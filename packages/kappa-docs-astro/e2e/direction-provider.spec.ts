import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-direction-provider-demo="${variant}"]`);

test.describe("Direction Provider documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/direction-provider");
  });

  test("renders complete examples, references, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Direction Provider" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(4);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(4);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);

    const snippets = page.locator("pre[data-language]");
    await expect(page.locator('.docs-code-full pre[data-language="vue"]').first()).toContainText(
      'from "@dicehub/kappa/components/direction-provider"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/utilities/locale",
    );
    await expect(page.locator("#composition")).toContainText(
      "direction from one locale.",
    );

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(compact.getByRole("link", { name: "Previous page: Diff Viewer" })).toHaveAttribute(
      "href",
      "/docs/components/diff-viewer",
    );
    await expect(compact.getByRole("link", { name: "Next page: Download Trigger" })).toHaveAttribute(
      "href",
      "/docs/components/download-trigger",
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
      "Nested Providers",
      "useDirection",
      "Accessibility",
      "API Reference",
      "DirectionProvider",
      "Slots",
      "Exports",
    ]);

    const response = await request.get("/docs/components/direction-provider.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Direction Provider");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [useDirection](#use-direction)");
    expect(markdown).toContain("`DirectionProviderProps`");
    expect(markdown).toContain("`DirectionProviderSlots`");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("switches Ark UI direction and directional keyboard movement at runtime", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !text.startsWith("Failed to load resource:")) {
        errors.push(text);
      }
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(text)) {
        errors.push(text);
      }
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const preview = demo(page, "preview");
    const surface = preview.locator(".direction-example__surface");
    const group = preview.locator('[data-slot="radio"]');
    await expect(preview.locator("xpath=ancestor::astro-island")).not.toHaveAttribute("ssr", "");

    await expect(surface).toHaveAttribute("dir", "ltr");
    await expect(group).toHaveAttribute("dir", "ltr");
    await expect(preview.getByRole("radio", { name: "Normal" })).toBeChecked();

    await preview.getByRole("button", { name: "العربية" }).click();
    await expect(surface).toHaveAttribute("dir", "rtl");
    await expect(surface).toHaveAttribute("lang", "ar");
    await expect(group).toHaveAttribute("dir", "rtl");
    await expect(preview.getByText("أولوية الرسالة")).toBeVisible();

    const normal = preview.getByRole("radio", { name: "عادية" });
    await normal.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(preview.getByRole("radio", { name: "عالية" })).toBeChecked();
    expect(errors).toEqual([]);
  });

  test("supports nested providers and exposes the computed direction", async ({ page }) => {
    const nestedGroups = demo(page, "nested").locator('[data-slot="radio"]');
    await expect(nestedGroups).toHaveCount(2);
    await expect(nestedGroups.nth(0)).toHaveAttribute("dir", "rtl");
    await expect(nestedGroups.nth(1)).toHaveAttribute("dir", "ltr");

    const value = demo(page, "composable").locator("[data-direction-value]");
    await expect(value).toContainText("Current direction: RTL");
  });
});
