import { defineConfig, devices } from "@playwright/test";

const externalUrl = process.env.HOMEPAGE_TEST_URL;

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: externalUrl || "http://127.0.0.1:4174",
    viewport: { width: 1280, height: 800 },
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: externalUrl ? undefined : {
    command: "npm run preview -- --host 127.0.0.1 --port 4174 --strictPort",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
  },
});
