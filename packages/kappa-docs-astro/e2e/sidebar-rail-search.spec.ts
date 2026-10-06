import { expect, test, type Page } from "@playwright/test";
import { expectSearchPanelMotion } from "./search-panel-motion";
import { expectRoundedSearchField } from "./search-field-shape";

async function openExample(page: Page) {
  await page.goto("/examples/sidebar/rail");
  await expect.poll(() => page.locator('[data-sidebar-block="rail"]').evaluate(node => node.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
}

test("rail header search expands and fades, then navigates pages and projects", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openExample(page);
  const trigger = page.getByRole("button", { name: "Search or go to…", exact: true });
  await expect(trigger).toHaveAttribute("aria-keyshortcuts", "/");
  await expect(trigger.locator("kbd")).toHaveText("/");
  await expectSearchPanelMotion(page, "sidebar-rail-search-in", () => page.keyboard.press("/"));
  const dialog = page.locator(".sidebar-rail-search-dialog");
  const input = dialog.getByRole("combobox");
  await expect(input).toBeFocused();
  await expectRoundedSearchField(dialog);
  await expect(dialog).toHaveCSS("animation-name", "sidebar-rail-search-in");
  await expect(dialog).toHaveCSS("animation-duration", "0.2s");
  await expect(dialog).toHaveCSS("width", "768px");
  expect((await dialog.boundingBox())!.y).toBeCloseTo(4, 0);
  await input.fill("Refinement");
  await expectSearchPanelMotion(page, "sidebar-rail-search-out", () => input.press("Enter"), true);
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("heading", { name: "Refinement", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await trigger.click();
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
  await input.fill("Rotor study");
  await expect(dialog.getByRole("option")).toHaveCount(1);
  await input.press("Enter");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("heading", { name: "Rotor study", exact: true })).toBeVisible();
});

test("rail field stays at the shell center through sidebar width changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openExample(page);
  for (const width of [1440, 1024, 768]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const state of ["expanded", "collapsed"]) {
      const toggle = page.locator('.kappa-sidebar-layout__toolbar > .kappa-sidebar__trigger');
      await toggle.click();
      const frames = await page.locator('[data-sidebar-block="rail"]').evaluate(node => {
        const shell = node.querySelector('.kappa-sidebar-layout')!;
        const sidebar = node.querySelector('.kappa-sidebar__shell')!;
        const trigger = node.querySelector('[data-rail-search-trigger]')!;
        const animations = [...sidebar.getAnimations(), ...trigger.getAnimations()];
        for (const animation of animations) animation.pause();
        const frames = [0, 80, 160].map(time => {
          for (const animation of animations) animation.currentTime = time;
          const shellBounds = shell.getBoundingClientRect();
          const triggerBounds = trigger.getBoundingClientRect();
          return { center: triggerBounds.x + triggerBounds.width / 2, shellCenter: shellBounds.x + shellBounds.width / 2, height: triggerBounds.height };
        });
        for (const animation of animations) animation.finish();
        return frames;
      });
      for (const frame of frames) {
        expect(frame.center).toBeCloseTo(frame.shellCenter, 1);
        expect(frame.height).toBe(32);
      }
      await expect(page.locator('.kappa-sidebar-layout')).toHaveAttribute('data-state', state);
      const bounds = await page.locator('[data-rail-search-trigger]').boundingBox();
      const toggleBounds = await toggle.boundingBox();
      expect(bounds!.x >= toggleBounds!.x + toggleBounds!.width || bounds!.x + bounds!.width <= toggleBounds!.x).toBe(true);
    }
  }
});

test("embedded rail search stays centered and uses a drawer in narrow frames", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto('/docs/blocks/sidebar');
  const demo = page.locator('[data-sidebar-block="rail"]');
  await expect.poll(() => demo.evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
  await demo.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
  for (const width of [600, 590, 588, 580, 360]) {
    await demo.evaluate((node, width) => { (node as HTMLElement).style.inlineSize = `${width}px`; }, width);
    const layout = demo.locator('.kappa-sidebar-layout');
    if (width < 590) await expect(layout).toHaveAttribute('data-mobile', '');
    else await expect(layout).not.toHaveAttribute('data-mobile', '');
    const shell = (await layout.boundingBox())!;
    const trigger = demo.getByRole('button', { name: 'Search or go to…', exact: true });
    const field = (await trigger.boundingBox())!;
    const toggle = (await demo.locator('.kappa-sidebar-layout__toolbar > .kappa-sidebar__trigger').boundingBox())!;
    expect(field.x + field.width / 2).toBeCloseTo(shell.x + shell.width / 2, 1);
    expect(field.width).toBeGreaterThanOrEqual(44);
    expect(field.x >= toggle.x + toggle.width || field.x + field.width <= toggle.x).toBe(true);
    expect(await trigger.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Search navigation', exact: true });
    await expect(dialog.getByRole('combobox')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  }
});

test("rail slash shortcut respects open menus and input text", async ({ page }) => {
  await openExample(page);
  await page.getByRole("button", { name: "Profile: Ros.Space", exact: true }).click();
  await page.keyboard.press("/");
  await expect(page.getByRole("menu", { name: "Profile: Ros.Space", exact: true })).toBeVisible();
  await expect(page.locator(".sidebar-rail-search-dialog")).toHaveCount(0);
  await page.keyboard.press("Escape");
  const trigger = page.getByRole("button", { name: "Search or go to…", exact: true });
  await trigger.press("/");
  const dialog = page.getByRole("dialog", { name: "Search navigation", exact: true });
  const input = dialog.getByRole("combobox");
  await expect(input).toBeFocused();
  await input.press("/");
  await expect(input).toHaveValue("/");
  await expect(dialog.getByText("No pages found.", { exact: true })).toBeVisible();
  await input.press("Escape");
  await expect(trigger).toBeFocused();
});

test("touch rail search fits 320px and keeps drawer focus in both themes", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await openExample(page);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(theme => { document.documentElement.dataset.kappaTheme = theme; }, theme);
      const trigger = page.getByRole("button", { name: "Search or go to…", exact: true });
      expect((await trigger.boundingBox())!.width).toBeGreaterThanOrEqual(180);
      const triggerBounds = (await trigger.boundingBox())!;
      expect(triggerBounds.x + triggerBounds.width / 2).toBeCloseTo(160, 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await trigger.tap();
      const dialog = page.getByRole("dialog", { name: "Search navigation", exact: true });
      await expect(dialog.getByRole("combobox")).toBeFocused();
      await expectRoundedSearchField(dialog, 16);
      await expect(dialog).toHaveCSS("animation-name", "none");
      const bounds = (await dialog.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(8);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(312);
      expect(bounds.y).toBeCloseTo(4, 0);
      await dialog.getByRole("combobox").fill("Projects");
      await dialog.getByRole("combobox").press("Enter");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
      const toggle = page.getByRole("button", { name: "Open sidebar", exact: true });
      await toggle.tap();
      const drawer = page.getByRole("dialog", { name: "rail application navigation", exact: true });
      await drawer.getByRole("button", { name: "Quick search …", exact: true }).tap();
      await dialog.getByRole("combobox").fill("Reports");
      await dialog.getByRole("combobox").press("Enter");
      await expect(dialog).toBeHidden();
      await expect(drawer).toBeHidden();
      await expect(toggle).toBeFocused();
    }
    expect(errors).toEqual([]);
  } finally {
    await context.close();
  }
});
