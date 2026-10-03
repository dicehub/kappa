import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-editable-demo="${variant}"]`);

test.describe("Editable documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/editable");
  });

  test("renders examples, public imports, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Editable" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(7);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    const inputIds = await page
      .locator('[data-slot="editable-input"]')
      .evaluateAll((inputs) => inputs.map((input) => input.id));
    expect(new Set(inputIds).size).toBe(inputIds.length);
    await expect(page.locator('pre[data-language="vue"]').first()).toContainText(
      'from "@dicehub/kappa/components/editable"',
    );

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/editable",
    );

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(compact.getByRole("link", { name: "Previous page: Dropdown" })).toHaveAttribute(
      "href",
      "/docs/components/dropdown",
    );
    await expect(compact.getByRole("link", { name: "Next page: Empty" })).toHaveAttribute(
      "href",
      "/docs/components/empty",
    );

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Explicit Controls",
      "Controlled",
      "States",
      "Sizes",
      "Textarea",
      "Accessibility",
      "API Reference",
      "Editable.Root",
      "Parts",
      "Events",
      "Exports",
    ]);

    const response = await request.get("/docs/components/editable.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Editable");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Textarea](#textarea)");
    expect(markdown).toContain("### [Sizes](#sizes)");
    expect(markdown).toContain('size="xs"');
    expect(markdown).toContain("Editable.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("edits, cancels, commits, and keeps controlled state synchronized", async ({ page }) => {
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

    const previewDemo = demo(page, "preview");
    const preview = previewDemo.locator('[data-slot="editable-preview"]');
    await expect(preview).toHaveText("Ocean current study");
    await preview.click();

    const input = previewDemo.getByRole("textbox", { name: "Project name" });
    await expect(input).toBeFocused();
    await input.fill("Changed name");
    await previewDemo.getByRole("button", { name: "Cancel" }).click();
    await expect(preview).toHaveText("Ocean current study");

    await previewDemo.getByRole("button", { name: "Edit" }).click();
    await input.fill("Current study");
    await previewDemo.getByRole("button", { name: "Save" }).click();
    await expect(preview).toHaveText("Current study");

    const controlled = demo(page, "controlled");
    await controlled.locator('[data-slot="editable-preview"]').click();
    const controlledInput = controlled.getByRole("textbox", { name: "Project name" });
    await controlledInput.fill("Wave response study");
    await controlledInput.press("Enter");
    await expect(controlled.getByText("Saved value: Wave response study")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("keeps selected text compact without changing the control height", async ({ page }) => {
    const example = demo(page, "preview");
    const preview = example.locator('[data-slot="editable-preview"]');
    const previewHeight = await preview.evaluate((element) => element.getBoundingClientRect().height);
    await preview.click();
    const input = example.getByRole("textbox", { name: "Project name" });
    await expect(input).toBeFocused();
    await expect(input).toHaveJSProperty("selectionStart", 0);
    await expect(input).toHaveJSProperty("selectionEnd", "Ocean current study".length);
    const metrics = await input.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        height: element.getBoundingClientRect().height,
        lineHeight: Number.parseFloat(style.lineHeight),
        fontSize: Number.parseFloat(style.fontSize),
      };
    });
    expect(metrics.height).toBe(previewHeight);
    expect(metrics.lineHeight).toBeLessThanOrEqual(metrics.fontSize * 1.5);
    await input.press("Escape");
    await expect(preview).toHaveText("Ocean current study");
  });

  test("matches dicehub field dimensions with xs and preserves the existing sizes", async ({ page }) => {
    const sizes = demo(page, "sizes");
    await expect(sizes).toHaveCSS("width", "192px");
    for (const [size, height] of [["xs", 20], ["sm", 28], ["default", 36], ["lg", 40]] as const) {
      const root = sizes.locator(`[data-slot="editable"][data-size="${size}"]`);
      const preview = root.locator('[data-slot="editable-preview"]');
      await expect(preview).toHaveCSS("height", `${height}px`);
      await preview.click();
      const input = root.getByRole("textbox", { name: `${size} editable field` });
      await expect(input).toBeFocused();
      await expect(input).toHaveCSS("height", `${height}px`);
      if (size === "xs") {
        await expect(input).toHaveCSS("padding-inline-start", "3px");
        await expect(input).toHaveCSS("padding-inline-end", "3px");
        await expect(input).toHaveCSS("border-radius", "2px");
        await expect(input).toHaveCSS("font-size", "13px");
      }
      await input.fill(`${size} refinement`);
      await input.press("Enter");
      await expect(preview).toHaveText(`${size} refinement`);
      await expect(preview).toHaveCSS("height", `${height}px`);
    }
  });

  test("supports explicit actions, state attributes, and a textarea merge target", async ({ page }) => {
    const controls = demo(page, "controls");
    await controls.getByRole("button", { name: "Edit" }).click();
    const controlsInput = controls.getByRole("textbox", { name: "Task name" });
    await controlsInput.fill("Final mesh review");
    await controlsInput.press("Enter");
    await expect(controlsInput).toBeVisible();
    await controls.getByRole("button", { name: "Save" }).click();
    await expect(controls.locator('[data-slot="editable-preview"]')).toHaveText("Final mesh review");

    const states = demo(page, "states");
    await expect(states.locator('[data-slot="editable-preview"][data-disabled]')).toHaveCount(1);
    await expect(states.locator('[data-slot="editable-preview"][aria-readonly="true"]')).toHaveCount(1);
    await expect(states.locator('[data-slot="editable-preview"][aria-invalid="true"]')).toHaveCount(1);

    const textarea = demo(page, "textarea");
    await textarea.locator('[data-slot="editable-preview"]').click();
    const textareaInput = textarea.getByRole("textbox", { name: "Review note" });
    await expect(textareaInput).toHaveJSProperty("localName", "textarea");
    await textareaInput.fill("Updated review note.");
    await textarea.getByRole("button", { name: "Save" }).click();
    await expect(textarea.locator('[data-slot="editable-preview"]')).toHaveText(
      "Updated review note.",
    );
  });
});
