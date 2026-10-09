import { expect, type Locator } from "@playwright/test";

export async function waitForDocsIsland(demo: Locator) {
  const island = demo.locator("xpath=ancestor::astro-island[1]");
  await expect(island).toBeAttached();
  await expect(island).not.toHaveAttribute("ssr");
}
