import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-banner-demo="${variant}"]`);

const readContrast = (
  locator: Locator,
  colorProperty: "color" | "outlineColor" = "color",
  backgroundFromParent = false,
) =>
  locator.evaluate((element, options) => {
    type Color = { a: number; b: number; g: number; r: number };
    const parse = (value: string): Color => {
      const values = value.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
      if (value.startsWith("oklab")) {
        const [lightness, axisA, axisB, alpha = 1] = values;
        const l = (lightness + 0.3963377774 * axisA + 0.2158037573 * axisB) ** 3;
        const m = (lightness - 0.1055613458 * axisA - 0.0638541728 * axisB) ** 3;
        const s = (lightness - 0.0894841775 * axisA - 1.291485548 * axisB) ** 3;
        const encode = (channel: number) => {
          const encoded = channel <= 0.0031308
            ? 12.92 * channel
            : 1.055 * channel ** (1 / 2.4) - 0.055;
          return Math.min(1, Math.max(0, encoded)) * 255;
        };
        return {
          r: encode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
          g: encode(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
          b: encode(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
          a: alpha,
        };
      }
      if (value.startsWith("color(srgb")) {
        return {
          r: values[0] * 255,
          g: values[1] * 255,
          b: values[2] * 255,
          a: values[3] ?? 1,
        };
      }
      if (value.startsWith("rgb")) {
        return { r: values[0], g: values[1], b: values[2], a: values[3] ?? 1 };
      }
      throw new Error(`Unsupported computed color: ${value}`);
    };
    const over = (foreground: Color, background: Color): Color => {
      const a = foreground.a + background.a * (1 - foreground.a);
      if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
      return {
        r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / a,
        g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / a,
        b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / a,
        a,
      };
    };
    const effectiveBackground = () => {
      let result: Color = { r: 0, g: 0, b: 0, a: 0 };
      for (
        let current: Element | null = options.backgroundFromParent ? element.parentElement : element;
        current;
        current = current.parentElement
      ) {
        result = over(result, parse(getComputedStyle(current).backgroundColor));
        if (result.a >= 1) break;
      }
      return result.a < 1 ? over(result, { r: 255, g: 255, b: 255, a: 1 }) : result;
    };
    const luminance = (color: Color) => {
      const channels = [color.r, color.g, color.b].map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };

    const background = effectiveBackground();
    const foreground = over(parse(getComputedStyle(element)[options.colorProperty]), background);
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
  }, { backgroundFromParent, colorProperty });

test.describe("Banner documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/banner");
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Banner" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-banner")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/banner"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebarLink = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Banner", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });

    await expect(sidebarLink).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Badge" })).toHaveAttribute(
      "href",
      "/docs/components/badge",
    );
    await expect(
      compact.getByRole("link", { name: "Next page: Breadcrumbs" }),
    ).toHaveAttribute("href", "/docs/components/breadcrumbs");
    await expect(footer.getByRole("link", { name: "Badge", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Breadcrumbs", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Variants",
      "With Icon",
      "With Action",
      "Multiple Actions",
      "Compact",
      "Custom Description",
      "Right-to-left",
      "Accessibility",
      "API Reference",
      "Banner",
      "Slots",
      "Banner.Action",
      "Exports",
    ]);

    const response = await request.get("/docs/components/banner.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Banner");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain('import { Banner, BannerAction } from "@dicehub/kappa";');
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain('role="status"');
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("renders variants and leaves announcement semantics to consumers", async ({ page }) => {
    const variants = demo(page, "variants");
    const names = ["default", "alert", "error", "secondary"];

    await expect(variants.locator(".kappa-banner")).toHaveCount(names.length);
    for (const variant of names) {
      const banner = variants.locator(`[data-variant="${variant}"]`);
      await expect(banner).toHaveCount(1);
      await expect(banner).not.toHaveAttribute("role");
      await expect(banner).toHaveAttribute("data-size", "base");
    }

    await expect(demo(page, "usage").locator(".kappa-banner")).toHaveAttribute("role", "status");
    const roles = demo(page, "roles");
    await expect(roles.getByRole("status")).toContainText("Export complete");
    await expect(roles.getByRole("alert")).toContainText("Connection lost");

    const icon = demo(page, "icon").locator('[data-slot="banner-icon"]');
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon.locator("svg")).toHaveAttribute("stroke-width", "2");

    const root = page.locator("html");
    const secondary = variants.locator('[data-variant="secondary"]');
    const readBackground = () =>
      secondary.evaluate((element) => getComputedStyle(element).backgroundColor);
    const lightBackground = await readBackground();

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(root).toHaveAttribute("data-mode", "dark");
    await expect.poll(readBackground).not.toBe(lightBackground);
  });

  test("composes native actions and forwards click events", async ({ page }) => {
    const action = demo(page, "action");
    const primary = action.getByRole("button", { name: "Update now" });
    const ghost = action.getByRole("button", { name: "Dismiss" });

    await expect(primary).toHaveAttribute("type", "button");
    await expect(primary).toHaveAttribute("data-variant", "primary");
    await expect(primary).toHaveAttribute("data-size", "sm");
    await expect(ghost).toHaveAttribute("data-variant", "ghost");

    await primary.focus();
    await expect(primary).toBeFocused();
    const focus = await primary.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);

    await primary.click();
    await expect(action.getByRole("status")).toHaveText("Update queued");
    await ghost.click();
    await expect(action.getByRole("status")).toHaveText("Update dismissed");

    const actions = demo(page, "actions");
    await expect(actions.locator(".kappa-banner-action")).toHaveCount(2);
    await actions.getByRole("button", { name: "Extend session" }).click();
    await expect(actions.getByRole("status")).toHaveText("Session extended");

    const compact = demo(page, "compact");
    await expect(compact.locator(".kappa-banner")).toHaveAttribute("data-size", "sm");
    const compactAction = compact.getByRole("button", { name: "Manage DNS" });
    await expect(compactAction).toHaveAttribute("type", "button");
    await expect(compactAction).toHaveAttribute("data-size", "xs");
  });

  test("keeps copy, actions, hover, and focus contrast in both themes", async ({ page }) => {
    await page.locator("body").evaluate((body) => {
      const fixture = document.createElement("div");
      fixture.dataset.bannerContrastFixture = "";
      fixture.style.cssText =
        "position:fixed;inset-block-end:0;inset-inline:0;z-index:9999;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;background:var(--docs-base);padding:8px";

      for (const bannerVariant of ["default", "alert", "error", "secondary"]) {
        const banner = document.createElement("div");
        banner.className = `kappa-banner kappa-banner--base kappa-banner--${bannerVariant}`;
        banner.dataset.variant = bannerVariant;
        const actions = document.createElement("div");
        actions.style.cssText = "display:flex;flex-wrap:wrap;gap:4px";
        for (const actionVariant of ["primary", "secondary", "ghost"]) {
          const action = document.createElement("button");
          action.className = `kappa-banner-action kappa-banner-action--sm kappa-banner-action--${actionVariant}`;
          action.dataset.contrastKey = `${bannerVariant}-${actionVariant}`;
          action.textContent = actionVariant;
          actions.append(action);
        }
        banner.append(actions);
        fixture.append(banner);
      }
      body.append(fixture);
    });

    const variants = ["default", "alert", "error", "secondary"];
    const actionVariants = ["primary", "secondary", "ghost"];
    const checkTheme = async (theme: string) => {
      for (const variant of variants) {
        const banner = demo(page, "variants").locator(`[data-variant="${variant}"]`);
        expect(
          await readContrast(banner.locator('[data-slot="banner-title"]')),
          `${theme} ${variant} title contrast`,
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          await readContrast(banner.locator('[data-slot="banner-description"]')),
          `${theme} ${variant} description contrast`,
        ).toBeGreaterThanOrEqual(4.5);

        for (const actionVariant of actionVariants) {
          const action = page.locator(
            `[data-banner-contrast-fixture] [data-contrast-key="${variant}-${actionVariant}"]`,
          );
          expect(
            await readContrast(action),
            `${theme} ${variant} ${actionVariant} contrast`,
          ).toBeGreaterThanOrEqual(4.5);
          await action.hover();
          expect(
            await readContrast(action),
            `${theme} ${variant} ${actionVariant} hover contrast`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      }

      const focusAction = page.locator(
        '[data-banner-contrast-fixture] [data-contrast-key="default-primary"]',
      );
      await focusAction.focus();
      expect(
        await readContrast(focusAction, "outlineColor", true),
        `${theme} focus indicator contrast`,
      ).toBeGreaterThanOrEqual(3);
    };

    await checkTheme("light");
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await checkTheme("dark");
  });

  test("uses logical layout in RTL and avoids mobile overflow", async ({ page }) => {
    const rtl = demo(page, "rtl");
    const banner = rtl.locator(".kappa-banner");
    const icon = banner.locator('[data-slot="banner-icon"]');
    const title = banner.locator('[data-slot="banner-title"]');
    const action = banner.getByRole("button", { name: "عرض النتائج" });

    const [iconBox, titleBox, actionBox] = await Promise.all([
      icon.boundingBox(),
      title.boundingBox(),
      action.boundingBox(),
    ]);
    expect(iconBox).not.toBeNull();
    expect(titleBox).not.toBeNull();
    expect(actionBox).not.toBeNull();
    expect(iconBox!.x).toBeGreaterThan(titleBox!.x);
    expect(actionBox!.x).toBeLessThan(titleBox!.x);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    const mobile = demo(page, "action");
    await mobile.scrollIntoViewIfNeeded();
    const mobileBox = await mobile.boundingBox();
    const mobileActions = mobile.locator('[data-slot="banner-actions"]');
    const actionsBox = await mobileActions.boundingBox();
    expect(mobileBox).not.toBeNull();
    expect(actionsBox).not.toBeNull();
    expect(actionsBox!.x).toBeGreaterThanOrEqual(mobileBox!.x);
    expect(actionsBox!.x + actionsBox!.width).toBeLessThanOrEqual(
      mobileBox!.x + mobileBox!.width + 1,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
