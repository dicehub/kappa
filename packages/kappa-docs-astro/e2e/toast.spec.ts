import { expect, test, type Locator, type Page } from "@playwright/test";

const demo = (page: Page, name: string) => page.locator(`[data-toast-demo="${name}"]`);
const toasts = (page: Page) => page.locator('.kappa-toast[data-state="open"]:not([data-limited])');

async function ready(page: Page, name: string) {
  const example = demo(page, name);
  await expect(example.locator("xpath=ancestor::astro-island[1]")).not.toHaveAttribute("ssr");
  return example;
}

async function settled(toast: Locator) {
  await expect(toast).toHaveAttribute("data-mounted", "");
  await toast.evaluate(async (element) => {
    // Height changes can replace an active transition during a burst.
    do {
      await Promise.allSettled(element.getAnimations().map((animation) => animation.finished));
    } while (element.getAnimations().some(animation => animation.playState === "running"));
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/toast");
  await ready(page, "preview");
});

test("renders documentation, copy-ready examples, public imports, and Markdown", async ({ page, request }) => {
  await expect(page.getByRole("heading", { name: "Toast", level: 1 })).toBeVisible();
  await expect(page.locator(".docs-component-example")).toHaveCount(11);
  await expect(page.locator('[data-composition-tree="toast"]')).toContainText("Toast.ActionTrigger");
  await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute("href", "https://ark-ui.com/docs/components/toast");
  await expect(page.locator('[data-code-full] pre[data-language="vue"]').first()).toContainText("createToaster()");
  const response = await request.get("/docs/components/toast.md");
  expect(response.ok()).toBe(true);
  const markdown = await response.text();
  expect(markdown).toContain("@dicehub/kappa/components/toast/store");
  expect(markdown).toContain("## [Accessibility](#accessibility)");
  expect(markdown).not.toContain("Planned documentation");
});

test("shows compact notifications without stealing focus and preserves accessible references", async ({ page }, testInfo) => {
  const trigger = demo(page, "preview").getByRole("button", { name: "Save changes" });
  await trigger.click();
  const toast = toasts(page);
  await expect(toast).toHaveCount(1);
  await settled(toast);
  await expect(trigger).toBeFocused();
  await expect(page.locator('.kappa-toaster')).toHaveAttribute("aria-live", "polite");
  await expect(toast).toHaveAttribute("role", "status");
  await expect(toast).toHaveAttribute("aria-labelledby", await toast.locator('[data-slot="toast-title"]').getAttribute("id") as string);
  await expect(toast).toHaveAttribute("aria-describedby", await toast.locator('[data-slot="toast-description"]').getAttribute("id") as string);
  await expect(toast.locator('[data-slot="toast-title"]')).toHaveText("Changes saved");
  await expect(toast.locator('[data-slot="toast-title"]')).toHaveCSS("font-size", "13px");
  await expect(toast.locator('[data-slot="toast-indicator"] > svg')).toHaveCSS("width", "16px");
  const box = (await toast.boundingBox())!;
  expect(box.width).toBe(352);
  expect(box.height).toBeLessThan(90);
  expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await page.screenshot({ path: testInfo.outputPath("toast-light.png") });
  await toast.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(toast).toHaveCount(0);
});

test("supports every status and both partial-content forms", async ({ page }) => {
  const types = await ready(page, "types");
  for (const type of ["Success", "Error", "Warning", "Info"]) {
    await types.getByRole("button", { name: type, exact: true }).click();
    await expect(toasts(page)).toHaveAttribute("data-type", type.toLowerCase());
    await toasts(page).getByRole("button", { name: "Dismiss notification" }).click();
    await expect(toasts(page)).toHaveCount(0);
  }
  const content = await ready(page, "content");
  await content.getByRole("button", { name: "Title only" }).click();
  await expect(toasts(page).locator('[data-slot="toast-description"]')).toHaveCount(0);
  await expect(toasts(page)).not.toHaveAttribute("aria-describedby");
  await toasts(page).getByRole("button").click();
  await expect(toasts(page)).toHaveCount(0);
  await content.getByRole("button", { name: "Description only" }).click();
  await expect(toasts(page).locator('[data-slot="toast-title"]')).toHaveCount(0);
  await expect(toasts(page)).not.toHaveAttribute("aria-labelledby");
});

test("hotkey, keyboard action, and Escape remain usable", async ({ page }) => {
  const action = await ready(page, "action");
  await action.getByRole("button", { name: "Remove item" }).click();
  await expect(toasts(page)).toBeVisible();
  await page.keyboard.press("Alt+t");
  await expect(page.locator(".kappa-toaster")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(toasts(page)).toBeFocused();
  await expect(toasts(page)).toHaveAttribute("data-paused", "");
  await page.keyboard.press("Tab");
  await expect(toasts(page).getByRole("button", { name: "Undo" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(action.locator("[data-toast-demo-result]")).toHaveText("Item restored");
  await expect(toasts(page)).toHaveCount(0);

  const content = await ready(page, "content");
  await content.getByRole("button", { name: "Without close button" }).click();
  await expect(toasts(page).getByRole("button")).toHaveCount(0);
  await page.keyboard.press("Alt+t");
  await page.keyboard.press("Tab");
  await expect(toasts(page)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toasts(page)).toHaveCount(0);
});

test("promise success and rejection update the same persistent loading toast", async ({ page }) => {
  const example = await ready(page, "promise");
  await example.getByRole("button", { name: "Start upload" }).click();
  await expect(toasts(page)).toHaveAttribute("data-type", "loading");
  await expect(toasts(page).locator('[data-slot="loader"]')).toHaveAttribute("aria-hidden", "true");
  const id = await toasts(page).getAttribute("id");
  await example.getByRole("button", { name: "Finish upload" }).click();
  await expect(toasts(page)).toHaveAttribute("id", id!);
  await expect(toasts(page)).toHaveAttribute("data-type", "success");
  await expect(toasts(page)).toContainText("geometry.step is ready.");
  await toasts(page).getByRole("button", { name: "Dismiss notification" }).click();
  await expect(toasts(page)).toHaveCount(0);
  await example.getByRole("button", { name: "Start upload" }).click();
  await expect(toasts(page)).toHaveAttribute("data-type", "loading");
  await example.getByRole("button", { name: "Fail upload" }).click();
  await expect(toasts(page)).toHaveAttribute("data-type", "error");
  await expect(toasts(page)).toContainText("No files were changed");
  await expect(example.getByRole("button", { name: "Start upload" })).toBeEnabled();
});

test("updates a notification in place", async ({ page }) => {
  const example = await ready(page, "update");
  await example.getByRole("button", { name: "Start export" }).click();
  await expect(toasts(page)).toHaveAttribute("data-type", "loading");
  const id = await toasts(page).getAttribute("id");
  await example.getByRole("button", { name: "Complete export" }).click();
  await expect(toasts(page)).toHaveCount(1);
  await expect(toasts(page)).toHaveAttribute("id", id!);
  await expect(toasts(page)).toHaveAttribute("data-type", "success");
  await expect(toasts(page)).toContainText("Export ready");
});

test("queues excess messages and keeps stacked geometry separate", async ({ page }) => {
  const example = await ready(page, "stack");
  await example.getByRole("button", { name: "Queue overflow" }).click();
  await expect(toasts(page)).toHaveCount(3);
  await expect(toasts(page).filter({ hasText: "Notification 4" })).toHaveCount(0);
  await settled(toasts(page).last());
  const boxes = await toasts(page).evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()).sort((a, b) => a.y - b.y));
  expect(boxes[1].y - boxes[0].bottom).toBeCloseTo(8, 0);
  expect(boxes[2].y - boxes[1].bottom).toBeCloseTo(8, 0);
  await toasts(page).first().getByRole("button", { name: "Dismiss notification" }).click();
  await expect(toasts(page).filter({ hasText: "Notification 4" })).toBeVisible();
  await expect(toasts(page)).toHaveCount(3);
  await example.getByRole("button", { name: "Clear all" }).click();
  await expect(page.locator(".kappa-toast")).toHaveCount(0);
});

test("overlap expands on hover and keyboard focus without inverting content", async ({ page }) => {
  const example = await ready(page, "stack");
  await example.getByRole("button", { name: "Add six notifications" }).click();
  await expect(toasts(page)).toHaveCount(3);
  const sibling = toasts(page).last();
  await settled(sibling);
  expect(Number(await sibling.evaluate(el => getComputedStyle(el).scale))).toBeGreaterThan(0);
  // A consumer can raise max well above the default of three.
  const originalIndex = await sibling.evaluate(el => {
    const element = el as HTMLElement;
    const index = element.style.getPropertyValue("--index");
    element.style.setProperty("--index", "24");
    return index;
  });
  await expect(sibling).toHaveCSS("scale", "0.5");
  await sibling.evaluate((el, index) => (el as HTMLElement).style.setProperty("--index", index), originalIndex);
  await toasts(page).first().hover();
  await expect(sibling).toHaveAttribute("data-stack", "");
  await expect(sibling.locator(".kappa-toast__body")).toHaveCSS("opacity", "1");
  await page.mouse.move(0, 0);
  await expect(sibling).toHaveAttribute("data-overlap", "");
  await page.keyboard.press("Alt+t");
  await expect(sibling).toHaveAttribute("data-stack", "");
});

test("one through six notifications keep the newest three with consistent peek edges", async ({ page }, testInfo) => {
  const example = await ready(page, "stack");
  for (let number = 1; number <= 6; number++) {
    await example.getByRole("button", { name: "Add notification", exact: true }).click();
    await expect(toasts(page)).toHaveCount(Math.min(number, 3));
    await expect(toasts(page).first().locator('[data-slot="toast-title"]')).toHaveText(`Notification ${number}`);
    await settled(toasts(page).first());
    await settled(toasts(page).last());
    const boxes = await toasts(page).evaluateAll(nodes => nodes.map(el => el.getBoundingClientRect().toJSON()));
    for (let index = 1; index < boxes.length; index++) {
      expect(boxes[index - 1].y - boxes[index].y).toBeCloseTo(8, 0);
      expect(boxes[index].width).toBeLessThan(boxes[index - 1].width);
    }
    const limited = page.locator('.kappa-toast[data-limited]');
    await expect(limited).toHaveCount(Math.max(0, number - 3));
    for (const old of await limited.all()) {
      await expect(old).toHaveAttribute("inert", "");
      await expect(old).toHaveAttribute("aria-hidden", "true");
      await expect(old).toHaveCSS("opacity", "0");
    }
  }
  await page.screenshot({ path: testInfo.outputPath("toast-six-collapsed.png") });
  await toasts(page).first().hover();
  await settled(toasts(page).last());
  await expect(toasts(page).locator('[data-slot="toast-title"]')).toHaveText(["Notification 6", "Notification 5", "Notification 4"]);
  const expanded = await toasts(page).evaluateAll(nodes => nodes.map(el => el.getBoundingClientRect().toJSON()));
  for (let index = 1; index < expanded.length; index++) {
    expect(expanded[index - 1].y - expanded[index].bottom).toBeCloseTo(8, 0);
    const x = expanded[index].x + expanded[index].width / 2;
    const gapY = expanded[index].bottom + 4;
    await page.mouse.move(x, gapY);
    await expect(toasts(page).last()).toHaveAttribute("data-stack", "");
  }
  await page.screenshot({ path: testInfo.outputPath("toast-six-expanded.png") });
  await toasts(page).first().getByRole("button", { name: "Dismiss notification" }).click();
  await expect(toasts(page).locator('[data-slot="toast-title"]')).toHaveText(["Notification 5", "Notification 4", "Notification 3"]);
  await example.getByRole("button", { name: "Clear all" }).click();
  await expect(page.locator(".kappa-toast")).toHaveCount(0);
});

test("a burst with mixed heights expands newest first without overlaps", async ({ page }) => {
  const example = await ready(page, "stack");
  await example.getByRole("button", { name: "Add six notifications" }).click();
  await expect(toasts(page)).toHaveCount(3);
  await settled(toasts(page).first());
  await toasts(page).first().hover();
  await settled(toasts(page).last());
  const boxes = await toasts(page).evaluateAll(nodes => nodes.map(el => el.getBoundingClientRect().toJSON()));
  expect(boxes[0].height).toBeGreaterThan(boxes[1].height);
  expect(boxes[0].y - boxes[1].bottom).toBeCloseTo(8, 0);
  expect(boxes[1].y - boxes[2].bottom).toBeCloseTo(8, 0);
});

test("messages added while the group is hovered or focused join its expanded state", async ({ page }) => {
  const example = await ready(page, "stack");
  const add = example.getByRole("button", { name: "Add notification", exact: true });
  await add.click();
  await toasts(page).first().hover();
  // Simulate an application notification without moving the pointer or focus.
  await add.evaluate(button => (button as HTMLButtonElement).click());
  await expect(toasts(page)).toHaveCount(2);
  await expect(toasts(page).first()).toHaveAttribute("data-stack", "");
  await expect(toasts(page).first()).toHaveAttribute("data-paused", "");
  await page.mouse.move(0, 0);
  await page.keyboard.press("Alt+t");
  await add.evaluate(button => (button as HTMLButtonElement).click());
  await expect(toasts(page)).toHaveCount(3);
  await expect(toasts(page).first()).toHaveAttribute("data-stack", "");
  await expect(page.locator(".kappa-toaster")).toBeFocused();
});

test("custom stacks hide older content and exclude limited actions from keyboard focus", async ({ page }) => {
  const example = await ready(page, "custom");
  for (let number = 0; number < 5; number++) await example.getByRole("button", { name: "Custom content" }).click();
  await expect(toasts(page)).toHaveCount(3);
  await expect(page.locator('.kappa-toast[data-limited]')).toHaveCount(2);
  await expect(toasts(page).last().locator(".toast-demo-custom")).toHaveCSS("opacity", "0");
  await page.keyboard.press("Alt+t");
  for (let index = 0; index < 9; index++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => {
      const root = document.activeElement?.closest(".kappa-toast");
      return Boolean(root && !root.hasAttribute("data-limited"));
    })).toBe(true);
  }
  await expect(toasts(page).last().locator(".toast-demo-custom")).toHaveCSS("opacity", "1");
});

test("top and bottom stacks stay open across gaps in all six placements", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const example = await ready(page, "placement");
  for (const placement of ["top-start", "top", "top-end", "bottom-start", "bottom", "bottom-end"]) {
    for (let index = 0; index < 3; index++) await example.getByRole("button", { name: placement, exact: true }).click();
    await expect(toasts(page)).toHaveCount(3);
    await settled(toasts(page).first());
    await toasts(page).first().hover();
    await expect(toasts(page).last()).toHaveAttribute("data-stack", "");
    await settled(toasts(page).last());
    const boxes = await toasts(page).evaluateAll(nodes => nodes.map(el => el.getBoundingClientRect().toJSON()));
    const top = placement.startsWith("top");
    const gap = top ? boxes[1].y - boxes[0].bottom : boxes[0].y - boxes[1].bottom;
    expect(gap).toBeCloseTo(8, 0);
    const gapY = top ? boxes[0].bottom + 4 : boxes[1].bottom + 4;
    await page.mouse.move(boxes[0].x + boxes[0].width / 2, gapY);
    await expect(toasts(page).last()).toHaveAttribute("data-stack", "");
  }
});

test("pauses duration on hover and keeps persistent messages", async ({ page }) => {
  const example = await ready(page, "duration");
  await page.clock.install();
  await example.getByRole("button", { name: "Two seconds" }).click();
  await expect(toasts(page)).toBeVisible();
  await toasts(page).hover();
  await expect(toasts(page)).toHaveAttribute("data-paused", "");
  await page.clock.fastForward(6000);
  await expect(toasts(page)).toBeVisible();
  await page.mouse.move(0, 0);
  await page.clock.runFor(2400);
  await expect(toasts(page)).toHaveCount(0);
  await expect(example.locator("[data-toast-demo-result]")).toHaveText("unmounted");
  await example.getByRole("button", { name: "Persistent" }).click();
  await expect(toasts(page)).toBeVisible();
  await page.clock.fastForward(60000);
  await expect(toasts(page)).toBeVisible();
});

test("keeps every placement inside a narrow viewport and avoids duplicate region IDs", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const example = await ready(page, "placement");
  for (const placement of ["top-start", "top", "top-end", "bottom-start", "bottom", "bottom-end"]) {
    await example.getByRole("button", { name: placement, exact: true }).click();
    const toast = toasts(page);
    await expect(toast).toHaveAttribute("data-placement", placement);
    await settled(toast);
    const box = (await toast.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(844);
    await expect(page.locator(".kappa-toaster")).toHaveCount(1);
  }
  const ids = await page.locator('[data-scope="toast"][id]').evaluateAll(nodes => nodes.map(node => node.id));
  expect(new Set(ids).size).toBe(ids.length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("uses semantic dark surfaces, logical RTL placement, and reduced motion", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  const example = await ready(page, "rtl");
  await example.getByRole("button").click();
  const toast = toasts(page);
  await settled(toast);
  await expect(toast).toHaveCSS("direction", "rtl");
  expect(parseFloat(await toast.evaluate(el => getComputedStyle(el).transitionDuration))).toBeLessThan(0.001);
  expect((await toast.boundingBox())!.x).toBeCloseTo(16, 0);
  expect(await toast.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe("rgb(255, 255, 255)");
  await page.screenshot({ path: testInfo.outputPath("toast-dark-rtl.png") });
  await page.setViewportSize({ width: 320, height: 640 });
  const box = (await toast.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  await page.screenshot({ path: testInfo.outputPath("toast-mobile-rtl.png") });
});

test("custom parts compose an existing Button and forward accessible labels", async ({ page }) => {
  const example = await ready(page, "custom");
  await example.getByRole("button", { name: "Custom content" }).click();
  const toast = toasts(page);
  await expect(toast.getByRole("button", { name: "Close custom notification" })).toBeVisible();
  const action = toast.getByRole("button", { name: "View project" });
  await expect(action).toHaveClass(/kappa-button/);
  await expect(action).toHaveAttribute("type", "button");
  await expect(toast.locator("button button")).toHaveCount(0);
  await action.click();
  await expect(example.locator("[data-toast-demo-result]")).toHaveText("Project opened");
  await expect(toasts(page)).toHaveCount(0);
});
