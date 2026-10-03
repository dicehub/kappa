import { expect, test, type Locator, type Page } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-data-grid-demo="${variant}"]`);

async function ready(container: Locator) {
  await expect
    .poll(
      () => container.evaluate((element) => element.closest("astro-island")?.hasAttribute("ssr")),
      { timeout: 15_000 },
    )
    .toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/docs/components/data-grid");
  await ready(demo(page, "preview"));
});

test("sorts, searches, selects, pages, and hides columns", async ({ page }) => {
  const grid = demo(page, "preview");
  await expect(grid.getByRole("grid", { name: "Records" })).toBeVisible();
  await expect(grid.locator("tbody tr")).toHaveCount(5);

  await grid.getByRole("button", { name: /Name/ }).click();
  await expect(grid.locator("tbody tr").first()).toContainText("Northwind report");
  await grid.getByRole("searchbox", { name: "Search records" }).fill("beacon");
  await expect(grid.locator("tbody tr")).toHaveCount(1);
  await expect(grid.locator("tbody tr").first()).toContainText("Beacon audit");
  await grid.getByRole("searchbox", { name: "Search records" }).fill("");

  const rowCheckboxControl = grid
    .locator('tbody tr:nth-child(2) [data-slot="checkbox-control"]');
  await rowCheckboxControl.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await rowCheckboxControl.click();
  await expect(grid.locator("tbody tr").nth(1)).toHaveAttribute("aria-selected", "true");
  await grid.getByRole("button", { name: "Next page" }).click();
  await expect(grid.locator("tbody tr")).toHaveCount(3);

  await grid.getByRole("button", { name: "Columns", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "Owner" }).click();
  await expect(grid.locator('th[data-column-id="owner"]')).toHaveCount(0);
});

test("uses roving grid focus and enters interactive cells", async ({ page }) => {
  const grid = demo(page, "preview");
  const first = grid.locator('[data-grid-row-index="0"][data-grid-column-index="0"]');
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(grid.locator('[data-grid-row-index="0"][data-grid-column-index="1"]')).toBeFocused();
  await page.keyboard.press("End");
  const action = grid.locator('[data-column-id="actions"]').filter({ has: page.getByRole("button", { name: /Open/ }) }).first();
  await expect(action).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(action.getByRole("button")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(action).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(grid.locator("tbody td:focus")).toHaveCount(0);

  const selectionCell = grid.locator('[data-grid-row-index="1"][data-grid-column-index="0"]');
  await selectionCell.focus();
  await page.keyboard.press("Enter");
  await expect(grid.getByRole("checkbox", { name: "Select row 2" })).toBeFocused();
  await page.keyboard.press("Space");
  await expect(grid.locator("tbody tr").nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Escape");
  await expect(selectionCell).toBeFocused();
});

test("keeps a bounded virtual row window for 100,000 rows", async ({ page }) => {
  const grid = demo(page, "virtual");
  await ready(grid);
  await expect(grid.getByText("100,000 records")).toBeVisible();
  const rows = grid.locator("tbody tr");
  expect(await rows.count()).toBeLessThan(60);
  const viewport = grid.locator('[data-slot="data-grid-viewport"]');
  await grid.locator('[data-grid-row-index="0"][data-grid-column-index="1"]').focus();
  await page.keyboard.press("Control+End");
  await expect(grid.locator("tbody td:focus")).toHaveAttribute("data-grid-row-index", "99999");
  await page.keyboard.press("Control+Home");
  await expect(grid.locator("tbody td:focus")).toHaveAttribute("data-grid-row-index", "0");
  await viewport.evaluate((element) => { element.scrollTop = 1_000_000; element.dispatchEvent(new Event("scroll")); });
  const scrollLoader = grid.locator('[data-slot="data-grid-scroll-loading"]');
  await expect(scrollLoader).toBeVisible();
  expect(await scrollLoader.evaluate((element) => {
    const loader = element.getBoundingClientRect();
    const frame = element.parentElement!.getBoundingClientRect();
    return loader.top >= frame.top
      && loader.right <= frame.right
      && loader.bottom <= frame.bottom
      && loader.left >= frame.left;
  })).toBe(true);
  await expect(rows.first()).not.toContainText("Record 000001");
  expect(await rows.count()).toBeLessThan(60);
  await expect(grid.locator("tbody td:focus")).toHaveCount(1);
  await expect(scrollLoader).toBeHidden();
});

test("uses server paging, correct row coordinates, and keyboard resizing", async ({ page }) => {
  const controlled = demo(page, "controlled");
  await ready(controlled);
  const grid = controlled.getByRole("grid", { name: "Records" });
  await expect(grid).toHaveAttribute("aria-rowcount", "9");
  await expect(controlled.locator("tbody tr")).toHaveCount(3);
  await controlled.getByRole("button", { name: "Next page" }).click();
  await expect(controlled.locator("tbody tr").first()).toHaveAttribute("aria-rowindex", "5");

  const resize = controlled.getByRole("separator", { name: "Resize Name column" });
  await resize.focus();
  const before = Number(await resize.getAttribute("aria-valuenow"));
  await page.keyboard.press("ArrowRight");
  await expect(resize).toHaveAttribute("aria-valuenow", String(before + 8));
  await page.keyboard.press("Enter");
  await expect(resize).toHaveAttribute("aria-valuenow", "220");

  await controlled.getByRole("searchbox", { name: "Search records" }).fill("beacon");
  await expect(controlled.locator("tbody tr")).toHaveCount(1);
  await expect(controlled.locator("tbody tr").first()).toContainText("Beacon audit");
});

test("shows loading, empty, and error states", async ({ page }) => {
  const states = demo(page, "states");
  await ready(states);
  await expect(states.getByRole("status")).toContainText("Loading data");
  await expect(states.getByText("No results")).toBeVisible();
  await expect(states.getByRole("alert")).toContainText("Data could not be loaded");
});

test("supports row-click selection without a checkbox column", async ({ page }) => {
  const grid = demo(page, "row-selection");
  await ready(grid);
  await expect(grid.locator('th[data-column-id="__kappa_selection"]')).toHaveCount(0);
  await expect(grid.locator("tbody").getByRole("checkbox")).toHaveCount(0);
  const row = grid.locator("tbody tr").nth(1);
  await expect(row).toHaveAttribute("aria-selected", "false");
  await row.click();
  await expect(row).toHaveAttribute("aria-selected", "true");
});

test("keeps standard and multiline layouts stable when selection changes", async ({ page }) => {
  for (const variant of ["preview", "multiline"]) {
    const grid = demo(page, variant);
    await ready(grid);
    const root = grid.locator(".kappa-data-grid");
    const header = grid.locator("thead");
    const rows = grid.locator("tbody tr");
    const measure = async () => ({
      grid: await root.evaluate((element) => element.getBoundingClientRect().height),
      header: await header.evaluate((element) => element.getBoundingClientRect().height),
      rows: await rows.evaluateAll((elements) => {
        const gridTop = elements[0]?.closest(".kappa-data-grid")?.getBoundingClientRect().top ?? 0;
        return elements.map((element) => ({
          height: element.getBoundingClientRect().height,
          top: element.getBoundingClientRect().top - gridTop,
        }));
      }),
    });
    const before = await measure();
    expect(Math.max(...before.rows.map((row) => row.height)) - Math.min(...before.rows.map((row) => row.height))).toBeLessThan(0.1);

    await rows.nth(1).click();
    const after = await measure();
    expect(Math.abs(after.grid - before.grid)).toBeLessThan(0.1);
    expect(Math.abs(after.header - before.header)).toBeLessThan(0.1);
    expect(after.rows).toHaveLength(before.rows.length);
    for (const [index, row] of after.rows.entries()) {
      expect(Math.abs(row.height - before.rows[index]!.height)).toBeLessThan(0.1);
      expect(Math.abs(row.top - before.rows[index]!.top)).toBeLessThan(0.1);
    }
  }
});
