import { defineConfig, devices } from "@playwright/test";

const production =
  Boolean(process.env.CI) || process.env.PLAYWRIGHT_PRODUCTION === "1";
const workers = process.env.PLAYWRIGHT_RUNTIME === "workers";
const port = process.env.PLAYWRIGHT_PORT ?? (workers ? "3102" : "3001");
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    channel: process.env.CI ? undefined : "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: workers
      ? `pnpm preview:workers --host 0.0.0.0 --port ${port} --strictPort`
      : production
        ? `pnpm exec next start --hostname 0.0.0.0 --port ${port}`
        : `pnpm exec next dev --port ${port}`,
    url: `${baseURL}/es`,
    reuseExistingServer: !production && !workers,
    timeout: 120_000,
  },
});
