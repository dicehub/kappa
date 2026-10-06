import { expect, type Page } from "@playwright/test";

export async function expectSearchPanelMotion(page: Page, animationName: string, activate: () => Promise<unknown>, closing = false) {
  await page.evaluate(name => {
    delete document.documentElement.dataset.kappaTestSearchMotion;
    const capture = (event: AnimationEvent) => {
      if (event.animationName !== name) return;
      document.removeEventListener("animationstart", capture, true);
      const node = event.target as HTMLElement;
      const animation = node.getAnimations().find(animation =>
        animation instanceof CSSAnimation && animation.animationName === name,
      );
      if (!animation) throw new Error(`Missing ${name} animation`);
      animation.pause();
      const frames = [0, 100, 199.999].map(time => {
        animation.currentTime = time;
        const bounds = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return { width: bounds.width, center: bounds.x + bounds.width / 2, top: bounds.y, opacity: Number(style.opacity) };
      });
      document.documentElement.dataset.kappaTestSearchMotion = JSON.stringify(frames);
      animation.finish();
    };
    document.addEventListener("animationstart", capture, true);
  }, animationName);
  await activate();
  await page.waitForFunction(() => document.documentElement.dataset.kappaTestSearchMotion !== undefined);
  const frames = await page.evaluate(() => {
    const frames = JSON.parse(document.documentElement.dataset.kappaTestSearchMotion!) as Array<{ width: number; center: number; top: number; opacity: number }>;
    delete document.documentElement.dataset.kappaTestSearchMotion;
    return frames;
  });
  const [start, middle, end] = frames;
  const small = closing ? end : start;
  const large = closing ? start : end;
  expect(small.width / large.width).toBeCloseTo(0.8, 3);
  expect(middle.width).toBeGreaterThan(small.width);
  expect(middle.width).toBeLessThan(large.width);
  expect(small.opacity).toBeCloseTo(0, 3);
  expect(large.opacity).toBeCloseTo(1, 3);
  expect(middle.opacity).toBeGreaterThan(0);
  expect(middle.opacity).toBeLessThan(1);
  for (const frame of frames) {
    expect(frame.center).toBeCloseTo(large.center, 1);
    expect(frame.top).toBeCloseTo(4, 1);
  }
}
