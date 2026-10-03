import { expect, type Locator, type Page, test } from "@playwright/test";

const clickAndWaitForScroll = async (page: Page, link: Locator) => {
  await page.evaluate(() => {
    document.documentElement.dataset.tocScrollEnded = "false";
    window.addEventListener("scrollend", () => {
      document.documentElement.dataset.tocScrollEnded = "true";
    }, { once: true });
  });
  await link.click();
  await expect(page.locator("html")).toHaveAttribute("data-toc-scroll-ended", "true");
};

const expectActiveIndicator = async (toc: Locator, link: Locator) => {
  await expect(toc.locator('a[aria-current="location"]')).toHaveCount(1);
  await expect(link).toHaveAttribute("aria-current", "location");
  await expect(toc.locator('[data-part="indicator"]')).toBeVisible();
  await expect.poll(() => link.evaluate((element) => {
    const indicator = element.closest('[data-part="root"]')!
      .querySelector('[data-part="indicator"]')!;
    const linkRect = element.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();
    return Math.max(
      Math.abs(indicatorRect.top - linkRect.top),
      Math.abs(indicatorRect.height - linkRect.height),
    );
  })).toBeLessThan(1);
};

for (const { path, labels } of [
  { path: "/", labels: ["Principles", "Start building", "Choose a layer", "Why Kappa"] },
  { path: "/docs/installation", labels: ["Install Package", "Styles and Theme", "Next Steps", "Requirements"] },
  { path: "/docs/components/button", labels: ["Barrel", "Granular", "Usage", "Installation"] },
  { path: "/docs/components/table-of-contents", labels: ["Barrel", "Granular", "Composition", "Nested depth", "Scroll tracking", "Events", "Exports", "Installation"] },
]) {
  test(`moves the docs TOC indicator to each clicked item on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(path);
    const toc = page.locator(".docs-page-toc__component");
    await expect(toc).toBeVisible();

    for (const label of labels) {
      const link = toc.getByRole("link", { name: label, exact: true });
      const href = await link.getAttribute("href");
      await link.click();
      await expect.poll(() => page.evaluate((hash) => {
        const target = document.getElementById(hash!.slice(1))!;
        const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop);
        const expectedY = Math.min(
          document.documentElement.scrollHeight - innerHeight,
          Math.max(0, target.getBoundingClientRect().top + scrollY - margin),
        );
        return Math.abs(scrollY - expectedY);
      }, href)).toBeLessThan(2);
      await expectActiveIndicator(toc, link);
    }
  });
}

test("tracks manual scrolling after TOC navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/button");
  const toc = page.locator(".docs-page-toc__component");
  const barrel = toc.getByRole("link", { name: "Barrel", exact: true });
  await clickAndWaitForScroll(page, barrel);
  await expectActiveIndicator(toc, barrel);

  await page.evaluate(() => window.scrollTo({ top: document.getElementById("sizes")!.getBoundingClientRect().top + scrollY - 80, behavior: "instant" }));
  await expectActiveIndicator(toc, toc.getByRole("link", { name: "Sizes", exact: true }));
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 120);
  await expect.poll(() => page.locator("#sizes").evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(0);
  await expectActiveIndicator(toc, toc.getByRole("link", { name: "Sizes", exact: true }));
  for (let step = 0; step < 4; step += 1) {
    const previousY = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 120);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(previousY);
  }
  await expectActiveIndicator(toc, toc.getByRole("link", { name: "With Icons", exact: true }));
  for (let step = 0; step < 18; step += 1) {
    await page.evaluate(() => {
      document.documentElement.dataset.tocScrollEnded = "false";
      window.addEventListener("scrollend", () => {
        document.documentElement.dataset.tocScrollEnded = "true";
      }, { once: true });
    });
    await page.mouse.wheel(0, -20);
    await expect(page.locator("html")).toHaveAttribute("data-toc-scroll-ended", "true");
  }
  await expectActiveIndicator(toc, toc.getByRole("link", { name: "Sizes", exact: true }));
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await expectActiveIndicator(toc, toc.getByRole("link", { name: "Exports", exact: true }));
});

test("restores the active section with browser history", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/button");
  const toc = page.locator(".docs-page-toc__component");
  await clickAndWaitForScroll(page, toc.getByRole("link", { name: "Barrel", exact: true }));
  await page.evaluate(() => window.scrollTo({ top: document.getElementById("sizes")!.getBoundingClientRect().top + scrollY - 80, behavior: "instant" }));
  await expectActiveIndicator(toc, toc.getByRole("link", { name: "Sizes", exact: true }));
  await clickAndWaitForScroll(page, toc.getByRole("link", { name: "Granular", exact: true }));
  await page.goBack();
  await expect(page).toHaveURL(/#barrel$/);
  await expectActiveIndicator(toc, toc.getByRole("link", { name: "Sizes", exact: true }));
});

test("keeps a deep link active at the page end with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/#start-building");
  const toc = page.locator(".docs-page-toc__component");
  const start = toc.getByRole("link", { name: "Start building", exact: true });
  await expectActiveIndicator(toc, start);
  await toc.getByRole("link", { name: "Why Kappa", exact: true }).click();
  await clickAndWaitForScroll(page, start);
  await expectActiveIndicator(toc, start);
});

test("tracks sections after soft navigation to another docs page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/docs/components/button");
  await page.locator(".docs-sidebar-panel--desktop").getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/?$/);
  const toc = page.locator(".docs-page-toc__component");
  await clickAndWaitForScroll(page, toc.getByRole("link", { name: "Principles", exact: true }));
  await expectActiveIndicator(toc, toc.getByRole("link", { name: "Principles", exact: true }));
});
