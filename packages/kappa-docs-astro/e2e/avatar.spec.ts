import { expect, type Locator, type Page, test } from "@playwright/test";
import { waitForDocsIsland } from "./helpers/docs-island";

const demo = (page: Page, variant: string) => page.locator(`[data-avatar-demo="${variant}"]`);
const roots = (container: Locator) => container.locator('[data-slot="avatar"]');

const luminance = (value: string) => {
  const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3) throw new Error(`Expected an RGB color, received ${value}`);
  const [red, green, blue] = channels.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return red! * 0.2126 + green! * 0.7152 + blue! * 0.0722;
};

const contrastRatio = (foreground: string, background: string) => {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0]! + 0.05) / (values[1]! + 0.05);
};

test.describe("Avatar documentation", () => {
  test("renders public examples, navigation, TOC, Markdown, and stable hydration", async ({ page, request }) => {
    const hydrationWarnings: string[] = [];
    page.on("console", (message) => {
      if (/hydration.*(?:mismatch|completed but contains)/i.test(message.text())) {
        hydrationWarnings.push(message.text());
      }
    });
    await page.goto("/docs/components/avatar");

    await expect(page.getByRole("heading", { level: 1, name: "Avatar" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    const preview = demo(page, "preview");
    await expect(roots(preview)).toHaveCount(3);
    await expect(roots(demo(page, "composition"))).toHaveCount(1);
    expect(hydrationWarnings).toEqual([]);

    const imageAssets = await preview.locator('[data-slot="avatar-image"]').evaluateAll((images) =>
      images.map((image) => {
        const element = image as HTMLImageElement;
        return {
          height: element.naturalHeight,
          src: element.getAttribute("src"),
          width: element.naturalWidth,
        };
      }),
    );
    expect(imageAssets).toHaveLength(3);
    for (const image of imageAssets) {
      expect(image.src).toMatch(/^\/avatars\/[\w-]+\.webp$/);
      expect(image.width).toBe(256);
      expect(image.height).toBe(256);
    }
    const profileSurface = await preview.locator(".avatar-demo__profile-card").evaluate((element) => {
      const styles = getComputedStyle(element);
      return { backgroundImage: styles.backgroundImage, boxShadow: styles.boxShadow };
    });
    expect(profileSurface).toEqual({ backgroundImage: "none", boxShadow: "none" });

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/avatar"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(9);

    const revealButtons = page.getByRole("button", { name: "View Code" });
    await expect(revealButtons).toHaveCount(9);
    const previewBlock = page.locator("#preview .docs-code-block");
    await previewBlock.getByRole("button", { name: "View Code" }).click();
    await expect(previewBlock).toHaveAttribute("data-code-expanded", "true");
    await expect(page.locator("#avatar-preview-code pre")).toBeFocused();

    const sidebar = page.locator("#desktop-navigation").getByRole("link", { name: "Avatar", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Autocomplete" })).toHaveAttribute(
      "href",
      "/docs/components/autocomplete",
    );
    await expect(compact.getByRole("link", { name: "Next page: Badge" })).toHaveAttribute(
      "href",
      "/docs/components/badge",
    );
    await expect(footer.getByRole("link", { name: "Autocomplete", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Badge", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Image and Fallback",
      "Sizes",
      "Status Badge",
      "Avatar Group",
      "Account Menu Trigger",
      "Right-to-left",
      "Accessibility",
      "API Reference",
      "Avatar.Root",
      "Parts",
      "Exports",
    ]);

    const response = await request.get("/docs/components/avatar.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Avatar");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("Avatar.GroupCount");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("shows successful images, error fallbacks, and status transitions", async ({ page }) => {
    await page.goto("/docs/components/avatar");

    const usage = demo(page, "usage");
    const loadedImage = usage.locator('[data-slot="avatar-image"]');
    const loadedFallback = usage.locator('[data-slot="avatar-fallback"]');
    await expect(loadedImage).toHaveAttribute("alt", "Mei Chen");
    await expect(loadedImage).toHaveAttribute("data-state", "visible");
    await expect(loadedImage).toBeVisible();
    await expect(loadedFallback).toHaveAttribute("data-state", "hidden");
    await expect(loadedFallback).toBeHidden();

    const fallback = demo(page, "fallback");
    const image = fallback.locator('[data-slot="avatar-image"]');
    const fallbackText = fallback.locator('[data-slot="avatar-fallback"]');
    await expect(fallback.getByText("Image event: error")).toBeVisible();
    await expect(image).toHaveAttribute("data-state", "hidden");
    await expect(image).toBeHidden();
    await expect(fallbackText).toHaveAttribute("data-state", "visible");
    await expect(fallbackText).toBeVisible();
    await expect(fallback.getByRole("status")).toHaveCount(0);

    await fallback.getByRole("button", { name: "Load portrait" }).click();
    await expect(fallback.getByText("Image event: loaded")).toBeVisible();
    await expect(image).toHaveAttribute("data-state", "visible");
    await expect(image).toBeVisible();
    await expect(fallbackText).toBeHidden();

    await fallback.getByRole("button", { name: "Break portrait" }).click();
    await expect(fallback.getByText("Image event: error")).toBeVisible();
    await expect(fallbackText).toBeVisible();
  });

  test("renders sizes, meaningful badges, and contextual groups", async ({ page }) => {
    await page.goto("/docs/components/avatar");

    const sizes = demo(page, "sizes");
    for (const [size, pixels] of [["sm", 24], ["default", 32], ["lg", 40]] as const) {
      const root = sizes.locator(`[data-slot="avatar"][data-size="${size}"]`);
      await expect(root).toHaveCount(1);
      const box = await root.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeCloseTo(pixels, 0);
      expect(box!.height).toBeCloseTo(pixels, 0);
    }

    const presence = demo(page, "badge");
    const badge = presence.getByRole("img", { name: "Online" });
    await expect(badge).toHaveAttribute("data-slot", "avatar-badge");
    await expect(presence.getByText("Online", { exact: true })).toBeVisible();
    await expect(presence.getByRole("status")).toHaveCount(0);

    const groupDemo = demo(page, "group");
    const group = groupDemo.getByRole("group", { name: "Review team" });
    await expect(group).toHaveAttribute("data-slot", "avatar-group");
    await expect(roots(group)).toHaveCount(3);
    const count = group.locator('[data-slot="avatar-group-count"]');
    await expect(count).toContainText("+3");
    await expect(count).toContainText("3 additional reviewers");
    expect((await count.boundingBox())?.width).toBeCloseTo(24, 0);

    const avatarBoxes = await roots(group).evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect()),
    );
    expect(avatarBoxes[1]!.x).toBeLessThan(avatarBoxes[0]!.right);
  });

  test("composes inside a labelled account button and supports RTL", async ({ page }) => {
    await page.goto("/docs/components/avatar");

    const dropdown = demo(page, "dropdown");
    await waitForDocsIsland(dropdown);
    const trigger = dropdown.getByRole("button", { name: "Open account menu for Lina Haddad" });
    await expect(trigger).toHaveAttribute("type", "button");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger.locator('[data-slot="avatar-image"]')).toHaveAttribute("alt", "");
    await expect(trigger.locator('[data-slot="avatar-fallback"]')).toHaveAttribute("aria-hidden", "true");
    await trigger.focus();
    await expect(trigger).toBeFocused();
    await expect.poll(() => trigger.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");
    await trigger.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    const accountMenu = page.getByRole("menu", { name: "Account options" });
    await expect(accountMenu).toBeVisible();
    await expect(accountMenu.getByRole("menuitem")).toHaveText(["Profile", "Sign out"]);
    await expect.poll(() => accountMenu.evaluate((element) => getComputedStyle(element).boxShadow)).toBe("none");
    await page.locator("#account-menu + p").click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(accountMenu).toBeHidden();

    await trigger.focus();
    await trigger.press("ArrowDown");
    await expect(accountMenu).toBeVisible();
    const profileItem = accountMenu.getByRole("menuitem", { name: "Profile" });
    await expect(accountMenu).toBeFocused();
    await expect(profileItem).toHaveAttribute("data-highlighted", "");
    const profileId = await profileItem.getAttribute("id");
    expect(profileId).not.toBeNull();
    await expect(accountMenu).toHaveAttribute("aria-activedescendant", profileId!);
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(accountMenu).toBeHidden();
    await expect(trigger).toBeFocused();

    const accountMenuHeading = page.locator("#account-menu");
    await page.evaluate(() => {
      document.documentElement.style.setProperty("scroll-behavior", "auto", "important");
    });
    await page.evaluate(() => scrollTo(0, 0));
    await page
      .getByRole("complementary", { name: "On this page" })
      .getByRole("link", { name: "Account Menu Trigger" })
      .click();
    await expect(page).toHaveURL(/#account-menu$/);
    await accountMenuHeading.evaluate((element) => element.scrollIntoView({ block: "start" }));
    await expect.poll(async () => {
      const [headerBox, headingBox] = await Promise.all([
        page.locator(".docs-header").boundingBox(),
        accountMenuHeading.boundingBox(),
      ]);
      if (!headerBox || !headingBox) return null;
      return Math.round(headingBox.y - (headerBox.y + headerBox.height));
    }).toBeGreaterThanOrEqual(8);
    await expect.poll(async () => {
      const [headerBox, headingBox] = await Promise.all([
        page.locator(".docs-header").boundingBox(),
        accountMenuHeading.boundingBox(),
      ]);
      if (!headerBox || !headingBox) return null;
      return Math.round(headingBox.y - (headerBox.y + headerBox.height));
    }).toBeLessThanOrEqual(32);

    const rtl = demo(page, "rtl");
    const rtlRoot = roots(rtl).first();
    const rtlImage = rtlRoot.locator('[data-slot="avatar-image"]');
    const rtlFallback = rtlRoot.locator('[data-slot="avatar-fallback"]');
    for (const element of [rtlRoot, rtlImage, rtlFallback]) {
      await expect.poll(() => element.evaluate((node) => getComputedStyle(node).direction)).toBe("rtl");
    }
    const [rootBox, badgeBox] = await Promise.all([
      rtlRoot.boundingBox(),
      rtlRoot.locator('[data-slot="avatar-badge"]').boundingBox(),
    ]);
    expect(rootBox).not.toBeNull();
    expect(badgeBox).not.toBeNull();
    expect(badgeBox!.x).toBeLessThan(rootBox!.x + rootBox!.width / 2);
  });

  test("adapts to dark mode and narrow viewports without overflow", async ({ page }) => {
    await page.goto("/docs/components/avatar");

    const visibleFallback = demo(page, "fallback").locator('[data-slot="avatar-fallback"]');
    const readSurface = () => visibleFallback.evaluate((element) => {
      const styles = getComputedStyle(element);
      return `${styles.backgroundColor}|${styles.color}`;
    });
    const lightSurface = await readSurface();
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(readSurface).not.toBe(lightSurface);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await demo(page, "preview").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    const [cardBox, previewBox] = await Promise.all([
      demo(page, "preview").locator(".avatar-demo__profile-card").boundingBox(),
      demo(page, "preview").locator("xpath=ancestor::*[contains(@class, 'docs-component-preview')]").boundingBox(),
    ]);
    expect(cardBox).not.toBeNull();
    expect(previewBox).not.toBeNull();
    expect(cardBox!.width).toBeLessThanOrEqual(previewBox!.width);

    await page.emulateMedia({ forcedColors: "active" });
    const forcedBadge = demo(page, "badge").locator('[data-slot="avatar-badge"]');
    const forcedColors = await forcedBadge.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        background: styles.backgroundColor,
        foreground: styles.color,
        adjustment: styles.forcedColorAdjust,
      };
    });
    expect(forcedColors.adjustment).toBe("none");
    expect(contrastRatio(forcedColors.foreground, forcedColors.background)).toBeGreaterThanOrEqual(3);
  });
});
