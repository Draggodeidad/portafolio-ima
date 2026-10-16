import { defineConfig, devices } from "@playwright/test";

const production =
  Boolean(process.env.CI) || process.env.PLAYWRIGHT_PRODUCTION === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:3001",
    channel: process.env.CI ? undefined : "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: production
      ? "pnpm exec next start --hostname 0.0.0.0 --port 3001"
      : "pnpm exec next dev --port 3001",
    url: "http://127.0.0.1:3001/es",
    reuseExistingServer: !production,
    timeout: 120_000,
  },
});
