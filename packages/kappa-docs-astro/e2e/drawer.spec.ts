import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-drawer-demo="${variant}"]`);
const surface = (page: Page, variant: string) =>
  page.locator(`[data-drawer-demo-surface="${variant}"]`);
const openDemo = async (
  page: Page,
  demoVariant: string,
  buttonName: string,
  surfaceVariant = demoVariant,
) => {
  const trigger = demo(page, demoVariant).getByRole("button", {
    name: buttonName,
    exact: true,
  });
  await trigger.click();
  const drawer = surface(page, surfaceVariant);
  await expect(drawer).toBeVisible();
  await drawer.evaluate(async (element) => {
    await Promise.all(
      element.getAnimations().map((animation) => animation.finished.catch(() => {})),
    );
  });
  return { drawer, trigger };
};
const dragBy = async (page: Page, target: Locator, x: number, y: number) => {
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  const startX = box!.x + box!.width / 2;
  const startY = box!.y + box!.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + x, startY + y, { steps: 8 });
  await page.mouse.up();
};

test.describe("Drawer documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/drawer");
    await expect(page.locator("astro-island[ssr]:has([data-drawer-demo])")).toHaveCount(0);
  });

  test("renders all examples, references, navigation, TOC, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Drawer" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);

    for (const variant of [
      "preview",
      "basic",
      "positions",
      "custom-size",
      "swipe-handle",
      "snap-points",
      "scrollable",
      "non-draggable",
      "non-modal",
      "controlled",
      "multiple-triggers",
      "nested",
      "responsive",
      "right-to-left",
    ]) {
      await expect(demo(page, variant)).toHaveCount(1);
    }

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/drawer",
    );
    await expect(page.locator("#composition")).toContainText(
      "Kappa uses Ark UI's logical start and end directions",
    );

    const snippets = page.locator("pre[data-language]");
    const granularSnippet = page.locator('pre[data-language="javascript"]').filter({
      hasText: 'from "@dicehub/kappa/components/drawer"',
    });
    await expect(granularSnippet).toHaveCount(1);
    await expect(granularSnippet).toBeVisible();
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Drawer", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(
      compact.getByRole("link", { name: "Previous page: Drag Selection" }),
    ).toHaveAttribute("href", "/docs/components/drag-selection");
    await expect(compact.getByRole("link", { name: "Next page: Dropdown" })).toHaveAttribute(
      "href",
      "/docs/components/dropdown",
    );
    await expect(
      footer.getByRole("link", { name: "Drag Selection", exact: true }),
    ).toBeVisible();
    await expect(footer.getByRole("link", { name: "Dropdown", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Reference Differences",
      "Sizing and Gestures",
      "Examples",
      "Basic",
      "Positions",
      "Custom Sizes",
      "Swipe Handle",
      "Snap Points",
      "Scrollable Content",
      "Handle-only Drag",
      "Non-modal",
      "Controlled",
      "Multiple Triggers",
      "Nested Drawers",
      "Responsive Dialog",
      "Right-to-left",
      "Accessibility",
      "API Reference",
      "Drawer.Root",
      "Drawer.Content",
      "Parts",
      "Events",
      "Exports",
    ]);

    const response = await request.get("/docs/components/drawer.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Drawer");
    expect(markdown).toContain("## [Sizing and Gestures](#sizing-and-gestures)");
    expect(markdown).toContain("### [Snap Points](#snap-points)");
    expect(markdown).toContain("Drawer.Content");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("labels, traps, dismisses, and restores focus", async ({ page }) => {
    const { drawer, trigger } = await openDemo(page, "preview", "Open Drawer");
    const semanticDrawer = page.getByRole("dialog", { name: "Move Goal" });
    const decrease = drawer.getByRole("button", { name: "Decrease goal" });
    const close = drawer.getByRole("button", { name: "Close drawer" });

    await expect(semanticDrawer).toHaveAttribute("aria-modal", "true");
    await expect(drawer).toHaveAttribute("data-swipe-direction", "right");
    await expect(decrease).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(decrease).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(semanticDrawer).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await trigger.click();
    const backdrop = page.locator('[data-slot="drawer-backdrop"][data-state="open"]').last();
    await backdrop.click({ position: { x: 4, y: 4 } });
    await expect(semanticDrawer).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("places all directions at the correct viewport edge", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    const cases = [
      { button: "Up", variant: "position-up", direction: "up", edge: "top" },
      { button: "Right", variant: "position-end", direction: "right", edge: "right" },
      { button: "Down", variant: "position-down", direction: "down", edge: "bottom" },
      { button: "Left", variant: "position-start", direction: "left", edge: "left" },
    ] as const;

    for (const item of cases) {
      const opened = await openDemo(page, "positions", item.button, item.variant);
      await expect(opened.drawer).toHaveAttribute("data-swipe-direction", item.direction);
      const box = await opened.drawer.boundingBox();
      expect(box).not.toBeNull();
      if (item.edge === "top") expect(box!.y).toBeLessThanOrEqual(1);
      if (item.edge === "bottom") expect(Math.abs(box!.y + box!.height - 900)).toBeLessThanOrEqual(1);
      if (item.edge === "left") expect(box!.x).toBeLessThanOrEqual(1);
      if (item.edge === "right") expect(Math.abs(box!.x + box!.width - 1200)).toBeLessThanOrEqual(1);
      await page.keyboard.press("Escape");
      await expect(opened.drawer).toHaveCount(0);
    }
  });

  test("supports custom sizes, handles, themes, and reduced motion", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    const vertical = await openDemo(page, "custom-size", "Half-height", "size-vertical");
    expect((await vertical.drawer.boundingBox())!.height).toBe(500);
    await page.keyboard.press("Escape");

    const side = await openDemo(page, "custom-size", "Wide side panel", "size-side");
    expect((await side.drawer.boundingBox())!.width).toBe(480);
    await page.keyboard.press("Escape");

    const visible = await openDemo(page, "swipe-handle", "Down", "grabber-down");
    await expect(visible.drawer.locator('[data-slot="drawer-grabber"]')).toBeVisible();
    await expect(visible.drawer.locator('[data-slot="drawer-grabber-indicator"]')).toBeVisible();
    const light = await visible.drawer.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color, font: style.fontFamily };
    });
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await visible.trigger.click();
    const dark = await visible.drawer.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color, font: style.fontFamily };
    });
    expect(dark.background).not.toBe(light.background);
    expect(dark.color).not.toBe(light.color);
    expect(dark.font).toMatch(/Geist/i);
    await page.keyboard.press("Escape");

    await page.emulateMedia({ reducedMotion: "reduce" });
    const reduced = await openDemo(page, "basic", "Open drawer");
    await expect(reduced.drawer).toHaveCSS("animation-name", "none");
  });

  test("supports snap state, scrolling, and handle-only dragging", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    const snap = await openDemo(page, "snap-points", "Open snap drawer");
    await expect(demo(page, "snap-points").locator("output")).toHaveText("Snap point: 0.35");
    await expect(snap.drawer).not.toHaveAttribute("data-expanded");
    await page.keyboard.press("Escape");

    const scrollable = await openDemo(page, "scrollable", "Open scrollable drawer");
    const body = scrollable.drawer.locator(".drawer-demo__copy");
    const metrics = await body.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
    await body.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    expect(await body.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await page.keyboard.press("Escape");

    const handleOnly = await openDemo(page, "non-draggable", "Open handle-only drawer");
    await dragBy(page, handleOnly.drawer.locator(".drawer-demo__selection"), 0, 80);
    await expect(handleOnly.drawer).toBeVisible();
    await dragBy(page, handleOnly.drawer.locator('[data-slot="drawer-grabber"]'), 0, 240);
    await expect(handleOnly.drawer).toHaveCount(0);
  });

  test("supports controlled, non-modal, multiple-trigger, and nested flows", async ({ page }) => {
    const controlledDemo = demo(page, "controlled");
    const controlledState = controlledDemo.locator("output");
    await expect(controlledState).toHaveText("State: closed");
    await controlledDemo.getByRole("button", { name: "Open controlled drawer" }).click();
    await expect(controlledState).toHaveText("State: open");
    await surface(page, "controlled").getByRole("button", { name: "Export" }).click();
    await expect(controlledState).toHaveText("State: closed");

    const nonModal = await openDemo(page, "non-modal", "Open non-modal drawer");
    const check = demo(page, "non-modal").getByRole("button", { name: "Update page" });
    await check.click();
    await expect(demo(page, "non-modal").locator("output")).toHaveText("Page updates: 1");
    await expect(nonModal.drawer).toBeVisible();
    await nonModal.drawer.getByRole("button", { name: "Close" }).click();

    const first = await openDemo(page, "multiple-triggers", "Profile");
    await expect(first.drawer.getByRole("heading", { name: "Profile settings" })).toBeVisible();
    await first.drawer.getByRole("button", { name: "Done" }).click();
    const second = await openDemo(page, "multiple-triggers", "Security");
    await expect(second.drawer.getByRole("heading", { name: "Security settings" })).toBeVisible();
    await second.drawer.getByRole("button", { name: "Done" }).click();

    const parent = await openDemo(page, "nested", "Open settings");
    await parent.drawer.getByRole("button", { name: "Advanced settings" }).click();
    const child = surface(page, "nested-child");
    await expect(page.locator('[role="dialog"]')).toHaveCount(2);
    await expect(parent.drawer).toHaveAttribute("data-nested-drawer-open");
    await child.getByRole("button", { name: "Done" }).click();
    await expect(child).toHaveCount(0);
    await expect(parent.drawer).toBeVisible();
  });

  test("switches responsive primitives and resolves RTL logical direction", async ({ page }) => {
    const desktop = await openDemo(
      page,
      "responsive",
      "Edit profile",
      "responsive-dialog",
    );
    await expect(desktop.drawer).toHaveAttribute("data-slot", "dialog-content");
    await page.keyboard.press("Escape");

    const rtl = await openDemo(page, "right-to-left", "فتح اللوحة");
    await expect(rtl.drawer).toHaveAttribute("dir", "rtl");
    await expect(rtl.drawer).toHaveAttribute("data-swipe-direction", "right");
    const rtlBox = await rtl.drawer.boundingBox();
    expect(Math.abs(rtlBox!.x + rtlBox!.width - page.viewportSize()!.width)).toBeLessThanOrEqual(1);
    await page.keyboard.press("Escape");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const mobile = await openDemo(
      page,
      "responsive",
      "Edit profile",
      "responsive-drawer",
    );
    await expect(mobile.drawer).toHaveAttribute("data-slot", "drawer-content");
    const box = await mobile.drawer.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
