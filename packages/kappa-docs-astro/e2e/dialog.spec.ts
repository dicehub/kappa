import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-dialog-demo="${variant}"]`);
const surface = (page: Page, variant: string) =>
  page.locator(`[data-dialog-demo-surface="${variant}"]`);
const openDemo = async (page: Page, variant: string, buttonName: string) => {
  const target = demo(page, variant);
  await expect
    .poll(() =>
      target.evaluate((node) => node.closest("astro-island")?.hasAttribute("ssr") === false),
    )
    .toBe(true);
  const trigger = target.getByRole("button", { name: buttonName });
  await trigger.click();
  await expect(surface(page, variant)).toBeVisible();
  return { dialog: surface(page, variant), trigger };
};
const clickBackdrop = async (page: Page) => {
  const backdrop = page.locator('[data-slot="dialog-backdrop"][data-state="open"]').last();
  await expect(backdrop).toBeVisible();
  await backdrop.click({ position: { x: 4, y: 4 } });
};

test.describe("Dialog documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/dialog");
    await expect(page.locator("astro-island[ssr]:has([data-dialog-demo])")).toHaveCount(0);
  });

  test("renders all examples, explanations, navigation, TOC, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Dialog" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);

    for (const variant of [
      "preview",
      "basic",
      "alert-dialog",
      "confirmation",
      "controlled",
      "sizes",
      "custom-close-button",
      "no-close-button",
      "native-form-control",
      "combobox",
      "sticky-footer",
      "scrollable-content",
      "nested-dialog",
      "right-to-left",
    ]) {
      await expect(demo(page, variant)).toHaveCount(1);
    }

    const primitive = page.getByRole("link", { name: "View Ark UI documentation" });
    await expect(primitive).toHaveAttribute("href", "https://ark-ui.com/docs/components/dialog");
    await expect(page.locator("#composition")).toContainText(
      "The Kappa close label is configurable for localization.",
    );

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/dialog"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Dialog", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Date Picker" })).toHaveAttribute(
      "href",
      "/docs/components/date-picker",
    );
    await expect(compact.getByRole("link", { name: "Next page: Dialog Layout" })).toHaveAttribute(
      "href",
      "/docs/components/dialog-layout",
    );
    await expect(footer.getByRole("link", { name: "Date Picker", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Dialog Layout", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Reference Differences",
      "Behavior and Focus",
      "Examples",
      "Basic",
      "Alert Dialog",
      "Confirmation",
      "Controlled",
      "Sizes and Custom Width",
      "Custom Close Button",
      "No Close Button",
      "Native Form Control",
      "With Combobox",
      "Sticky Footer",
      "Scrollable Content",
      "Nested Dialog",
      "Right-to-left",
      "Accessibility",
      "API Reference",
      "Dialog.Root",
      "Dialog.Content",
      "Parts",
      "Events",
      "Exports",
    ]);

    const response = await request.get("/docs/components/dialog.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Dialog");
    expect(markdown).toContain("## [Behavior and Focus](#behavior-and-focus)");
    expect(markdown).toContain("### [Nested Dialog](#nested-dialog)");
    expect(markdown).toContain("Dialog.Content");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("opens, labels, traps, dismisses, and restores focus", async ({ page }) => {
    const { dialog, trigger } = await openDemo(page, "preview", "Edit run details");
    const semanticDialog = page.getByRole("dialog", { name: "Edit run details" });
    const input = dialog.getByRole("textbox", { name: "Run label" });
    const close = dialog.getByRole("button", { name: "Close dialog" });

    await expect(semanticDialog).toBeVisible();
    await expect(semanticDialog).toHaveAttribute("aria-modal", "true");
    await expect(input).toBeFocused();
    await expect(dialog.getByText("Change the label used in reports and result archives.")).toBeVisible();

    await page.keyboard.press("Shift+Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(input).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(semanticDialog).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await trigger.click();
    await clickBackdrop(page);
    await expect(semanticDialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("protects alert and explicit confirmation dialogs from outside dismissal", async ({
    page,
  }) => {
    const alert = await openDemo(page, "alert-dialog", "Delete run");
    const alertDialog = page.getByRole("alertdialog", { name: "Delete run 4189?" });
    await expect(alertDialog).toBeVisible();
    await expect(alert.dialog.getByRole("button", { name: "Keep run" })).toBeFocused();
    await clickBackdrop(page);
    await expect(alertDialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(alertDialog).toHaveCount(0);

    const confirmation = await openDemo(page, "confirmation", "Stop solver");
    await clickBackdrop(page);
    await expect(confirmation.dialog).toBeVisible();
    await confirmation.dialog.getByRole("button", { name: "Continue run" }).click();
    await expect(confirmation.dialog).toHaveCount(0);
  });

  test("supports controlled, custom-close, no-close, and unique close controls", async ({
    page,
  }) => {
    const controlled = demo(page, "controlled");
    const controlledState = controlled.locator("output");
    await expect(controlledState).toHaveText("State: closed");
    await controlled.getByRole("button", { name: "Open controlled dialog" }).click();
    await expect(controlledState).toHaveText("State: open");
    await surface(page, "controlled").getByRole("button", { name: "Done" }).click();
    await expect(controlledState).toHaveText("State: closed");

    const custom = await openDemo(page, "custom-close-button", "Open custom close");
    await expect(custom.dialog.getByRole("button", { name: "Dismiss" })).toBeVisible();
    await expect(custom.dialog.getByRole("button", { name: "Close dialog" })).toHaveCount(0);
    await custom.dialog.getByRole("button", { name: "Dismiss" }).click();
    await expect(custom.trigger).toBeFocused();

    const noClose = await openDemo(page, "no-close-button", "Open without corner close");
    await expect(noClose.dialog.getByRole("button", { name: "Close dialog" })).toHaveCount(0);
    await noClose.dialog.getByRole("button", { name: "Acknowledge" }).click();

    const preview = await openDemo(page, "preview", "Edit run details");
    const closeIds = await Promise.all(
      ["Close dialog", "Cancel", "Save changes"].map((name) =>
        preview.dialog.getByRole("button", { name, exact: true }).getAttribute("id"),
      ),
    );
    expect(closeIds).toHaveLength(3);
    expect(new Set(closeIds).size).toBe(closeIds.length);
    expect(closeIds.every(Boolean)).toBe(true);
  });

  test("applies sizes, theme tokens, reduced motion, and mobile limits", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    const expectedWidths = new Map([
      ["sm", 320],
      ["base", 416],
      ["lg", 544],
      ["xl", 768],
    ]);

    for (const [size, width] of expectedWidths) {
      await demo(page, "sizes").getByRole("button", { name: size, exact: true }).click();
      const sized = surface(page, `size-${size}`);
      await expect(sized).toHaveAttribute("data-size", size);
      const computedWidth = await sized.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).width),
      );
      expect(computedWidth).toBe(width);
      await page.keyboard.press("Escape");
      await expect(sized).toHaveCount(0);
    }

    const preview = await openDemo(page, "preview", "Edit run details");
    const light = await preview.dialog.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color, font: style.fontFamily };
    });
    await page.keyboard.press("Escape");
    await expect(preview.dialog).toHaveCount(0);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await preview.trigger.click();
    const dark = await preview.dialog.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color, font: style.fontFamily };
    });
    expect(dark.background).not.toBe(light.background);
    expect(dark.color).not.toBe(light.color);
    expect(dark.font).toMatch(/Geist/i);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(preview.dialog).toHaveCSS("animation-name", "none");
    await page.keyboard.press("Escape");
    await expect(preview.dialog).toHaveCount(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const mobile = await openDemo(page, "preview", "Edit run details");
    const box = await mobile.dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test("keeps native and Combobox controls interactive above the modal", async ({ page }) => {
    const form = await openDemo(page, "native-form-control", "Configure resource");
    const select = form.dialog.getByRole("combobox", { name: "Region" });
    await select.selectOption("us-east");
    await expect(select).toHaveValue("us-east");
    await form.dialog.getByRole("button", { name: "Cancel" }).click();

    const nested = await openDemo(page, "combobox", "Open searchable form");
    const input = nested.dialog.getByRole("combobox", { name: "Destination region" });
    await input.fill("Virginia");
    const combobox = page.locator('.kappa-combobox__content[data-state="open"]');
    await expect(combobox).toBeVisible();
    const option = combobox.getByRole("option").filter({ hasText: "US East · Virginia" });
    await expect(option).toBeVisible();

    await expect
      .poll(() =>
        option.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const topmost = document.elementFromPoint(
            box.left + box.width / 2,
            box.top + box.height / 2,
          );
          return topmost === element || element.contains(topmost);
        }),
      )
      .toBe(true);

    await option.click();
    await expect(nested.dialog).toBeVisible();
    await expect(input).toHaveValue("US East · Virginia");
  });

  test("keeps fixed actions visible and scroll regions usable", async ({ page }) => {
    const sticky = await openDemo(page, "sticky-footer", "Review report");
    const body = sticky.dialog.locator(".dialog-demo__scroll-body");
    const header = sticky.dialog.getByRole("heading", { name: "Convergence report" });
    const footer = sticky.dialog.getByRole("button", { name: "Export report" });
    const scrollMetrics = await body.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(scrollMetrics.scrollHeight).toBeGreaterThan(scrollMetrics.clientHeight);
    await body.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
    expect(await body.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await page.keyboard.press("Escape");

    const scrollable = await openDemo(page, "scrollable-content", "Read solver notes");
    const scrollBody = scrollable.dialog.locator(".dialog-demo__scroll-body");
    const compactMetrics = await scrollBody.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(compactMetrics.scrollHeight).toBeGreaterThan(compactMetrics.clientHeight);
    await scrollBody.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    expect(await scrollBody.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  });

  test("coordinates nested layers and preserves RTL layout", async ({ page }) => {
    const parent = await openDemo(page, "nested-dialog", "Open parent dialog");
    await parent.dialog.getByRole("button", { name: "Edit advanced settings" }).click();
    const child = surface(page, "nested-child");
    await expect(parent.dialog).toBeVisible();
    await expect(child).toBeVisible();
    await expect(page.getByRole("dialog", { includeHidden: true })).toHaveCount(2);
    await expect(page.getByRole("dialog")).toHaveCount(1);
    await expect(page.getByRole("dialog", { name: "Advanced settings", exact: true })).toBeVisible();
    await expect(child.getByRole("heading", { name: "Advanced settings" })).toBeVisible();
    await child.getByRole("button", { name: "Done" }).click();
    await expect(child).toHaveCount(0);
    await expect(page.getByRole("dialog", { name: "Run settings", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(parent.dialog).toHaveCount(0);

    const rtl = await openDemo(page, "right-to-left", "فتح الحوار");
    await expect(rtl.dialog).toHaveCSS("direction", "rtl");
    const dialogBox = await rtl.dialog.boundingBox();
    const closeBox = await rtl.dialog.getByRole("button", { name: "Close dialog" }).boundingBox();
    expect(dialogBox).not.toBeNull();
    expect(closeBox).not.toBeNull();
    expect(closeBox!.x).toBeLessThan(dialogBox!.x + dialogBox!.width / 2);
  });
});
