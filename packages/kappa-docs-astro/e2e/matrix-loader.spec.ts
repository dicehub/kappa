import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-matrix-loader-demo="${variant}"]`);

test.describe("Matrix Loader documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/matrix-loader");
  });

  test("renders examples, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Matrix Loader" })).toBeVisible();
    await expect(demo(page, "preview").locator(".kappa-matrix-loader")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/matrix-loader"',
    );

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(compact.getByRole("link", { name: "Previous page: Loader" })).toHaveAttribute(
      "href",
      "/docs/components/loader",
    );
    await expect(compact.getByRole("link", { name: "Next page: Menu Bar" })).toHaveAttribute(
      "href",
      "/docs/components/menu-bar",
    );

    const response = await request.get("/docs/components/matrix-loader.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Matrix Loader");
    expect(markdown).toContain("### [Motion Patterns](#motions)");
    expect(markdown).toContain("MatrixLoaderProps");
  });

  test("renders every shape, motion, and size with accessible status semantics", async ({ page }) => {
    const basic = demo(page, "basic").locator(".kappa-matrix-loader");
    await expect(basic).toHaveAttribute("role", "status");
    await expect(basic).toHaveAttribute("aria-live", "polite");
    await expect(basic.locator(".kappa-matrix-loader__label")).toHaveText(
      "Indexing surface cells",
    );
    await expect(basic.locator('[data-slot="matrix-loader-dot"]')).toHaveCount(25);

    const shapeLoaders = demo(page, "shapes").locator(".kappa-matrix-loader");
    await expect(shapeLoaders).toHaveCount(4);
    await expect(shapeLoaders.first()).toHaveAttribute("aria-hidden", "true");
    expect(
      await shapeLoaders.evaluateAll((items) => items.map((item) => item.dataset.shape)),
    ).toEqual(["square", "circle", "diamond", "ring"]);

    const motionLoaders = demo(page, "motions").locator(".kappa-matrix-loader");
    expect(
      await motionLoaders.evaluateAll((items) => items.map((item) => item.dataset.motion)),
    ).toEqual(["pulse", "scan", "twinkle", "orbit"]);

    const widths = await demo(page, "sizes")
      .locator(".kappa-matrix-loader")
      .evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().width)));
    expect(widths).toEqual([16, 24, 32]);
  });

  test("supports dark mode, reduced motion, and a narrow viewport", async ({ page }) => {
    const firstDot = demo(page, "basic").locator(".kappa-matrix-loader__dot").first();
    await expect(firstDot).toHaveCSS("animation-name", "kappa-matrix-loader-pulse");

    const lightColor = await firstDot.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => firstDot.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(lightColor);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(demo(page, "basic").locator(".kappa-matrix-loader__dot").first()).toHaveCSS(
      "animation-name",
      "none",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(demo(page, "preview").locator(".kappa-matrix-loader")).toBeVisible();
  });
});
