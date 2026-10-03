import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-meter-demo="${variant}"]`);

const indicatorRatio = async (root: ReturnType<Page["locator"]>) =>
  root.evaluate((meter) => {
    const track = meter.querySelector('[data-slot="meter-track"]');
    const indicator = meter.querySelector('[data-slot="meter-indicator"]');
    if (!(track instanceof HTMLElement) || !(indicator instanceof HTMLElement)) return Number.NaN;
    return Math.round((indicator.getBoundingClientRect().width / track.getBoundingClientRect().width) * 100);
  });

test.describe("Meter documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/meter");
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Meter" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-meter")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/meter"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(6);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Meter", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Menu Bar" })).toHaveAttribute(
      "href",
      "/docs/components/menu-bar",
    );
    await expect(compact.getByRole("link", { name: "Next page: Native Select" })).toHaveAttribute(
      "href",
      "/docs/components/native-select",
    );
    await expect(footer.getByRole("link", { name: "Menu Bar", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Native Select", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Custom Range and Value Text",
      "Sizes",
      "Semantic Tones",
      "Hidden Visual Value",
      "Accessibility",
      "API Reference",
      "Meter",
      "Data Slots",
      "Data Attributes",
      "Exports",
    ]);
    await expect(
      page.locator('.docs-page-header__title-row a[href*="ark-ui.com"]'),
    ).toHaveCount(0);

    const response = await request.get("/docs/components/meter.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Meter");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("MeterProps");
    expect(markdown).not.toContain("View Code");
  });

  test("normalizes the range and exposes complete meter semantics", async ({ page }) => {
    const preview = demo(page, "preview").getByRole("meter", { name: "Storage used" });
    await expect(preview).toHaveAttribute("aria-valuemin", "0");
    await expect(preview).toHaveAttribute("aria-valuemax", "100");
    await expect(preview).toHaveAttribute("aria-valuenow", "65");
    await expect(preview).toHaveAttribute("aria-valuetext", "65%");
    await expect(preview.locator('[data-slot="meter-label"]')).toHaveText("Storage used");
    await expect(preview.locator('[data-slot="meter-value"]')).toHaveText("65%");
    await expect.poll(() => indicatorRatio(preview)).toBe(65);

    const custom = demo(page, "custom-range").getByRole("meter", {
      name: "API request quota",
    });
    await expect(custom).toHaveAttribute("aria-valuemax", "1000");
    await expect(custom).toHaveAttribute("aria-valuenow", "750");
    await expect(custom).toHaveAttribute("aria-valuetext", "750 / 1,000 requests");
    await expect(custom.locator('[data-slot="meter-value"]')).toHaveText(
      "750 / 1,000 requests",
    );
    await expect.poll(() => indicatorRatio(custom)).toBe(75);

    const hidden = demo(page, "hidden-value").getByRole("meter", { name: "Battery charge" });
    await expect(hidden.locator('[data-slot="meter-value"]')).toHaveCount(0);
    await expect(hidden).toHaveAttribute("aria-valuetext", "48%");
  });

  test("supports sizes, explicit tones, themes, motion, RTL, and mobile width", async ({ page }) => {
    const sizeMeters = demo(page, "sizes").locator(".kappa-meter");
    await expect(sizeMeters).toHaveCount(3);
    await expect(sizeMeters.nth(0)).toHaveAttribute("data-size", "sm");
    await expect(sizeMeters.nth(1)).toHaveAttribute("data-size", "base");
    await expect(sizeMeters.nth(2)).toHaveAttribute("data-size", "lg");
    const trackHeights = await sizeMeters.evaluateAll((meters) =>
      meters.map((meter) =>
        Math.round(
          meter.querySelector('[data-slot="meter-track"]')?.getBoundingClientRect().height ?? 0,
        ),
      ),
    );
    expect(trackHeights).toEqual([4, 6, 8]);

    const toneMeters = demo(page, "tones").locator(".kappa-meter");
    await expect(toneMeters).toHaveCount(5);
    for (const [index, tone] of ["accent", "neutral", "success", "warning", "danger"].entries()) {
      await expect(toneMeters.nth(index)).toHaveAttribute("data-tone", tone);
    }

    const previewTrack = demo(page, "preview").locator('[data-slot="meter-track"]');
    const lightTrack = await previewTrack.evaluate((element) => getComputedStyle(element).backgroundColor);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => previewTrack.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(lightTrack);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const previewIndicator = demo(page, "preview").locator('[data-slot="meter-indicator"]');
    await expect
      .poll(() =>
        previewIndicator.evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).transitionDuration),
        ),
      )
      .toBeLessThanOrEqual(0.00001);

    await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
    const rtlGeometry = await demo(page, "preview").locator(".kappa-meter").evaluate((meter) => {
      const track = meter.querySelector('[data-slot="meter-track"]')?.getBoundingClientRect();
      const indicator = meter.querySelector('[data-slot="meter-indicator"]')?.getBoundingClientRect();
      return track && indicator ? { trackRight: track.right, indicatorRight: indicator.right } : null;
    });
    expect(Math.abs((rtlGeometry?.trackRight ?? 0) - (rtlGeometry?.indicatorRight ?? 1))).toBeLessThanOrEqual(1);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-meter")).toBeVisible();
  });
});
