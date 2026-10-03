import { expect, test, type Page } from "@playwright/test";

async function ready(page: Page) {
  await expect.poll(() => page.locator("[data-property-list-demo]").evaluateAll(elements =>
    elements.every(element => !element.closest("astro-island")?.hasAttribute("ssr"))
  )).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/property-list");
  await ready(page);
});

test("Property List uses definition semantics and preserves custom controls", async ({ page }) => {
  const root = page.locator('[data-property-list-demo="preview"]');
  await expect(root.locator("dl")).toHaveAttribute("aria-label", "Run properties");
  await expect(root.locator("dt")).toHaveText(["Status", "Solver", "Cells", "Elapsed time"]);
  await expect(root.locator("dd")).toHaveText(["Completed", "simpleFoam", "2,480,000", "12 min 34 s"]);
  const custom = page.locator('[data-property-list-demo="stacked"]');
  await custom.getByRole("button", { name: "Show checks" }).click();
  await expect(custom.getByText("No negative volumes.", { exact: false })).toBeVisible();
});

test("long metadata stacks without horizontal overflow in a narrow container", async ({ page }) => {
  const root = page.locator('[data-property-list-demo="long"] dl');
  await root.evaluate((element) => { element.style.width = "260px"; });
  await expect.poll(() => root.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  const term = await root.locator("dt").first().boundingBox();
  const value = await root.locator("dd").first().boundingBox();
  expect(value!.y).toBeGreaterThan(term!.y);
  expect(Math.abs(value!.x - term!.x)).toBeLessThan(1);
});
