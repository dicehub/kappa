import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-badge-demo="${variant}"]`);

const waitForBadgeStyles = async (badges: Locator) => {
  await expect(badges.first()).toBeAttached();
  await expect.poll(() => badges.evaluateAll((elements) => {
    const surfaces = new Set<Element>();
    for (const element of elements) {
      for (let current: Element | null = element; current; current = current.parentElement) {
        surfaces.add(current);
      }
    }
    return [...surfaces].flatMap((element) => element.getAnimations()).filter(
      (animation) => animation.playState === "running" || animation.pending,
    ).length;
  })).toBe(0);
};

const readBadgeContrasts = (page: Page) =>
  page
    .locator('[data-badge-demo="semantic"] .kappa-badge, [data-badge-demo="colors"] .kappa-badge')
    .evaluateAll((elements) => {
      const luminance = (color: string) => {
        const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
        const linear = channels.map((channel) => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };
      const effectiveBackground = (element: Element) => {
        for (let current: Element | null = element; current; current = current.parentElement) {
          const color = getComputedStyle(current).backgroundColor;
          if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent") return color;
        }
        return "rgb(255, 255, 255)";
      };

      return elements.map((element) => {
        const styles = getComputedStyle(element);
        const foreground = luminance(styles.color);
        const background = luminance(effectiveBackground(element));
        return {
          variant: (element as HTMLElement).dataset.variant,
          ratio: (Math.max(foreground, background) + 0.05) /
            (Math.min(foreground, background) + 0.05),
        };
      });
    });

test.describe("Badge documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/badge");
  });

  test("renders public examples, navigation, TOC, and both themes", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Badge" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-badge")).toHaveCount(5);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/badge"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(8);

    const sidebarLink = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Badge", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });

    await expect(sidebarLink).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Avatar" })).toHaveAttribute(
      "href",
      "/docs/components/avatar",
    );
    await expect(compact.getByRole("link", { name: "Next page: Banner" })).toHaveAttribute(
      "href",
      "/docs/components/banner",
    );
    await expect(footer.getByRole("link", { name: "Avatar", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Banner", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Semantic Variants",
      "Color Variants",
      "With Icons",
      "Link",
      "In a Sentence",
      "Numeric Values",
      "Accessibility",
      "API Reference",
      "Badge",
      "Semantic Variants",
      "Color Variants",
      "Exports",
    ]);

    const root = page.locator("html");
    const secondary = demo(page, "preview").locator('[data-variant="secondary"]');
    const themeToggle = page
      .getByRole("button", { name: "Toggle theme" })
      .filter({ visible: true });
    const readStyles = () =>
      secondary.evaluate((element) => {
        const styles = getComputedStyle(element);
        return {
          background: styles.backgroundColor,
          color: styles.color,
          fontFamily: styles.fontFamily,
        };
      });

    await expect(root).toHaveAttribute("data-mode", "light");
    const lightStyles = await readStyles();
    const lightContrasts = await readBadgeContrasts(page);
    await themeToggle.click();
    await expect(root).toHaveAttribute("data-mode", "dark");
    await expect.poll(async () => (await readStyles()).background).not.toBe(lightStyles.background);
    await waitForBadgeStyles(page.locator(
      '[data-badge-demo="preview"] .kappa-badge, [data-badge-demo="semantic"] .kappa-badge, [data-badge-demo="colors"] .kappa-badge',
    ));
    const darkStyles = await readStyles();
    const darkContrasts = await readBadgeContrasts(page);

    expect(lightStyles.background).not.toBe(darkStyles.background);
    expect(lightStyles.color).not.toBe(darkStyles.color);
    expect(lightStyles.fontFamily).toMatch(/Geist/i);
    expect(darkStyles.fontFamily).toMatch(/Geist/i);
    expect(Math.min(...lightContrasts.map(({ ratio }) => ratio))).toBeGreaterThanOrEqual(4.5);
    expect(Math.min(...darkContrasts.map(({ ratio }) => ratio))).toBeGreaterThanOrEqual(4.5);
  });

  test("renders semantic and color variants as non-interactive text", async ({ page }) => {
    const semantic = demo(page, "semantic");
    const colors = demo(page, "colors");
    const semanticNames = [
      "primary",
      "secondary",
      "outline",
      "beta",
      "info",
      "success",
      "warning",
      "error",
      "destructive",
    ];
    const colorNames = [
      "red",
      "orange",
      "green",
      "teal",
      "teal-subtle",
      "blue",
      "purple",
      "neutral",
    ];

    await expect(semantic.locator(".kappa-badge")).toHaveCount(semanticNames.length);
    await expect(colors.locator(".kappa-badge")).toHaveCount(colorNames.length);
    await expect(semantic.getByRole("group", { name: "General" })).toBeVisible();
    await expect(semantic.getByRole("group", { name: "Status" })).toBeVisible();

    for (const variant of semanticNames) {
      const badge = semantic.locator(`[data-variant="${variant}"]`);
      await expect(badge).toHaveCount(1);
      await expect(badge).toHaveJSProperty("tagName", "SPAN");
      await expect(badge).not.toHaveAttribute("role");
    }

    for (const variant of colorNames) {
      await expect(colors.locator(`[data-variant="${variant}"]`)).toHaveCount(1);
    }

    const variants = [...semanticNames, ...colorNames];
    await page.locator("body").evaluate((body, names) => {
      const fixture = document.createElement("div");
      fixture.dataset.badgeLinkContrastFixture = "";
      fixture.style.cssText = "position:fixed;inset-block-end:0;inset-inline-start:0;z-index:9999;display:flex;max-inline-size:100vw;flex-wrap:wrap;gap:4px;background:var(--docs-base);padding:8px";
      for (const variant of names) {
        const link = document.createElement("a");
        link.href = "#badge-contrast";
        link.className = `kappa-badge kappa-badge--${variant}`;
        link.dataset.variant = variant;
        link.textContent = variant;
        fixture.append(link);
      }
      body.append(fixture);
    }, variants);

    const hoverContrast = async (variant: string) => {
      const link = page.locator(`[data-badge-link-contrast-fixture] [data-variant="${variant}"]`);
      await link.hover();
      await waitForBadgeStyles(link);
      return link.evaluate((element) => {
        const luminance = (color: string) => {
          const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
          const linear = channels.map((channel) => {
            const value = channel / 255;
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
        };
        const styles = getComputedStyle(element);
        const background = styles.backgroundColor === "rgba(0, 0, 0, 0)"
          ? getComputedStyle(element.parentElement!).backgroundColor
          : styles.backgroundColor;
        const foregroundLuminance = luminance(styles.color);
        const backgroundLuminance = luminance(background);
        return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
          (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
      });
    };

    for (const variant of variants) {
      expect(await hoverContrast(variant), `light ${variant} link hover`).toBeGreaterThanOrEqual(4.5);
    }

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    for (const variant of variants) {
      expect(await hoverContrast(variant), `dark ${variant} link hover`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("composes icons, native links, inline text, and numeric content", async ({ page }) => {
    const icons = demo(page, "icons");
    const startIcon = icons.locator('[data-icon="inline-start"]');
    const endIcon = icons.locator('[data-icon="inline-end"]');

    await expect(startIcon).toHaveAttribute("aria-hidden", "true");
    await expect(endIcon).toHaveAttribute("aria-hidden", "true");
    await expect(startIcon).toHaveCSS("width", "12px");
    await expect(endIcon).toHaveCSS("width", "12px");

    for (const badge of await icons.locator(".kappa-badge").all()) {
      const box = await badge.boundingBox();
      expect(box?.width).toBeGreaterThan(50);
    }

    const link = demo(page, "link").getByRole("link", { name: "Open run" });
    await expect(link).toHaveAttribute("href", "#badge-link-example");
    await expect(link).toHaveJSProperty("tagName", "A");
    await link.focus();
    await expect(link).toBeFocused();
    const focus = await link.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);
    expect((await link.boundingBox())?.width).toBeGreaterThan(60);

    await page.locator("html").evaluate((element) => element.setAttribute("dir", "rtl"));
    for (const icon of [startIcon, endIcon]) {
      const iconBox = await icon.boundingBox();
      const badgeBox = await icon.locator("..").boundingBox();
      expect(iconBox).not.toBeNull();
      expect(badgeBox).not.toBeNull();
      expect(iconBox!.x).toBeGreaterThanOrEqual(badgeBox!.x);
      expect(iconBox!.x + iconBox!.width).toBeLessThanOrEqual(badgeBox!.x + badgeBox!.width);
    }

    const sentence = demo(page, "sentence").locator("p");
    await expect(sentence).toContainText("Simulation Complete in 18m 42s.");
    await expect(sentence.locator(".kappa-badge")).toHaveJSProperty("tagName", "SPAN");

    const numericDemo = demo(page, "numeric");
    const numeric = numericDemo.locator(".kappa-badge");
    await expect(numeric.locator('[aria-hidden="true"]')).toHaveText("99+");
    await expect(numeric.locator(".docs-visually-hidden")).toHaveText("128");
    await expect(numericDemo).toMatchAriaSnapshot(`- text: 128 queued jobs`);
  });

  test("wraps compactly without horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    const preview = demo(page, "preview");
    await preview.scrollIntoViewIfNeeded();
    const badges = preview.locator(".kappa-badge");
    const firstBox = await badges.first().boundingBox();
    const lastBox = await badges.last().boundingBox();

    expect(firstBox).not.toBeNull();
    expect(lastBox).not.toBeNull();
    expect(firstBox?.height).toBe(20);
    expect(lastBox?.height).toBe(20);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
