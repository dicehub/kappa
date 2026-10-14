import type { Locator, Page } from "@playwright/test";
import { test, expect, visitConsumer } from "./fixtures";

async function sandboxedDocs(page: Page) {
  await visitConsumer(page, "/test-consumer/number-input-sandbox");
  const docs = page.frameLocator('iframe[title="Number input documentation"]');
  await expect(docs.locator("astro-island[ssr]")).toHaveCount(0);
  await expect(docs.locator('[data-number-input-demo="compact-use"]')).toBeVisible();
  return docs;
}

async function beginDrag(page: Page, surface: Locator) {
  await surface.scrollIntoViewIfNeeded();
  const box = (await surface.boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x + 9, y);
  await expect(surface).not.toHaveAttribute("data-dragging", "");
  await page.mouse.move(x + 10, y);
  await expect(surface).not.toHaveAttribute("data-dragging", "");
  await page.mouse.move(x + 11, y);
  await expect(surface).toHaveAttribute("data-dragging", "");
  return { x, y };
}

const numeric = async (field: Locator) => Number((await field.inputValue()).replace(/[^\d,.-]/g, "").replace(",", "."));

async function finishDrag(page: Page) {
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => document.pointerLockElement === null)).toBe(true);
}

test("sandboxed scrubbing preserves standard modifiers, editing and Escape rollback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const docs = await sandboxedDocs(page);
  const scope = docs.locator('[data-number-input-demo="scrubbable"]');
  const field = scope.getByRole("spinbutton", { name: "Under-relaxation factor", exact: true });
  const surface = scope.locator('[data-slot="number-input-scrubbable-input"]').first();
  const display = surface.locator('[data-slot="number-input-scrubbable-display"]');
  await expect(display).toBeVisible();
  const originalBackground = await surface.evaluate(element => getComputedStyle(element).backgroundColor);
  const setValue = async () => {
    await surface.click();
    await expect(field).toBeFocused();
    await expect(surface).toHaveAttribute("data-editing", "");
    await expect(display).toBeHidden();
    await expect(field).toHaveJSProperty("selectionStart", 0);
    await expect(field).toHaveJSProperty("selectionEnd", 5);
    await expect.poll(() => surface.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(originalBackground);
    await field.fill("0.350"); await field.press("Enter");
    await docs.getByRole("heading", { level: 3, name: "Scrubbable Input" }).click();
    await expect(surface).not.toHaveAttribute("data-editing", "");
    await expect(display).toBeVisible();
  };
  const deltas: number[] = [];
  for (const modifier of [null, "Control", "Shift"] as const) {
    await setValue();
    if (modifier) await page.keyboard.down(modifier);
    const { x, y } = await beginDrag(page, surface);
    await page.mouse.move(x + 40, y);
    await expect.poll(() => numeric(field)).toBeGreaterThan(0.35);
    deltas.push(await numeric(field) - 0.35);
    await finishDrag(page);
    if (modifier) await page.keyboard.up(modifier);
  }
  expect(deltas[1]).toBeGreaterThan(0);
  expect(deltas[1]).toBeLessThan(deltas[0]);
  expect(deltas[2]).toBeGreaterThan(deltas[0]);
  await setValue();
  const { x, y } = await beginDrag(page, surface);
  await page.mouse.move(x + 40, y);
  await expect.poll(() => numeric(field)).not.toBe(0.35);
  await page.keyboard.press("Escape");
  await expect.poll(() => numeric(field)).toBe(0.35);
  await expect(surface).not.toHaveAttribute("data-dragging", "");
  await page.mouse.move(x + 80, y);
  await expect.poll(() => numeric(field)).toBe(0.35);
  await finishDrag(page);
});

test("compact sensitivity keeps its documented multiplier precedence when the browser denies pointer lock", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const docs = await sandboxedDocs(page);
  const scope = docs.locator('[data-number-input-demo="compact-use"]');
  const field = scope.getByRole("spinbutton", { name: "Value", exact: true });
  const surface = scope.locator('[data-slot="number-input-scrubbable-input"]');
  const cases = [[], ["Shift"], ["Alt"], ["Control"], ["Shift", "Alt"], ["Control", "Shift", "Alt"]] as const;
  const changes: number[] = [];
  for (const keys of cases) {
    await surface.click(); await field.fill("2"); await field.press("Enter");
    for (const key of keys) await page.keyboard.down(key);
    const { x, y } = await beginDrag(page, surface);
    await page.mouse.move(x + 21, y);
    await expect.poll(() => numeric(field)).toBeGreaterThan(2);
    changes.push(await numeric(field) - 2);
    await finishDrag(page);
    for (const key of keys) await page.keyboard.up(key);
  }
  for (const [index, expected] of [10, 0.2, 100, 1000, 0.2, 1000].entries()) expect(changes[index]).toBeCloseTo(expected, 5);
  const { x, y } = await beginDrag(page, surface);
  await page.mouse.move(x + 21, y);
  await expect(field).toHaveValue("1012");
  await page.keyboard.press("Escape");
  await expect(surface).not.toHaveAttribute("data-dragging", "");
  await expect(field).toHaveValue("1002");
  await page.mouse.move(x + 31, y);
  await expect(field).toHaveValue("1002");
  await finishDrag(page);
});

test("a short movement followed by release opens the selected editor", async ({ page }) => {
  const docs = await sandboxedDocs(page);
  const scope = docs.locator('[data-number-input-demo="scrubbable"]');
  const field = scope.getByRole("spinbutton", { name: "Under-relaxation factor", exact: true });
  const surface = scope.locator('[data-slot="number-input-scrubbable-input"]').first();
  await surface.scrollIntoViewIfNeeded();
  const box = (await surface.boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 5, y);
  await expect(surface).not.toHaveAttribute("data-dragging", "");
  await page.mouse.up();
  await expect(field).toBeFocused();
  await expect(surface).toHaveAttribute("data-editing", "");
  await expect(field).toHaveValue("0.350");
  await expect(field).toHaveJSProperty("selectionStart", 0);
  await expect(field).toHaveJSProperty("selectionEnd", 5);
});

test("disabled and read-only whole-field controls refuse dragging while read-only text remains selectable", async ({ page }) => {
  const docs = await sandboxedDocs(page);
  const scope = docs.locator('[data-number-input-demo="scrubbable"]');
  for (const [name, value, attribute] of [["Disabled coefficient", "0.5", "data-disabled"], ["Read-only coefficient", "0.7", "data-readonly"]]) {
    const field = scope.getByRole("spinbutton", { name, exact: true });
    const surface = field.locator("..");
    await expect(surface).toHaveAttribute(attribute, "");
    await surface.scrollIntoViewIfNeeded();
    const box = (await surface.boundingBox())!;
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    await page.mouse.move(x, y); await page.mouse.down();
    await page.mouse.move(x + 40, y); await page.mouse.up();
    await expect(field).toHaveValue(value);
    await expect(surface).not.toHaveAttribute("data-dragging", "");
    if (attribute === "data-readonly") {
      await expect(field).toBeFocused();
      await expect(field).toHaveJSProperty("selectionStart", 0);
      await expect(field).toHaveJSProperty("selectionEnd", 3);
    }
  }
});

test("the label scrubber moves both ways and a read-only scrubber refuses input", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const docs = await sandboxedDocs(page);
  const scope = docs.locator('[data-number-input-demo="scrubbing"]');
  const field = scope.getByRole("spinbutton", { name: "Under-relaxation factor", exact: true });
  const surface = scope.locator('[data-slot="number-input-scrubber"]');
  const original = await numeric(field);
  await surface.scrollIntoViewIfNeeded();
  let box = (await surface.boundingBox())!;
  await page.mouse.move(box.x + 10, box.y + box.height / 2); await page.mouse.down();
  await expect(surface).toHaveAttribute("data-scrubbing", "");
  await page.mouse.move(box.x + 50, box.y + box.height / 2, { steps: 5 });
  await expect.poll(() => numeric(field)).toBeGreaterThan(original);
  await finishDrag(page);
  const increased = await numeric(field);
  box = (await surface.boundingBox())!;
  await page.mouse.move(box.x + 10, box.y + box.height / 2); await page.mouse.down();
  await expect(surface).toHaveAttribute("data-scrubbing", "");
  await page.mouse.move(box.x - 60, box.y + box.height / 2, { steps: 5 });
  await expect.poll(() => numeric(field)).toBeLessThan(increased);
  await finishDrag(page);
  const readOnly = docs.locator('[data-number-input-demo="states"]').getByRole("spinbutton", { name: "Read-only partitions", exact: true });
  const disabledSurface = docs.locator('[data-number-input-demo="states"] [data-slot="number-input-scrubber"]');
  await disabledSurface.scrollIntoViewIfNeeded();
  box = (await disabledSurface.boundingBox())!;
  await page.mouse.move(box.x + 4, box.y + 4); await page.mouse.down();
  await page.mouse.move(box.x + 60, box.y + 4, { steps: 5 }); await page.mouse.up();
  await expect(readOnly).toHaveValue("24");
  expect(await page.evaluate(() => document.pointerLockElement)).toBeNull();
});
