import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-combobox-demo="${variant}"]`);
const openContent = (page: Page) =>
  page.locator('.kappa-combobox__content[data-state="open"]');
const openOptions = (page: Page) => openContent(page).getByRole("option");

test.describe("Combobox documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/combobox");
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Combobox" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-combobox")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/combobox"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Combobox", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(
      compact.getByRole("link", { name: "Previous page: Color Picker" }),
    ).toHaveAttribute("href", "/docs/components/color-picker");
    await expect(
      compact.getByRole("link", { name: "Next page: Command Palette" }),
    ).toHaveAttribute("href", "/docs/components/command-palette");
    await expect(footer.getByRole("link", { name: "Color Picker", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Command Palette", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Popup Search",
      "Custom Trigger",
      "Grouped Options",
      "Multiple Values",
      "Sizes",
      "Disabled and Invalid",
      "Accessibility",
      "API Reference",
      "Combobox.Root",
      "Parts",
      "Events",
      "Exports",
    ]);

    const response = await request.get("/docs/components/combobox.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Combobox");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("### [Multiple Values](#multiple)");
    expect(markdown).toContain("Combobox.TriggerMultipleWithInput");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("filters, selects, clears, and uses the Ark keyboard contract", async ({ page }) => {
    const preview = demo(page, "preview");
    const input = preview.getByRole("combobox", { name: "Compute region" });

    await expect(input).toHaveValue("EU Central · Frankfurt");
    await input.fill("west");
    await expect(openOptions(page)).toHaveCount(2);
    await expect(openOptions(page).first()).toHaveText(/EU West · Dublin/);
    await input.press("Enter");
    await expect(input).toHaveValue("EU West · Dublin");
    await expect(openContent(page)).toHaveCount(0);

    const clear = preview.getByRole("button", { name: "Clear selection" });
    await clear.click();
    await expect(input).toHaveValue("");
    await expect(clear).toHaveCount(0);
  });

  test("supports popup search and custom trigger composition", async ({ page }) => {
    const popup = demo(page, "popup-search");
    const valueTrigger = popup.locator(".kappa-combobox__value-trigger");

    await expect(valueTrigger).toContainText("English");
    await valueTrigger.click();
    const search = page.getByRole("combobox", { name: "Search languages" });
    await expect(search).toBeVisible();
    await search.fill("germ");
    await expect(openOptions(page)).toHaveCount(1);
    await openOptions(page).getByText("German", { exact: true }).click();
    await expect(valueTrigger).toContainText("German");
    await expect(openContent(page)).toHaveCount(0);

    const custom = demo(page, "custom-trigger");
    const customTrigger = custom.locator(".combobox-demo__custom-trigger");
    await expect(customTrigger).toContainText("Language: German");
    await expect(customTrigger).toHaveClass(/kappa-button/);
    await expect(customTrigger).toHaveClass(/kappa-combobox__trigger/);
    await customTrigger.click();
    await openOptions(page).getByText("French", { exact: true }).click();
    await expect(customTrigger).toContainText("Language: French");
  });

  test("filters groups and skips disabled items", async ({ page }) => {
    const grouped = demo(page, "grouped");
    const solverInput = grouped.getByRole("combobox", { name: "Linear solver" });

    await solverInput.fill("smooth");
    await expect(openContent(page).locator(".kappa-combobox__group-label")).toHaveText([
      "Momentum",
    ]);
    await expect(openOptions(page)).toHaveCount(1);
    await openOptions(page).click();
    await expect(solverInput).toHaveValue("smoothSolver");

    const usage = demo(page, "usage");
    const formatInput = usage.getByRole("combobox", { name: "Mesh format" });
    await formatInput.fill("star");
    const disabled = openOptions(page).getByText("STAR-CCM+ mesh", { exact: true });
    await expect(disabled).toHaveAttribute("data-disabled", "");
    await disabled.click({ force: true });
    await expect(formatInput).not.toHaveValue("STAR-CCM+ mesh");
  });

  test("adds and removes multiple selected values without closing", async ({ page }) => {
    const multiple = demo(page, "multiple");
    const input = multiple.getByRole("combobox", { name: "Run tags" });

    await expect(multiple.locator(".kappa-combobox__chip")).toHaveCount(1);
    await input.fill("prod");
    await openOptions(page).getByText("Production", { exact: true }).click();
    await expect(openContent(page)).toBeVisible();
    await expect(multiple.locator(".kappa-combobox__chip")).toHaveCount(2);
    await expect(multiple.getByText("2 tags selected")).toBeVisible();
    await multiple.getByRole("button", { name: "Remove Production" }).click();
    await expect(multiple.locator(".kappa-combobox__chip")).toHaveCount(1);
    await expect(multiple.getByText("1 tags selected")).toBeVisible();
  });

  test("keeps field states, themes, and mobile layout intact", async ({ page }) => {
    const states = demo(page, "states");
    const disabled = states.getByRole("combobox", { name: "Source format" });
    const invalid = states.getByRole("combobox", { name: "Output format" });
    await expect(disabled).toBeDisabled();
    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid).toHaveAttribute("aria-describedby", /-error/);
    await expect(states.getByText("Select one supported output format.")).toBeVisible();

    const previewControl = demo(page, "preview").locator(".kappa-combobox__control");
    const lightBackground = await previewControl.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => previewControl.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(lightBackground);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "sizes").locator(".combobox-demo__sizes")).toHaveCSS(
      "grid-template-columns",
      /.+/,
    );
  });
});
