import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-selection-list-demo="${variant}"]`);

test.describe("Selection List documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/selection-list");
    const islands = page
      .locator("[data-selection-list-demo]")
      .locator("xpath=ancestor::astro-island");
    await expect(islands).toHaveCount(6);
    for (let index = 0; index < 6; index += 1) {
      await expect(islands.nth(index)).not.toHaveAttribute("ssr", "");
    }
  });

  test("renders the public API, examples, Ark link, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Selection List" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(4);
    await expect(demo(page, "preview").getByRole("option")).toHaveCount(3);
    await expect(demo(page, "groups").getByRole("group")).toHaveCount(2);
    await expect(demo(page, "sizes").locator('[data-slot="selection-list"]')).toHaveCount(2);

    const primitive = page.getByRole("link", { name: "View Ark UI documentation" });
    await expect(primitive).toHaveAttribute("href", "https://ark-ui.com/docs/components/listbox");
    await expect(primitive).toHaveAttribute("target", "_blank");

    const snippets = page.locator("pre[data-language]");
    await expect(
      snippets.filter({ hasText: "@dicehub/kappa/components/selection-list" }),
    ).not.toHaveCount(0);
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);

    const response = await request.get("/docs/components/selection-list.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Selection List");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("SelectionList.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

test("changes a controlled single selection", async ({ page }) => {
  const preview = demo(page, "preview");
  const balanced = preview.getByRole("option", { name: /Balanced/ });
  const fast = preview.getByRole("option", { name: /Fast turnaround/ });
  const fastMeta = fast.locator('[data-slot="selection-list-item-meta"]');

  await expect(balanced).toHaveAttribute("aria-selected", "true");
  const metaBefore = await fastMeta.boundingBox();
  await fast.click();
  await expect(fast).toHaveAttribute("aria-selected", "true");
  await expect(balanced).toHaveAttribute("aria-selected", "false");
  await expect(preview.getByRole("status")).toHaveText(/Selected: Fast turnaround/);
  const metaAfter = await fastMeta.boundingBox();

  expect(metaBefore).not.toBeNull();
  expect(metaAfter).not.toBeNull();
  expect(Math.abs(metaAfter!.x - metaBefore!.x)).toBeLessThan(0.5);
});

  test("supports keyboard and multiple selection", async ({ page }) => {
    const usage = demo(page, "usage");
    const listbox = usage.getByRole("listbox");
    await listbox.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(usage.getByRole("option", { name: /Fast turnaround/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    const multiple = demo(page, "multiple");
    await multiple.getByRole("option", { name: /Temperature/ }).click();
    await expect(multiple.getByRole("status")).toHaveText("3 fields selected");
    await expect(multiple.getByRole("option", { name: /Pressure/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("filters, renders its empty state, and preserves input navigation", async ({ page }) => {
    const filter = demo(page, "filter");
    const input = filter.getByRole("textbox", { name: "Filter case files" });

    await input.fill("scheme");
    await expect(filter.getByRole("option")).toHaveCount(1);
    await expect(filter.getByRole("option", { name: /fvSchemes/ })).toBeVisible();

    await input.fill("missing");
    await expect(filter.getByText("No matching files")).toBeVisible();
    await expect(filter.getByRole("option")).toHaveCount(0);
  });

  test("keeps disabled grouped items unavailable", async ({ page }) => {
    const groups = demo(page, "groups");
    const disabled = groups.getByRole("option", { name: /GPU runner/ });
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    await disabled.click({ force: true });
    await expect(disabled).toHaveAttribute("aria-selected", "false");
  });
});
