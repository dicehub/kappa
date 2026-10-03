import { expect, test, type Page } from "@playwright/test";

const demo = (page: Page) => page.locator('[data-number-input-demo="compact-use"]');
const field = (page: Page, label = "Value") => demo(page).getByRole("spinbutton", { name: label, exact: true });
const row = (page: Page, label = "Value") => field(page, label).locator('xpath=ancestor::*[contains(@class,"kappa-compact-number-row")]');
const surface = (page: Page, label = "Value") => row(page, label).locator('[data-slot="number-input-scrubbable-input"]');

test.beforeEach(async ({ page }) => {
  // Test field interactions, not the docs shell's animated anchor scrolling.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/number-input");
  await expect.poll(() => demo(page).evaluate(el => el.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
  await page.evaluate(() => document.fonts.ready);
  await demo(page).scrollIntoViewIfNeeded();
});

test("shows one simple field with the reference geometry, hover controls, selected editor, and tooltip", async ({ page }) => {
  await expect(demo(page).getByRole("spinbutton")).toHaveCount(1);
  await expect(demo(page).getByRole("heading")).toHaveCount(0);
  await expect(demo(page).getByRole("button", { name: "Reset values" })).toHaveCount(0);
  const control = row(page).locator('[data-slot="number-input-control"]');
  await page.mouse.move(0, 0);
  await expect(control).toHaveCSS("height", "20px");
  await expect(control).toHaveCSS("border-radius", "2px");
  await expect(control).toHaveCSS("background-color", "rgb(235, 235, 235)");
  expect((await control.boundingBox())!.width).toBeCloseTo(180.4, 1);
  await expect(row(page).getByRole("button", { name: "Decrease Value" })).toBeHidden();
  await surface(page).hover();
  await expect(row(page).getByRole("button", { name: "Decrease Value" })).toBeVisible();
  expect((await row(page).getByRole("button", { name: "Decrease Value" }).boundingBox())!.width).toBeCloseTo(16.3, 1);
  await expect(row(page).locator('[data-slot="number-input-label"]')).toHaveCSS("text-align", "end");
  const labelBox = (await row(page).locator('[data-slot="number-input-label"]').boundingBox())!;
  const controlBox = (await control.boundingBox())!;
  expect(Math.abs(labelBox.y + labelBox.height / 2 - controlBox.y - controlBox.height / 2)).toBeLessThan(0.5);
  await expect(page.getByRole("tooltip")).toHaveText("2");
  await surface(page).click();
  await expect(field(page)).toBeFocused();
  await expect(field(page)).toHaveJSProperty("selectionStart", 0);
  await expect(field(page)).toHaveJSProperty("selectionEnd", 1);
  await expect(field(page)).toHaveCSS("text-align", "start");
  await expect(field(page)).toHaveCSS("padding-inline-start", "3px");
  await expect(row(page).getByRole("button", { name: "Increase Value" })).toBeHidden();
});

test("commits drafts, accepts decimals, and clamps the value", async ({ page }) => {
  await surface(page).click();
  await field(page).fill("5");
  await field(page).press("Enter");
  await expect(surface(page)).not.toHaveAttribute("data-editing", "");

  await surface(page).click();
  await field(page).fill("1,5");
  await field(page).press("Escape");
  await expect(field(page)).toHaveValue("1.5");

  await surface(page).click();
  await field(page).fill("");
  await field(page).press("Tab");
  await expect(field(page)).toHaveValue("1.5");
  await field(page).fill("-2");
  await field(page).press("Enter");
  await expect(field(page)).toHaveValue("0");
});

test("uses dicehub drag multipliers and restores the dragged value on Escape", async ({ page }) => {
  await page.evaluate(() => {
    // Exercise the supported capture fallback; no OS pointer-lock timing dependency.
    HTMLElement.prototype.requestPointerLock = () => Promise.reject(new Error("Test capture fallback"));
  });
  for (const [keys, expected] of [
    [[], "12"], [["Shift"], "2.2"], [["Alt"], "102"], [["Control"], "1002"],
    [["Shift", "Alt"], "2.2"], [["Control", "Shift", "Alt"], "1002"],
  ] as const) {
    await surface(page).click();
    await field(page).fill("2");
    await field(page).press("Enter");
    const box = (await surface(page).boundingBox())!;
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    for (const key of keys) await page.keyboard.down(key);
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 9, y);
    await expect(field(page)).toHaveValue("2");
    await page.mouse.move(x + 11, y);
    await page.mouse.move(x + 21, y);
    await expect(field(page)).toHaveValue(expected);
    await page.mouse.up();
    for (const key of keys) await page.keyboard.up(key);
  }
  const box = (await surface(page).boundingBox())!;
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + 50, y);
  await page.mouse.down();
  await page.mouse.move(box.x + 61, y);
  await page.mouse.move(box.x + 71, y);
  await expect(field(page)).toHaveValue("1012");
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await expect(field(page)).toHaveValue("1002");
  await expect(surface(page)).not.toHaveAttribute("data-dragging", "");
});

test("steps on release and repeats after a 400ms hold without leaking a timer", async ({ page }) => {
  const now = new Date();
  await page.clock.install({ time: now });
  // Installation starts the clock. Pause ahead of it, even under parallel load.
  await page.clock.pauseAt(new Date(now.getTime() + 60_000));
  await surface(page).hover();
  const button = row(page).getByRole("button", { name: "Increase Value" });
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.clock.runFor(300);
  await expect(field(page)).toHaveValue("2");
  await page.clock.runFor(200);
  const held = Number(await field(page).inputValue());
  expect(held).toBeGreaterThan(2);
  await page.mouse.up();
  await expect(field(page)).toHaveValue(String(held + 1));
  await page.clock.runFor(1000);
  await expect(field(page)).toHaveValue(String(held + 1));
});

test("shortens long display fractions but preserves the full value", async ({ page }) => {
  await surface(page).click();
  await field(page).fill("1.234567");
  await field(page).press("Enter");
  await expect(row(page).locator('[data-slot="number-input-scrubbable-display"]')).toHaveText("1.2345...");
  await expect(field(page)).toHaveValue("1.234567");
  await page.mouse.move(0, 0);
  await surface(page).hover();
  await expect(page.getByRole("tooltip")).toHaveText("1.234567");
});

test("steps without editing and supports dark mode and mobile width", async ({ page }) => {
  await surface(page).hover();
  await row(page).getByRole("button", { name: "Increase Value" }).click();
  await expect(field(page)).toHaveValue("3");
  await expect(surface(page)).not.toHaveAttribute("data-editing", "");
  await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  await expect(row(page).locator('[data-slot="number-input-control"]')).toHaveCSS("background-color", "rgb(51, 51, 51)");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
