import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-slider-demo="${variant}"]`);

test.describe("Slider documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/slider");
  });

  test("renders documentation, snippets, anatomy, and API data", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Slider" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator('[data-slot="slider"]')).toHaveCount(1);
    await expect(demo(page, "preview").locator('[data-slot="slider-track"]')).toHaveCount(1);
    await expect(demo(page, "preview").getByRole("slider")).toHaveCount(1);
    await expect(page.locator("pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/slider"',
    );
    await expect(page.locator("pre").filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.getByText("SliderValueChangeDetails").first()).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Range",
      "Marks",
      "Vertical",
      "Sizes",
      "States",
      "Controlled",
      "Centered Origin",
      "Accessibility",
      "Keyboard Support",
      "API Reference",
      "Slider.Root",
      "Parts",
      "Events",
      "Slots",
      "Data Attributes",
      "Exports",
    ]);

    const markdownResponse = await request.get("/docs/components/slider.md");
    expect(markdownResponse.ok()).toBe(true);
    const markdown = await markdownResponse.text();
    expect(markdown).toContain("# Slider");
    expect(markdown).toContain("SliderProps");
    expect(markdown).not.toContain("On this page");
  });

  test("supports pointer-independent keyboard updates, ranges, marks, and orientation", async ({ page }) => {
    const preview = demo(page, "preview");
    const thumb = preview.getByRole("slider");
    await expect(thumb).toHaveAttribute("aria-valuenow", "64");
    await thumb.focus();
    await thumb.press("ArrowRight");
    await expect(thumb).toHaveAttribute("aria-valuenow", "65");
    await expect(preview.getByRole("status")).toHaveText("Current mix: 65%");

    const range = demo(page, "range");
    await expect(range.getByRole("slider")).toHaveCount(2);
    await expect(range.locator('[data-slot="slider-hidden-input"]')).toHaveCount(2);
    await expect(range.locator('[data-slot="slider-range"]')).toBeVisible();

    const marks = demo(page, "marks");
    await expect(marks.locator('[data-slot="slider-marker"]')).toHaveCount(3);
    await expect(marks.locator('[data-slot="slider-marker"]').nth(1)).toHaveAttribute("data-value", "50");

    const vertical = demo(page, "vertical");
    await expect(vertical.locator('[data-slot="slider"]')).toHaveAttribute("data-orientation", "vertical");
    const verticalThumb = vertical.getByRole("slider");
    await verticalThumb.focus();
    await verticalThumb.press("ArrowUp");
    await expect(verticalThumb).toHaveAttribute("aria-valuenow", "69");
  });

  test("keeps disabled, read-only, invalid, theme, and narrow states visible", async ({ page }) => {
    const states = demo(page, "states");
    await expect(states.locator('[data-slot="slider"]').nth(0)).toHaveAttribute("data-disabled", "");
    await expect(states.locator('[data-slot="slider"]').nth(0).getByRole("slider")).toBeDisabled();
    await expect(states.locator('[data-slot="slider"]').nth(1)).toHaveAttribute("data-readonly", "");
    await expect(states.locator('[data-slot="slider"]').nth(2)).toHaveAttribute("data-invalid", "");

    const errors: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !text.startsWith("Failed to load resource:")) errors.push(text);
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(text)) errors.push(text);
    });
    page.on("pageerror", (error) => errors.push(error.message));
    const thumb = demo(page, "usage").getByRole("slider");
    const lightBackground = await thumb.evaluate((element) => getComputedStyle(element).backgroundColor);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => thumb.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(lightBackground);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").getByRole("slider")).toBeVisible();
    expect(errors).toEqual([]);
  });
});
