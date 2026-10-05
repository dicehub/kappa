import { expect, test } from "@playwright/test";

const demo = (page: import("@playwright/test").Page, variant = "preview") =>
  page.locator(`[data-navigation-menu-demo="${variant}"]`);
const panel = (scope: import("@playwright/test").Locator, value: string) =>
  scope.locator(`[data-slot="navigation-menu-content"][data-value="${value}"]`);

async function expectUnclipped(content: import("@playwright/test").Locator) {
  await expect.poll(() => content.evaluate(element => {
    const box = element.getBoundingClientRect();
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      if (!/hidden|clip/.test(getComputedStyle(parent).overflow)) continue;
      const bounds = parent.getBoundingClientRect();
      if (box.left < bounds.left - 1 || box.right > bounds.right + 1
        || box.top < bounds.top - 1 || box.bottom > bounds.bottom + 1) return false;
    }
    return true;
  })).toBe(true);
}

test.describe("Navigation Menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/navigation-menu");
    await expect(page.locator('astro-island[component-url*="NavigationMenuDocsDemo"]:not([ssr])')).toHaveCount(6);
  });

  test("renders navigation semantics, current links, and highlighted usage code", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Navigation Menu", exact: true })).toBeVisible();
    const root = demo(page).getByRole("navigation", { name: "Main navigation" });
    await expect(root).toBeVisible();
    await expect(demo(page).locator(".navigation-menu-demo__brand")).toHaveCount(0);
    await expect(demo(page).getByRole("link", { name: "Your account" })).toHaveCount(0);
    await expect(root.getByRole("menuitem")).toHaveCount(0);
    await expect(panel(demo(page), "platform")).toBeVisible();
    const viewport = demo(page).locator('[data-slot="navigation-menu-viewport"]');
    await expect.poll(async () => (await viewport.boundingBox())?.height ?? 0).toBeGreaterThan(100);
    await expect.poll(async () => (await viewport.boundingBox())?.width ?? 0).toBeGreaterThan(100);
    await expect(root).toHaveAttribute("data-change-count", "0");
    await expect(demo(page, "links").getByRole("link", { name: "Overview", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page.locator('pre[data-language="vue"] span[style*="--shiki-light"]')).not.toHaveCount(0);
  });

  test("switches panels repeatedly and keeps the panel open while entering it", async ({ page }) => {
    const scope = demo(page);
    for (const name of ["Resources", "Platform", "Resources", "Platform"]) {
      await scope.getByRole("button", { name, exact: true }).hover();
      await expect(panel(scope, name.toLowerCase())).toBeVisible();
    }
    const projects = panel(scope, "platform").getByRole("link", { name: /Projects/ });
    await projects.hover();
    await expect(panel(scope, "platform")).toBeVisible();
    await projects.click();
    await expect(panel(scope, "platform")).not.toBeVisible();
    await expect(scope.locator("output")).toContainText("Projects");
  });

  test("supports keyboard entry, panel traversal, and Escape focus restoration", async ({ page }) => {
    const scope = demo(page, "compact");
    const platform = scope.getByRole("button", { name: "Platform", exact: true });
    await platform.focus();
    await page.keyboard.press("Enter");
    await expect(panel(scope, "platform")).toBeVisible();
    await page.keyboard.press("ArrowDown");
    const projects = panel(scope, "platform").getByRole("link", { name: "Projects", exact: true });
    await expect(projects).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(panel(scope, "platform").getByRole("link", { name: "Automation", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(panel(scope, "platform")).not.toBeVisible();
    await expect(platform).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(scope.getByRole("button", { name: "Resources", exact: true })).toBeFocused();
  });

  test("supports controlled click-only state, disabled items, and outside dismissal", async ({ page }) => {
    await page.keyboard.press("Escape"); // Dismiss the independent, initially open preview.
    const scope = demo(page, "controlled");
    const resources = scope.getByRole("button", { name: "Resources", exact: true });
    await expect(scope.getByRole("button", { name: "Admin", exact: true })).toBeDisabled();
    await resources.click();
    await expect(scope.locator("[data-open-value]")).toHaveText("Open panel: resources");
    await scope.getByRole("button", { name: "Platform", exact: true }).hover();
    await expect(scope.locator("[data-open-value]")).toHaveText("Open panel: resources");
    await scope.locator(".navigation-menu-demo__body p").click();
    await expect(panel(scope, "resources")).not.toBeVisible();
    await expect(scope.locator("[data-open-value]")).toHaveText("Open panel: none");
    await scope.getByRole("button", { name: "Open resources" }).click();
    await expect(panel(scope, "resources")).toBeVisible();
    await scope.getByRole("button", { name: "Close panel" }).click();
    await expect(panel(scope, "resources")).not.toBeVisible();
    await expect(scope.locator("[data-open-value]")).toHaveText("Open panel: none");
    await scope.getByRole("button", { name: "Platform", exact: true }).click();
    await scope.getByRole("button", { name: "Close panel" }).click();
    await expect(scope.locator("[data-open-value]")).toHaveText("Open panel: none");
    await scope.getByRole("button", { name: "Open resources" }).focus();
    await page.keyboard.press("Enter");
    await expect(panel(scope, "resources")).toBeVisible();
    await scope.getByRole("button", { name: "Close panel" }).focus();
    await page.keyboard.press("Enter");
    await expect(scope.locator("[data-open-value]")).toHaveText("Open panel: none");
  });

  test("uses compact controls and keeps chevrons pointed toward their panels", async ({ page }) => {
    await page.keyboard.press("Escape");
    for (const variant of ["compact", "vertical", "rtl"]) {
      const scope = demo(page, variant);
      const trigger = scope.locator('[data-slot="navigation-menu-trigger"]').first();
      const chevron = trigger.locator(".kappa-navigation-menu__chevron");
      const direction = variant === "vertical" ? "matrix(0, -1, 1, 0, 0, 0)" : "none";
      await expect(chevron).toHaveCSS("transform", direction);
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(chevron).toHaveCSS("transform", direction);
      await page.keyboard.press("Escape");
      await expect(chevron).toHaveCSS("transform", direction);
    }
    const compact = demo(page, "compact");
    await expect(compact.locator('[data-slot="navigation-menu-indicator"]')).toHaveCount(0);
    const height = await compact.getByRole("button", { name: "Platform", exact: true }).evaluate(el => el.getBoundingClientRect().height);
    expect(height).toBeLessThanOrEqual(26);
  });

  for (const width of [1440, 390, 320]) {
    test(`keeps every panel inside its example at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.keyboard.press("Escape");
      for (const variant of ["preview", "compact", "controlled", "vertical", "rtl"]) {
        const scope = demo(page, variant);
        for (const value of ["platform", "resources"]) {
          const trigger = scope.locator(`[data-slot="navigation-menu-trigger"][data-value="${value}"]`);
          await trigger.focus();
          await page.keyboard.press("Enter");
          const content = panel(scope, value);
          await expect(content).toBeVisible();
          await expectUnclipped(content);
          await content.getByRole("link").first().click({ trial: true });
          await content.getByRole("link").last().click({ trial: true });
          await page.keyboard.press("Escape");
        }
      }
    });
  }

  test("updates direct link selection without affecting unrelated menus", async ({ page }) => {
    const scope = demo(page, "links");
    await scope.getByRole("link", { name: "Projects", exact: true }).click();
    await expect(scope.getByRole("link", { name: "Projects", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(scope.getByRole("link", { name: "Overview", exact: true })).not.toHaveAttribute("aria-current");
    await expect(scope.locator("output")).toContainText("Projects");
  });

  test("cancels hover intent when a mouse click closes the same trigger", async ({ page }) => {
    await page.keyboard.press("Escape");
    const scope = demo(page, "compact");
    const trigger = scope.getByRole("button", { name: "Platform", exact: true });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel(scope, "platform")).not.toBeVisible();
  });

  test("supports vertical panels and right-to-left keyboard navigation", async ({ page }) => {
    const vertical = demo(page, "vertical");
    const trigger = vertical.getByRole("button", { name: "Platform", exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(panel(vertical, "platform")).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(panel(vertical, "platform").getByRole("link", { name: /Projects/ })).toBeFocused();
    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel(vertical, "platform").boundingBox();
    expect(panelBox!.x).toBeGreaterThan(triggerBox!.x + triggerBox!.width);
    await page.keyboard.press("Escape");

    const rtl = demo(page, "rtl");
    const platform = rtl.getByRole("button", { name: "المنصة", exact: true });
    await platform.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(rtl.getByRole("button", { name: "المصادر", exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(panel(rtl, "resources")).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test.describe("Touch", () => {
  test.use({ hasTouch: true, isMobile: true });
  test("keeps touch panels inside a narrow viewport and honors reduced motion", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/examples/components/navigation-menu");
    await expect(page.locator('astro-island[component-url*="NavigationMenuDocsDemo"]:not([ssr])')).toHaveCount(1);
    const scope = demo(page);
    const platform = scope.getByRole("button", { name: "Platform", exact: true });
    await expect(panel(scope, "platform")).toBeVisible();
    const box = await panel(scope, "platform").boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    const animation = await panel(scope, "platform").evaluate(el => getComputedStyle(el).animationName);
    expect(animation).toBe("none");
    await platform.tap();
    await expect(panel(scope, "platform")).not.toBeVisible();
    await platform.tap();
    await expect(panel(scope, "platform")).toBeVisible();
    await panel(scope, "platform").getByRole("link", { name: /Reports/ }).tap();
    await expect(scope.locator("output")).toContainText("Reports");
    await expect(panel(scope, "platform")).not.toBeVisible();
  });
  });
});

test.describe("Navigation Menu behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/examples/components/navigation-menu/behavior");
    await expect(page.locator('astro-island[component-url*="BehaviorFixture"]:not([ssr])')).toHaveCount(1);
  });

  test("keeps hover activation when click activation is disabled", async ({ page }) => {
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    const scope = page.locator('[data-fixture="hover-only"]');
    const trigger = scope.getByRole("button", { name: "Resources" });
    await trigger.hover();
    await page.mouse.down();
    await page.mouse.up();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await page.clock.runFor(600);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel(scope, "resources")).toBeVisible();
  });

  for (const fixture of ["eager", "eager-provider"]) {
  test(`keeps ${fixture} panels mounted and measurable despite untyped lazy flags`, async ({ page }) => {
    const scope = page.locator(`[data-fixture="${fixture}"]`);
    const trigger = scope.getByRole("button", { name: "Resources" });
    for (let opening = 0; opening < 2; opening++) {
      await expect(panel(scope, "resources")).toHaveCount(1);
      await expect(panel(scope, "resources")).not.toBeVisible();
      await trigger.click();
      await expect(panel(scope, "resources")).toBeVisible();
      await expect.poll(async () => (await scope.locator('[data-slot="navigation-menu-viewport"]').boundingBox())?.height ?? 0).toBeGreaterThan(50);
      await scope.getByRole("link", { name: "Support" }).click({ trial: true });
      await page.keyboard.press("Escape");
    }
    await expect(panel(scope, "resources")).toHaveCount(1);
    await expect(panel(scope, "resources")).not.toBeVisible();
  });
  }
});
