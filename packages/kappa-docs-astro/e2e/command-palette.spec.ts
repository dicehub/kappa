import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-command-palette-demo="${variant}"]`);
const openDemo = async (page: Page, variant: string, buttonName: string) => {
  await demo(page, variant).getByRole("button", { name: buttonName }).click();
  return page.locator(`[data-command-palette-demo-surface="${variant}"]`);
};
const option = (surface: Locator, name: string) =>
  surface.getByRole("option").filter({ hasText: name });

test.describe("Command Palette documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/command-palette");
  });

  test("renders the framed reference examples, explanations, navigation, and API", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Command Palette" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    for (const variant of [
      "preview",
      "grouped",
      "simple",
      "loading",
      "autocomplete-off",
      "result-item",
    ]) {
      await expect(demo(page, variant)).toHaveCount(1);
    }

    const frames = page.locator(".docs-component-preview--command-palette");
    await expect(frames).toHaveCount(6);
    await expect(page.locator(".docs-component-example")).toHaveCount(6);
    await expect(page.locator(".docs-keyboard-shortcut")).toHaveCount(5);
    await expect(page.locator("#component-parts h3")).toHaveCount(15);
    await expect(page.getByText("Chips, multiple selection, and a clear-selection control do not apply.")).toBeVisible();

    const snippets = page.locator("pre[data-language]");
    await expect(
      snippets.filter({ hasText: 'from "@dicehub/kappa/components/command-palette"' }),
    ).not.toHaveCount(0);
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Command Palette", exact: true });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    const adjacent = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(adjacent.getByRole("link", { name: "Previous page: Combobox" })).toHaveAttribute(
      "href",
      "/docs/components/combobox",
    );
    await expect(adjacent.getByRole("link", { name: "Next page: Content Loader" })).toHaveAttribute(
      "href",
      "/docs/components/content-loader",
    );

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc).toHaveClass(/docs-page-toc/);
    await expect(toc.locator(".docs-page-toc__inner")).toBeVisible();
    await expect(toc.locator('[data-part="item"][data-depth="3"]')).toHaveCount(10);
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Keyboard Navigation",
      "Examples",
      "With Grouped Items",
      "Simple Flat List",
      "Loading State",
      "Disabling Browser Autocomplete",
      "ResultItem with Breadcrumbs",
      "Component Parts",
      "Accessibility",
      "API Reference",
      "Root",
      "ResultItem",
      "Events",
    ]);
  });

  test("uses theme-aware modal styling", async ({ page }) => {
    const surface = await openDemo(page, "preview", "Open Command Palette");
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    const input = surface.getByRole("combobox", { name: "Search commands" });
    await expect(dialog).toBeVisible();
    await expect(input).toBeFocused();
    await expect(dialog).toHaveCSS("border-top-width", "1px");
    expect(
      await surface
        .locator(".kappa-command-palette__input-header")
        .evaluate((element) => getComputedStyle(element, "::after").content),
    ).toBe("none");
    const light = await dialog.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color, font: style.fontFamily };
    });

    await page.keyboard.press("Escape");
    const themeToggle = page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true });
    await themeToggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await openDemo(page, "preview", "Open Command Palette");
    const dark = await dialog.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color, font: style.fontFamily };
    });
    expect(light.background).not.toBe(dark.background);
    expect(light.color).not.toBe(dark.color);
    expect(light.font).toMatch(/Geist/i);
    expect(dark.font).toMatch(/Geist/i);
    await page.keyboard.press("Escape");
  });

  test("filters groups, skips disabled commands, loops, selects, resets, and restores focus", async ({ page }) => {
    const trigger = demo(page, "preview").getByRole("button", { name: "Open Command Palette" });
    await trigger.click();
    const surface = page.locator('[data-command-palette-demo-surface="preview"]');
    const input = surface.getByRole("combobox", { name: "Search commands" });
    const highlighted = surface.locator('[data-part="item"][data-highlighted]');

    await expect(input).toBeFocused();
    await expect(surface.getByRole("option")).toHaveCount(7);
    await expect(highlighted).toContainText("Create new project");
    await expect(highlighted).toHaveCSS("border-left-width", "0px");
    expect(
      await highlighted.evaluate((element) => {
        const marker = getComputedStyle(element, "::before");
        return {
          bottom: marker.bottom,
          radius: marker.borderRadius,
          top: marker.top,
        };
      }),
    ).toEqual({ bottom: "0px", radius: "0px", top: "0px" });
    await expect(option(surface, "Restart active worker")).toHaveAttribute("aria-disabled", "true");

    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(input).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(highlighted).toContainText("Open settings");
    await page.keyboard.press("ArrowDown");
    await expect(highlighted).toContainText("Search files");
    await page.keyboard.press("ArrowDown");
    await expect(highlighted).toContainText("Home");
    await page.keyboard.press("End");
    await expect(highlighted).toContainText("Users");
    await page.keyboard.press("ArrowDown");
    await expect(highlighted).toContainText("Create new project");

    await input.fill("dashboard");
    await expect(surface.getByRole("option")).toHaveCount(1);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(demo(page, "preview").locator(".command-palette-demo__selected")).toHaveText(
      "Last selected: Dashboard",
    );

    await trigger.click();
    await expect(input).toHaveValue("");
    await expect(surface.getByRole("option")).toHaveCount(7);
    await page.keyboard.press("Escape");
  });

  test("runs the simple, loading, autocomplete-off, and rich result examples", async ({ page }) => {
    const simple = await openDemo(page, "simple", "Open Simple Palette");
    const simpleInput = simple.getByRole("combobox", { name: "Search commands" });
    await simpleInput.fill("copy");
    await expect(simple.getByRole("option")).toHaveCount(1);
    await expect(option(simple, "Copy")).toBeVisible();
    await simpleInput.fill("zzzz");
    await expect(simple.getByText("No actions found.")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(simple).toHaveCount(0);

    const loading = await openDemo(page, "loading", "Open with Loading");
    await expect(loading.getByRole("status")).toHaveText("Loading results...");
    await expect(loading.locator(".kappa-command-palette__spinner")).toBeVisible();
    await expect(loading.getByRole("option")).toHaveCount(0);
    await expect(loading.getByRole("status")).toHaveCount(0, { timeout: 5_000 });
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
    const loadedOptions = page.locator('.kappa-command-palette__item[role="option"]');
    await expect(loadedOptions).toHaveCount(7);
    await expect(loadedOptions.first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(loading).toHaveCount(0);

    const autocomplete = await openDemo(
      page,
      "autocomplete-off",
      "Open Palette (No Autocomplete)",
    );
    const autocompleteInput = autocomplete.getByRole("combobox", { name: "Search commands" });
    await expect(autocompleteInput).toHaveAttribute("autocomplete", "off");
    await expect(autocompleteInput).toHaveAttribute("data-1p-ignore", "true");
    await expect(autocompleteInput).toHaveAttribute("data-lpignore", "true");
    await page.keyboard.press("Escape");
    await expect(autocomplete).toHaveCount(0);

    const result = await openDemo(page, "result-item", "Open with ResultItem");
    const resultInput = result.getByRole("combobox", { name: "Search commands" });
    await resultInput.fill("header");
    const resultOption = result.getByRole("option");
    await expect(resultOption).toHaveCount(1);
    await expect(resultOption).toContainText("Blocks/Page Header");
    await page.keyboard.press("Control+Enter");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toHaveCount(0);
  });
});

test.describe("Documentation search", () => {
  test("opens from the header and shortcut, navigates, and survives soft navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");

    const trigger = page.locator(".docs-header [data-docs-search-open]");
    await expect(trigger).toBeEnabled();
    await expect(trigger).toHaveAttribute("data-docs-search-ready", "true");
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Search documentation" });
    const input = dialog.getByRole("combobox", { name: "Search documentation" });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(input).toBeFocused();
    await input.fill("command palette");
    await expect(dialog.getByRole("option")).toHaveCount(1);
    await expect(dialog.getByRole("option")).toContainText("Command Palette");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/docs\/components\/command-palette\/?$/);
    await expect(page.getByRole("heading", { level: 1, name: "Command Palette" })).toBeVisible();
    const nextTrigger = page.locator(".docs-header").getByRole("button", { name: "Search documentation" });
    await expect(nextTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(nextTrigger).toHaveAttribute("data-docs-search-ready", "true");

    await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible();
    await expect(input).toHaveValue("");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("fits the mobile viewport and restores the search trigger", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs/components/button");
    const trigger = page.locator(".docs-mobile-header").getByRole("button", { name: "Search documentation" });
    await expect(trigger).toHaveAttribute("data-docs-search-ready", "true");
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Search documentation" });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(391);
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(845);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
