import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-autocomplete-demo="${variant}"]`);

const comboboxInput = (container: Locator) =>
  container.locator('[data-scope="combobox"][data-part="input"]');

const openContent = (page: Page) =>
  page.locator('[data-scope="combobox"][data-part="content"][data-state="open"]');

const openOptions = (page: Page) => openContent(page).getByRole("option");

async function expectPopupClosed(page: Page) {
  await expect(openContent(page)).toHaveCount(0);
}

test.describe("Autocomplete documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/autocomplete");
    await expect(page.locator("astro-island[ssr]:has([data-autocomplete-demo])")).toHaveCount(0);
  });

  test("renders public examples, navigation, names, and both themes", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Autocomplete" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-autocomplete")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/autocomplete"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const inputs = page.locator('[data-scope="combobox"][data-part="input"]');
    expect(await inputs.count()).toBeGreaterThan(0);
    for (const input of await inputs.all()) {
      await expect(input).toHaveAccessibleName(/\S+/);
    }

    const sidebarLink = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Autocomplete", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });

    await expect(sidebarLink).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Attachment" })).toHaveAttribute(
      "href",
      "/docs/components/attachment",
    );
    await expect(compact.getByRole("link", { name: "Next page: Avatar" })).toHaveAttribute(
      "href",
      "/docs/components/avatar",
    );
    await expect(footer.getByRole("link", { name: "Attachment", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Avatar", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Controlled and Clearable",
      "Field and Help Text",
      "Invalid",
      "Grouped Suggestions",
      "Sizes",
      "Custom Filtering",
      "Disabled and Read-only",
      "Accessibility",
      "API Reference",
      "Autocomplete",
      "Autocomplete.Content",
      "Events",
      "Exports",
    ]);

    const root = page.locator("html");
    const preview = demo(page, "preview");
    const previewInput = comboboxInput(preview);
    const previewControl = preview.locator('[data-part="control"]');
    const themeToggle = page
      .getByRole("button", { name: "Toggle theme" })
      .filter({ visible: true });
    const readThemeStyles = async () => {
      const content = openContent(page);
      const [control, popup, fontFamily] = await Promise.all([
        previewControl.evaluate((element) => {
          const styles = getComputedStyle(element);
          return { background: styles.backgroundColor, color: styles.color };
        }),
        content.evaluate((element) => {
          const styles = getComputedStyle(element);
          return { background: styles.backgroundColor, color: styles.color };
        }),
        previewInput.evaluate((element) => getComputedStyle(element).fontFamily),
      ]);
      return { control, popup, fontFamily };
    };

    await expect(root).toHaveAttribute("data-mode", "light");
    await previewInput.fill("run");
    await expect(openContent(page)).toBeVisible();
    const lightStyles = await readThemeStyles();

    await themeToggle.click();
    await expect(root).toHaveAttribute("data-mode", "dark");
    await previewInput.fill("review");
    await expect(openContent(page)).toBeVisible();
    const darkStyles = await readThemeStyles();

    expect(lightStyles.control.background).not.toBe(darkStyles.control.background);
    expect(lightStyles.control.color).not.toBe(darkStyles.control.color);
    expect(lightStyles.popup.background).not.toBe(darkStyles.popup.background);
    expect(lightStyles.popup.color).not.toBe(darkStyles.popup.color);
    expect(lightStyles.fontFamily).toMatch(/Geist/i);
    expect(darkStyles.fontFamily).toMatch(/Geist/i);

    await themeToggle.click();
    await expect(root).toHaveAttribute("data-mode", "light");
  });

  test("autohighlights, skips disabled items, selects, and closes with Escape", async ({ page }) => {
    const preview = demo(page, "preview");
    const input = comboboxInput(preview);

    await input.click();
    await input.fill("re");

    const options = openOptions(page);
    const highlighted = openContent(page).locator('[data-part="item"][data-highlighted]');
    const disabled = options.filter({ hasText: "Restart worker" });
    const unselected = options.filter({ hasText: "Review mesh" });

    await expect(options).toHaveCount(3);
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    await expect(unselected.locator('[data-part="item-indicator"]')).toBeHidden();
    await expect(highlighted).toContainText("Review mesh");

    await page.keyboard.press("ArrowDown");
    await expect(highlighted).toContainText("Open results");
    await page.keyboard.press("Enter");

    await expect(input).toHaveValue("Open results");
    await expectPopupClosed(page);

    await page.keyboard.press("ArrowDown");
    await expect(openContent(page)).toBeVisible();
    const selected = openOptions(page).filter({ hasText: "Open results" });
    await expect(selected.locator('[data-part="item-indicator"]')).toBeVisible();

    await page.keyboard.press("Escape");
    await expectPopupClosed(page);
    await expect(input).toBeFocused();
  });

  test("handles whitespace, empty results, custom filtering, and its optional trigger", async ({ page }) => {
    const previewInput = comboboxInput(demo(page, "preview"));

    await previewInput.click();
    await previewInput.fill("   ");
    await expect(openOptions(page)).toHaveCount(0);

    await previewInput.fill("zzzz");
    await expect(openContent(page).getByText("No matching command.")).toBeVisible();
    await previewInput.fill("");
    await expect(openOptions(page)).toHaveCount(0);
    await page.keyboard.press("Escape");

    const filtering = demo(page, "filtering");
    const filterInput = comboboxInput(filtering);
    const trigger = filtering.getByRole("button", { name: "Toggle suggestions" });

    await trigger.click();
    await expect(openOptions(page)).toHaveCount(4);
    await filterInput.fill("cy");
    await expect(openOptions(page)).toHaveCount(1);
    await expect(openOptions(page).first()).toHaveText("Cylinder wake");
    await filterInput.fill("wake");
    await expect(openOptions(page)).toHaveCount(0);
    await expect(
      openContent(page).getByText("No project starts with that text."),
    ).toBeVisible();
  });

  test("synchronizes controlled clearing and exposes complete form states", async ({ page }) => {
    const controlled = demo(page, "controlled");
    const controlledInput = comboboxInput(controlled);
    const clear = controlled.getByRole("button", { name: "Clear input" });

    await expect(clear).toBeHidden();
    await controlledInput.fill("pear");
    await openOptions(page).filter({ hasText: "Pear" }).click();
    await expect(controlledInput).toHaveValue("Pear");
    await expect(controlled.getByText("Input: Pear")).toBeVisible();
    await expect(clear).toBeVisible();

    await clear.click();
    await expect(controlledInput).toHaveValue("");
    await expect(controlled.getByText("Input: empty")).toBeVisible();
    await expect(clear).toBeHidden();
    await expect(openOptions(page)).toHaveCount(0);

    const fieldInput = comboboxInput(demo(page, "field"));
    const invalidInput = comboboxInput(demo(page, "invalid"));
    const disabledInput = comboboxInput(demo(page, "states")).nth(0);
    const readOnlyInput = comboboxInput(demo(page, "states")).nth(1);

    await expect(fieldInput).toHaveAttribute("aria-describedby", "autocomplete-country-help");
    await expect(fieldInput).toHaveAccessibleName("Country");
    await expect(invalidInput).toHaveAttribute("aria-invalid", "true");
    await expect(invalidInput).toHaveAttribute(
      "aria-describedby",
      "autocomplete-country-error",
    );
    await expect(disabledInput).toBeDisabled();
    await expect(readOnlyInput).toHaveAttribute("readonly", "");
    await expect(readOnlyInput).toHaveValue("Apple");
  });

  test("keeps the portalled suggestion surface inside a mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.locator("astro-island[ssr]:has([data-autocomplete-demo])")).toHaveCount(0);

    const input = comboboxInput(demo(page, "preview"));
    await input.scrollIntoViewIfNeeded();
    await input.click();
    await input.fill("run");

    const content = openContent(page);
    await expect(content).toBeVisible();
    await expect(content.getByRole("option", { name: "Run simulation" })).toBeVisible();

    const [contentBox, inputFontSize, isInsidePreview] = await Promise.all([
      content.boundingBox(),
      input.evaluate((element) => getComputedStyle(element).fontSize),
      content.evaluate((element) => Boolean(element.closest(".docs-component-preview"))),
    ]);

    expect(contentBox).not.toBeNull();
    expect(contentBox?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect(contentBox?.y ?? -1).toBeGreaterThanOrEqual(0);
    expect((contentBox?.x ?? 0) + (contentBox?.width ?? 0)).toBeLessThanOrEqual(391);
    expect((contentBox?.y ?? 0) + (contentBox?.height ?? 0)).toBeLessThanOrEqual(845);
    expect(Number.parseFloat(inputFontSize)).toBeGreaterThanOrEqual(16);
    expect(isInsidePreview).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
