import { test, expect, visitConsumer } from "./fixtures";

test("unmounting Kappa does not break a separate real Ark NumberInput", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/number-input");
  await expect(page.getByRole("spinbutton", { name: "Kappa value", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Unmount Kappa input", exact: true }).click();
  await expect(page.getByRole("spinbutton", { name: "Kappa value", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "increment value", exact: true }).click();
  await expect(page.getByRole("spinbutton", { name: "Ark value", exact: true })).toHaveValue("25");
  await expect(page.getByLabel("Ark model")).toHaveText("25");
});

test("scrubbing uses real pointer lock and releases it on unmount", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/number-input");
  const field = page.getByRole("spinbutton", { name: "Scrub value", exact: true });
  await expect(field).toHaveValue("12.5");
  const surface = field.locator("..");
  const bounds = (await surface.boundingBox())!;
  const x = bounds.x + bounds.width / 2, y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 12, y);
  await expect.poll(() => page.evaluate(() => document.pointerLockElement !== null)).toBe(true);
  await page.mouse.move(x + 30, y);
  await expect(field).not.toHaveValue("12.5");
  await page.getByRole("button", { name: "Unmount Kappa input", exact: true }).evaluate((button: HTMLButtonElement) => button.click());
  await expect.poll(() => page.evaluate(() => document.pointerLockElement === null)).toBe(true);
  await page.mouse.up();
  await expect(page.getByRole("spinbutton", { name: "Ark value", exact: true })).toBeVisible();
});

test("losing real pointer lock restores the starting value and ends the drag", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/number-input");
  const field = page.getByRole("spinbutton", { name: "Scrub value", exact: true });
  const surface = field.locator("..");
  const box = (await surface.boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 11, y);
  await expect.poll(() => page.evaluate(() => document.pointerLockElement !== null)).toBe(true);
  await page.mouse.move(x + 40, y);
  await expect(field).not.toHaveValue("12.5");
  await page.evaluate(() => document.exitPointerLock());
  await expect(field).toHaveValue("12.5");
  await expect(surface).not.toHaveAttribute("data-dragging", "");
  await page.mouse.up();
});
