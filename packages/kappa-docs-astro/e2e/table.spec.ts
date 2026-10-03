import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-table-demo="${variant}"]`);

const checkbox = (container: Locator, name: string) =>
  container
    .getByRole("checkbox", { name, exact: true })
    .locator("xpath=ancestor::*[@data-slot='checkbox'][1]");

test.describe("Table documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/table");
    await expect(demo(page, "selection").locator("xpath=ancestor::astro-island[1]")).not.toHaveAttribute("ssr");
  });

  test("uses consistent typography, compact headers, and distinct row surfaces", async ({ page }) => {
    const preview = demo(page, "preview");
    const head = preview.locator("th").first();
    const cell = preview.locator("td").first();
    await expect(head).toHaveCSS("font-size", "14px");
    await expect(head).toHaveCSS("font-weight", "600");
    await expect(head).toHaveCSS("padding-inline-start", "12px");
    await expect(cell).toHaveCSS("line-height", "20px");
    await expect(cell).toHaveCSS("font-weight", "400");
    await expect(preview.locator("caption")).toHaveCSS("caption-side", "bottom");

    const compact = demo(page, "usage").locator("th").first();
    await expect(compact).toHaveCSS("text-transform", "none");
    await expect(compact).toHaveCSS("font-size", "14px");
    await expect(compact).toHaveCSS("padding-block-start", "8px");
    expect((await compact.boundingBox())!.height).toBeLessThan((await head.boundingBox())!.height);

    const selection = demo(page, "selection");
    const backgrounds = () => selection.locator("tbody tr td:last-child").evaluateAll(cells =>
      cells.map(cell => getComputedStyle(cell).backgroundColor),
    );
    expect(new Set(await backgrounds()).size).toBe(3);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    expect(new Set(await backgrounds()).size).toBe(3);
    const sticky = demo(page, "sticky").locator("th");
    expect(await sticky.first().evaluate(el => getComputedStyle(el).backgroundColor)).toBe(
      await sticky.nth(1).evaluate(el => getComputedStyle(el).backgroundColor),
    );
  });

  test("renders the public contract, examples, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Table" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(7);
    await expect(demo(page, "preview").getByRole("table", { name: "Recent projects" })).toBeVisible();
    await expect(demo(page, "preview").locator('[data-slot="table-caption"]')).toContainText(
      "Project activity",
    );
    await expect(demo(page, "fixed").getByRole("button", { name: "Resize run column" })).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/table"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator("#composition [data-composition-tree='table']")).toContainText(
      "Table.CheckCell",
    );

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Table", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Switch" })).toHaveAttribute(
      "href",
      "/docs/components/switch",
    );
    await expect(
      compact.getByRole("link", { name: "Next page: Table of Contents" }),
    ).toHaveAttribute("href", "/docs/components/table-of-contents");
    await expect(footer.getByRole("link", { name: "Switch", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Table of Contents", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Compact",
      "Selection",
      "Fixed Layout",
      "Sticky Columns",
      "States",
      "Accessibility",
      "API Reference",
      "Table",
      "Table.Header",
      "Table.Row",
      "Table.Head / Table.Cell",
      "Selection",
      "Data Slots",
      "Data Attributes",
      "Exports",
    ]);

    const response = await request.get("/docs/components/table.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Table");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("Table.CheckHead / Table.CheckCell");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("supports selection, semantic states, and sticky contracts", async ({ page }) => {
    const selection = demo(page, "selection");
    const selectionSummary = selection.locator(".table-demo__selection-summary");
    const checkboxes = selection.getByRole("checkbox");
    await expect(checkboxes).toHaveCount(4);
    await expect(selectionSummary).toHaveText("1 of 3 projects selected");
    await expect(selection.getByRole("row", { name: /Project Atlas/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    const beacon = checkbox(selection, "Select Beacon API");
    await beacon.click();
    await expect(selectionSummary).toHaveText("2 of 3 projects selected");
    await expect(selection.getByRole("row", { name: /Beacon API/ })).toHaveAttribute(
      "data-variant",
      "selected",
    );

    const all = checkbox(selection, "Select all rows");
    await all.click();
    await expect(selectionSummary).toHaveText("3 of 3 projects selected");

    const states = demo(page, "states");
    await expect(states.locator('[data-loading][aria-busy="true"]')).toHaveCount(1);
    await expect(states.locator('[data-invalid][aria-invalid="true"]')).toHaveCount(1);
    await expect(states.locator("[data-empty]")).toHaveCount(1);

    const sticky = demo(page, "sticky");
    await expect(sticky.locator('[data-slot="table-header"][data-sticky]')).toHaveCount(1);
    await expect(sticky.locator('[data-slot="table-head"][data-sticky="left"]')).toHaveCount(1);
    await expect(sticky.locator('[data-slot="table-cell"][data-sticky="right"]')).toHaveCount(3);
  });

  test("reduces the whole table with compact while preserving selection", async ({ page }) => {
    const compact = demo(page, "compact");
    const table = compact.getByRole("table");
    await expect(table).toHaveAttribute("data-compact", "");
    await expect(demo(page, "preview").getByRole("table")).not.toHaveAttribute("data-compact");
    await expect(table).toHaveCSS("font-size", "12px");
    const cell = compact.locator("tbody td").nth(1);
    await expect(cell).toHaveCSS("padding-block-start", "4px");
    await expect(cell).toHaveCSS("padding-inline-start", "8px");
    await expect(cell).toHaveCSS("line-height", "16px");
    expect((await compact.locator("tbody tr").first().boundingBox())!.height).toBeLessThanOrEqual(26);
    await expect(compact.locator("th").nth(1)).toHaveCSS("padding-block-start", "4px");
    await checkbox(compact, "Select Beacon API").click();
    await expect(compact.getByRole("status")).toHaveText("2 of 3 projects selected");
    await checkbox(compact, "Select all rows").click();
    await expect(compact.getByRole("status")).toHaveText("3 of 3 projects selected");
    await compact.getByRole("checkbox", { name: "Select Cinder worker", exact: true }).focus();
    await page.keyboard.press("Space");
    await expect(compact.getByRole("status")).toHaveText("2 of 3 projects selected");
    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test("keeps table surfaces readable in both themes and on narrow screens", async ({ page }) => {
    const table = demo(page, "preview").getByRole("table", { name: "Recent projects" });
    const light = await table.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { background: styles.backgroundColor, color: styles.color, font: styles.fontFamily };
    });
    expect(light.font).toMatch(/Geist/i);

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => table.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(light.background);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator(".table-demo__scroll--sticky")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
