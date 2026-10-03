import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-accordion-demo="${variant}"]`);

const trigger = (container: Locator, name: string) =>
  container.getByRole("button", { name, exact: true });

const contentFor = (container: Locator, text: string) =>
  container.locator('[data-scope="accordion"][data-part="item-content"]').filter({ hasText: text });

test.describe("Accordion documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/accordion");
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Accordion" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-accordion")).toHaveCount(1);
    await expect(demo(page, "composition").locator(".kappa-accordion__indicator")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/accordion"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Accordion", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Components" })).toHaveAttribute(
      "href",
      "/docs/components",
    );
    await expect(compact.getByRole("link", { name: "Next page: Activity Feed" })).toHaveAttribute(
      "href",
      "/docs/components/activity-feed",
    );
    await expect(footer.getByRole("link", { name: "Components", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Activity Feed", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Basic",
      "Multiple",
      "Disabled",
      "Controlled",
      "Right-to-left",
      "Lazy Mount",
      "Accessibility",
      "API Reference",
      "Accordion.Root",
      "Accordion.Item",
      "Parts",
      "Events",
      "Exports",
    ]);
    await expect(
      page.getByRole("link", { name: "official Ark UI Accordion documentation" }),
    ).toHaveAttribute("href", "https://ark-ui.com/docs/components/accordion");

    const response = await request.get("/docs/components/accordion.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Accordion");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("Accordion.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("wires ARIA and supports Enter, Space, and non-collapsible single mode", async ({ page }) => {
    const basic = demo(page, "basic");
    const geometry = trigger(basic, "Geometry");
    const mesh = trigger(basic, "Mesh");
    const geometryContent = contentFor(basic, "12 watertight regions");
    const meshContent = contentFor(basic, "2.4 million cells");
    const [contentId, triggerId] = await Promise.all([
      geometryContent.getAttribute("id"),
      geometry.getAttribute("id"),
    ]);
    expect(contentId).toBeTruthy();
    expect(triggerId).toBeTruthy();

    await expect(geometry).toHaveAttribute("aria-expanded", "true");
    await expect(geometry).toHaveAttribute("aria-controls", contentId!);
    await expect(geometryContent).toHaveAttribute("role", "region");
    await expect(geometryContent).toHaveAttribute("aria-labelledby", triggerId!);
    await expect(geometryContent).toBeVisible();
    await expect(meshContent).toBeHidden();

    await mesh.focus();
    await mesh.press("Enter");
    await expect(mesh).toHaveAttribute("aria-expanded", "true");
    await expect(meshContent).toBeVisible();
    await expect(geometry).toHaveAttribute("aria-expanded", "false");
    await expect(geometryContent).toBeHidden();

    await mesh.press("Space");
    await expect(mesh).toHaveAttribute("aria-expanded", "true");
    await expect(meshContent).toBeVisible();
  });

  test("moves focus with arrows, Home, and End while skipping disabled items", async ({ page }) => {
    const disabled = demo(page, "disabled");
    const mesh = trigger(disabled, "Mesh");
    const decomposition = trigger(disabled, "Domain decomposition");
    const solver = trigger(disabled, "Solver");
    const results = trigger(disabled, "Results");

    await expect(decomposition).toBeDisabled();
    await mesh.focus();
    await expect(mesh).toBeFocused();
    await expect(mesh).toHaveAttribute("data-focus", "");
    await mesh.press("ArrowDown");
    await expect(solver).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(mesh).toBeFocused();
    await expect(mesh).toHaveAttribute("data-focus", "");
    await page.keyboard.press("End");
    await expect(results).toBeFocused();
    await expect(results).toHaveAttribute("data-focus", "");
    await page.keyboard.press("Home");
    await expect(mesh).toBeFocused();
    await expect(decomposition).not.toBeFocused();
  });

  test("supports multiple, collapsible, and controlled state", async ({ page }) => {
    const multiple = demo(page, "multiple");
    const mesh = trigger(multiple, "Mesh summary");
    const boundaries = trigger(multiple, "Boundary summary");
    const numerics = trigger(multiple, "Numerics");

    await expect(mesh).toHaveAttribute("aria-expanded", "true");
    await expect(boundaries).toHaveAttribute("aria-expanded", "true");
    await mesh.click();
    await expect(mesh).toHaveAttribute("aria-expanded", "false");
    await expect(boundaries).toHaveAttribute("aria-expanded", "true");
    await numerics.click();
    await expect(numerics).toHaveAttribute("aria-expanded", "true");
    await expect(boundaries).toHaveAttribute("aria-expanded", "true");

    const controlled = demo(page, "controlled");
    const residuals = trigger(controlled, "Residuals");
    const forces = trigger(controlled, "Forces");
    const feedback = controlled.locator("[data-controlled-feedback]");
    await expect(feedback).toHaveText("Open panels: residuals");
    await forces.click();
    await expect(residuals).toHaveAttribute("aria-expanded", "false");
    await expect(feedback).toHaveText("Open panels: forces");
    await forces.click();
    await expect(feedback).toHaveText("Open panels: none");
  });

  test("lazy mounts and unmounts panel content", async ({ page }) => {
    const lazy = demo(page, "lazy");
    const plots = trigger(lazy, "Residual plots");
    const detail = lazy.getByText("Residual plots mount only while this item is open.");

    await expect(detail).toHaveCount(0);
    await plots.click();
    await expect(detail).toBeVisible();
    await plots.click();
    await expect(detail).toHaveCount(0);
  });

  test("keeps focus, themes, RTL, reduced motion, and mobile width intact", async ({ page }) => {
    const previewTrigger = trigger(demo(page, "preview"), "Mesh");
    const indicator = previewTrigger.locator('[data-slot="accordion-indicator"]');
    await previewTrigger.focus();
    await expect(previewTrigger).toBeFocused();
    const focus = await previewTrigger.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);

    const lightColor = await previewTrigger.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => previewTrigger.evaluate((element) => getComputedStyle(element).color))
      .not.toBe(lightColor);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => indicator.evaluate((element) => getComputedStyle(element).transitionDuration))
      .toMatch(/^(?:0s|0\.00001s|1e-05s)$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const rtl = demo(page, "rtl");
    const rtlTrigger = trigger(rtl, "نتائج المحاكاة");
    const rtlIndicator = rtlTrigger.locator('[data-slot="accordion-indicator"]');
    await rtl.scrollIntoViewIfNeeded();
    const [triggerBox, indicatorBox, direction] = await Promise.all([
      rtlTrigger.boundingBox(),
      rtlIndicator.boundingBox(),
      rtlTrigger.evaluate((element) => getComputedStyle(element).direction),
    ]);
    expect(direction).toBe("rtl");
    expect(triggerBox).not.toBeNull();
    expect(indicatorBox).not.toBeNull();
    expect(indicatorBox!.x).toBeLessThan(triggerBox!.x + triggerBox!.width / 2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
