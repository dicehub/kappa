import { expect, test, type Locator, type Page } from "@playwright/test";

const currentWidth = async (handle: Locator) => Number(await handle.getAttribute("aria-valuenow"));
async function moveTo(page: Page, handle: Locator, target: number, direction = 1) {
  await handle.scrollIntoViewIfNeeded();
  const box = (await handle.boundingBox())!;
  const start = await currentWidth(handle);
  const x = box.x + box.width / 2;
  const y = box.y + Math.min(150, box.height / 2);
  await page.mouse.move(x, y);
  await page.mouse.down();
  const end = x + (target - start) * direction;
  await page.mouse.move(end, y, { steps: 5 });
  return { x: end, y };
}
async function dragTo(page: Page, handle: Locator, target: number, direction = 1) {
  await moveTo(page, handle, target, direction);
  await page.mouse.up();
}
async function train(page: Page, handle: Locator, direction = 1) {
  for (const width of [300, 302, 301]) {
    await dragTo(page, handle, width, direction);
    await expect(handle).toHaveAttribute("aria-valuenow", String(width));
    await page.clock.fastForward(2100);
  }
}
async function openWorkspace(page: Page, showGuide = true) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/examples/appshell/paneled-workspace?view=Dashboard");
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await page.clock.install();
  const flags = page.getByRole("button", { name: "Feature flags", exact: true });
  await flags.click();
  const option = page.getByRole("menuitemcheckbox", { name: "Smart sidebar resizing", exact: true });
  await expect(option).not.toBeChecked();
  await expect(page.getByRole("separator", { name: "Resize sidebar", exact: true })).toHaveAttribute("aria-valuenow", "240");
  await option.click();
  if (showGuide) {
    await flags.click();
    await page.getByRole("menuitemcheckbox", { name: "Show snap guide", exact: true }).click();
  }
  return page.getByRole("separator", { name: "Resize sidebar", exact: true });
}

test("the snap guide flag is independent, preserves learning, and persists in both headers", async ({ page }) => {
  const handle = await openWorkspace(page, false);
  const zone = page.locator('[data-slot="sidebar-snap-zone"]');
  const flags = page.getByRole("button", { name: "Feature flags", exact: true });
  const guideOption = page.getByRole("menuitemcheckbox", { name: "Show snap guide", exact: true });
  await expect(zone).toHaveCount(0);
  await flags.click();
  await expect(guideOption).not.toBeChecked();
  await page.keyboard.press("Escape");
  await train(page, handle);
  await flags.click();
  await guideOption.click();
  await expect(zone).toBeVisible();
  const learned = (await zone.boundingBox())!;
  await flags.click();
  await guideOption.click();
  await expect(zone).toHaveCount(0);
  await handle.dblclick();
  await dragTo(page, handle, 306);
  await expect(handle).toHaveAttribute("aria-valuenow", "301");
  await flags.click();
  await page.getByRole("menuitemcheckbox", { name: "Inset header", exact: true }).click();
  await flags.click();
  await expect(guideOption).not.toBeChecked();
  await guideOption.click();
  expect((await zone.boundingBox())!.x).toBeCloseTo(learned.x, 1);
  await page.reload();
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await expect(zone).toBeVisible();
  await flags.click();
  await expect(guideOption).toBeChecked();
  const smartOption = page.getByRole("menuitemcheckbox", { name: "Smart sidebar resizing", exact: true });
  await expect(smartOption).toBeChecked();
  await smartOption.click();
  await expect(zone).toHaveCount(0);
  await flags.click();
  await expect(guideOption).toBeChecked();
  await smartOption.click();
  await expect(zone).toBeVisible();
});

test("smart resizing has a visible hold from the first drag", async ({ page }) => {
  const handle = await openWorkspace(page);
  const zone = page.locator('[data-slot="sidebar-snap-zone"]');
  await expect(zone).toBeVisible();
  await expect(zone).not.toHaveAttribute("data-active");
  const initialZone = (await zone.boundingBox())!;
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  const pointer = await moveTo(page, handle, 246);
  await expect(handle).toHaveAttribute("aria-valuenow", "240");
  await expect(handle).toHaveAttribute("data-snapped", "true");
  await expect(zone).toHaveAttribute("data-active", "true");
  const heldColor = await handle.evaluate(element => getComputedStyle(element, "::after").backgroundColor);
  await page.clock.fastForward(350);
  await expect(handle).not.toHaveAttribute("data-snapped");
  await expect(zone).toHaveAttribute("data-active", "true");
  expect(await handle.evaluate(element => getComputedStyle(element, "::after").backgroundColor)).not.toBe(heldColor);
  await page.mouse.move(pointer.x + 4, pointer.y);
  await expect(handle).toHaveAttribute("aria-valuenow", "244");
  expect((await zone.boundingBox())!.x).toBeCloseTo(initialZone.x, 1);
  await page.mouse.up();
  await expect(zone).toHaveAttribute("data-active", "true");
  await handle.press("ArrowRight");
  await expect(zone).not.toHaveAttribute("data-active");
  await page.getByRole("button", { name: "Feature flags", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "Smart sidebar resizing", exact: true }).click();
  await dragTo(page, handle, 246);
  await expect(handle).toHaveAttribute("aria-valuenow", "246");
  await expect(handle).not.toHaveAttribute("data-snapped");
  await expect(zone).toHaveCount(0);
});

test("learned width holds, releases continuously, and preserves keyboard, bounds, and reset", async ({ page }) => {
  const handle = await openWorkspace(page);
  await train(page, handle);
  const pointer = await moveTo(page, handle, 306);
  await expect(handle).toHaveAttribute("aria-valuenow", "301");
  await page.clock.fastForward(350);
  await expect(handle).toHaveAttribute("aria-valuenow", "301");
  await page.mouse.move(pointer.x - 5, pointer.y);
  await expect(handle).toHaveAttribute("aria-valuenow", "296");
  await page.mouse.move(pointer.x - 6, pointer.y);
  await expect(handle).toHaveAttribute("aria-valuenow", "295");
  await page.mouse.move(pointer.x + 3, pointer.y);
  await expect(handle).toHaveAttribute("aria-valuenow", "304");
  await page.mouse.move(pointer.x + 200, pointer.y, { steps: 5 });
  await expect(handle).toHaveAttribute("aria-valuenow", "420");
  await page.mouse.move(pointer.x - 106, pointer.y, { steps: 5 });
  await expect(handle).toHaveAttribute("aria-valuenow", "200");
  await page.mouse.up();
  await dragTo(page, handle, 280);
  await handle.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "304");
  await dragTo(page, handle, 600);
  await expect(handle).toHaveAttribute("aria-valuenow", "420");
  await dragTo(page, handle, 100);
  await expect(handle).toHaveAttribute("aria-valuenow", "44");
  await handle.dblclick();
  await expect(handle).toHaveAttribute("aria-valuenow", "240");
});

test("fine adjustments keep the initial default guide stable", async ({ page }) => {
  const handle = await openWorkspace(page);
  const zone = page.locator('[data-slot="sidebar-snap-zone"]');
  const initialZone = (await zone.boundingBox())!;
  for (let index = 0; index < 3; index += 1) {
    await handle.dblclick();
    const pointer = await moveTo(page, handle, 246);
    await expect(handle).toHaveAttribute("aria-valuenow", "240");
    await page.clock.fastForward(350);
    await page.mouse.move(pointer.x + 4, pointer.y);
    await expect(handle).toHaveAttribute("aria-valuenow", "244");
    await page.mouse.up();
    await page.clock.fastForward(2100);
    expect((await zone.boundingBox())!.x).toBeCloseTo(initialZone.x, 1);
  }
  await handle.dblclick();
  await moveTo(page, handle, 246);
  await expect(handle).toHaveAttribute("aria-valuenow", "240");
  await page.mouse.up();
});

test("the flag persists, learned widths do not, and disabling restores free resizing", async ({ page }) => {
  const handle = await openWorkspace(page);
  await train(page, handle);
  await page.getByRole("button", { name: "Feature flags", exact: true }).click();
  const option = page.getByRole("menuitemcheckbox", { name: "Smart sidebar resizing", exact: true });
  await expect(option).toBeChecked();
  await option.click();
  await dragTo(page, handle, 306);
  await expect(handle).toHaveAttribute("aria-valuenow", "306");
  await page.getByRole("button", { name: "Feature flags", exact: true }).click();
  await option.click();
  await page.reload();
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await page.getByRole("button", { name: "Feature flags", exact: true }).click();
  await expect(option).toBeChecked();
  await page.keyboard.press("Escape");
  await dragTo(page, handle, 306);
  await expect(handle).toHaveAttribute("aria-valuenow", "306");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(handle).toHaveCount(0);
});

for (const edge of [
  { name: "maximum", width: 420, key: "ArrowLeft", near: 415, beyond: 85, reverse: 55, inside: -25, result: 390 },
  { name: "minimum", width: 200, key: "ArrowRight", near: 205, beyond: -25, reverse: -15, inside: 30, result: 235 },
]) test(`a preferred width at the ${edge.name} retains pointer overshoot`, async ({ page }) => {
  const handle = await openWorkspace(page);
  for (let index = 0; index < 4; index += 1) {
    await handle.press(edge.key);
    await dragTo(page, handle, edge.width);
    await expect(handle).toHaveAttribute("aria-valuenow", String(edge.width));
    await page.clock.fastForward(2100);
  }
  for (let index = 0; index < 3; index += 1) await handle.press(edge.key);
  const pointer = await moveTo(page, handle, edge.near);
  await expect(handle).toHaveAttribute("aria-valuenow", String(edge.width));
  const direction = Math.sign(edge.beyond);
  await page.mouse.move(pointer.x + 10 * direction, pointer.y);
  await page.clock.fastForward(350);
  await page.mouse.move(pointer.x + 7 * direction, pointer.y);
  await expect(handle).toHaveAttribute("aria-valuenow", String(edge.width));
  await page.mouse.move(pointer.x + edge.beyond, pointer.y);
  await page.clock.fastForward(350);
  await page.mouse.move(pointer.x + edge.reverse, pointer.y);
  await expect(handle).toHaveAttribute("aria-valuenow", String(edge.width));
  await page.mouse.move(pointer.x + edge.inside, pointer.y);
  await expect(handle).toHaveAttribute("aria-valuenow", String(edge.result));
  await page.mouse.up();
});

test("fine adjustments retain the reference until a new width is preferred outside the zone", async ({ page }) => {
  const handle = await openWorkspace(page);
  await train(page, handle);
  for (let index = 0; index < 5; index += 1) {
    await handle.dblclick();
    const pointer = await moveTo(page, handle, 308);
    await page.clock.fastForward(350);
    const heldWidth = await currentWidth(handle);
    await page.mouse.move(pointer.x + 308 - heldWidth, pointer.y);
    await expect(handle).toHaveAttribute("aria-valuenow", "308");
    await page.mouse.up();
    await page.clock.fastForward(2100);
  }
  await handle.dblclick();
  await moveTo(page, handle, 308);
  await expect(handle).toHaveAttribute("aria-valuenow", "301");
  await page.mouse.up();
  for (const width of [338, 340, 339, 340, 339, 340]) {
    await page.clock.fastForward(2100);
    await handle.dblclick();
    await dragTo(page, handle, width);
  }
  await handle.dblclick();
  await moveTo(page, handle, 344);
  expect(await currentWidth(handle)).toBeGreaterThanOrEqual(338);
  expect(await currentWidth(handle)).toBeLessThanOrEqual(340);
  await page.mouse.up();
});

for (const widths of [[320, 321, 322], [282, 281, 280]]) {
  test(`the learned guide stays fixed until a replacement near ${widths[1]} has support`, async ({ page }) => {
    const handle = await openWorkspace(page);
    const zone = page.locator('[data-slot="sidebar-snap-zone"]');
    await train(page, handle);
    const established = (await zone.boundingBox())!;
    for (const [index, width] of widths.entries()) {
      await moveTo(page, handle, width);
      await expect(handle).toHaveAttribute("aria-valuenow", String(width));
      expect((await zone.boundingBox())!.x).toBeCloseTo(established.x, 1);
      await page.mouse.up();
      if (index < 2) expect((await zone.boundingBox())!.x).toBeCloseTo(established.x, 1);
      await page.clock.fastForward(2100);
    }
    const replacement = (await zone.boundingBox())!;
    expect(replacement.x - established.x).toBeCloseTo(widths[1] - 301, 1);
  });
}

test("a rapid correction does not clear the learned guide", async ({ page }) => {
  const handle = await openWorkspace(page);
  const zone = page.locator('[data-slot="sidebar-snap-zone"]');
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  for (const width of [300, 302]) {
    await dragTo(page, handle, width);
    await page.clock.fastForward(2100);
  }
  await dragTo(page, handle, 301);
  const established = (await zone.boundingBox())!;
  await dragTo(page, handle, 350);
  await expect(handle).toHaveAttribute("aria-valuenow", "350");
  expect((await zone.boundingBox())!.x).toBeCloseTo(established.x, 1);
});

test("keyboard resizing and reset bypass an active learned preference", async ({ page }) => {
  const handle = await openWorkspace(page);
  for (const width of [301, 302, 303]) {
    await dragTo(page, handle, width);
    await page.clock.fastForward(2100);
  }
  await handle.dblclick();
  await expect(handle).toHaveAttribute("aria-valuenow", "240");
  for (let index = 0; index < 3; index += 1) await handle.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "312");
  await moveTo(page, handle, 306);
  await expect(handle).toHaveAttribute("aria-valuenow", "302");
  await page.mouse.up();
});

test("cancelled drags and rapid corrections do not establish a preference", async ({ page }) => {
  const handle = await openWorkspace(page);
  for (const width of [300, 302, 301]) {
    await moveTo(page, handle, width);
    await handle.dispatchEvent("pointercancel", { pointerId: 1, pointerType: "mouse" });
    await page.mouse.up();
    await page.clock.fastForward(2100);
  }
  await dragTo(page, handle, 306);
  await expect(handle).toHaveAttribute("aria-valuenow", "306");
  await page.clock.setFixedTime(await page.evaluate(() => Date.now()));
  for (const width of [301, 300, 302, 305]) await dragTo(page, handle, width);
  await expect(handle).toHaveAttribute("aria-valuenow", "305");
});

test("a narrower container keeps its fallback guide stable", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/sidebar");
  const demo = page.locator('[data-sidebar-demo="resizable-controlled"]');
  await expect.poll(() => demo.evaluate(el => el.closest("astro-island")!.hasAttribute("ssr"))).toBe(false);
  await page.clock.install();
  await demo.getByRole("button", { name: "Smart resizing", exact: true }).click();
  const handle = demo.getByRole("separator", { name: "Resize sidebar", exact: true });
  const zone = demo.locator('[data-slot="sidebar-snap-zone"]');
  for (let index = 0; index < 10; index += 1) {
    await handle.dblclick();
    await dragTo(page, handle, 300 + index % 3);
    await page.clock.fastForward(2100);
  }
  await demo.evaluate(element => { element.style.width = "260px"; element.style.maxWidth = "260px"; });
  await expect(handle).toHaveAttribute("aria-valuemax", "260");
  const fallbackZone = (await zone.boundingBox())!;
  for (let index = 0; index < 7; index += 1) {
    await handle.dblclick();
    const pointer = await moveTo(page, handle, 246);
    await expect(handle).toHaveAttribute("aria-valuenow", "240");
    await page.clock.fastForward(350);
    await page.mouse.move(pointer.x + 4, pointer.y);
    await expect(handle).toHaveAttribute("aria-valuenow", "244");
    await page.mouse.up();
    await page.clock.fastForward(2100);
    expect((await zone.boundingBox())!.x).toBeCloseTo(fallbackZone.x, 1);
  }
});

for (const variant of ["end", "rtl", "resizable-controlled"]) {
  test(`smart resizing respects ${variant} sidebar behavior`, async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1100 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/sidebar");
    const demo = page.locator(`[data-sidebar-demo="${variant}"]`);
    await expect.poll(() => demo.evaluate(el => el.closest("astro-island")!.hasAttribute("ssr"))).toBe(false);
    await page.clock.install();
    await demo.getByRole("button", { name: "Smart resizing", exact: true }).click();
    const handle = demo.getByRole("separator", { name: "Resize sidebar", exact: true });
    const direction = variant === "resizable-controlled" ? 1 : -1;
    if (variant === "resizable-controlled") {
      await demo.getByRole("button", { name: "Lock width", exact: true }).click();
      for (const width of [300, 302, 301]) {
        await dragTo(page, handle, width);
        await expect(handle).toHaveAttribute("aria-valuenow", "240");
        await page.clock.fastForward(2100);
      }
      await demo.getByRole("button", { name: "Unlock width", exact: true }).click();
      await moveTo(page, handle, 306);
      await expect(handle).toHaveAttribute("aria-valuenow", "306");
      await handle.dispatchEvent("pointercancel", { pointerId: 1, pointerType: "mouse" });
      await page.mouse.up();
      await page.clock.fastForward(2100);
    }
    await train(page, handle, direction);
    await moveTo(page, handle, 306, direction);
    const snapped = await currentWidth(handle);
    expect(snapped).toBeGreaterThanOrEqual(300);
    expect(snapped).toBeLessThanOrEqual(303);
    await page.mouse.up();
  });
}
