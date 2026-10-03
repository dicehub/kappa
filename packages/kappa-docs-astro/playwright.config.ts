import { defineConfig, devices, type ReporterDescription } from "@playwright/test";

const PORT = 4328;
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseURL ?? `http://127.0.0.1:${PORT}`;
const buildDocs = process.env.KAPPA_E2E_SKIP_BUILD !== "1";
const ciReporters: ReporterDescription[] = [
  ["line"],
  ["junit", { outputFile: "test-results/e2e-junit.xml" }],
];

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Focus and clipboard checks share browser resources. Match CI locally.
  workers: 1,
  reporter: process.env.CI ? ciReporters : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        // Keep Astro in the foreground when it detects an agent session.
        command: `${buildDocs ? "pnpm build && " : ""}pnpm exec astro preview --ignore-lock --host 127.0.0.1 --port ${PORT}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
