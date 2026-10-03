import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-tabs-demo="${variant}"]`);

const tab = (container: Locator, name: string) =>
  container.getByRole("tab", { name, exact: true });

const panel = (container: Locator, text: string) =>
  container.locator('[role="tabpanel"]').filter({ hasText: text });

const box = async (locator: Locator) => {
  const value = await locator.boundingBox();
  if (!value) throw new Error("Expected a visible element");
  return value;
};

test.describe("Tabs documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/tabs");
  });

  test("renders public examples, navigation, composition, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Tabs" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(14);
    await expect(page.locator('[data-tabs-demo="preview"] .kappa-tabs')).toHaveCount(1);
    await expect(page.locator('[data-tabs-demo="composition"] [data-slot="tabs-indicator"]')).toHaveCount(1);
    const rootIds = await page.locator("[data-tabs-demo] .kappa-tabs").evaluateAll((roots) =>
      roots.map((root) => root.id),
    );
    expect(rootIds.every(Boolean)).toBe(true);
    expect(new Set(rootIds).size).toBe(rootIds.length);
    const publicTabs = page.locator(
      "[data-tabs-demo]:not([data-tabs-demo='dynamic']) [role='tab']",
    );
    await expect(publicTabs).toHaveCount(69);
    const selectedPublicTabs = page.locator(
      "[data-tabs-demo]:not([data-tabs-demo='dynamic']) [role='tab'][aria-selected='true']",
    );
    await expect(selectedPublicTabs).toHaveCount(18);
    await expect.poll(() => selectedPublicTabs.evaluateAll((triggers) =>
      triggers
        .map((trigger) => trigger.getAttribute("aria-controls"))
        .filter((id) => !id || !document.getElementById(id)),
    )).toEqual([]);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/tabs"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    await expect(
      page.getByRole("link", { name: "View Ark UI documentation" }),
    ).toHaveAttribute("href", "https://ark-ui.com/docs/components/tabs");
    await expect(page.locator('[data-composition-tree="tabs"]')).toContainText("Tabs.Indicator");

    const response = await request.get("/docs/components/tabs.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Tabs");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("Tabs.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("selects basic tabs and moves the measured indicator", async ({ page }) => {
    const basic = demo(page, "basic");
    const overview = tab(basic, "Overview");
    const runs = tab(basic, "Runs");
    const overviewPanel = panel(basic, "The case is ready for review");
    const runsPanel = panel(basic, "Three solver runs completed");
    const indicator = basic.locator('[data-slot="tabs-indicator"]');

    await expect(overview).toHaveAttribute("aria-selected", "true");
    await expect(overviewPanel).toBeVisible();
    await expect(runsPanel).toBeHidden();
    await expect(indicator).toBeVisible();

    await runs.click();
    await expect(runs).toHaveAttribute("aria-selected", "true");
    await expect(runsPanel).toBeVisible();
    await expect(overviewPanel).toBeHidden();
    const runsPanelId = await runsPanel.getAttribute("id");
    expect(runsPanelId).toBeTruthy();
    await expect(runs).toHaveAttribute("aria-controls", runsPanelId!);
  });

  test("renders variants, sizes, icons, overflow, and right-to-left navigation", async ({ page }) => {
    const variants = demo(page, "variants");
    const segmented = variants.getByRole("tablist").first();
    const line = variants.getByRole("tablist").nth(1);

    await expect(segmented).toHaveAttribute("data-variant", "segmented");
    await expect(line).toHaveAttribute("data-variant", "line");
    await expect(segmented.locator(".kappa-tabs__indicator")).not.toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await expect(line.locator(".kappa-tabs__indicator")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    const lineIndicator = line.locator(".kappa-tabs__indicator");
    const lineCode = tab(variants, "Code").last();
    await lineCode.click();
    await expect(lineCode).toHaveAttribute("aria-selected", "true");
    expect(
      await lineIndicator.evaluate((element) => Number(getComputedStyle(element).zIndex)),
    ).toBeGreaterThan(
      await lineCode.evaluate((element) => Number(getComputedStyle(element).zIndex)),
    );

    const sizes = demo(page, "sizes").getByRole("tablist");
    expect(Math.round((await box(sizes.first())).height)).toBe(36);
    expect(Math.round((await box(sizes.nth(1))).height)).toBe(28);
    await expect(sizes.first()).toHaveAttribute("data-size", "base");
    await expect(sizes.nth(1)).toHaveAttribute("data-size", "sm");

    await expect(demo(page, "icons").locator('[role="tab"] svg')).toHaveCount(3);

    const overflow = demo(page, "overflow");
    const overflowList = overflow.getByRole("tablist");
    expect(
      await overflowList.evaluate((element) => element.scrollWidth > element.clientWidth),
    ).toBe(true);
    const reportsBox = await box(tab(overflow, "Reports"));
    const notificationsBox = await box(tab(overflow, "Notifications"));
    const forwardControl = overflow.getByRole("button", { name: "Scroll tabs forward" });
    const forwardBox = await box(forwardControl);
    expect(reportsBox.x + reportsBox.width).toBeLessThanOrEqual(forwardBox.x);
    expect(notificationsBox.x).toBeGreaterThanOrEqual(forwardBox.x - 1);
    const overview = tab(overflow, "Overview");
    await overview.focus();
    await overview.press("End");
    const integrations = tab(overflow, "Integrations");
    await expect(integrations).toBeFocused();
    await expect(integrations).toHaveAttribute("aria-selected", "true");
    await expect.poll(async () => {
      const currentListBox = await box(overflowList);
      const integrationsBox = await box(integrations);
      return currentListBox.x + currentListBox.width - (integrationsBox.x + integrationsBox.width);
    }).toBeGreaterThanOrEqual(4);
    await expect(forwardControl).toHaveCount(0);

    const rtl = demo(page, "rtl");
    const rtlOverview = tab(rtl, "Overview");
    await rtlOverview.focus();
    await rtlOverview.press("ArrowLeft");
    await expect(tab(rtl, "Reports")).toBeFocused();
    await expect(tab(rtl, "Reports")).toHaveAttribute("aria-selected", "true");
  });

  test("supports many tabs, edge controls, and a dynamic tab count", async ({ page }) => {
    const many = demo(page, "many");
    const manyList = many.getByRole("tablist");
    await expect(many.getByRole("tab")).toHaveCount(8);
    expect(await manyList.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    await many.getByRole("button", { name: "Scroll tabs forward" }).click();
    await expect.poll(() => manyList.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await expect(many.getByRole("button", { name: "Scroll tabs backward" })).toBeVisible();

    const dynamic = demo(page, "dynamic-count");
    const dynamicList = dynamic.getByRole("tablist");
    await expect(dynamic.getByRole("tab")).toHaveCount(10);
    await expect(dynamic.getByText("10 tabs", { exact: true })).toBeVisible();
    await expect(dynamic.locator("[data-scroll-control]")).toHaveCount(2);

    const dynamicStart = dynamic.getByRole("button", { name: "Scroll tabs backward" });
    const dynamicEnd = dynamic.getByRole("button", { name: "Scroll tabs forward" });
    const initialScroll = await dynamicList.evaluate((element) => element.scrollLeft);
    await tab(dynamic, "Metrics").click();
    await expect.poll(() => dynamicList.evaluate((element) => element.scrollLeft)).toBeLessThan(initialScroll);
    const metricsBox = await box(tab(dynamic, "Metrics"));
    const dynamicStartBox = await box(dynamicStart);
    expect(metricsBox.x - (dynamicStartBox.x + dynamicStartBox.width)).toBeGreaterThanOrEqual(7);

    const firstEdgeScroll = await dynamicList.evaluate((element) => element.scrollLeft);
    await tab(dynamic, "Settings").click();
    await expect.poll(() => dynamicList.evaluate((element) => element.scrollLeft)).toBeGreaterThan(firstEdgeScroll);
    const settingsBox = await box(tab(dynamic, "Settings"));
    const dynamicEndBox = await box(dynamicEnd);
    expect(dynamicEndBox.x - (settingsBox.x + settingsBox.width)).toBeGreaterThanOrEqual(7);

    await dynamic.getByRole("button", { name: "Toggle extra tabs" }).click();
    await expect(dynamic.getByRole("tab")).toHaveCount(7);
    await expect(dynamic.getByText("7 tabs", { exact: true })).toBeVisible();
    await expect(dynamic.locator("[data-scroll-control]")).toHaveCount(0);
    expect(
      await dynamicList.evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
  });

  test("keeps manual activation separate from keyboard focus", async ({ page }) => {
    const manual = demo(page, "manual");
    const setup = tab(manual, "Setup");
    const review = tab(manual, "Review");
    const setupPanel = panel(manual, "Configure the case");
    const reviewPanel = panel(manual, "Review the input values");

    await expect(setup).toHaveAttribute("aria-selected", "true");
    await setup.focus();
    await setup.press("ArrowRight");
    await expect(review).toBeFocused();
    await expect(review).toHaveAttribute("aria-selected", "false");
    await expect(setupPanel).toBeVisible();
    await expect(reviewPanel).toBeHidden();

    await review.press("Enter");
    await expect(review).toHaveAttribute("aria-selected", "true");
    await expect(reviewPanel).toBeVisible();
  });

  test("supports vertical navigation, disabled triggers, controlled state, and lazy panels", async ({ page }) => {
    const vertical = demo(page, "vertical");
    const geometry = tab(vertical, "Geometry");
    const mesh = tab(vertical, "Mesh");
    await geometry.focus();
    await geometry.press("ArrowDown");
    await expect(mesh).toBeFocused();

    const disabled = demo(page, "disabled");
    const pending = tab(disabled, "Pending data");
    await expect(pending).toBeDisabled();

    const controlled = demo(page, "controlled");
    await tab(controlled, "Forces").click();
    await expect(controlled.locator("[data-controlled-feedback]")).toContainText("forces");

    const dynamic = demo(page, "dynamic");
    const logs = tab(dynamic, "Logs");
    await expect(panel(dynamic, "Logs mount only when selected.")).toHaveCount(0);
    await logs.click();
    await expect(panel(dynamic, "Logs mount only when selected.")).toBeVisible();
    await tab(dynamic, "Overview").click();
    await expect(panel(dynamic, "Logs mount only when selected.")).toHaveCount(0);
    await dynamic.getByRole("button", { name: "Add inspect", exact: true }).click();
    await expect(tab(dynamic, "Inspect")).toBeVisible();
  });

  test("keeps rich content, focus, themes, reduced motion, and mobile layout intact", async ({ page }) => {
    const rich = demo(page, "rich");
    await expect(rich.getByRole("table")).toBeHidden();
    await expect(rich.getByRole("cell", { name: "2,048" })).toHaveCount(0);
    await tab(rich, "Boundaries").click();
    await expect(rich.getByRole("table")).toBeVisible();
    await expect(rich.getByRole("cell", { name: "2,048" })).toBeVisible();

    const preview = demo(page, "preview");
    const previewTab = tab(preview, "Overview");
    await previewTab.focus();
    await previewTab.press("ArrowRight");
    const keyboardFocusedTab = tab(preview, "Runs");
    await expect(keyboardFocusedTab).toBeFocused();
    const focus = await keyboardFocusedTab.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);

    const lightColor = await keyboardFocusedTab.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => keyboardFocusedTab.evaluate((element) => getComputedStyle(element).color)).not.toBe(lightColor);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => keyboardFocusedTab.evaluate((element) => getComputedStyle(element).transitionDuration))
      .toMatch(/^(?:0s|0\.00001s|1e-05s)$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
