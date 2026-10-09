import { expect, test, type Page } from "@playwright/test";
import { expectRoundedSearchField } from "./search-field-shape";

async function captureMorph(page: Page, name: string, activate: () => Promise<unknown>, pauseAt?: number) {
  await page.evaluate(({ name, pauseAt }) => {
    delete document.documentElement.dataset.kappaTestMorph;
    const capture = (event: AnimationEvent) => {
      if (event.animationName !== name) return;
      document.removeEventListener("animationstart", capture, true);
      const node = event.target as HTMLElement;
      const animation = node.getAnimations().find(animation => animation instanceof CSSAnimation && animation.animationName === name)!;
      animation.pause();
      const frames = [0, 100, 199.999].map(time => {
        animation.currentTime = time;
        const bounds = node.getBoundingClientRect();
        const appearance = getComputedStyle(node);
        return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height, opacity: Number(appearance.opacity), radius: Number.parseFloat(appearance.borderRadius) };
      });
      document.documentElement.dataset.kappaTestMorph = JSON.stringify(frames);
      if (pauseAt === undefined) animation.finish();
      else animation.currentTime = pauseAt;
    };
    document.addEventListener("animationstart", capture, true);
  }, { name, pauseAt });
  await activate();
  await page.waitForFunction(() => document.documentElement.dataset.kappaTestMorph !== undefined);
  return page.evaluate(() => {
    const frames = JSON.parse(document.documentElement.dataset.kappaTestMorph!) as Array<{ x: number; y: number; width: number; height: number; opacity: number; radius: number }>;
    delete document.documentElement.dataset.kappaTestMorph;
    return frames;
  });
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/docs/components/command-palette#morphing-search");
  await page.locator('[data-morph-search-trigger]').scrollIntoViewIfNeeded();
});

test("morphing search grows from the field and returns to it after selection", async ({ page }) => {
  const trigger = page.locator('[data-morph-search-trigger]');
  const origin = (await trigger.boundingBox())!;
  const opening = await captureMorph(page, "command-palette-morph-in", () => trigger.press("/"));
  for (const key of ["x", "y", "width", "height"] as const) expect(opening[0][key]).toBeCloseTo(origin[key], 1);
  expect(opening[1].width).toBeGreaterThan(origin.width);
  expect(opening[1].width).toBeLessThan(768);
  expect(opening[1].height).toBeGreaterThan(32);
  expect(opening[1].height).toBeLessThan(320);
  const dialog = page.getByRole("dialog", { name: "Morphing search", exact: true });
  const input = dialog.getByRole("combobox");
  await expect(input).toBeFocused();
  await expectRoundedSearchField(dialog);
  await input.fill("Settings");
  await expect(dialog.getByRole("option")).toHaveCount(1);
  const closing = await captureMorph(page, "command-palette-morph-out", () => input.press("Enter"));
  expect(closing[1].width).toBeLessThan(closing[0].width);
  expect(closing[1].height).toBeLessThan(closing[0].height);
  for (const key of ["x", "y", "width", "height"] as const) expect(closing[2][key]).toBeCloseTo(origin[key], 1);
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('[data-command-palette-demo="morphing"]').getByRole("status")).toHaveText("Opened Settings.");
  const after = (await trigger.boundingBox())!;
  expect(after.y).toBeCloseTo(origin.y, 1);
});

test("interrupted opening and closing resume from the current panel bounds", async ({ page }) => {
  const trigger = page.locator('[data-morph-search-trigger]');
  await captureMorph(page, "command-palette-morph-in", () => trigger.click(), 50);
  const dialog = page.getByRole("dialog", { name: "Morphing search", exact: true });
  const current = (await dialog.boundingBox())!;
  const currentAppearance = await dialog.evaluate(node => ({ opacity: Number(getComputedStyle(node).opacity), radius: Number.parseFloat(getComputedStyle(node).borderRadius) }));
  await expect(dialog.getByRole("combobox")).toBeFocused();
  const closing = await captureMorph(page, "command-palette-morph-out", () => dialog.getByRole("combobox").press("Escape"), 100);
  for (const key of ["x", "y", "width", "height"] as const) expect(closing[0][key]).toBeCloseTo(current[key], 1);
  expect(closing[0].opacity).toBeCloseTo(currentAppearance.opacity, 3);
  expect(closing[0].radius).toBeCloseTo(currentAppearance.radius, 3);
  await expect(dialog).toHaveAttribute("inert", "");
  const returning = (await dialog.boundingBox())!;
  const returningAppearance = await dialog.evaluate(node => ({ opacity: Number(getComputedStyle(node).opacity), radius: Number.parseFloat(getComputedStyle(node).borderRadius) }));
  const reopening = await captureMorph(page, "command-palette-morph-in", () => trigger.press("/"));
  for (const key of ["x", "y", "width", "height"] as const) expect(reopening[0][key]).toBeCloseTo(returning[key], 1);
  expect(reopening[0].opacity).toBeCloseTo(returningAppearance.opacity, 3);
  expect(reopening[0].radius).toBeCloseTo(returningAppearance.radius, 3);
  await expect(dialog.getByRole("combobox")).toBeFocused();
  await expect(dialog).not.toHaveAttribute("inert");
  await page.mouse.click(10, 600);
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("morphing search fits mobile and short viewports with reduced motion in both themes", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const theme of ["light", "dark"]) {
    await page.evaluate(theme => { document.documentElement.dataset.kappaTheme = theme; }, theme);
    const trigger = page.locator('[data-morph-search-trigger]');
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Morphing search", exact: true });
    await expect(dialog.getByRole("combobox")).toBeFocused();
    await expectRoundedSearchField(dialog, 16);
    await expect(dialog).toHaveCSS("animation-name", "none");
    await expect(dialog.locator('.kappa-command-palette__list')).toHaveCSS("animation-name", "none");
    await expect(dialog.locator('.kappa-command-palette__footer')).toHaveCSS("opacity", "1");
    const bounds = (await dialog.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(8);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(312);
    await page.setViewportSize({ width: 320, height: 240 });
    await expect(dialog).toHaveCSS("height", "228px");
    expect((await dialog.boundingBox())!.y + (await dialog.boundingBox())!.height).toBeLessThanOrEqual(232);
    await expect(dialog.locator('.kappa-command-palette__footer')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await page.setViewportSize({ width: 320, height: 700 });
  }
  expect(errors).toEqual([]);
});
