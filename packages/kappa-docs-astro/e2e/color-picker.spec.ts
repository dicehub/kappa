import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-color-picker-demo="${variant}"]`);

const expectHydrated = async (page: Page, variant: string) => {
  await expect.poll(() =>
    demo(page, variant).evaluate((element) =>
      !element.closest("astro-island")?.hasAttribute("ssr"),
    ),
  ).toBe(true);
};

test.describe("Color Picker documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/color-picker");
  });

  test("renders the public composition and documentation", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Color Picker" })).toBeVisible();
    await expect(demo(page, "preview").locator('[data-slot="color-picker"]')).toHaveCount(1);
    await expect(demo(page, "preview").locator('[data-slot="color-picker-channel-input"]')).toHaveValue("#3F5FDB");
    await expect(page.locator("pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/color-picker"',
    );
    const unhighlightedCompoundTags = await page
      .locator('pre[data-language="vue"] .line')
      .evaluateAll((lines) =>
        lines
          .filter((line) => line.textContent?.includes("<ColorPicker."))
          .filter((line) => {
            const tokenColors = new Set(
              [...line.querySelectorAll<HTMLElement>("span[style]")].map((token) =>
                token.style.getPropertyValue("--shiki-light"),
              ),
            );
            return tokenColors.size < 2;
          })
          .map((line) => line.textContent?.trim()),
      );
    expect(unhighlightedCompoundTags).toEqual([]);
    await expect(page.getByText("ColorPickerValueChangeDetails").first()).toBeVisible();

    const markdownResponse = await request.get("/docs/components/color-picker.md");
    expect(markdownResponse.ok()).toBe(true);
    const markdown = await markdownResponse.text();
    expect(markdown).toContain("# Color Picker");
    expect(markdown).toContain("ColorPicker.Root");
    expect(markdown).not.toContain("On this page");
  });

  test("opens, updates, and dismisses the picker with restored focus", async ({ page }) => {
    await expectHydrated(page, "preview");
    const preview = demo(page, "preview");
    const trigger = preview.getByRole("button", { name: "Accent color" });
    await trigger.click();

    const dialog = page.locator('[data-slot="color-picker-content"][role="dialog"][data-state="open"]');
    await expect(dialog).toBeVisible();
    const dialogId = await dialog.getAttribute("id");
    expect(dialogId).toBeTruthy();
    const persistentDialog = page.locator(`[data-slot="color-picker-content"][id="${dialogId}"]`);
    const hue = dialog.getByRole("slider", { name: "hue" });
    await expect(hue).toBeVisible();
    await expect(dialog.getByRole("slider", { name: "alpha" })).toBeVisible();
    await expect(dialog.getByRole("slider", { name: /saturation and brightness/ })).toBeVisible();

    const initialValue = await preview.getByRole("status").textContent();
    const initialHue = await hue.getAttribute("aria-valuenow");
    await dialog.locator('[data-slot="color-picker-channel-slider-track"][data-channel="hue"]').click({
      position: { x: 24, y: 5 },
    });
    await expect(hue).not.toHaveAttribute("aria-valuenow", initialHue ?? "");
    await expect(preview.getByRole("status")).not.toHaveText(initialValue ?? "");

    await page.getByRole("heading", { level: 2, name: "Installation" }).click();
    await expect(persistentDialog).toHaveAttribute("data-state", "closed");
    await expect(persistentDialog).toBeHidden();
  });

  test("supports inline, swatch, size, and form states", async ({ page }) => {
    await expectHydrated(page, "inline");
    const inline = demo(page, "inline");
    await expect(inline.locator('[data-slot="color-picker-content"]')).toBeVisible();
    await expect(inline.getByRole("button", { name: /select #b42318/i })).toBeVisible();
    await inline.getByRole("button", { name: /select #b42318/i }).click();
    await expect(inline.getByRole("textbox", { name: "Hex color" })).toHaveValue("#B42318");

    const sizes = demo(page, "sizes").locator('[data-slot="color-picker"]');
    await expect(sizes).toHaveCount(3);
    await expect(sizes.nth(0)).toHaveAttribute("data-size", "sm");
    await expect(sizes.nth(1)).toHaveAttribute("data-size", "base");
    await expect(sizes.nth(2)).toHaveAttribute("data-size", "lg");
    const heights = await sizes.locator('[data-slot="color-picker-channel-input"]').evaluateAll((inputs) =>
      inputs.map((input) => input.getBoundingClientRect().height),
    );
    expect(heights[0]).toBeLessThan(heights[1]);
    expect(heights[1]).toBeLessThan(heights[2]);
    const sizeTrigger = sizes.nth(0).getByRole("button", { name: "sm" });
    await sizeTrigger.click();
    await expect(page.locator('[data-slot="color-picker-content"][role="dialog"][data-state="open"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sizeTrigger).toBeFocused();

    const states = demo(page, "states").locator('[data-slot="color-picker"]');
    await expect(states.nth(0).getByRole("textbox")).toBeDisabled();
    await expect(states.nth(1).getByRole("textbox")).toHaveAttribute("readonly", "");
    await expect(states.nth(2).getByRole("textbox")).toHaveAttribute("data-invalid", "");
  });

  test("remains usable in dark mode and a narrow viewport", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !text.startsWith("Failed to load resource:")) errors.push(text);
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(text)) errors.push(text);
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expectHydrated(page, "preview");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const trigger = demo(page, "preview").getByRole("button", { name: "Accent color" });
    await trigger.click();
    await expect(page.locator('[data-slot="color-picker-content"][role="dialog"][data-state="open"]')).toBeVisible();
    expect(errors).toEqual([]);
  });
});
