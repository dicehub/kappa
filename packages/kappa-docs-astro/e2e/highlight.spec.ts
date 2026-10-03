import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-highlight-demo="${variant}"]`);

test.describe("Highlight documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/highlight");
  });

  test("renders examples, navigation, TOC, composition, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Highlight" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/highlight",
    );
    await expect(page.locator("[data-highlight-demo]")).toHaveCount(6);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(6);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator("pre[data-language]").first()).toContainText(
      '@dicehub/kappa/components/highlight',
    );

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Highlight", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Grid" })).toHaveAttribute(
      "href",
      "/docs/components/grid",
    );
    await expect(compact.getByRole("link", { name: "Next page: Hover Card" })).toHaveAttribute(
      "href",
      "/docs/components/hover-card",
    );
    await expect(footer.getByRole("link", { name: "Grid", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Hover Card", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Single Query",
      "Multiple Queries",
      "Case Sensitive",
      "Exact Matching",
      "Accessibility",
      "API Reference",
      "Highlight",
      "Data Slots",
      "Exports",
    ]);

    const composition = page.locator('#composition [data-composition-tree="highlight"]');
    await expect(composition).toContainText("Highlight <span>");
    await expect(composition).toContainText("<mark>matching chunks</mark>");

    const response = await request.get("/docs/components/highlight.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Highlight");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Exact Matching](#exact-matching)");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("keeps Ark matching semantics for each documented query mode", async ({ page }) => {
    const preview = demo(page, "preview").locator('[data-slot="highlight"]');
    await expect(preview).toHaveCount(1);
    await expect(preview.locator("mark")).toHaveText("convergence");
    await expect(preview.locator("mark")).toHaveCSS("font-weight", "650");

    const usage = demo(page, "usage").locator('[data-slot="highlight"]');
    await expect(usage.locator("mark")).toHaveText(["Solver", "status"]);
    await expect(usage).toHaveAttribute("data-match-all", "");

    const single = demo(page, "single").locator('[data-slot="highlight"]');
    await expect(single.locator("mark")).toHaveCount(1);
    await expect(single.locator("mark")).toHaveText("solver");

    const multiple = demo(page, "multiple").locator('[data-slot="highlight"]');
    await expect(multiple.locator("mark")).toHaveText(["mesh", "field", "mesh"]);
    await expect(multiple.locator("mark")).toHaveCount(3);

    const caseSensitive = demo(page, "case-sensitive").locator('[data-slot="highlight"]');
    await expect(caseSensitive.locator("mark")).toHaveText("kappa");
    await expect(caseSensitive.locator("mark")).not.toHaveText("Kappa");
    await expect(caseSensitive).not.toHaveAttribute("data-ignore-case", "");

    const exact = demo(page, "exact").locator('[data-slot="highlight"]');
    await expect(exact.locator("mark")).toHaveText(["mesh", "mesh"]);
    await expect(exact.locator("mark")).toHaveCount(2);
    expect(await exact.locator("mark").allTextContents()).not.toContain("meshlet");
    await expect(exact).toHaveAttribute("data-exact-match", "");
  });
});
