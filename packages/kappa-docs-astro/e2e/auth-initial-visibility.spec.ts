import { expect, test } from "@playwright/test";

type AuthPaint = { frames: { opacity: string; transform: string }[]; lcpEntries: number };
declare global {
  interface Window { __kappaAuthPaint: AuthPaint }
}

const routes = [
  { path: "/docs/blocks/login", count: 6 },
  { path: "/docs/blocks/signup", count: 5 },
  ...["simple", "split", "panel", "media-card", "email-only", "neutral-background"]
    .map(variant => ({ path: `/examples/login/${variant}`, count: 1 })),
  ...["complete", "split", "panel", "media-card", "email-only"]
    .map(variant => ({ path: `/examples/signup/${variant}`, count: 1 })),
];

for (const display of [
  { name: "desktop light", viewport: { width: 1440, height: 1000 }, theme: "light" },
  { name: "mobile dark", viewport: { width: 320, height: 844 }, theme: "dark" },
]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`auth content is visible on its first frame: ${display.name}, ${motion}`, async ({ page }) => {
      await page.setViewportSize(display.viewport);
      await page.emulateMedia({ reducedMotion: motion });
      await page.addInitScript(theme => {
        localStorage.setItem("theme", theme);
        const state: AuthPaint = { frames: [], lcpEntries: 0 };
        window.__kappaAuthPaint = state;
        const seen = new WeakSet<Element>();
        const record = () => {
          for (const frame of document.querySelectorAll('[data-slot="login-layout-frame"]')) {
            if (seen.has(frame)) continue;
            seen.add(frame);
            const style = getComputedStyle(frame);
            state.frames.push({ opacity: style.opacity, transform: style.transform });
          }
        };
        const observer = new MutationObserver(() => requestAnimationFrame(record));
        observer.observe(document, { childList: true, subtree: true });
        addEventListener("load", () => requestAnimationFrame(() => {
          record();
          observer.disconnect();
        }), { once: true });
        new PerformanceObserver(list => {
          state.lcpEntries += list.getEntries().length;
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }, display.theme);

      for (const route of routes) {
        await test.step(route.path, async () => {
          await page.goto(route.path);
          await expect(page.locator('[data-slot="login-layout-frame"]')).toHaveCount(route.count);
          await expect.poll(() => page.evaluate(() => window.__kappaAuthPaint.frames.length))
            .toBeGreaterThanOrEqual(route.count);
          const frames = await page.evaluate(() => window.__kappaAuthPaint.frames);
          for (const frame of frames) expect(frame).toEqual({ opacity: "1", transform: "none" });
          if (route.path.startsWith("/examples/")) {
            await expect.poll(() => page.evaluate(() => window.__kappaAuthPaint.lcpEntries))
              .toBeGreaterThan(0);
          }
        });
      }
    });
  }
}
