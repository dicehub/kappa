import { test as base, expect, type Browser, type BrowserContext, type BrowserContextOptions } from "@playwright/test";
export * from "@playwright/test";

const violations = new Map<string, string[]>();
async function isolate(context: BrowserContext, blocked: string[], ownedOrigins: string[] = []) {
  for (const origin of ownedOrigins) {
    const url = new URL(origin);
    if (url.protocol !== "http:" || url.hostname !== "127.0.0.1" || url.username || url.password) {
      throw new Error("An extra browser origin must be an owned loopback HTTP server.");
    }
  }
  const origins = new Set([process.env.PLAYWRIGHT_BASE_URL, process.env.KAPPA_BLACKBOX_SERVICE, ...ownedOrigins].filter(Boolean));
  await context.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (["data:", "blob:", "about:"].includes(url.protocol) || origins.has(url.origin)) return route.continue();
    if (url.origin === "https://tiles.openfreemap.org" && url.pathname === "/styles/liberty") {
      // Real MapLibre loads a valid provider style; geography is synthetic.
      return route.fulfill({ contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({
        version: 8, sources: {}, layers: [{ id: "background", type: "background", paint: { "background-color": "#fbfbfb" } }],
      }) });
    }
    blocked.push(`${route.request().method()} ${url.href}`);
    await route.abort("blockedbyclient");
  });
}

export const test = base.extend<{ networkBoundary: void }>({
  networkBoundary: [async ({ context }, use, info) => {
    const blocked: string[] = [];
    violations.set(info.testId, blocked);
    try { await isolate(context, blocked); await use(); expect(blocked, "Unlisted external browser requests").toEqual([]); }
    finally { violations.delete(info.testId); }
  }, { auto: true }],
});

export async function networkContext(browser: Browser, options: BrowserContextOptions, ownedOrigins: string[] = []) {
  const blocked = violations.get(test.info().testId);
  if (!blocked) throw new Error("Extra browser context needs an active network boundary.");
  const context = await browser.newContext({ ...options, serviceWorkers: "block" });
  await isolate(context, blocked, ownedOrigins);
  return context;
}
