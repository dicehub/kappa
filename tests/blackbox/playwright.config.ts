import { defineConfig, devices } from "@playwright/test";
import { readFileSync } from "node:fs";

const legacyNames: string[] = JSON.parse(readFileSync(new URL("./blackbox/legacy-browser-cases.json", import.meta.url), "utf8"));
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const legacy = new RegExp(`(?:${legacyNames.map(escape).join("|")})$`);

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
    { name: "documentation", testDir: "./e2e", grepInvert: legacy },
    ...(process.env.KAPPA_BLACKBOX_WITH_LEGACY === "1" ? [{ name: "retained-browser", testDir: "./e2e", grep: legacy }] : []),
  ],
});
