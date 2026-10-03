import { expect, type Locator, test } from "@playwright/test";

const columnCount = async (grid: Locator) =>
  grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);

test.describe("Grid documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/grid");
  });

  test("renders the public contract, composition, and semantic elements", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Grid" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(7);
    await expect(page.locator("#all-variants tbody tr")).toHaveCount(9);
    await expect(page.locator("#composition [data-composition-tree='grid']")).toContainText("Grid.Root");
    await expect(page.locator("#grid-api").locator("..")).toContainText("mobileDivider");
    await expect(page.locator("#grid-item-api").locator("..")).toContainText('"article"');
    await expect(page.locator("#preview pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/grid"',
    );
    await expect(page.locator('.docs-page-header__title-row a[href*="ark-ui.com"]')).toHaveCount(0);

    const semantic = page.locator('[data-grid-demo="semantic"]');
    const list = semantic.getByRole("list", { name: "Team members" });
    await expect(list).toHaveAttribute("data-slot", "grid");
    await expect(list).toHaveAttribute("data-variant", "3up");
    await expect(list.getByRole("listitem")).toHaveCount(3);
    await expect(list.getByRole("listitem").first()).toHaveAttribute("data-slot", "grid-item");

    const markdownResponse = await request.get("/docs/components/grid.md");
    expect(markdownResponse.ok()).toBe(true);
    const markdown = await markdownResponse.text();
    expect(markdown).toContain("# Grid");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("GridRootProps");
  });

  test("applies responsive columns, gaps, dividers, themes, and mobile bounds", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.reload();

    const preview = page.locator('[data-grid-demo="preview"] .kappa-grid');
    const variants = page.locator('[data-grid-demo="variants"]');
    const gaps = page.locator('[data-grid-demo="gaps"] .kappa-grid');
    const desktopDivider = page
      .locator('[data-grid-demo="mobile-divider"] [data-mobile-divider]')
      .nth(1);

    await expect(preview).toHaveAttribute("data-gap", "base");
    await expect.poll(() => columnCount(preview)).toBe(2);
    await expect.poll(() => columnCount(variants.locator('.kappa-grid[data-variant="3up"]'))).toBe(3);
    await expect.poll(() => columnCount(variants.locator('.kappa-grid[data-variant="4up"]'))).toBe(4);
    await expect(gaps.nth(0)).toHaveCSS("column-gap", "0px");
    await expect(gaps.nth(1)).toHaveCSS("column-gap", "12px");
    await expect(gaps.nth(2)).toHaveCSS("column-gap", "32px");
    await expect(gaps.nth(3)).toHaveCSS("column-gap", "32px");
    await expect(desktopDivider).toHaveCSS("border-bottom-style", "none");

    await page.locator(".docs-header").getByRole("button", { name: "Toggle theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-kappa-theme", "dark");
    await expect(preview.locator(".grid-demo__tile").first()).not.toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    const mobileGrid = page.locator('[data-grid-demo="mobile-divider"] .kappa-grid');
    const mobileItems = mobileGrid.locator(".kappa-grid__item");
    await expect.poll(() => columnCount(mobileGrid)).toBe(1);
    await expect(mobileItems.first()).toHaveCSS("border-bottom-style", "solid");
    await expect(mobileItems.first()).toHaveCSS("padding-bottom", "32px");
    await expect(mobileItems.last()).toHaveCSS("border-bottom-style", "none");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    ).toBe(true);
  });
});
