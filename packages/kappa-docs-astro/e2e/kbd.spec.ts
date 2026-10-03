import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-kbd-demo="${variant}"]`);

test.describe("Kbd documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/kbd");
  });

  test("renders examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Kbd" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-kbd")).toHaveCount(6);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/kbd"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(7);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Kbd", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Item" })).toHaveAttribute(
      "href",
      "/docs/components/item",
    );
    await expect(compact.getByRole("link", { name: "Next page: Label" })).toHaveAttribute(
      "href",
      "/docs/components/label",
    );
    await expect(footer.getByRole("link", { name: "Item", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Label", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Group",
      "Button",
      "Tooltip",
      "Inline Text",
      "Right to Left",
      "Accessibility",
      "API Reference",
      "Kbd",
      "KbdGroup",
      "Slots",
      "Data Slots",
      "Exports",
    ]);

    const response = await request.get("/docs/components/kbd.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Kbd");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("### [Inline Text](#inline-text)");
    expect(markdown).toContain("KbdGroupProps / KbdGroupSlots");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("uses native semantics and composes groups, buttons, and tooltips", async ({ page }) => {
    const preview = demo(page, "preview");
    const keys = preview.locator(".kappa-kbd");
    const group = preview.locator(".kappa-kbd-group");

    for (const key of await keys.all()) {
      await expect(key).toHaveJSProperty("tagName", "KBD");
      await expect(key).toHaveCSS("height", "20px");
      await expect(key).toHaveCSS("pointer-events", "none");
    }
    await expect(group).toHaveJSProperty("tagName", "SPAN");
    await expect(group).toContainText("Ctrl+B");
    await expect(preview.getByText("Command", { exact: true })).toHaveClass(
      /docs-visually-hidden/,
    );

    const groupKeys = demo(page, "group").locator(".kappa-kbd");
    const firstBox = await groupKeys.first().boundingBox();
    const lastBox = await groupKeys.last().boundingBox();
    expect(firstBox).not.toBeNull();
    expect(lastBox).not.toBeNull();
    expect(firstBox?.y).toBe(lastBox?.y);

    await expect(
      demo(page, "button").getByRole("button", { name: "Accept Enter" }),
    ).toBeVisible();

    const tooltipTrigger = demo(page, "tooltip").getByRole("button", {
      name: "Save changes",
    });
    await tooltipTrigger.scrollIntoViewIfNeeded();
    await page.mouse.move(2, 2);
    await tooltipTrigger.hover();
    await expect(tooltipTrigger).toHaveAttribute("aria-describedby", /.+/);
    const tooltipId = await tooltipTrigger.getAttribute("aria-describedby");
    expect(tooltipId).toBeTruthy();
    const tooltip = page.locator(`[id="${tooltipId}"]`);
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveAttribute("role", "tooltip");
    await expect(tooltip.locator(".kappa-kbd")).toHaveCount(2);
    await expect(tooltip).toContainText("Ctrl+S");
  });

  test("supports both themes, RTL text, and a narrow viewport without warnings", async ({ page }) => {
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
    await page.reload();

    const key = demo(page, "usage").locator(".kappa-kbd");
    const lightBackground = await key.evaluate((element) => getComputedStyle(element).backgroundColor);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => key.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
      lightBackground,
    );

    const rtl = demo(page, "rtl");
    await expect(rtl.locator('[dir="rtl"]')).toHaveAttribute("lang", "ar");
    await expect(rtl.locator(".kappa-kbd-group")).toHaveAttribute("dir", "ltr");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-kbd").first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});
