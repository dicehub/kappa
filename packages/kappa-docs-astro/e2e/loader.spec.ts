import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-loader-demo="${variant}"]`);

test.describe("Loader documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/loader");
    await expect
      .poll(() =>
        demo(page, "preview").evaluate((element) =>
          element.closest("astro-island")?.hasAttribute("ssr"),
        ),
      )
      .toBe(false);
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Loader" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-loader")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/loader"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Loader", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Link" })).toHaveAttribute(
      "href",
      "/docs/components/link",
    );
    await expect(compact.getByRole("link", { name: "Next page: Matrix Loader" })).toHaveAttribute(
      "href",
      "/docs/components/matrix-loader",
    );
    await expect(footer.getByRole("link", { name: "Link", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Matrix Loader", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Design",
      "Examples",
      "Variants",
      "Run Waiting",
      "Sizes",
      "Custom Size",
      "Button",
      "Badge",
      "Empty",
      "Accessibility",
      "API Reference",
      "Loader",
      "Exports",
    ]);

    const response = await request.get("/docs/components/loader.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Loader");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("### [Custom Size](#custom-size)");
    expect(markdown).toContain("### [Run Waiting](#run-waiting)");
    expect(markdown).toContain("LoaderProps");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("renders every motion variant and the dicehub run-waiting composition", async ({ page }) => {
    const variants = demo(page, "variants").locator(".kappa-loader");
    await expect(variants).toHaveCount(9);
    const variantSizes = await variants.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-size")),
    );
    expect(variantSizes).toEqual(Array(9).fill("40"));
    const variantNames = await variants.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-variant")),
    );
    expect(variantNames).toEqual([
      "spinner",
      "waveform",
      "helix",
      "quantum",
      "dot-wave",
      "dot-stream",
      "mirage",
      "ping",
      "orbit",
    ]);

    const run = demo(page, "run");
    const orbit = run.locator('.kappa-loader[data-variant="orbit"]');
    await expect(run.getByRole("status")).toContainText("Waiting to start");
    await expect(orbit).toHaveAttribute("aria-hidden", "true");
    await expect(orbit.locator(".kappa-loader__orbit")).toHaveCount(3);
    await expect.poll(async () => Math.round((await orbit.boundingBox())?.width ?? 0)).toBe(80);
    await expect(orbit).toHaveCSS("--kappa-loader-duration", "900ms");
  });

  test("renders accessible statuses, preset sizes, and a custom size", async ({ page }) => {
    const basic = demo(page, "basic");
    const basicLoader = basic.locator(".kappa-loader");
    await expect(basic.getByRole("status")).toHaveCount(1);
    await expect(basicLoader.locator(".kappa-loader__label")).toHaveText("Loading");
    await expect(basicLoader).toHaveAttribute("aria-live", "polite");
    await expect(basicLoader).toHaveAttribute("aria-atomic", "true");
    await expect(basicLoader.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(basicLoader.locator("circle")).toHaveCount(2);

    const sizeLoaders = demo(page, "sizes").locator(".kappa-loader");
    await expect(sizeLoaders).toHaveCount(3);
    const widths = await sizeLoaders.evaluateAll((elements) =>
      elements.map((element) => Math.round(element.getBoundingClientRect().width)),
    );
    expect(widths).toEqual([16, 24, 32]);
    await expect(sizeLoaders.nth(0).locator(".kappa-loader__label")).toHaveText(
      "Loading sm example",
    );
    await expect(sizeLoaders.nth(2).locator(".kappa-loader__label")).toHaveText(
      "Loading lg example",
    );

    const custom = demo(page, "custom").locator(".kappa-loader");
    await expect(custom).toHaveAttribute("data-size", "40");
    await expect.poll(async () => Math.round((await custom.boundingBox())?.width ?? 0)).toBe(40);
    await expect(custom.locator(".kappa-loader__label")).toHaveText("Loading large preview");
  });

  test("composes as a decorative current-color indicator", async ({ page }) => {
    const preview = demo(page, "preview");
    const previewLoader = preview.locator(".kappa-loader");
    await expect(preview.getByRole("status")).toContainText("Processing payment");
    await expect(previewLoader).toHaveAttribute("aria-hidden", "true");
    await expect(previewLoader).not.toHaveAttribute("role");

    const buttons = demo(page, "button").getByRole("button");
    await expect(buttons).toHaveCount(3);
    await expect(demo(page, "button").locator(".loader-demo__row")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(buttons.nth(0)).toBeDisabled();
    await expect(buttons.nth(2)).toHaveAccessibleName("Saving");
    await expect(buttons.locator(".kappa-loader")).toHaveCount(3);
    await expect(buttons.locator(".kappa-loader").first()).toHaveCSS("color", "rgb(255, 255, 255)");

    const badges = demo(page, "badge").locator(".kappa-badge");
    await expect(badges).toHaveCount(3);
    await expect(badges.locator(".kappa-loader")).toHaveCount(3);
    await expect(badges.locator('[role="status"]')).toHaveCount(0);

    const empty = demo(page, "empty");
    await expect(empty.locator(".kappa-empty")).toHaveCount(1);
    await expect(empty.locator(".kappa-loader")).toHaveAttribute("aria-hidden", "true");
    await expect(empty.getByRole("heading", { name: "Processing your request" })).toBeVisible();
    await expect(empty.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  test("supports themes, reduced motion, and mobile layout", async ({ page }) => {
    const loader = demo(page, "basic").locator(".kappa-loader");
    const graphic = loader.locator(".kappa-loader__graphic");
    const indicator = loader.locator(".kappa-loader__indicator");
    await expect(graphic).toHaveCSS("animation-name", "kappa-loader-rotate");
    await expect(indicator).toHaveCSS("animation-name", "kappa-loader-dash");

    const lightColor = await loader.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => loader.evaluate((element) => getComputedStyle(element).color)).not.toBe(
      lightColor,
    );

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(demo(page, "basic").locator(".kappa-loader__graphic")).toHaveCSS(
      "animation-name",
      "none",
    );
    await expect(demo(page, "basic").locator(".kappa-loader__indicator")).toHaveCSS(
      "animation-name",
      "none",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-loader")).toBeVisible();
  });
});
