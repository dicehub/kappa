import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-breadcrumbs-demo="${variant}"]`);

const root = (scope: Locator) => scope.locator('[data-slot="breadcrumbs"]');

test.describe("Breadcrumbs documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/breadcrumbs");
  });

  test("renders the implemented route, public snippets, navigation, TOC, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Breadcrumbs" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").getByRole("navigation", { name: "Simulation path" })).toBeVisible();

    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator("pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/breadcrumbs"',
    );
    await expect(page.locator('pre:has-text("../../../kappa/src")')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "View Code" })).toHaveCount(10);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Breadcrumbs", exact: true });
    await expect(sidebar).toHaveAttribute("aria-current", "page");

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(compact.getByRole("link", { name: "Previous page: Banner" })).toHaveAttribute(
      "href",
      "/docs/components/banner",
    );
    await expect(compact.getByRole("link", { name: "Next page: Button" })).toHaveAttribute(
      "href",
      "/docs/components/button",
    );
    await expect(footer.getByRole("link", { name: "Banner", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Button", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Basic",
      "Custom Separator",
      "Sizes",
      "With Icons",
      "Long and Wrapping",
      "Collapsed",
      "Collapsed Ancestor Menu",
      "Router Link",
      "Right-to-left",
      "Accessibility",
      "API Reference",
      "Root",
      "Link",
      "Parts",
      "Exports",
    ]);

    const response = await request.get("/docs/components/breadcrumbs.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Breadcrumbs");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("BreadcrumbsCurrent");
    expect(markdown).toContain("does not measure, hide, or automatically");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("uses native breadcrumb semantics and forwards the root contract", async ({ page }) => {
    const basic = demo(page, "basic");
    const nav = basic.getByRole("navigation", { name: "Breadcrumb" });
    const list = nav.locator('[data-slot="breadcrumbs-list"]');
    const items = list.locator('[data-slot="breadcrumbs-item"]');
    const links = list.locator('[data-slot="breadcrumbs-link"]');
    const pagePart = list.locator('[data-slot="breadcrumbs-page"]');
    const separators = list.locator('[data-slot="breadcrumbs-separator"]');

    await expect(nav).toHaveAttribute("data-slot", "breadcrumbs");
    await expect(nav).toHaveAttribute("data-size", "base");
    await expect(list).toHaveJSProperty("tagName", "OL");
    await expect(items).toHaveCount(3);
    await expect(links).toHaveCount(2);
    await expect(links.first()).toHaveJSProperty("tagName", "A");
    await expect(pagePart).toHaveJSProperty("tagName", "SPAN");
    await expect(pagePart).toHaveAttribute("aria-current", "page");
    await expect(pagePart).not.toHaveAttribute("role");
    await expect(pagePart).not.toHaveAttribute("aria-disabled");
    await expect(separators).toHaveCount(2);
    for (const separator of await separators.all()) {
      await expect(separator).toHaveAttribute("role", "presentation");
      await expect(separator).toHaveAttribute("aria-hidden", "true");
    }
    await expect(nav.getByRole("link")).toHaveText(["Workspace", "Simulations"]);

    const routerLink = demo(page, "router").locator('[data-router-link="true"]');
    await expect(routerLink).toHaveAttribute("href", "#router-projects");
    await expect(routerLink).toHaveAttribute("data-slot", "breadcrumbs-link");
    await expect(routerLink).toHaveClass(/kappa-breadcrumbs__link/);
  });

  test("renders sizes, custom content, icons, and decorative ellipsis", async ({ page }) => {
    const sizes = demo(page, "sizes");
    await expect(root(sizes)).toHaveCount(2);
    await expect(root(sizes).nth(0)).toHaveAttribute("data-size", "sm");
    await expect(root(sizes).nth(1)).toHaveAttribute("data-size", "base");
    const fontSizes = await root(sizes).evaluateAll((elements) =>
      elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    );
    expect(fontSizes[0]).toBeLessThan(fontSizes[1]);

    const separator = demo(page, "separator").locator('[data-slot="breadcrumbs-separator"]');
    await expect(separator).toHaveText(["/", "/"]);
    await expect(separator.locator("svg")).toHaveCount(0);
    const separatorDemo = demo(page, "separator");
    const alignment = await separatorDemo
      .locator('[data-slot="breadcrumbs-link"], [data-slot="breadcrumbs-page"], [data-slot="breadcrumbs-separator"]')
      .evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return {
            center: box.top + box.height / 2,
            fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
          };
        }),
      );
    const expectedCenter = alignment[0]!.center;
    for (const part of alignment) {
      expect(Math.abs(part.center - expectedCenter)).toBeLessThanOrEqual(1);
      expect(part.fontSize).toBe(14);
    }

    const icons = demo(page, "icons");
    const contentIcon = icons.locator(".breadcrumbs-demo__content-icon");
    await expect(contentIcon).toHaveCount(1);
    await expect(contentIcon).toHaveAttribute("aria-hidden", "true");
    await expect(contentIcon).toHaveAttribute("viewBox", "0 0 256 256");
    await expect(icons.getByRole("link")).toHaveText(["Home", "Projects"]);
    await expect(icons.locator('[data-slot="breadcrumbs-page"]')).toHaveText("Current Project");
    await expect(icons.locator('[data-slot="breadcrumbs-page"] svg')).toHaveCount(0);
    const iconStyle = await contentIcon.evaluate((element) => {
      const styles = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return { fill: styles.fill, color: styles.color, width: box.width, height: box.height };
    });
    expect(iconStyle.fill).toBe(iconStyle.color);
    expect(iconStyle.width).toBe(16);
    expect(iconStyle.height).toBe(16);

    const ellipsis = demo(page, "ellipsis").locator('[data-slot="breadcrumbs-ellipsis"]');
    await expect(ellipsis).toHaveAttribute("role", "presentation");
    await expect(ellipsis).toHaveAttribute("aria-hidden", "true");
    await expect(ellipsis).not.toHaveAttribute("tabindex");
    await expect(demo(page, "ellipsis").getByRole("button")).toHaveCount(0);
  });

  test("composes a functional collapsed-ancestor menu with complete keyboard dismissal", async ({
    page,
  }) => {
    const menuDemo = demo(page, "menu");
    const trigger = menuDemo.getByRole("button", { name: "Show collapsed ancestors" });
    const menu = page.getByRole("menu", { name: "Collapsed ancestors" });

    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    const triggerGeometry = await trigger.evaluate((element) => {
      const ellipsis = element.querySelector('[data-slot="breadcrumbs-ellipsis"]');
      if (!ellipsis) throw new Error("Missing breadcrumb ellipsis");
      const triggerBox = element.getBoundingClientRect();
      const ellipsisBox = ellipsis.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return {
        padding: styles.padding,
        triggerCenter: [triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height / 2],
        ellipsisCenter: [ellipsisBox.x + ellipsisBox.width / 2, ellipsisBox.y + ellipsisBox.height / 2],
      };
    });
    expect(triggerGeometry.padding).toBe("0px");
    expect(Math.abs(triggerGeometry.triggerCenter[0]! - triggerGeometry.ellipsisCenter[0]!)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(triggerGeometry.triggerCenter[1]! - triggerGeometry.ellipsisCenter[1]!)).toBeLessThanOrEqual(0.5);
    await trigger.focus();
    await expect(trigger).toBeFocused();
    await expect.poll(() => trigger.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
      "solid",
    );

    await trigger.press("ArrowDown");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem")).toHaveText(["Models", "Rotor study", "Mesh variants"]);
    await expect(menu).toBeFocused();
    const first = menu.getByRole("menuitem", { name: "Models" });
    await expect(first).toHaveAttribute("data-highlighted", "");
    const firstId = await first.getAttribute("id");
    expect(firstId).not.toBeNull();
    await expect(menu).toHaveAttribute("aria-activedescendant", firstId!);

    await page.keyboard.press("ArrowDown");
    await expect(menu.getByRole("menuitem", { name: "Rotor study" })).toHaveAttribute(
      "data-highlighted",
      "",
    );
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(menu).toBeVisible();
    await page.locator("#collapsed-menu + p").click();
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("wraps on mobile without overflow and mirrors the default separator in RTL", async ({
    page,
  }) => {
    const basic = demo(page, "basic");
    const breadcrumbColors = await basic.evaluate((scope) => {
      const link = scope.querySelector('[data-slot="breadcrumbs-link"]');
      const separator = scope.querySelector('[data-slot="breadcrumbs-separator"]');
      const arrow = separator?.querySelector("svg");
      if (!link || !separator || !arrow) throw new Error("Missing breadcrumb parts");
      return {
        link: getComputedStyle(link).color,
        separator: getComputedStyle(separator).color,
        arrow: getComputedStyle(arrow).stroke,
      };
    });
    expect(breadcrumbColors.separator).toBe(breadcrumbColors.link);
    expect(breadcrumbColors.arrow).toBe(breadcrumbColors.link);

    const wrapping = demo(page, "wrapping");
    const list = wrapping.locator('[data-slot="breadcrumbs-list"]');
    const items = list.locator('[data-slot="breadcrumbs-item"]');
    const listBox = await list.boundingBox();
    const firstBox = await items.first().boundingBox();
    const lastBox = await items.last().boundingBox();
    expect(listBox).not.toBeNull();
    expect(firstBox).not.toBeNull();
    expect(lastBox).not.toBeNull();
    expect(lastBox!.y).toBeGreaterThan(firstBox!.y);

    const rtl = root(demo(page, "rtl"));
    const rtlList = rtl.locator('[data-slot="breadcrumbs-list"]');
    const rtlItems = rtlList.locator('[data-slot="breadcrumbs-item"]');
    const rtlIcon = rtl.locator('[data-slot="breadcrumbs-separator"] svg').first();
    await expect.poll(() => rtl.evaluate((element) => getComputedStyle(element).direction)).toBe("rtl");
    const rtlBoxes = await rtlItems.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect()),
    );
    expect(rtlBoxes[1]!.x).toBeLessThan(rtlBoxes[0]!.x);
    await expect.poll(() => rtlIcon.evaluate((element) => getComputedStyle(element).transform)).not.toBe(
      "none",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(demo(page, "wrapping")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test("preserves readable themes, focus, and forced-color geometry", async ({ page }) => {
    const basicLink = demo(page, "basic").locator('[data-slot="breadcrumbs-link"]').first();
    const readColor = () => basicLink.evaluate((element) => getComputedStyle(element).color);
    const lightColor = await readColor();
    await basicLink.hover();
    await expect
      .poll(readColor)
      .not.toBe(lightColor);
    await expect
      .poll(() => basicLink.evaluate((element) => getComputedStyle(element).textDecorationLine))
      .toBe("none");
    await basicLink.focus();
    const focus = await basicLink.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(readColor).not.toBe(lightColor);

    await page.emulateMedia({ forcedColors: "active" });
    await basicLink.focus();
    await page.keyboard.press("Tab");
    const forcedLink = demo(page, "basic").locator('[data-slot="breadcrumbs-link"]').nth(1);
    await expect(forcedLink).toBeFocused();
    const forcedFocus = await forcedLink.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(forcedFocus.style).not.toBe("none");
    expect(forcedFocus.width).toBeGreaterThanOrEqual(2);

    const separatorIcon = demo(page, "basic")
      .locator('[data-slot="breadcrumbs-separator"] svg')
      .first();
    const forcedSeparator = await separatorIcon.evaluate((element) => {
      const styles = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return { stroke: styles.stroke, width: box.width, height: box.height };
    });
    expect(forcedSeparator.stroke).not.toBe("none");
    expect(forcedSeparator.width).toBeGreaterThan(0);
    expect(forcedSeparator.height).toBeGreaterThan(0);
  });
});
