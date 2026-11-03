import { expect, test, type Locator, type Page } from "@playwright/test";

async function openExample(page: Page, mobile = false) {
  await page.setViewportSize({ width: mobile ? 390 : 1440, height: 1000 });
  await page.goto("/examples/appshell/paneled-workspace?view=Pipelines");
  await expect(page.getByRole("heading", { name: "Simulation runs", exact: true })).toBeVisible();
  if (mobile) await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const nav = page.getByRole(mobile ? "dialog" : "navigation", { name: "Paneled workspace navigation", exact: true });
  const trigger = nav.getByRole("button", { name: "Templates", exact: true });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const content = page.locator(`[id="${await trigger.getAttribute("aria-controls")}"]`);
  await content.evaluate(node => Promise.all(node.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))));
  return { nav, trigger, content };
}

// Pause real browser motion at its start so geometry checks do not depend on machine speed.
async function toggleAndPause(trigger: Locator, content: Locator) {
  await trigger.evaluate(button => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls")!)!;
      const start = performance.now();
      const pause = () => {
        const animations = panel.getAnimations();
        if (animations.length) {
          for (const animation of panel.getAnimations({ subtree: true })) animation.pause();
        } else if (performance.now() - start < 1000) requestAnimationFrame(pause);
      };
      requestAnimationFrame(pause);
    }, { once: true });
  });
  await trigger.click();
  await expect.poll(() => content.evaluate(node => node.getAnimations().some(animation => animation.playState === "paused"))).toBe(true);
}

async function seek(content: Locator, time: number) {
  return content.evaluate((node, currentTime) => {
    for (const animation of node.getAnimations({ subtree: true })) animation.currentTime = currentTime;
    const label = node.querySelector(".kappa-sidebar__menu-label")!;
    const style = getComputedStyle(label);
    return { height: node.getBoundingClientRect().height, textOpacity: Number(style.opacity) };
  }, time);
}

for (const mobile of [false, true]) {
  test(`${mobile ? "mobile" : "desktop"} submenus reveal height over 200ms with the label motion inside`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const { nav, trigger, content } = await openExample(page, mobile);
    const nextGroup = nav.getByRole("button", { name: "Engineering tools", exact: true });
    const fullHeight = (await content.boundingBox())!.height;
    const expandedNextY = (await nextGroup.boundingBox())!.y;
    await toggleAndPause(trigger, content);
    const timing = await content.evaluate(node => node.getAnimations().map(animation => {
      const { duration } = animation.effect!.getTiming();
      return { duration, easing: (animation.effect as KeyframeEffect).getKeyframes()[0].easing };
    }));
    expect(timing).toEqual([{ duration: 200, easing: "ease" }]);
    const closeStart = await seek(content, 0);
    const nextStart = (await nextGroup.boundingBox())!.y;
    expect(nextStart).toBeCloseTo(expandedNextY, 1);
    const closeMiddle = await seek(content, 100);
    expect(closeStart.height).toBeCloseTo(fullHeight, 0);
    expect(closeMiddle.height / fullHeight).toBeCloseTo(0.198, 1);
    expect(nextStart - (await nextGroup.boundingBox())!.y).toBeCloseTo(closeStart.height - closeMiddle.height, 0);
    await content.evaluate(node => node.getAnimations({ subtree: true }).forEach(animation => animation.play()));
    await expect(content).toBeHidden();

    await toggleAndPause(trigger, content);
    const start = await seek(content, 0);
    const middle = await seek(content, 100);
    expect(start.height).toBe(0);
    expect(middle.height / fullHeight).toBeCloseTo(0.802, 1);
    expect(middle.textOpacity).toBeCloseTo(0.953, 2);
    await content.evaluate(node => node.getAnimations({ subtree: true }).forEach(animation => animation.play()));
    await expect(content).toHaveCSS("height", `${fullHeight}px`);
    expect((await nextGroup.boundingBox())!.y).toBeCloseTo(expandedNextY, 1);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
}

test("reduced motion opens and closes without intermediate motion or focusable hidden links", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { nav, trigger, content } = await openExample(page);
  await trigger.click();
  await expect(content).toBeHidden();
  await expect.poll(() => content.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
  await trigger.press("Tab");
  await expect(nav.getByRole("button", { name: "Engineering tools", exact: true })).toBeFocused();
  await trigger.click();
  await expect(nav.getByRole("link", { name: "CFD Templates", exact: true })).toBeVisible();
  await expect.poll(() => content.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
});

test("reopening during collapse settles at full height and survives sidebar collapse", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const { nav, trigger, content } = await openExample(page);
  const fullHeight = (await content.boundingBox())!.height;
  await toggleAndPause(trigger, content);
  await seek(content, 100);
  await trigger.click();
  await expect(content).toHaveCSS("height", `${fullHeight}px`);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.click();
  await expect(content).toBeHidden();
  await trigger.click();
  await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await nav.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await expect(nav.getByRole("link", { name: "CFD Templates", exact: true })).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});

test("enabling reduced motion during collapse completes closure", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const { trigger, content } = await openExample(page);
  await toggleAndPause(trigger, content);
  await seek(content, 100);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(content).toBeVisible();
});

test("the popup stays open across its pointer gap and closes without an exit animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const { nav } = await openExample(page);
  const build = nav.getByRole("button", { name: "Templates", exact: true });
  await build.click();
  await expect(build).toHaveAttribute("aria-expanded", "false");
  await page.mouse.move(900, 100);
  await build.hover();
  const popup = page.getByRole("navigation", { name: "Templates pages", exact: true, includeHidden: true });
  await expect(popup).toBeVisible();
  const button = (await build.boundingBox())!;
  const row = (await popup.getByRole("link", { name: "CFD Templates", exact: true }).boundingBox())!;
  await page.mouse.move(button.x + button.width - 1, button.y + button.height / 2);
  await page.mouse.move(button.x + button.width + 5, button.y + button.height / 2, { steps: 6 });
  await expect(popup).toBeVisible();
  await page.mouse.move(row.x + 20, row.y + row.height / 2, { steps: 6 });
  await expect(popup).toBeVisible();
  const box = popup.locator("..");
  await expect(box).toHaveCSS("animation-duration", "0.2s");
  await expect(box).toHaveCSS("animation-timing-function", "cubic-bezier(0.22, 0.61, 0.36, 1)");
  await page.mouse.move(900, 100);
  await expect(popup).toBeHidden();
  await expect(box).toHaveCSS("animation-name", "none");
});
