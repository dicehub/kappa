import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator('[data-select-demo="' + variant + '"]');
const openContent = (page: Page) =>
  page.locator('.kappa-select__content[data-state="open"]');
const openOptions = (page: Page) => openContent(page).getByRole("option");

test.describe("Select documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/select");
  });

  test("renders examples, API, navigation, Ark reference, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Select" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-select")).toHaveCount(1);
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(9);

    const rootIds = await page
      .locator('.kappa-select[data-scope="select"][data-part="root"]')
      .evaluateAll((roots) => roots.map((root) => root.id));
    expect(rootIds.every(Boolean)).toBe(true);
    expect(new Set(rootIds).size).toBe(rootIds.length);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/select"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Select", exact: true });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(
      page.locator(".docs-page-header__title-row").getByRole("link", {
        name: "View Ark UI documentation",
      }),
    ).toHaveAttribute("href", "https://ark-ui.com/docs/components/select");

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(compact.getByRole("link", { name: "Previous page: Scroll Area" })).toHaveAttribute(
      "href",
      "/docs/components/scroll-area",
    );
    await expect(
      compact.getByRole("link", { name: "Next page: Selection List" }),
    ).toHaveAttribute("href", "/docs/components/selection-list");
    await expect(footer.getByRole("link", { name: "Scroll Area", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Selection List", exact: true })).toBeVisible();

    await expect(page.locator('[data-composition-tree="select"]')).toContainText(
      "Select.HiddenSelect (automatic)",
    );
    await expect(page.locator("#root-api").locator("..").locator("tbody tr")).toHaveCount(16);
    await expect(page.locator("#item-api").locator("..").locator("tbody tr")).toHaveCount(4);

    const response = await request.get("/docs/components/select.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Select");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("Select.Option");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("opens, highlights, selects, and submits a collection value", async ({ page }) => {
    const preview = demo(page, "preview");
    const trigger = preview.getByRole("combobox", { name: "Compute region" });
    const indicator = trigger.locator('[data-slot="select-indicator"]');

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toContainText("EU Central · Frankfurt");
    await expect(indicator.locator("path")).toHaveCount(2);
    const closedIndicatorTransform = await indicator.evaluate(
      (element) => getComputedStyle(element).transform,
    );
    await trigger.click();
    await expect(openContent(page)).toBeVisible();
    await expect(openOptions(page)).toHaveCount(4);
    await expect
      .poll(() => indicator.evaluate((element) => getComputedStyle(element).transform))
      .toBe(closedIndicatorTransform);

    await page.keyboard.press("ArrowDown");
    await expect(openOptions(page).getByText("EU West · Dublin", { exact: true })).toHaveAttribute(
      "data-highlighted",
      "",
    );
    await page.keyboard.press("Enter");
    await expect(trigger).toContainText("EU West · Dublin");
    await expect(preview.getByRole("status")).toContainText("eu-west");
    await expect(openContent(page)).toHaveCount(0);

    const hidden = preview.locator('select[name="compute-region"]');
    await expect(hidden).toHaveValue("eu-west");
  });

  test("keeps multiple selection open and renders groups and disabled options", async ({ page }) => {
    const multiple = demo(page, "multiple");
    const trigger = multiple.getByRole("combobox", { name: "Visible columns" });
    await trigger.click();
    const selectedName = openContent(page).getByRole("option", { name: "Name", exact: true });
    const activeWrite = openContent(page).getByRole("option", { name: "Write", exact: true });
    await activeWrite.hover();
    await expect(activeWrite).toHaveAttribute("data-highlighted", "");
    // The highlight color transitions after the state attribute changes.
    await expect(activeWrite).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

    await activeWrite.click();
    await expect(openContent(page)).toBeVisible();
    await expect(multiple.getByText("4 columns selected")).toBeVisible();
    await expect(selectedName).toHaveAttribute("data-state", "checked");
    await expect(selectedName).not.toHaveAttribute("data-highlighted", "");
    await expect(selectedName).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await page.keyboard.press("Escape");

    const grouped = demo(page, "grouped");
    const groupedTrigger = grouped.getByRole("combobox", { name: "Linear solver" });
    await groupedTrigger.click();
    await expect(openContent(page).locator(".kappa-select__group-label")).toHaveText([
      "Pressure",
      "Momentum",
      "Direct",
    ]);
    await expect(openOptions(page)).toHaveCount(5);
    await openOptions(page).getByText("PCG", { exact: true }).click();
    await expect(groupedTrigger).toContainText("PCG");

    const usage = demo(page, "usage");
    await usage.getByRole("combobox", { name: "Mesh format" }).click();
    const disabled = openOptions(page).getByText("STAR-CCM+ mesh", { exact: true });
    await expect(disabled).toHaveAttribute("data-disabled", "");
    await disabled.click({ force: true });
    await expect(usage.getByRole("combobox", { name: "Mesh format" })).toContainText(
      "OpenFOAM mesh",
    );
  });

  test("aligns the selected option with the trigger when requested", async ({ page }) => {
    const alignment = demo(page, "alignment");
    const anchoredTrigger = alignment.getByRole("combobox", { name: "Anchored planet" });
    await anchoredTrigger.click();

    const anchoredMars = openContent(page).getByRole("option", { name: "Mars", exact: true });
    const [anchoredTriggerBox, anchoredMarsBox] = await Promise.all([
      anchoredTrigger.boundingBox(),
      anchoredMars.boundingBox(),
    ]);
    expect(anchoredTriggerBox).not.toBeNull();
    expect(anchoredMarsBox).not.toBeNull();
    const anchoredTriggerCenter = anchoredTriggerBox!.y + anchoredTriggerBox!.height / 2;
    const anchoredMarsCenter = anchoredMarsBox!.y + anchoredMarsBox!.height / 2;
    expect(Math.abs(anchoredMarsCenter - anchoredTriggerCenter)).toBeGreaterThan(32);
    await page.keyboard.press("Escape");

    const alignedTrigger = alignment.getByRole("combobox", { name: "Aligned planet" });
    await alignedTrigger.click();
    const alignedPositioner = page.locator(
      '.kappa-select__positioner[data-align-item-with-trigger]',
    );
    await expect(alignedPositioner).toHaveAttribute("data-item-alignment", "selected");

    await expect
      .poll(async () => {
        const [triggerBox, selectedBox] = await Promise.all([
          alignedTrigger.boundingBox(),
          openContent(page).getByRole("option", { name: "Mars", exact: true }).boundingBox(),
        ]);
        if (!triggerBox || !selectedBox) return Number.POSITIVE_INFINITY;
        const triggerCenter = triggerBox.y + triggerBox.height / 2;
        const selectedCenter = selectedBox.y + selectedBox.height / 2;
        return Math.abs(triggerCenter - selectedCenter);
      })
      .toBeLessThanOrEqual(1.5);
  });

  test("exposes disabled, read-only, invalid, RTL, and reduced-motion states", async ({ page }) => {
    const states = demo(page, "states");
    await expect(states.getByRole("combobox", { name: "Source format" })).toBeDisabled();
    await expect(states.getByRole("combobox", { name: "Pinned format" })).toHaveAttribute(
      "data-readonly",
      "",
    );
    const invalid = states.getByRole("combobox", { name: "Output format" });
    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid).toHaveAttribute("aria-describedby", /-error/);
    const triggerTops = await states
      .getByRole("combobox")
      .evaluateAll((triggers) => triggers.map((trigger) => trigger.getBoundingClientRect().top));
    expect(Math.max(...triggerTops) - Math.min(...triggerTops)).toBeLessThanOrEqual(1);

    const rtl = demo(page, "rtl").getByRole("combobox", { name: "منطقة الحساب" });
    await expect(rtl).toHaveAttribute("dir", "rtl");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await rtl.click();
    await expect(openContent(page)).toBeVisible();
    await expect(openContent(page)).toHaveCSS("animation-name", "none");
  });

  test("labels sizes and supports placement and long-list scrolling", async ({ page }) => {
    const sizes = demo(page, "sizes");
    await expect(sizes.locator(".select-demo__size-row > span")).toHaveText([
      "xs",
      "sm",
      "base",
      "lg",
    ]);
    expect(
      await sizes
        .getByRole("combobox")
        .evaluateAll((triggers) => triggers.map((trigger) => trigger.getBoundingClientRect().height)),
    ).toEqual([24, 28, 36, 40]);

    const placement = demo(page, "placement");
    await placement.evaluate((element) => element.scrollIntoView({ block: "center" }));
    const topTrigger = placement.getByRole("combobox", { name: "top-start" });
    await topTrigger.click();
    await expect(openContent(page)).toHaveAttribute("data-placement", "top-start");
    await page.keyboard.press("Escape");

    const gutterTrigger = placement.getByRole("combobox", { name: "gutter: 12" });
    await gutterTrigger.click();
    await expect(openContent(page)).toHaveAttribute("data-placement", "bottom-start");
    await openContent(page).evaluate((content) =>
      Promise.all(content.getAnimations().map((animation) => animation.finished)),
    );
    const [gutterTriggerBox, gutterContentBox] = await Promise.all([
      gutterTrigger.boundingBox(),
      openContent(page).boundingBox(),
    ]);
    expect(gutterTriggerBox).not.toBeNull();
    expect(gutterContentBox).not.toBeNull();
    expect(gutterContentBox!.y - (gutterTriggerBox!.y + gutterTriggerBox!.height)).toBeCloseTo(12, 0);
    await page.keyboard.press("Escape");

    const longList = demo(page, "long-list");
    const longListTrigger = longList.getByRole("combobox", { name: "Long list select" });
    await longListTrigger.click();
    await expect(openOptions(page)).toHaveCount(50);
    const scrollMetrics = await openContent(page).evaluate((content) => ({
      clientHeight: content.clientHeight,
      scrollHeight: content.scrollHeight,
    }));
    expect(scrollMetrics.scrollHeight).toBeGreaterThan(scrollMetrics.clientHeight);
    await page.keyboard.press("End");
    await expect(openOptions(page).getByText("Option 50", { exact: true })).toHaveAttribute(
      "data-highlighted",
      "",
    );
    expect(await openContent(page).evaluate((content) => content.scrollTop)).toBeGreaterThan(0);
  });
});
