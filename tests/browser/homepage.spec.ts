import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import original from "../fixtures/original-homepage.json" with { type: "json" };

async function renderedContent(page: Page) {
  return page.evaluate(() => ({
    title: document.title,
    text: `${document.querySelector("header h1")!.textContent} ${document.querySelector<HTMLElement>("main")!.innerText}`.replace(/\s+/g, " ").trim(),
    paragraphs: [...document.querySelectorAll<HTMLElement>("main p")].map((p) => p.innerText.replace(/\s+/g, " ").trim()),
    links: [...document.querySelectorAll("a")].map((a) => ({ text: a.innerText, href: a.getAttribute("href"), target: a.getAttribute("target") })),
  }));
}

test("preserves the original homepage copy, emphasis, links, and title", async ({ page }) => {
  await page.goto("/");
  expect(await renderedContent(page)).toEqual({
    title: original.title,
    text: original.text,
    paragraphs: original.paragraphs,
    links: original.links,
  });
  await expect(page.locator("main strong")).toHaveText("Abdalkhani");
  await expect(page.locator("main em")).toHaveText(original.paragraphs[2]);
  await expect(page.locator(".header-watermark")).toHaveText("ABDALKHANI");
});

test("header logo and favicon use the actual design kit assets", async ({ page, request }) => {
  await page.goto("/");
  const logo = page.locator(".header-logo");
  const mask = await logo.evaluate((element) => getComputedStyle(element).maskImage);
  expect(mask).toContain("winged-horse-compact");
  const logoUrl = mask.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
  const faviconUrl = await page.locator("link[rel=icon]").getAttribute("href");
  for (const [url, asset] of [
    [logoUrl, "logos/winged-horse-compact.svg"],
    [faviconUrl!, "icons/favicon.svg"],
  ]) {
    const response = await request.get(url);
    expect(response.ok()).toBe(true);
    const kitAsset = readFileSync(fileURLToPath(import.meta.resolve(`@abdalkhani/homelab-theme/${asset}`)));
    expect(createHash("sha256").update(await response.body()).digest("hex")).toBe(createHash("sha256").update(kitAsset).digest("hex"));
  }
  await page.emulateMedia({ colorScheme: "light" });
  const light = await logo.evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole("switch", { name: "Dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await logo.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(light);
  expect(await logo.evaluate((element) => getComputedStyle(element).maskImage)).toBe(mask);
});

test("calculator remains a native link and navigates in the current tab", async ({ page }) => {
  const calculator = original.links[1];
  const popups: Page[] = [];
  page.on("popup", (popup) => popups.push(popup));
  await page.route(`${calculator.href}/**`, (route) => route.fulfill({
    status: 200,
    contentType: "text/html",
    body: "<!doctype html><title>Calculator destination</title>",
  }));
  await page.goto("/");
  await page.getByRole("link", { name: calculator.text, exact: true }).click();
  await expect(page).toHaveURL(`${calculator.href}/`);
  expect(popups).toEqual([]);
});

test("both themes reflow across desktop, tablet, and mobile widths", async ({ page, browserName }) => {
  await page.goto("/");
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    for (const width of [1280, 769, 768, 480, 320]) {
      await page.setViewportSize({ width, height: 800 });
      expect((await renderedContent(page)).text).toBe(original.text);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const about = await page.getByRole("region", { name: "About Us", exact: true }).boundingBox();
      const apps = await page.getByRole("region", { name: "List of apps within the domain:", exact: true }).boundingBox();
      expect(about).not.toBeNull();
      expect(apps).not.toBeNull();
      if (width > 768) {
        expect(apps!.y).toBe(about!.y);
        expect(apps!.x).toBeGreaterThanOrEqual(about!.x + about!.width);
      } else {
        expect(apps!.y).toBeGreaterThanOrEqual(about!.y + about!.height);
      }
      await expect(page.locator(".header-logo")).toBeVisible();
      await expect(page.locator(".header-watermark")).toBeVisible();
      const toggle = page.getByRole("switch", { name: "Dark mode", exact: true });
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute("aria-checked", String(colorScheme === "dark"));
      await expect(toggle).toHaveText("");
      const header = (await page.getByRole("banner").boundingBox())!;
      expect(header.height).toBeLessThanOrEqual(60);
      const control = (await toggle.boundingBox())!;
      expect(control.x).toBeGreaterThanOrEqual(0);
      expect(control.x + control.width).toBeLessThanOrEqual(width);
      expect(control.height).toBeGreaterThanOrEqual(44);
      if (browserName === "chromium" && (width === 1280 || width === 320)) {
        await mkdir("artifacts", { recursive: true });
        await page.screenshot({ path: `artifacts/homepage-${colorScheme}${width === 320 ? "-mobile" : ""}.png`, fullPage: true });
      }
    }
  }
});

test("theme toggle and original links work with visible keyboard focus in both themes", async ({ page, browserName }) => {
  const tab = browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab";
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("ak-appearance"));
    await page.reload();
    await page.keyboard.press(tab);
    const toggle = page.getByRole("switch", { name: "Dark mode", exact: true });
    await expect(toggle).toBeFocused();
    expect(await toggle.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-theme", colorScheme === "dark" ? "light" : "dark");
    await expect(toggle).toHaveAttribute("aria-checked", String(colorScheme !== "dark"));
    await page.keyboard.press("Space");
    await expect(page.locator("html")).toHaveAttribute("data-theme", colorScheme);
    await expect(toggle).toHaveAttribute("aria-checked", String(colorScheme === "dark"));
    for (const link of original.links) {
      await page.keyboard.press(tab);
      const anchor = page.getByRole("link", { name: link.text, exact: true });
      await expect(anchor).toBeFocused();
      const outline = await anchor.evaluate((element) => ({
        style: getComputedStyle(element).outlineStyle,
        width: parseFloat(getComputedStyle(element).outlineWidth),
      }));
      expect(outline.style).toBe("solid");
      expect(outline.width).toBeGreaterThanOrEqual(2);
    }
  }
});

test("appearance follows system changes with local assets and no runtime failures", async ({ page, baseURL }) => {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") failures.push(message.text()); });
  page.on("requestfailed", (request) => failures.push(request.url()));
  page.on("response", (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin) failures.push(`External asset: ${request.url()}`);
  });
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage blocked"); } });
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const light = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.getByRole("switch", { name: "Dark mode", exact: true })).toHaveAttribute("aria-checked", "true");
  const dark = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(dark).not.toBe(light);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  await page.emulateMedia({ colorScheme: "light" });
  expect(await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(light);
  expect(failures).toEqual([]);
});

test("automated WCAG checks pass in both themes at mobile and desktop widths", async ({ page }) => {
  await page.goto("/");
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 800 });
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(result.violations, `${colorScheme} at ${width}px`).toEqual([]);
    }
  }
});

test("200% text zoom, forced colors, reduced motion, and sticky header work", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("html").evaluate((element) => { element.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const link of original.links) await expect(page.getByRole("link", { name: link.text, exact: true })).toBeVisible();
  const calculator = page.getByRole("link", { name: "Investment Calculator", exact: true });
  expect(await calculator.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");
  expect(await page.locator(".appearance-thumb").evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");
  await page.emulateMedia({ forcedColors: "active" });
  await calculator.focus();
  expect(await calculator.evaluate((element) => parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThanOrEqual(2);
  await page.locator("html").evaluate((element) => { element.style.fontSize = ""; });
  await page.setViewportSize({ width: 320, height: 300 });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.getByRole("banner")).toBeVisible();
  expect((await page.getByRole("banner").boundingBox())!.y).toBe(0);
});


test("manual appearance persists after reload and takes precedence over system changes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("switch", { name: "Dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => localStorage.getItem("ak-appearance"))).toBe("dark");
  const dark = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("switch", { name: "Dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("ak-appearance"))).toBe("light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.getByRole("switch", { name: "Dark mode", exact: true })).toHaveAttribute("aria-checked", "false");
  expect(await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(dark);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("a saved theme is restored before the React bundle runs", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("ak-appearance", "dark"));
  await page.route("**/*.js", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("#root")).toBeEmpty();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("theme toggle works for the current page when browser storage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage blocked"); } });
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("switch", { name: "Dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("switch", { name: "Dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("an invalid saved appearance falls back to the system preference", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ak-appearance", "invalid"));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  await expect(page.getByRole("switch", { name: "Dark mode", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("switch", { name: "Dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("ak-appearance"))).toBe("light");
});
