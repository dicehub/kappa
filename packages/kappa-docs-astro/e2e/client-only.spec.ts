import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-client-only-demo="${variant}"]`);

test.describe("Client Only documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/client-only");
  });

  test("renders examples, composition, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Client Only" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(4);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(4);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);
    await expect(
      page.locator('.docs-code-full pre[data-language="vue"]').first(),
    ).toContainText('from "@dicehub/kappa/components/client-only"');
    await expect(page.locator("pre").filter({ hasText: "../../../kappa/src" })).toHaveCount(0);

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/utilities/client-only",
    );
    await expect(
      page.locator('#composition [data-composition-tree="clientOnly"]'),
    ).toContainText("ClientOnly (renderless)");

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(
      compact.getByRole("link", { name: "Previous page: Checkbox" }),
    ).toHaveAttribute("href", "/docs/components/checkbox");
    await expect(compact.getByRole("link", { name: "Next page: Clipboard Text" })).toHaveAttribute(
      "href",
      "/docs/components/clipboard-text",
    );

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Reference Behavior",
      "Examples",
      "Layout-safe Fallback",
      "No Fallback",
      "Accessibility",
      "API Reference",
      "ClientOnly",
      "Slots",
      "Data Attributes",
      "Exports",
    ]);

    const response = await request.get("/docs/components/client-only.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Client Only");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Layout-safe Fallback](#layout-safe-fallback)");
    expect(markdown).toContain("ClientOnlyProps");
    expect(markdown).toContain("ClientOnlySlots");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("switches every boundary from fallback to browser content", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) {
        errors.push(message.text());
      }
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(message.text())) {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => errors.push(error.message));

    for (const variant of ["preview", "usage", "fallback", "no-fallback"]) {
      await expect(demo(page, variant).locator("[data-client-only-ready]")).toBeVisible();
      await expect(demo(page, variant).locator("[data-client-only-fallback]")).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  });
});
