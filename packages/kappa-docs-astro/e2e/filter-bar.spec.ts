import { expect, test, type Locator } from "@playwright/test";

async function ready(demo: Locator) {
  await expect.poll(() => demo.evaluate(element => element.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/docs/components/filter-bar");
});

test("controlled search, sort, and view update the displayed resources", async ({ page }) => {
  const demo = page.locator('[data-filter-bar-demo="complete"]');
  await ready(demo);
  const items = demo.locator('[data-slot="item"]');
  await expect(items).toHaveCount(4);
  await demo.getByRole("searchbox", { name: "Search resources" }).fill("thermal");
  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText("Turbine cooling study");
  await demo.getByRole("searchbox").fill("no matching resource");
  await expect(demo.getByRole("status")).toHaveText("0 resources");
  await demo.getByRole("searchbox").fill("");

  await demo.getByRole("button", { name: "Sort by: Updated date" }).click();
  await page.getByRole("menuitemradio", { name: "Name", exact: true }).click();
  await demo.getByRole("button", { name: "Sort ascending" }).click();
  await expect(items.first()).toContainText("Cryogenic transfer line");
  await demo.getByRole("radio", { name: "Grid view" }).click();
  await expect(demo.locator(".filter-bar-demo__results")).toHaveAttribute("data-view", "grid");
  await demo.getByRole("radio", { name: "Grid view" }).click();
  await expect(demo.getByRole("radio", { name: "Grid view" })).toHaveAttribute("aria-checked", "true");
});

test("sorting and view controls support keyboard interaction", async ({ page }) => {
  const demo = page.locator('[data-filter-bar-demo="complete"]');
  await ready(demo);
  const sort = demo.getByRole("button", { name: "Sort by: Updated date" });
  await sort.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu).toBeFocused();
  await page.keyboard.press("n");
  await expect(menu.getByRole("menuitemradio", { name: "Name", exact: true })).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Enter");
  await expect(demo.getByRole("button", { name: "Sort by: Name" })).toBeFocused();
  await demo.getByRole("radio", { name: "List view" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(demo.getByRole("radio", { name: "Grid view" })).toBeFocused();
  await page.keyboard.press("Space");
  await expect(demo.getByRole("radio", { name: "Grid view" })).toHaveAttribute("aria-checked", "true");
});

test("uncontrolled values start from defaults and update after input", async ({ page }) => {
  const demo = page.locator('[data-filter-bar-demo="uncontrolled"]');
  await ready(demo);
  await expect(demo.getByRole("searchbox")).toHaveValue("thermal");
  await expect(demo.getByRole("button", { name: "Sort by: Name" })).toBeVisible();
  await expect(demo.getByRole("radio", { name: "Grid view" })).toHaveAttribute("aria-checked", "true");
  await expect(demo.locator('[data-slot="item"]')).toHaveCount(1);
  await demo.getByRole("searchbox").fill("");
  await demo.getByRole("button", { name: "Sort descending" }).click();
  await expect(demo.locator('[data-slot="item"]').first()).toContainText("Turbine cooling study");
  await demo.getByRole("radio", { name: "List view" }).click();
  await expect(demo.locator(".filter-bar-demo__results")).toHaveAttribute("data-view", "list");
});

test("slots filter results and add resources; disabled state blocks built-in controls", async ({ page }) => {
  const demo = page.locator('[data-filter-bar-demo="slots"]');
  await ready(demo);
  await demo.getByRole("button", { name: "My projects" }).click();
  await expect(demo.locator('[data-slot="item"]')).toHaveCount(2);
  await demo.getByRole("button", { name: "New project" }).click();
  await expect(demo.locator('[data-slot="item"]')).toHaveCount(3);
  await expect(demo.locator('[data-slot="item"]').first()).toContainText("Untitled project 1");

  const disabled = page.locator('[data-filter-bar-demo="disabled"]');
  await ready(disabled);
  await expect(disabled.getByRole("searchbox")).toBeDisabled();
  for (const name of ["Sort by: Updated date", "Sort ascending"]) {
    await expect(disabled.getByRole("button", { name })).toBeDisabled();
  }
  for (const name of ["List view", "Grid view"]) {
    await expect(disabled.getByRole("radio", { name })).toBeDisabled();
  }
});

test("search-only hides optional controls and narrow containers wrap without overflow", async ({ page }) => {
  const simple = page.locator('[data-filter-bar-demo="search"]');
  await ready(simple);
  await expect(simple.getByRole("searchbox")).toBeVisible();
  await expect(simple.getByRole("button")).toHaveCount(0);
  await expect(simple.getByRole("radio")).toHaveCount(0);
  await page.setViewportSize({ width: 375, height: 850 });
  const demo = page.locator('[data-filter-bar-demo="slots"]');
  await ready(demo);
  await expect(demo.getByRole("button", { name: "New project" })).toBeVisible();
  const width = await demo.evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth }));
  expect(width.scroll).toBeLessThanOrEqual(width.client + 1);
});
