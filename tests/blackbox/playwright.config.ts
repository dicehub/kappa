import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  workers: 1,
  forbidOnly: true,
  retries: 0,
  reporter: [["line"], ["junit", { outputFile: "test-results/blackbox.xml" }]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    trace: "retain-on-failure",
    serviceWorkers: "block",
  },
  projects: [
    { name: "consumer", testDir: "./blackbox/browser" },
    { name: "documentation", testDir: "./e2e" },
  ],
});
