import { expect, test, type Page } from "@playwright/test";

async function ready(page: Page) {
  await expect.poll(() => page.locator("[data-content-loader-demo]").evaluateAll(elements =>
    elements.every(element => !element.closest("astro-island")?.hasAttribute("ssr"))
  )).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/content-loader");
  await ready(page);
});

test("Content Loader switches states and supports retry", async ({ page }) => {
  const demo = page.locator('[data-content-loader-demo="preview"]');
  await expect(demo.locator('[data-slot="content-loader-region"]')).toHaveAttribute("aria-busy", "true");
  await expect(demo.getByRole("status")).toHaveText("Loading cases…");
  await demo.getByRole("button", { name: "Empty", exact: true }).click();
  await expect(demo.getByText("No cases yet", { exact: true }).last()).toBeVisible();
  await expect(demo.locator('[data-slot="content-loader-content"]')).toHaveCount(0);
  await demo.getByRole("button", { name: "Error", exact: true }).click();
  await demo.getByRole("button", { name: "Try again" }).click();
  await expect(demo.locator('[data-slot="content-loader"]')).toHaveAttribute("data-state", "ready");
  await expect(demo.getByText("Wing profile")).toBeVisible();
  await expect(demo.locator('[data-slot="content-loader-region"]')).toHaveAttribute("aria-busy", "false");
});

test("keepMounted preserves input identity and hides it during reload", async ({ page }) => {
  const demo = page.locator('[data-content-loader-demo="preserve"]');
  const field = demo.getByRole("textbox", { name: "Note" });
  await field.fill("Preserve this local note");
  await field.evaluate(element => element.setAttribute("data-original-node", "true"));
  await demo.getByRole("button", { name: "Refresh details" }).click();
  await expect(field).toBeHidden();
  await expect(field).toBeVisible();
  await expect(field).toHaveValue("Preserve this local note");
  await expect(field).toHaveAttribute("data-original-node", "true");
});

test("custom states expose recovery controls", async ({ page }) => {
  const demo = page.locator('[data-content-loader-demo="custom"]');
  await demo.getByRole("button", { name: "Empty", exact: true }).click();
  await demo.getByRole("button", { name: "Clear filter" }).click();
  await expect(demo.getByText("Wing profile")).toBeVisible();
  await demo.getByRole("button", { name: "Error", exact: true }).click();
  await demo.getByRole("button", { name: "Reconnect" }).click();
  await expect(demo.getByText("Wing profile")).toBeVisible();
});
