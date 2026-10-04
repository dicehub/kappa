import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-radio-demo="${variant}"]`);

const item = (radio: Locator) =>
  radio.locator("xpath=ancestor::*[@data-slot='radio-item'][1]");

const control = (radio: Locator) =>
  item(radio).locator('[data-slot="radio-item-control"]');

test.describe("Radio documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/radio");
    await expect(page.locator("astro-island[ssr]:has([data-radio-demo])")).toHaveCount(0);
  });

  test("renders the public examples, references, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Radio" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(7);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/radio"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const header = page.locator(".docs-page-header__title-row");
    await expect(header.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/radio-group",
    );

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(compact.getByRole("link", { name: "Previous page: QR Code" })).toHaveAttribute(
      "href",
      "/docs/components/qr-code",
    );
    await expect(compact.getByRole("link", { name: "Next page: Rating" })).toHaveAttribute(
      "href",
      "/docs/components/rating",
    );
    await expect(footer.getByRole("link", { name: "QR Code", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Rating", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Basic",
      "Descriptions",
      "Horizontal",
      "Choice Cards",
      "Controlled",
      "Sliding Indicator",
      "States",
      "Accessibility",
      "API Reference",
      "Radio.Root",
      "Radio.Item",
      "Parts",
      "Events",
      "Exports",
    ]);

    await expect(page.locator('[data-composition-tree="radio"]')).toContainText("HiddenInput (automatic)");
    await expect(page.locator("#root-api").locator("..").locator("tbody tr")).toHaveCount(13);
    await expect(page.locator("#item-api").locator("..").locator("tbody tr")).toHaveCount(3);
    await expect(page.locator("#parts-api").locator("..").locator("tbody tr")).toHaveCount(8);

    const response = await request.get("/docs/components/radio.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Radio");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("Radio.ItemControl");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("selects with pointer and arrow keys and keeps native form semantics", async ({ page }) => {
    const preview = demo(page, "preview");
    const compact = preview.getByRole("radio", { name: "Compact" });
    const comfortable = preview.getByRole("radio", { name: "Comfortable" });
    const spacious = preview.getByRole("radio", { name: "Spacious" });

    await expect(comfortable).toBeChecked();
    await expect(compact).not.toBeChecked();
    await expect(preview.getByRole("radiogroup", { name: "Interface density" })).toBeVisible();
    await expect(preview.getByRole("radio")).toHaveCount(3);
    await expect(comfortable).toHaveAttribute("name", "interface-density");

    await control(compact).click();
    await expect(compact).toBeChecked();
    await expect(preview.getByRole("status")).toContainText("compact");

    await compact.focus();
    await page.keyboard.press("ArrowDown");
    await expect(comfortable).toBeFocused();
    await expect(comfortable).toBeChecked();
    await page.keyboard.press("ArrowDown");
    await expect(spacious).toBeFocused();
    await expect(spacious).toBeChecked();
    await expect(preview.getByRole("status")).toContainText("spacious");
  });

  test("supports rich rows, choice cards, controlled state, and the moving indicator", async ({ page }) => {
    const descriptions = demo(page, "descriptions");
    await expect(descriptions.locator(".radio-demo__option-description")).toHaveCount(3);
    await expect(descriptions.getByRole("radio", { name: /Daily/ })).toBeChecked();

    const cards = demo(page, "cards");
    const team = item(cards.getByRole("radio", { name: /Team/ }));
    const business = item(cards.getByRole("radio", { name: /Business/ }));
    await expect(team).toHaveAttribute("data-state", "checked");
    await business.click();
    await expect(business).toHaveAttribute("data-state", "checked");
    await expect(team).toHaveAttribute("data-state", "unchecked");

    const controlled = demo(page, "controlled");
    await control(controlled.getByRole("radio", { name: "Public" })).click();
    await expect(controlled.getByRole("status")).toContainText("public");

    const segmented = demo(page, "indicator");
    const indicator = segmented.locator('[data-slot="radio-indicator"]');
    const list = item(segmented.getByRole("radio", { name: "List" }));
    const timeline = item(segmented.getByRole("radio", { name: "Timeline" }));
    await expect(indicator).toBeVisible();
    await timeline.click();
    await expect(segmented.getByRole("radio", { name: "Timeline" })).toBeChecked();
    await expect.poll(async () => {
      const indicatorBox = await indicator.boundingBox();
      const listBox = await list.boundingBox();
      const itemBox = await timeline.boundingBox();
      if (!indicatorBox || !listBox || !itemBox) return { aligned: false, horizontal: false };
      return {
        aligned:
          Math.abs(indicatorBox.x - itemBox.x) <= 1 &&
          Math.abs(indicatorBox.y - itemBox.y) <= 1 &&
          Math.abs(indicatorBox.width - itemBox.width) <= 1 &&
          Math.abs(indicatorBox.height - itemBox.height) <= 1,
        horizontal: itemBox.x > listBox.x && Math.abs(itemBox.y - listBox.y) <= 1,
      };
    }).toEqual({ aligned: true, horizontal: true });
  });

  test("exposes states, focus, reduced motion, themes, and mobile layout", async ({ page }) => {
    const states = demo(page, "states");
    const disabled = states.getByRole("radio", { name: "Email" });
    const automatic = states.getByRole("radio", { name: "Automatic" });
    const manual = states.getByRole("radio", { name: "Manual" });
    const express = states.getByRole("radio", { name: "Express" });

    await expect(disabled).toBeDisabled();
    await expect(automatic).toBeChecked();
    await manual.click({ force: true });
    await expect(automatic).toBeChecked();
    await expect(express).toHaveAttribute("aria-invalid", "true");
    await expect(control(express)).toHaveAttribute("data-invalid", "");

    const preview = demo(page, "preview");
    const comfortable = preview.getByRole("radio", { name: "Comfortable" });
    const previewControl = control(comfortable);
    await comfortable.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(comfortable).toBeFocused();
    await expect(previewControl).toHaveAttribute("data-focus-visible", "");
    const focus = await previewControl.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);

    const previewText = item(comfortable).locator('[data-slot="radio-item-text"]');
    const lightColor = await previewText.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => previewText.evaluate((element) => getComputedStyle(element).color))
      .not.toBe(lightColor);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => previewControl.evaluate((element) => getComputedStyle(element).transitionDuration))
      .toMatch(/^(?:0s|0\.00001s|1e-05s)$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
