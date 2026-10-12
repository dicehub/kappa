import { test, expect, visitConsumer } from "./fixtures";

test("default tooltip delays prevent brief hovers from flashing content", async ({ page }) => {
  await visitConsumer(page, "/docs/components/tooltip");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const trigger = page.locator('[data-tooltip-demo="preview"]').getByRole("button", { name: "Add item" });
  await trigger.scrollIntoViewIfNeeded();
  const now = new Date();
  await page.clock.install({ time: now });
  await page.clock.pauseAt(new Date(now.getTime() + 60_000));
  const tooltip = page.getByRole("tooltip", { name: "Add item" });
  await trigger.hover();
  await page.clock.runFor(399);
  await expect(tooltip).toHaveCount(0);
  await page.mouse.move(2, 2);
  await page.clock.runFor(1_000);
  await expect(tooltip).toHaveCount(0);
  await trigger.hover();
  await page.clock.runFor(400);
  await expect(tooltip).toBeVisible();
  await page.mouse.move(2, 2);
  await page.clock.runFor(149);
  await expect(tooltip).toBeVisible();
  await page.clock.runFor(1);
  await expect(tooltip).toBeHidden();
});
