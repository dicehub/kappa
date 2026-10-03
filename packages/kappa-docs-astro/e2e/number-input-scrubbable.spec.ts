import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page) => page.locator('[data-number-input-demo="scrubbable"]');
const input = (scope: Locator, name: string) =>
  scope.getByRole("spinbutton", { name, exact: true });
const numericValue = async (field: Locator) =>
  Number.parseFloat((await field.inputValue()).replace(/[^\d,.-]/g, "").replace(",", "."));

type PointerLockTestWindow = Window & {
  __delayPointerLock?: boolean;
  __pointerLockExits?: number;
  __pointerLockRequests?: number;
  __resolvePointerLock?: () => void;
};

const installPointerLockStub = async (page: Page) => {
  await page.evaluate(() => {
    const browserWindow = window as PointerLockTestWindow;
    let lockedElement: Element | null = null;
    browserWindow.__delayPointerLock = false;
    browserWindow.__pointerLockExits = 0;
    browserWindow.__pointerLockRequests = 0;
    Object.defineProperty(document, "pointerLockElement", {
      configurable: true,
      get: () => lockedElement,
    });
    Object.defineProperty(HTMLElement.prototype, "requestPointerLock", {
      configurable: true,
      value(this: HTMLElement) {
        browserWindow.__pointerLockRequests = (browserWindow.__pointerLockRequests ?? 0) + 1;
        const acquire = () => {
          lockedElement = this;
          document.dispatchEvent(new Event("pointerlockchange"));
        };
        if (!browserWindow.__delayPointerLock) {
          queueMicrotask(acquire);
          return Promise.resolve();
        }
        return new Promise<void>((resolve) => {
          browserWindow.__resolvePointerLock = () => {
            acquire();
            browserWindow.__resolvePointerLock = undefined;
            resolve();
          };
        });
      },
    });
    Object.defineProperty(document, "exitPointerLock", {
      configurable: true,
      value() {
        lockedElement = null;
        browserWindow.__pointerLockExits = (browserWindow.__pointerLockExits ?? 0) + 1;
        document.dispatchEvent(new Event("pointerlockchange"));
      },
    });
  });
};

const dragBy = async (
  page: Page,
  target: Locator,
  deltaX: number,
  modifier?: "Alt" | "Control" | "Shift",
) => {
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  const x = box!.x + box!.width / 2;
  const y = box!.y + box!.height / 2;
  if (modifier) await page.keyboard.down(modifier);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + Math.sign(deltaX) * 11, y);
  await page.mouse.move(x + deltaX, y);
  await page.mouse.up();
  if (modifier) await page.keyboard.up(modifier);
};

test("composes decrement and increment triggers around a scrubbable field", async ({ page }) => {
  await page.goto("/docs/components/number-input");
  const scope = demo(page);
  const field = input(scope, "Clipping plane offset (mm)");
  const decrement = scope.getByRole("button", { name: "Decrease clipping plane offset" });
  const increment = scope.getByRole("button", { name: "Increase clipping plane offset" });
  const control = field.locator("xpath=ancestor::*[@data-slot='number-input-control']");
  const parts = control.locator(":scope > [data-slot]");

  await expect(parts).toHaveCount(3);
  const partSlots = await parts.evaluateAll((elements) =>
    elements.map((element) => element.dataset.slot),
  );
  expect(partSlots).toEqual([
    "number-input-decrement-trigger",
    "number-input-scrubbable-input",
    "number-input-increment-trigger",
  ]);
  await expect(field).toHaveValue("12.5");
  const scrubbable = control.locator('[data-slot="number-input-scrubbable-input"]');
  await expect(scrubbable).not.toHaveAttribute("data-editing", "");

  await decrement.click();
  await expect(field).toHaveValue("12.0");
  await expect(field).not.toBeFocused();
  await expect(scrubbable).not.toHaveAttribute("data-editing", "");
  await increment.click();
  await expect(field).toHaveValue("12.5");
  await expect(field).not.toBeFocused();
  await expect(scrubbable).not.toHaveAttribute("data-editing", "");

  await scrubbable.click();
  await expect(field).toBeFocused();
  await expect(scrubbable).toHaveAttribute("data-editing", "");
  await expect(scrubbable).toHaveAttribute("data-edit-alignment", "center");
  await expect(field).toHaveCSS("text-align", "center");
  const surfaceState = () =>
    scrubbable.evaluate((element) => {
      const controlElement = element.closest('[data-slot="number-input-control"]');
      return {
        hovered: element.matches(":hover"),
        matchesControl:
          getComputedStyle(element).backgroundColor ===
          (controlElement ? getComputedStyle(controlElement).backgroundColor : null),
      };
    });
  await expect.poll(surfaceState).toEqual({ hovered: true, matchesControl: true });

  await field.evaluate((element) => element.blur());
  await expect(field).not.toBeFocused();
  await expect(scrubbable).not.toHaveAttribute("data-editing", "");
  await expect(scrubbable.locator('[data-slot="number-input-scrubbable-display"]')).toBeVisible();
  await expect.poll(surfaceState).toEqual({ hovered: true, matchesControl: false });

  await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  await scrubbable.click();
  await expect(field).toBeFocused();
  await expect.poll(surfaceState).toEqual({ hovered: true, matchesControl: true });
});

test("supports whole-field editing, scrubbing, modifiers, rollback, and cleanup", async ({
  page,
}) => {
  await page.goto("/docs/components/number-input");
  const scope = demo(page);
  const field = input(scope, "Under-relaxation factor");
  const scrubbable = scope.locator('[data-slot="number-input-scrubbable-input"]').first();
  const display = scrubbable.locator('[data-slot="number-input-scrubbable-display"]');
  await installPointerLockStub(page);

  await expect(scrubbable).not.toHaveAttribute("data-editing", "");
  await expect(display).toBeVisible();
  const blurredBackground = await scrubbable.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await scrubbable.click();
  await expect(field).toBeFocused();
  await expect(scrubbable).toHaveAttribute("data-editing", "");
  await expect(display).toBeHidden();
  await expect
    .poll(() => scrubbable.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe(blurredBackground);
  await expect
    .poll(() =>
      field.evaluate((element) => ({
        end: (element as HTMLInputElement).selectionEnd,
        length: (element as HTMLInputElement).value.length,
        start: (element as HTMLInputElement).selectionStart,
      })),
    )
    .toEqual({ start: 0, end: 5, length: 5 });

  await page.getByRole("heading", { level: 3, name: "Scrubbable Input" }).click();
  await expect(field).not.toBeFocused();
  await expect(scrubbable).not.toHaveAttribute("data-editing", "");
  await expect(display).toBeVisible();

  const clickBox = await scrubbable.boundingBox();
  expect(clickBox).not.toBeNull();
  const clickX = clickBox!.x + clickBox!.width / 2;
  const clickY = clickBox!.y + clickBox!.height / 2;
  await page.mouse.move(clickX, clickY);
  await page.mouse.down();
  await page.mouse.move(clickX + 5, clickY);
  await expect(scrubbable).not.toHaveAttribute("data-dragging", "");
  await page.mouse.up();
  await expect(field).toBeFocused();

  const setValue = async (value: string) => {
    await field.fill(value);
    await field.press("Enter");
    await page.getByRole("heading", { level: 3, name: "Scrubbable Input" }).click();
    await expect(display).toBeVisible();
  };

  await setValue("0.350");
  const start = await numericValue(field);
  await dragBy(page, scrubbable, 40);
  const normalDelta = (await numericValue(field)) - start;
  expect(normalDelta).toBeGreaterThan(0);

  await scrubbable.click();
  await setValue("0.350");
  await dragBy(page, scrubbable, 40, "Control");
  const fineDelta = (await numericValue(field)) - start;
  expect(fineDelta).toBeGreaterThan(0);
  expect(fineDelta).toBeLessThan(normalDelta);

  await scrubbable.click();
  await setValue("0.350");
  await dragBy(page, scrubbable, 40, "Shift");
  expect((await numericValue(field)) - start).toBeGreaterThan(normalDelta);

  await scrubbable.click();
  await setValue("0.350");
  const escapeBox = await scrubbable.boundingBox();
  expect(escapeBox).not.toBeNull();
  const escapeX = escapeBox!.x + escapeBox!.width / 2;
  const escapeY = escapeBox!.y + escapeBox!.height / 2;
  await page.mouse.move(escapeX, escapeY);
  await page.mouse.down();
  await page.mouse.move(escapeX + 11, escapeY);
  await expect(scrubbable).toHaveAttribute("data-dragging", "");
  await page.mouse.move(escapeX + 40, escapeY);
  await expect.poll(() => numericValue(field)).not.toBe(start);
  await page.keyboard.press("Escape");
  await expect.poll(() => numericValue(field)).toBe(start);
  await expect(scrubbable).not.toHaveAttribute("data-dragging", "");
  await page.mouse.up();

  await scrubbable.click();
  await setValue("0.350");
  const unlockBox = await scrubbable.boundingBox();
  expect(unlockBox).not.toBeNull();
  const unlockX = unlockBox!.x + unlockBox!.width / 2;
  const unlockY = unlockBox!.y + unlockBox!.height / 2;
  await page.mouse.move(unlockX, unlockY);
  await page.mouse.down();
  await page.mouse.move(unlockX + 11, unlockY);
  await expect(scrubbable).toHaveAttribute("data-dragging", "");
  await expect
    .poll(() =>
      page.evaluate(() => document.pointerLockElement?.getAttribute("data-slot") ?? null),
    )
    .toBe("number-input-scrubbable-input");
  await page.mouse.move(unlockX + 40, unlockY);
  await expect.poll(() => numericValue(field)).not.toBe(start);
  await page.evaluate(() => document.exitPointerLock());
  await expect.poll(() => numericValue(field)).toBe(start);
  await expect(scrubbable).not.toHaveAttribute("data-dragging", "");
  await page.mouse.up();

  await scrubbable.click();
  await setValue("0.350");
  await page.evaluate(() => {
    (window as PointerLockTestWindow).__delayPointerLock = true;
  });
  const delayedBox = await scrubbable.boundingBox();
  expect(delayedBox).not.toBeNull();
  const delayedX = delayedBox!.x + delayedBox!.width / 2;
  const delayedY = delayedBox!.y + delayedBox!.height / 2;
  await page.mouse.move(delayedX, delayedY);
  await page.mouse.down();
  await page.mouse.move(delayedX + 11, delayedY);
  await expect(scrubbable).toHaveAttribute("data-dragging", "");
  await page.mouse.move(delayedX + 40, delayedY);
  await page.mouse.up();
  const pendingRequestCount = await page.evaluate(
    () => (window as PointerLockTestWindow).__pointerLockRequests ?? 0,
  );
  await dragBy(page, scrubbable, 30);
  await expect
    .poll(() =>
      page.evaluate(() => (window as PointerLockTestWindow).__pointerLockRequests ?? 0),
    )
    .toBe(pendingRequestCount);
  await page.evaluate(() => {
    (window as PointerLockTestWindow).__resolvePointerLock?.();
  });
  await expect.poll(() => page.evaluate(() => document.pointerLockElement === null)).toBe(true);
  await expect
    .poll(() =>
      page.evaluate(() => (window as PointerLockTestWindow).__pointerLockExits ?? 0),
    )
    .toBeGreaterThan(0);
  await page.evaluate(() => {
    (window as PointerLockTestWindow).__delayPointerLock = false;
  });
  await expect
    .poll(() =>
      page.evaluate(() => (window as PointerLockTestWindow).__pointerLockRequests),
    )
    .toBeGreaterThanOrEqual(6);

  for (const [name, expected, stateAttribute] of [
    ["Disabled coefficient", 0.5, "data-disabled"],
    ["Read-only coefficient", 0.7, "data-readonly"],
  ] as const) {
    const safeField = input(scope, name);
    const safeTarget = safeField.locator("xpath=..");
    await expect(safeTarget).toHaveAttribute(stateAttribute, "");
    await dragBy(page, safeTarget, 40);
    await expect.poll(() => numericValue(safeField)).toBe(expected);
    if (name === "Read-only coefficient") {
      await expect(safeField).toBeFocused();
      await expect
        .poll(() =>
          safeField.evaluate((element) => ({
            end: (element as HTMLInputElement).selectionEnd,
            length: (element as HTMLInputElement).value.length,
            start: (element as HTMLInputElement).selectionStart,
          })),
        )
        .toEqual({ start: 0, end: 3, length: 3 });
    }
  }
});
