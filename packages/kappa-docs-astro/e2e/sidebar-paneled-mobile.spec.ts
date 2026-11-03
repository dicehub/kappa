import { expect, test, type Locator, type Page } from "@playwright/test";

async function open(page: Page, starter = false) {
  await page.goto(`/examples/appshell/${starter ? "starter/" : ""}paneled-workspace`);
  await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
}

test("mobile header puts the logo before the navigation toggle in display and tab order", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const home = page.getByRole("link", { name: "dicehub home", exact: true });
  const toggle = page.getByRole("button", { name: "Open sidebar", exact: true });
  for (const width of [320, 390, 575, 576, 768, 991, 992, 1199]) {
    await page.setViewportSize({ width, height: 844 });
    const inset = width < 992 ? 8 : 12;
    await expect.poll(async () => (await home.boundingBox())!.x).toBe(inset);
    const brand = (await home.boundingBox())!;
    const button = (await toggle.boundingBox())!;
    expect(button.x - brand.x - brand.width).toBe(8);
    expect(button).toMatchObject({ y: 8, width: 32, height: 32 });
    await home.focus();
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();
    const search = (await page.getByRole("button", { name: "Search or go to…", exact: true }).boundingBox())!;
    const credits = (await page.getByRole("button", { name: /^Credits:/ }).boundingBox())!;
    expect(search.x).toBeGreaterThanOrEqual(button.x + button.width);
    expect(credits.x - search.x - search.width).toBeGreaterThanOrEqual(8);
    if (width < 576) {
      const profile = (await page.getByRole("button", { name: "Profile: Alex Morgan", exact: true }).boundingBox())!;
      expect(credits.x - search.x - search.width).toBe(8);
      expect(profile.x + profile.width).toBe(width - 8);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("paneled pages and list content keep 12px inner padding on phone and tablet", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const starter of [false, true]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, starter);
    const content = page.locator(starter ? ".kappa-app-shell__page" : ".paneled-workspace-demo__list-scroll").first();
    const frame = page.locator(".kappa-app-shell__panel-frame");
    for (const width of [390, 575, 576, 768, 1199]) {
      await page.setViewportSize({ width, height: 844 });
      await expect(content).toHaveCSS("padding-left", "12px");
      await expect(content).toHaveCSS("padding-right", "12px");
      await expect.poll(async () => (await frame.boundingBox())!.x).toBe(width < 576 ? 0 : 8);
    }
  }
});

test("mobile drawer uses theme-aware overlays, closes outside, and resets on desktop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const toggle = page.getByRole("button", { name: "Open sidebar", exact: true });
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  for (const theme of ["light", "dark"]) {
    await page.evaluate(theme => document.documentElement.setAttribute("data-kappa-theme", theme), theme);
    await toggle.click();
    await expect(drawer).toBeVisible();
    await expect(page.locator('[data-slot="sidebar-backdrop"]')).toHaveCSS("background-color", theme === "dark" ? "rgba(0, 0, 0, 0.64)" : "rgba(5, 5, 6, 0.24)");
    expect(await drawer.boundingBox()).toMatchObject({ x: 0, y: 0, width: 312, height: 844 });
    await page.mouse.click(370, 120);
    await expect(drawer).toBeHidden();
    await expect(toggle).toBeFocused();
  }
  await toggle.click();
  await page.setViewportSize({ width: 1200, height: 844 });
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toggle).toBeVisible();
  await expect(drawer).toBeHidden();
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
});

async function pauseSlide(button: Locator, drawer: Locator) {
  const id = await button.getAttribute("aria-controls") ?? await drawer.getAttribute("id");
  await button.evaluate((node, id) => {
    node.addEventListener("click", () => {
      const start = performance.now();
      const pause = () => {
        const animations = document.getElementById(id!)?.getAnimations() ?? [];
        if (animations.length) animations.forEach(animation => animation.pause());
        else if (performance.now() - start < 1000) requestAnimationFrame(pause);
      };
      requestAnimationFrame(pause);
    }, { once: true });
  }, id);
  await button.click();
  await expect.poll(() => drawer.evaluate(node => node.getAnimations().some(animation => animation.playState === "paused"))).toBe(true);
  expect(await drawer.evaluate(node => node.getAnimations().map(animation => ({
    duration: animation.effect!.getTiming().duration,
    easing: (animation.effect as KeyframeEffect).getKeyframes()[0].easing,
  })))).toEqual([{ duration: 200, easing: "ease" }]);
}

test("mobile drawer slides in and out over 200ms and completes a reduced-motion interruption", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const toggle = page.getByRole("button", { name: "Open sidebar", exact: true });
  const drawer = page.locator('[data-slot="sidebar-dialog"]');
  await pauseSlide(toggle, drawer);
  const sample = (time: number) => drawer.evaluate((node, time) => {
    node.getAnimations().forEach(animation => { animation.currentTime = time; });
    return node.getBoundingClientRect().x;
  }, time);
  expect(await sample(0)).toBeCloseTo(-312, 0);
  expect(await sample(100)).toBeCloseTo(-312 * 0.198, 0);
  await drawer.evaluate(node => node.getAnimations().forEach(animation => animation.finish()));
  await expect.poll(async () => (await drawer.boundingBox())!.x).toBe(0);
  await pauseSlide(drawer.getByRole("button", { name: "Close navigation", exact: true }), drawer);
  expect(await sample(0)).toBe(0);
  expect(await sample(100)).toBeCloseTo(-312 * 0.802, 0);
  await drawer.evaluate(node => node.getAnimations().forEach(animation => animation.play()));
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await pauseSlide(drawer.getByRole("button", { name: "Close navigation", exact: true }), drawer);
  await sample(50);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await expect.poll(async () => (await drawer.boundingBox())!.x).toBe(0);
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("custom header toggle preserves context and focus, then restores the translated default", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/examples/components/app-shell/header");
  await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
  for (const appearance of ["paneled", "default"]) {
    if (appearance === "default") await page.getByRole("button", { name: "Use default appearance", exact: true }).click();
    const home = page.getByRole("link", { name: "Project home", exact: true });
    const custom = page.getByRole("button", { name: "Project navigation", exact: true });
    const drawer = page.getByRole("dialog", { name: "Header example navigation", exact: true });
    await expect(custom).toHaveAttribute("data-mobile-toggle", "true");
    await expect(page.getByRole("button", { name: "Open project menu", exact: true })).toHaveCount(0);
    await home.focus();
    await page.keyboard.press("Tab");
    await expect(custom).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(custom).toBeFocused();
    await page.getByRole("button", { name: "Use default toggle", exact: true }).click();
    const fallback = page.getByRole("button", { name: "Open project menu", exact: true });
    await expect(custom).toHaveCount(0);
    await fallback.click();
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(fallback).toBeFocused();
    await page.getByRole("button", { name: "Use custom toggle", exact: true }).click();
  }
});
