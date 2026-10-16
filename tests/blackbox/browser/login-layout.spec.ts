import { test, expect, visitConsumer } from "./fixtures";

test("account actions stay inside an embedded login layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await visitConsumer(page, "/test-consumer/login-layout");
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().map(animation => animation.finished));
  });
  const account = page.getByRole("region", { name: "Account", exact: true });
  const signIn = account.getByRole("link", { name: "Sign in", exact: true });
  const [container, action] = await Promise.all([account.boundingBox(), signIn.boundingBox()]);
  expect(container).not.toBeNull();
  expect(action).not.toBeNull();
  expect(container!.y).toBe(160);
  expect(container!.width).toBe(800);
  expect(Math.abs(action!.y - container!.y - 28)).toBeLessThanOrEqual(1);
  expect(Math.abs(action!.x + action!.width - container!.x - container!.width + 16))
    .toBeLessThanOrEqual(1);
});
