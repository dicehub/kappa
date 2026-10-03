import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-toggle-group-demo="${variant}"]`);

test.describe("Toggle Group documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/toggle-group");
  });

  test("renders documentation, snippets, anatomy, and API data", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Toggle Group" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator('[data-slot="toggle-group"]')).toHaveCount(1);
    await expect(page.locator("pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/toggle-group"',
    );
    await expect(page.locator("pre").filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.getByText("ToggleGroupValueChangeDetails")).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Multiple Selection",
      "Vertical",
      "Sizes",
      "States",
      "Controlled",
      "Accessibility",
      "Keyboard Support",
      "API Reference",
      "ToggleGroup.Root",
      "ToggleGroup.Item",
      "Parts",
      "Events",
      "Slots",
      "Data Attributes",
      "Exports",
    ]);

    const markdownResponse = await request.get("/docs/components/toggle-group.md");
    expect(markdownResponse.ok()).toBe(true);
    const markdown = await markdownResponse.text();
    expect(markdown).toContain("# Toggle Group");
    expect(markdown).toContain("ToggleGroupProps");
    expect(markdown).not.toContain("On this page");
  });

  test("supports single, multiple, vertical, and disabled interaction", async ({ page }) => {
    const preview = demo(page, "preview");
    const board = preview.getByRole("radio", { name: "Board" });
    await expect(board).toHaveAttribute("aria-checked", "true");
    await expect(board).toHaveCSS("background-color", "rgb(242, 243, 245)");
    await expect(board).toHaveCSS("color", "rgb(23, 23, 23)");
    await preview.getByRole("radio", { name: "List" }).click();
    await expect(preview.getByRole("radio", { name: "List" })).toHaveAttribute("aria-checked", "true");
    await expect(preview.getByRole("status")).toHaveText("Showing list view");

    const multiple = demo(page, "multiple");
    await expect(multiple.getByRole("button", { name: "Status" })).toHaveAttribute("aria-pressed", "true");
    await multiple.getByRole("button", { name: "Updated" }).click();
    await expect(multiple.getByRole("status")).toHaveText("Columns: status, owner, updated");

    const vertical = demo(page, "vertical");
    const verticalBoard = vertical.getByRole("radio", { name: "Board" });
    await verticalBoard.focus();
    await verticalBoard.press("ArrowDown");
    await expect(vertical.getByRole("radio", { name: "Timeline" })).toBeFocused();

    const states = demo(page, "states");
    await expect(states.getByRole("radio", { name: "Pending" })).toBeDisabled();
    await expect(states.getByRole("radio", { name: "Locked" })).toBeDisabled();
    await expect(states.getByRole("radio", { name: "Locked" })).toHaveAttribute("aria-checked", "true");
  });

  test("keeps theme, narrow layout, and console clean", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !text.startsWith("Failed to load resource:")) errors.push(text);
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(text)) errors.push(text);
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.reload();

    const group = demo(page, "usage").locator('[data-slot="toggle-group"]');
    const lightForeground = await group.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => group.evaluate((element) => getComputedStyle(element).color)).not.toBe(lightForeground);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator('[data-slot="toggle-group"]')).toBeVisible();
    expect(errors).toEqual([]);
  });
});
