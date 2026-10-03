import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-tooltip-demo="${variant}"]`);

async function openTooltip(page: Page, trigger: Locator) {
  await trigger.scrollIntoViewIfNeeded();
  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-describedby", /.+/);
  const tooltipId = await trigger.getAttribute("aria-describedby");
  expect(tooltipId).toBeTruthy();
  const content = page.locator(`[id="${tooltipId}"]`);
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute("role", "tooltip");
  return content;
}

test.describe("Tooltip documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/tooltip");
    await expect(page.locator("astro-island[ssr]:has([data-tooltip-demo])")).toHaveCount(0);
  });

  test("renders complete examples, references, composition, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Tooltip" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(8);
    await expect(page.locator('[data-composition-tree="tooltip"]')).toContainText(
      "Tooltip.ArrowTip",
    );

    const duplicateIds = await page.locator('[data-scope="tooltip"][id]').evaluateAll((elements) => {
      const counts = new Map<string, number>();
      for (const element of elements) counts.set(element.id, (counts.get(element.id) ?? 0) + 1);
      return [...counts.entries()].filter(([, count]) => count > 1);
    });
    expect(duplicateIds).toEqual([]);

    const arkLink = page
      .locator(".docs-page-header__title-row")
      .getByRole("link", { name: "View Ark UI documentation" });
    await expect(arkLink).toHaveAttribute("href", "https://ark-ui.com/docs/components/tooltip");

    const snippets = page.locator("pre[data-language]");
    await expect(page.locator("[data-code-full] pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/tooltip"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const toc = page.getByRole("complementary", { name: "On this page" });
    for (const label of [
      "Barrel",
      "Granular",
      "Composition",
      "Sides",
      "With Keyboard Shortcut",
      "Disabled Button",
      "Delay Control",
      "Long Content and Overflow",
      "Controlled",
      "Accessibility",
      "Tooltip.Content",
      "Events",
      "Exports",
    ]) {
      await expect(toc.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    const response = await request.get("/docs/components/tooltip.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Tooltip");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("### [Disabled Button](#disabled-button)");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("opens on hover and focus, follows sides, and closes with Escape", async ({ page }) => {
    const previewTrigger = demo(page, "preview").getByRole("button", { name: "Add item" });
    const previewTooltip = await openTooltip(page, previewTrigger);
    await expect(previewTooltip).toHaveText("Add item");
    await expect(previewTooltip).toHaveAttribute("data-side", "top");
    await expect(
      previewTooltip.locator('xpath=../*[@data-slot="tooltip-arrow"]'),
    ).toBeVisible();

    const triggerBox = (await previewTrigger.boundingBox())!;
    const contentBox = (await previewTooltip.boundingBox())!;
    expect(contentBox.y + contentBox.height).toBeLessThanOrEqual(triggerBox.y);

    await page.mouse.move(2, 2);
    await expect(previewTooltip).toBeHidden();
    await previewTrigger.focus();
    await expect(previewTooltip).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(previewTooltip).toBeHidden();

    const sides = demo(page, "sides");
    for (const side of ["left", "top", "bottom", "right"] as const) {
      const trigger = sides.getByRole("button", { name: new RegExp(`^${side}$`, "i") });
      const content = await openTooltip(page, trigger);
      await expect(content).toHaveAttribute("data-side", side);
      await page.mouse.move(2, 2);
      await expect(content).toBeHidden();
    }
  });

  test("supports disabled wrappers, controlled state, overflow, themes, and reduced motion", async ({
    page,
  }) => {
    const disabledTrigger = demo(page, "disabled").locator(".tooltip-demo__disabled-trigger");
    await disabledTrigger.scrollIntoViewIfNeeded();
    await disabledTrigger.focus();
    await page.keyboard.press("Shift+Tab");
    // Finish the blur transition before returning with keyboard focus.
    await expect(disabledTrigger).not.toBeFocused();
    await expect(disabledTrigger).toHaveAttribute("data-state", "closed");
    await page.keyboard.press("Tab");
    await expect(disabledTrigger).toBeFocused();
    await expect(
      page.locator('[id="tooltip:tooltip-demo-disabled:content"]'),
    ).toContainText("Available after validation passes");
    await expect(page.locator('[id="tooltip:tooltip-demo-disabled:content"]')).toBeVisible();
    await disabledTrigger.evaluate((element) => (element as HTMLElement).blur());
    await expect(page.locator('[id="tooltip:tooltip-demo-disabled:content"]')).toBeHidden();

    const controlled = demo(page, "controlled");
    const controlledTrigger = controlled.getByRole("button", { name: "Focus state" });
    await controlledTrigger.scrollIntoViewIfNeeded();
    await page.mouse.move(2, 2);
    await expect(controlled.getByRole("status")).toHaveText("Tooltip: closed");
    await controlledTrigger.hover();
    await expect(controlled.getByRole("status")).toHaveText("Tooltip: open");
    await page.keyboard.press("Escape");
    await expect(controlled.getByRole("status")).toHaveText("Tooltip: closed");

    const rightEdge = demo(page, "overflow").getByRole("button", { name: "Near right edge" });
    const overflowTooltip = await openTooltip(page, rightEdge);
    const overflowBox = (await overflowTooltip.boundingBox())!;
    expect(overflowBox.x).toBeGreaterThanOrEqual(0);
    expect(overflowBox.x + overflowBox.width).toBeLessThanOrEqual(page.viewportSize()!.width);

    const background = await overflowTooltip.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    expect(background).not.toBe("rgba(0, 0, 0, 0)");
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    // Clicking the theme control leaves the tooltip trigger and closes its hover state.
    await openTooltip(page, rightEdge);
    await expect(overflowTooltip).toBeVisible();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(overflowTooltip).toHaveCSS("animation-name", "none");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(demo(page, "overflow").locator(".tooltip-demo__edge-row")).toHaveCSS(
      "flex-direction",
      "column",
    );
  });
});
