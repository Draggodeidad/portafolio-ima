import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:3001",
    channel: "chrome",
  },
  webServer: {
    command: "pnpm exec next dev --port 3001",
    url: "http://127.0.0.1:3001/es",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
