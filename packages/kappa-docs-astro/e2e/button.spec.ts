import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-button-demo="${variant}"]`);
const buttons = (scope: Locator) => scope.locator(".kappa-button");
const settleAnimations = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );

const readContrast = (elements: Locator) =>
  elements.evaluateAll((nodes) => {
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
      const linear = channels.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
    };
    const background = (element: Element) => {
      for (let current: Element | null = element; current; current = current.parentElement) {
        const value = getComputedStyle(current).backgroundColor;
        if (value !== "rgba(0, 0, 0, 0)" && value !== "transparent") return value;
      }
      return "rgb(255, 255, 255)";
    };

    return nodes.map((node) => {
      const foreground = luminance(getComputedStyle(node).color);
      const surface = luminance(background(node));
      return {
        ratio: (Math.max(foreground, surface) + 0.05) / (Math.min(foreground, surface) + 0.05),
        variant: (node as HTMLElement).dataset.variant,
      };
    });
  });

test.describe("Button documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/button");
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(buttons(demo(page, "preview"))).toHaveCount(2);

    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator("pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/button"',
    );
    await expect(page.locator('pre:has-text("../../../kappa/src")')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "View Code" })).toHaveCount(22);

    const sidebar = page.locator("#desktop-navigation").getByRole("link", {
      name: "Button",
      exact: true,
    });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Breadcrumbs" })).toHaveAttribute(
      "href",
      "/docs/components/breadcrumbs",
    );
    await expect(compact.getByRole("link", { name: "Next page: Button Group" })).toHaveAttribute(
      "href",
      "/docs/components/button-group",
    );
    await expect(footer.getByRole("link", { name: "Breadcrumbs", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Button Group", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation", "Barrel", "Granular", "Usage", "Examples", "Basic", "Variants", "Sizes",
      "With Icons", "Icon-only", "Loading", "Disabled", "Full Width", "Links and asChild",
      "Native Forms", "Right-to-left", "Accessibility", "API Reference", "Button", "LinkButton",
      "Variant Reference", "Exports",
    ]);

    const response = await request.get("/docs/components/button.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Button");
    expect(markdown).toContain('from "@lucide/vue"');
    expect(markdown).toContain("#### [Primary](#primary)");
    expect(markdown).toContain("#### [Secondary Destructive](#secondary-destructive)");
    expect(markdown).toContain("#### [Link](#link)");
    expect(markdown).toContain("destructive-outline");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("keeps native button, click, attribute, and form behavior", async ({ page }) => {
    const usage = demo(page, "usage").getByRole("button", { name: "Save case" });
    await expect(usage).toHaveJSProperty("tagName", "BUTTON");
    await expect(usage).toHaveAttribute("type", "button");
    await expect(usage).toHaveAttribute("data-trace", "save-case");
    await expect(usage).toHaveClass(/button-demo__custom/);
    await expect(usage).toHaveClass(/kappa-button/);
    await usage.evaluate((element) => {
      element.addEventListener("click", () => {
        document.documentElement.dataset.buttonClickObserved = "true";
      });
    });
    await usage.click();
    await expect(page.locator("html")).toHaveAttribute("data-button-click-observed", "true");

    const form = demo(page, "form").getByRole("form", { name: "Case action form" });
    const submit = form.getByRole("button", { name: "Submit" });
    const reset = form.getByRole("button", { name: "Reset" });
    await expect(submit).toHaveAttribute("type", "submit");
    await expect(reset).toHaveAttribute("type", "reset");
    await form.getByLabel("Case name").fill("Updated case");
    await submit.click();
    await expect(form.getByRole("status")).toHaveText("Submitted");
    await reset.click();
    await expect(form.getByLabel("Case name")).toHaveValue("Rotor study");
    await expect(form.getByRole("status")).toHaveText("Reset");
  });

  test("renders every variant, size, icon position, shape, and width contract", async ({ page }) => {
    const variantNames = [
      "primary", "secondary", "outline", "ghost", "destructive", "secondary-destructive",
      "destructive-outline", "success", "warning", "link",
    ];
    const variantDemo = page.locator("[data-button-variant-examples]");
    await expect(buttons(variantDemo)).toHaveCount(variantNames.length);
    for (const variant of variantNames) {
      const section = demo(page, variant);
      await expect(page.locator(`h4#${variant}`)).toHaveText(
        variant.split("-").map((part) => part[0]!.toUpperCase() + part.slice(1)).join(" "),
      );
      await expect(section.locator(`[data-variant="${variant}"]`)).toHaveCount(1);
      await expect(section.locator("xpath=ancestor::*[@data-button-variant-examples]")).toHaveCount(1);
    }

    const sizeDemo = demo(page, "sizes");
    const sizeNames = ["xs", "sm", "base", "lg"];
    for (const size of sizeNames) {
      const control = sizeDemo.locator(`[data-size="${size}"]`);
      await expect(control).toHaveCount(1);
      await expect(control).toHaveCSS("border-radius", "4px");
    }
    const heights = await buttons(sizeDemo).evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    );
    expect(heights).toEqual([...heights].sort((a, b) => a - b));
    expect(heights[0]).toBeGreaterThanOrEqual(24);
    expect(heights.at(-1)).toBeLessThanOrEqual(40);

    const iconDemo = demo(page, "icons");
    const start = iconDemo.getByRole("button", { name: "New case" });
    const end = iconDemo.getByRole("button", { name: "Export" });
    for (const icon of await iconDemo.locator("svg").all()) {
      await expect(icon).toHaveAttribute("aria-hidden", "true");
      await expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
      await expect(icon).toHaveAttribute("stroke", "currentColor");
      await expect(icon).toHaveClass(/lucide/);
      await expect(icon).toHaveCSS("pointer-events", "none");
    }
    const [startParts, endParts] = await Promise.all([
      start.locator("svg, .kappa-button__label").evaluateAll((parts) =>
        parts.map((part) => part.getBoundingClientRect().x),
      ),
      end.locator("svg, .kappa-button__label").evaluateAll((parts) =>
        parts.map((part) => part.getBoundingClientRect().x),
      ),
    ]);
    expect(startParts[0]).toBeLessThan(startParts[1]!);
    expect(endParts[0]).toBeGreaterThan(endParts[1]!);

    const iconOnly = demo(page, "icon-only");
    const add = iconOnly.getByRole("button", { name: "Add case" });
    const refresh = iconOnly.getByRole("button", { name: "Refresh runs" });
    await expect(add).toHaveAttribute("data-shape", "square");
    await expect(refresh).toHaveAttribute("data-shape", "circle");
    for (const control of [add, refresh]) {
      const box = await control.boundingBox();
      expect(box).not.toBeNull();
      expect(Math.abs(box!.width - box!.height)).toBeLessThanOrEqual(1);
    }

    const full = demo(page, "full-width");
    const [wrapperBox, buttonBox] = await Promise.all([
      full.locator(".button-demo__full-width").boundingBox(),
      full.getByRole("button", { name: "Create project" }).boundingBox(),
    ]);
    expect(wrapperBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();
    expect(Math.abs(wrapperBox!.width - buttonBox!.width)).toBeLessThanOrEqual(1);
  });

  test("blocks loading and disabled activation and keeps links semantic and safe", async ({ page }) => {
    const loading = demo(page, "loading");
    for (const control of await loading.getByRole("button").all()) {
      await expect(control).toBeDisabled();
      await expect(control).toHaveAttribute("aria-busy", "true");
      await expect(control.locator(".kappa-button__spinner")).toHaveCount(1);
      await control.evaluate((element) => (element as HTMLButtonElement).click());
    }
    await expect(loading.locator("[data-blocked-count]")).toHaveText("0");

    const disabled = demo(page, "disabled");
    const disabledControls = disabled.getByRole("button");
    await expect(disabledControls).toHaveCount(2);
    for (const control of await disabledControls.all()) {
      await expect(control).toBeDisabled();
      await control.evaluate((element) => (element as HTMLButtonElement).click());
    }
    await expect(disabled.getByRole("link")).toHaveCount(0);
    await expect(disabled.locator("[data-blocked-count]")).toHaveText("0");

    const links = demo(page, "links");
    const native = links.getByRole("link", { name: "View runs" });
    const external = links.getByRole("link", { name: "dicehub website" });
    const router = links.getByRole("link", { name: "Open projects" });
    await expect(native).toHaveAttribute("href", "#button-native-target");
    await expect(native).toHaveJSProperty("tagName", "A");
    await expect(external).toHaveAttribute("target", "_blank");
    await expect(external).toHaveAttribute("rel", /noopener/);
    await expect(external).toHaveAttribute("rel", /noreferrer/);
    await expect(router).toHaveAttribute("href", "#button-router-target");
    await expect(router).toHaveAttribute("data-router-link", "true");
    await expect(router).toHaveClass(/kappa-button/);
    const unavailable = links.getByRole("button", { name: "Unavailable run" });
    await expect(unavailable).toBeDisabled();
    await expect(unavailable).not.toHaveAttribute("href");
    await expect(unavailable.locator("a")).toHaveCount(0);
  });

  test("neutral buttons use the light hover fill and retain dark and expanded states", async ({ page }) => {
    for (const mode of ["light", "dark"]) {
      await page.evaluate((mode) => {
        document.documentElement.setAttribute("data-kappa-theme", mode);
        document.documentElement.setAttribute("data-mode", mode);
      }, mode);
      const hoverFill = mode === "light" ? "rgb(250, 250, 250)" : "rgb(38, 38, 38)";

      for (const variant of ["secondary", "outline", "ghost", "secondary-destructive"]) {
        const control = buttons(demo(page, variant));
        await control.hover();
        await expect(control).toHaveCSS("background-color", hoverFill);
        await control.evaluate((element) => element.setAttribute("aria-expanded", "true"));
        await expect(control).toHaveCSS("background-color", hoverFill);
        await page.mouse.down();
        await expect(control).not.toHaveCSS("background-color", hoverFill);
        await page.mouse.up();
        await control.evaluate((element) => element.removeAttribute("aria-expanded"));
      }
    }
  });

  test("keeps complete light, dark, hover, active, focus, and contrast states", async ({ page }) => {
    const variantButtons = buttons(page.locator("[data-button-variant-examples]"));
    const lightContrast = await readContrast(variantButtons);
    for (const item of lightContrast) {
      expect(item.ratio, `light ${item.variant}`).toBeGreaterThanOrEqual(4.5);
    }

    for (const control of await variantButtons.all()) {
      const base = await control.evaluate((element) => {
        const styles = getComputedStyle(element);
        return { background: styles.backgroundColor, image: styles.backgroundImage, shadow: styles.boxShadow };
      });
      expect(base.image).toBe("none");
      expect(base.shadow).toBe("none");
    }

    const primary = demo(page, "primary").getByRole("button", { name: "Primary" });
    await expect(primary).toHaveCSS("background-color", "rgb(36, 122, 183)");
    const readBackground = () => primary.evaluate((element) => getComputedStyle(element).backgroundColor);
    const initialBackground = await readBackground();
    await primary.hover();
    await expect.poll(readBackground).not.toBe(initialBackground);
    const hoverStyles = await primary.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { background: styles.backgroundColor, transform: styles.transform };
    });
    const primaryBox = await primary.boundingBox();
    expect(primaryBox).not.toBeNull();
    await page.mouse.move(primaryBox!.x + primaryBox!.width / 2, primaryBox!.y + primaryBox!.height / 2);
    await page.mouse.down();
    const activeStyles = await primary.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { background: styles.backgroundColor, transform: styles.transform };
    });
    expect(activeStyles).not.toEqual(hoverStyles);
    await page.mouse.up();
    await primary.evaluate((element) => element.setAttribute("aria-invalid", "true"));
    await settleAnimations(page);
    const invalid = await primary.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { border: styles.borderColor, outline: styles.outlineStyle };
    });
    expect(invalid.border).not.toBe("rgba(0, 0, 0, 0)");
    expect(invalid.outline).not.toBe("none");
    await primary.evaluate((element) => element.removeAttribute("aria-invalid"));
    await primary.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(primary).toBeFocused();
    const focus = await primary.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await settleAnimations(page);
    const darkContrast = await readContrast(variantButtons);
    for (const item of darkContrast) {
      expect(item.ratio, `dark ${item.variant}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("uses logical RTL order and survives mobile, reduced motion, and forced colors", async ({ page }) => {
    const rtl = demo(page, "rtl");
    const [leading, trailing] = await rtl.getByRole("button").all();
    const parts = async (control: Locator) => control.locator("svg, .kappa-button__label").evaluateAll(
      (nodes) => nodes.map((node) => node.getBoundingClientRect().x),
    );
    const leadingParts = await parts(leading!);
    const trailingParts = await parts(trailing!);
    await expect(leading!.locator("svg")).toHaveClass(/lucide-plus/);
    await expect(trailing!.locator("svg")).toHaveClass(/lucide-arrow-left/);
    expect(leadingParts[0]).toBeGreaterThan(leadingParts[1]!);
    expect(trailingParts[0]).toBeLessThan(trailingParts[1]!);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.locator("[data-button-variant-examples]")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();

    await page.emulateMedia({ reducedMotion: "reduce" });
    const reduced = demo(page, "primary").getByRole("button", { name: "Primary" });
    await expect.poll(() => reduced.evaluate((element) =>
      Math.max(...getComputedStyle(element).transitionDuration.split(",").map(Number.parseFloat)),
    )).toBeLessThanOrEqual(0.001);
    const spinner = demo(page, "loading").locator(".kappa-button__spinner").first();
    await expect.poll(() => spinner.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");

    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    const forced = demo(page, "basic").getByRole("button", { name: "Save draft" });
    await forced.focus();
    const forcedStyle = await forced.evaluate((element) => {
      const styles = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return { outline: styles.outlineStyle, width: box.width, height: box.height };
    });
    expect(forcedStyle.outline).not.toBe("none");
    expect(forcedStyle.width).toBeGreaterThan(0);
    expect(forcedStyle.height).toBeGreaterThan(0);
  });
});
