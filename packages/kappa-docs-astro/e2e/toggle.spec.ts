import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-toggle-demo="${variant}"]`);

test.describe("Toggle documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/toggle");
  });

  test("renders complete documentation and public examples", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Toggle" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-toggle")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/toggle"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(8);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Toggle", exact: true });
    await expect(sidebar).toHaveAttribute("aria-current", "page");

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Variants",
      "With Text",
      "Sizes",
      "Controlled",
      "Disabled",
      "Right to Left",
      "Accessibility",
      "Keyboard Support",
      "API Reference",
      "Toggle",
      "Events",
      "Slots",
      "Data Attributes",
      "Exports",
    ]);

    await expect(page.locator('#composition [data-composition-tree="toggle"]')).toContainText(
      "Toggle <button aria-pressed>",
    );
    await expect(page.locator("#composition")).toContainText(
      "The API uses a native button with aria-pressed.",
    );
    await expect(
      page.locator("#composition").getByRole("link", { name: "Toggle Group", exact: true }),
    ).toHaveAttribute("href", "https://ark-ui.com/docs/components/toggle-group");

    const markdownResponse = await request.get("/docs/components/toggle.md");
    expect(markdownResponse.ok()).toBe(true);
    const markdown = await markdownResponse.text();
    expect(markdown).toContain("# Toggle");
    expect(markdown).toContain("## [Keyboard Support](#keyboard-support)");
    expect(markdown).toContain("ToggleProps");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("supports pointer, keyboard, controlled, size, and disabled behavior", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    const preview = demo(page, "preview");
    const button = preview.getByRole("button", { name: "Toggle bookmark" });
    const icon = button.locator("svg");
    const before = await button.boundingBox();
    await page.mouse.move(0, 0);
    const inactiveButtonStyle = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.color,
      };
    });
    const inactiveIconStyle = await icon.evaluate((element) => {
      const style = getComputedStyle(element);
      return { color: style.color, fill: style.fill };
    });
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await button.hover();
    const inactiveHoverStyle = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.color,
      };
    });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    const activeHoverStyle = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.color,
      };
    });
    expect(activeHoverStyle).toEqual(inactiveHoverStyle);
    await page.mouse.move(0, 0);
    const activeButtonStyle = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.color,
      };
    });
    const activeIconStyle = await icon.evaluate((element) => {
      const style = getComputedStyle(element);
      return { color: style.color, fill: style.fill };
    });
    expect(activeButtonStyle.backgroundColor).not.toBe(inactiveButtonStyle.backgroundColor);
    expect(activeButtonStyle.borderColor).toBe(inactiveButtonStyle.borderColor);
    expect(activeButtonStyle.color).toBe(inactiveButtonStyle.color);
    expect(activeIconStyle.color).toBe(inactiveIconStyle.color);
    expect(activeIconStyle.fill).not.toBe(inactiveIconStyle.fill);
    const after = await button.boundingBox();
    expect(after?.y).toBe(before?.y);
    expect(after?.height).toBe(before?.height);

    const usage = demo(page, "usage").getByRole("button", { name: "Bold" });
    await expect(usage).toHaveAttribute("aria-pressed", "true");
    await usage.focus();
    await usage.press("Space");
    await expect(usage).toHaveAttribute("aria-pressed", "false");
    await usage.press("Enter");
    await expect(usage).toHaveAttribute("aria-pressed", "true");

    const controlled = demo(page, "controlled");
    const controlledButton = controlled.getByRole("button", { name: "Save report" });
    await expect(controlledButton).toHaveAttribute("aria-pressed", "true");
    await controlledButton.click();
    await expect(controlledButton).toHaveAttribute("aria-pressed", "false");
    await expect(controlled.getByRole("status")).toHaveText("Not saved");

    const sizes = demo(page, "sizes").locator(".kappa-toggle");
    const heights = await sizes.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    );
    expect(heights).toEqual([28, 32, 36]);

    const disabled = demo(page, "disabled").getByRole("button");
    await expect(disabled.first()).toBeDisabled();
    await expect(disabled.first()).toHaveAttribute("data-disabled", "");
    await expect(disabled.last()).toBeDisabled();
    await expect(disabled.last()).toHaveAttribute("aria-pressed", "true");

    const rtl = demo(page, "rtl");
    const rtlButton = rtl.getByRole("button", { name: "حفظ" });
    const rtlIcon = rtlButton.locator("svg");
    await expect(rtlIcon).toHaveCSS("fill", "none");
    await rtlButton.click();
    await expect(rtlButton).toHaveAttribute("aria-pressed", "true");
    await expect
      .poll(() =>
        rtlIcon.evaluate((element) => {
          const style = getComputedStyle(element);
          return [style.fill, style.color];
        }),
      )
      .toEqual(["rgb(23, 23, 23)", "rgb(23, 23, 23)"]);
  });

  test("keeps themes, RTL, narrow layout, and the console clean", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !text.startsWith("Failed to load resource:")) errors.push(text);
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(text)) errors.push(text);
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.reload();

    const toggle = demo(page, "usage").locator(".kappa-toggle");
    const lightBackground = await toggle.evaluate((element) => getComputedStyle(element).backgroundColor);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => toggle.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
      lightBackground,
    );

    await expect(demo(page, "rtl").locator('[dir="rtl"]')).toHaveAttribute("lang", "ar");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-toggle")).toBeVisible();
    expect(errors).toEqual([]);
  });
});
