import { chromium } from "@playwright/test";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

async function inlineCss(url) {
  let css = await readFile(url, "utf8");
  for (const match of css.matchAll(/@import "([^"]+)";/g)) {
    css = css.replace(match[0], await inlineCss(new URL(match[1], url)));
  }
  return css;
}

const theme = await inlineCss(new URL(import.meta.resolve("@abdalkhani/homelab-theme/tokens.css")));
const logo = await readFile(fileURLToPath(import.meta.resolve("@abdalkhani/homelab-theme/logos/winged-horse-compact.svg")), "utf8");
const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="en" data-theme="light"><head><style>
    ${theme}
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--ak-background); color: var(--ak-foreground); font-family: var(--ak-font-sans); }
    main { height: 630px; padding: 64px 80px; display: flex; flex-direction: column; justify-content: center; gap: 36px; }
    .brand { display: flex; align-items: center; gap: 28px; font-size: 24px; font-weight: 600; letter-spacing: 0.12em; }
    .mark { color: var(--ak-brand); padding: 24px; border: 1px solid var(--ak-border); border-radius: var(--ak-radius-panel); background: var(--ak-surface); }
    .mark svg { display: block; width: 96px; height: 96px; }
    h1 { margin: 0; font-size: 80px; line-height: var(--ak-leading-heading); letter-spacing: -0.03em; }
    p { margin: 0; max-width: 900px; color: var(--ak-muted); font-size: 30px; line-height: var(--ak-leading-body); }
  </style></head><body><main><div class="brand"><div class="mark">${logo}</div><span>ABDALKHANI</span></div><h1>Public apps</h1><p>Find tools and applications on the Abdalkhani domain.</p></main></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const brand = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue("--ak-brand").trim());
  if (!brand) throw new Error("The design-kit theme must be loaded before rendering the sharing preview.");
  await mkdir(new URL("../public/", import.meta.url), { recursive: true });
  const png = await page.screenshot();
  const filename = `social-preview-${createHash("sha256").update(png).digest("hex").slice(0, 12)}.png`;
  await writeFile(new URL(`../public/${filename}`, import.meta.url), png);
  const entry = new URL("../index.html", import.meta.url);
  const html = await readFile(entry, "utf8");
  await writeFile(entry, html.replace(/social-preview(?:-[a-f0-9]{12})?\.png/g, filename));
  console.log(`Sharing preview: ${filename}`);
} finally {
  await browser.close();
}
