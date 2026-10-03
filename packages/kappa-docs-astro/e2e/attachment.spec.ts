import { expect, type Locator, type Page, test } from "@playwright/test";

const parseRgb = (value: string) => {
  const hex = value.trim().match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (hex) return hex.slice(1).map((channel) => Number.parseInt(channel!, 16));

  const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3) throw new Error(`Expected an RGB color, received ${value}`);
  return channels;
};

const luminance = (value: string) => {
  const [red, green, blue] = parseRgb(value).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
};

const contrastRatio = (foreground: string, background: string) => {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0]! + 0.05) / (values[1]! + 0.05);
};

const demo = (page: Page, variant: string) =>
  page.locator(`[data-attachment-demo="${variant}"]`);

const roots = (container: Locator) => container.locator('[data-slot="attachment"]');

test.describe("Attachment documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/attachment");
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Attachment" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(roots(demo(page, "preview"))).toHaveCount(5);
    await expect(roots(demo(page, "composition"))).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/attachment"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(10);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Attachment", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(
      compact.getByRole("link", { name: "Previous page: Aspect Ratio" }),
    ).toHaveAttribute("href", "/docs/components/aspect-ratio");
    await expect(compact.getByRole("link", { name: "Next page: Autocomplete" })).toHaveAttribute(
      "href",
      "/docs/components/autocomplete",
    );
    await expect(footer.getByRole("link", { name: "Aspect Ratio", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Autocomplete", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Icons and Images",
      "States",
      "Sizes",
      "Orientation",
      "Attachment Group",
      "Full-card Trigger",
      "Right-to-left",
      "Accessibility",
      "API Reference",
      "Attachment.Root",
      "Attachment.Media",
      "Attachment.Action",
      "Attachment.Trigger",
      "Parts",
      "Exports",
    ]);

    const response = await request.get("/docs/components/attachment.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Attachment");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("Attachment.Trigger");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("exposes presentational states, media, sizes, and orientations", async ({ page }) => {
    const previewDemo = demo(page, "preview");
    const preview = roots(previewDemo).first();
    await expect(preview).toHaveJSProperty("tagName", "DIV");
    await expect(preview).toHaveAttribute("data-state", "done");
    await expect(preview).toHaveAttribute("data-size", "default");
    await expect(preview).toHaveAttribute("data-orientation", "vertical");
    await expect(preview).not.toHaveAttribute("role");
    await expect(previewDemo.locator('[data-orientation="vertical"]')).toHaveCount(3);
    await expect(previewDemo.locator('[data-orientation="horizontal"]')).toHaveCount(2);
    await expect(preview.getByRole("img", { name: "pressure.png contour preview" })).toHaveAttribute(
      "src",
      /^data:image\/svg\+xml/,
    );
    await expect(previewDemo.getByRole("button", { name: "Remove solver-log.txt" })).toHaveAttribute(
      "type",
      "button",
    );
    const [tileBox, tileMediaBox, rowBox] = await Promise.all([
      preview.boundingBox(),
      preview.locator('[data-slot="attachment-media"]').boundingBox(),
      previewDemo.locator('[data-orientation="horizontal"]').first().boundingBox(),
    ]);
    expect(tileBox).not.toBeNull();
    expect(tileMediaBox).not.toBeNull();
    expect(rowBox).not.toBeNull();
    expect(tileBox!.width).toBeGreaterThanOrEqual(112);
    expect(tileBox!.width).toBeLessThanOrEqual(128);
    expect(Math.abs(tileMediaBox!.width - tileMediaBox!.height)).toBeLessThan(1);
    expect(rowBox!.width).toBeGreaterThan(tileBox!.width * 3);

    const stateDemo = demo(page, "states");
    const stateNames = ["idle", "uploading", "processing", "error", "done"];
    await expect(roots(stateDemo)).toHaveCount(stateNames.length);
    for (const state of stateNames) {
      await expect(stateDemo.locator(`[data-slot="attachment"][data-state="${state}"]`)).toHaveCount(1);
    }
    await expect(stateDemo.getByRole("status")).toHaveCount(0);
    await expect(stateDemo.getByRole("alert")).toHaveCount(0);
    await expect(stateDemo.locator("#attachment-error-text")).toHaveText(
      "Upload failed. Check the file and try again.",
    );
    await expect(stateDemo.getByRole("button", { name: "Retry boundary-map.json" })).toBeVisible();

    const media = demo(page, "media");
    await expect(media.locator('[data-slot="attachment-media"][data-variant="icon"]')).toHaveCount(0);
    await expect(media.locator('[data-slot="attachment-media"][data-variant="image"]')).toHaveCount(3);
    await expect(media.getByRole("img", { name: "pressure.png contour preview" })).toBeVisible();

    const sizes = demo(page, "sizes");
    for (const size of ["default", "sm", "xs"]) {
      await expect(sizes.locator(`[data-slot="attachment"][data-size="${size}"]`)).toHaveCount(1);
    }
    const sizeHeights = await sizes.locator('[data-slot="attachment"]').evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    );
    expect(sizeHeights[0]).toBeGreaterThanOrEqual(56);
    expect(sizeHeights[0]).toBeLessThanOrEqual(60);
    expect(sizeHeights[1]).toBeLessThan(sizeHeights[0]!);
    expect(sizeHeights[2]).toBeLessThan(sizeHeights[1]!);
    expect(sizeHeights[2]).toBeGreaterThanOrEqual(36);

    const orientation = demo(page, "orientation");
    const horizontalCard = orientation.locator('[data-orientation="horizontal"]');
    const verticalCard = orientation.locator('[data-orientation="vertical"]');
    await expect(horizontalCard).toHaveCount(1);
    await expect(verticalCard).toHaveCount(1);
    await expect(verticalCard.getByRole("img", { name: "Velocity contour preview" })).toBeVisible();
    const [horizontalBox, verticalBox] = await Promise.all([
      horizontalCard.boundingBox(),
      verticalCard.boundingBox(),
    ]);
    expect(horizontalBox).not.toBeNull();
    expect(verticalBox).not.toBeNull();
    expect(verticalBox!.width).toBeGreaterThanOrEqual(112);
    expect(horizontalBox!.width).toBeGreaterThan(verticalBox!.width);
  });

  test("keeps full-card buttons, links, and actions independently operable", async ({ page }) => {
    const triggerDemo = demo(page, "trigger");
    const open = triggerDemo.getByRole("button", { name: "Open rotor-case.cas" });
    const remove = triggerDemo.getByRole("button", { name: "Remove rotor-case.cas" });
    const link = triggerDemo.getByRole("link", { name: "View solver-log.txt" });

    await expect(open).toHaveAttribute("type", "button");
    await expect(open).toHaveAttribute("data-as", "button");
    await expect(remove).toHaveAttribute("type", "button");
    await expect(link).toHaveAttribute("data-as", "a");
    await expect(link).toHaveAttribute("href", "#attachment-anchor-target");

    await open.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(open).toBeFocused();
    await expect
      .poll(() => open.evaluate((element) => getComputedStyle(element.parentElement!).boxShadow))
      .not.toBe("none");
    await open.press("Enter");
    await expect(triggerDemo.getByRole("status")).toHaveText("Opened rotor-case.cas");

    await remove.focus();
    await expect(remove).toBeFocused();
    await expect
      .poll(() => remove.evaluate((element) => getComputedStyle(element).outlineStyle))
      .toBe("solid");
    await remove.press("Space");
    await expect(triggerDemo.getByRole("status")).toHaveText("Removed rotor-case.cas");

    await remove.click();
    await expect(triggerDemo.getByRole("status")).toHaveText("Removed rotor-case.cas");
    await open.click({ position: { x: 16, y: 16 } });
    await expect(triggerDemo.getByRole("status")).toHaveText("Opened rotor-case.cas");

    await link.focus();
    await expect(link).toBeFocused();
    await link.press("Enter");
    await expect(page).toHaveURL(/#attachment-anchor-target$/);
  });

  test("supports keyboard scrolling, RTL, and narrow viewports without page overflow", async ({ page }) => {
    const group = demo(page, "group").locator(
      '[data-slot="attachment-group"][aria-label="Simulation attachments"]',
    );
    await expect(group).toHaveAttribute("role", "group");
    await expect(group).toHaveAttribute("tabindex", "0");
    expect(await group.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    expect(
      await group.evaluate(
        (element) => element.firstElementChild!.getBoundingClientRect().width < element.clientWidth,
      ),
    ).toBe(true);
    await expect(group.locator('[data-orientation="horizontal"]')).toHaveCount(4);
    const firstGroupItem = await group.locator('[data-slot="attachment"]').first().boundingBox();
    expect(firstGroupItem).not.toBeNull();
    expect(firstGroupItem!.width).toBeGreaterThanOrEqual(240);
    expect(firstGroupItem!.width).toBeLessThanOrEqual(272);
    await group.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(group).toBeFocused();
    await expect
      .poll(() => group.evaluate((element) => getComputedStyle(element).outlineStyle))
      .toBe("solid");
    await group.press("ArrowRight");
    await expect.poll(() => group.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

    const rtl = demo(page, "rtl");
    const root = roots(rtl).first();
    const media = root.locator('[data-slot="attachment-media"]');
    const content = root.locator('[data-slot="attachment-content"]');
    const action = root.getByRole("button", { name: "إزالة نتائج الضغط" });
    const [rootDirection, mediaBox, contentBox, actionBox] = await Promise.all([
      root.evaluate((element) => getComputedStyle(element).direction),
      media.boundingBox(),
      content.boundingBox(),
      action.boundingBox(),
    ]);
    expect(rootDirection).toBe("rtl");
    expect(mediaBox).not.toBeNull();
    expect(contentBox).not.toBeNull();
    expect(actionBox).not.toBeNull();
    expect(mediaBox!.x).toBeGreaterThan(contentBox!.x);
    expect(contentBox!.x).toBeGreaterThan(actionBox!.x);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await demo(page, "group").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    const mobileGroup = demo(page, "group").locator('[data-slot="attachment-group"]');
    const [groupBox, previewBox] = await Promise.all([
      mobileGroup.boundingBox(),
      mobileGroup.locator("xpath=ancestor::*[contains(@class, 'docs-component-preview')]").boundingBox(),
    ]);
    expect(groupBox).not.toBeNull();
    expect(previewBox).not.toBeNull();
    expect(groupBox!.width).toBeLessThanOrEqual(previewBox!.width);
  });

  test("responds to both themes and reduced-motion preferences", async ({ page }) => {
    const preview = roots(demo(page, "preview")).first();
    const readSurface = () =>
      preview.evaluate((element) => {
        const styles = getComputedStyle(element);
        return `${styles.backgroundColor}|${styles.color}|${styles.borderColor}`;
      });
    const lightSurface = await readSurface();

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(readSurface).not.toBe(lightSurface);

    const uploadingTitle = demo(page, "states")
      .locator('[data-state="uploading"] [data-slot="attachment-title"]');
    const uploadingRoot = demo(page, "states").locator('[data-state="uploading"]');
    const shimmerColors = await uploadingRoot.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        accent: styles.getPropertyValue("--kappa-attachment-accent").trim(),
        background: styles.backgroundColor,
      };
    });
    expect(contrastRatio(shimmerColors.accent, shimmerColors.background)).toBeGreaterThanOrEqual(4.5);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => uploadingTitle.evaluate((element) => getComputedStyle(element).animationDuration))
      .toMatch(/^(?:0s|0\.00001s|1e-05s)(?:, (?:0s|0\.00001s|1e-05s))*$/);
    await expect
      .poll(() => preview.evaluate((element) => getComputedStyle(element).transitionDuration))
      .toMatch(/^(?:0s|0\.00001s|1e-05s)(?:, (?:0s|0\.00001s|1e-05s))*$/);

    await page.emulateMedia({ forcedColors: "active", reducedMotion: "no-preference" });
    await expect
      .poll(() => uploadingTitle.evaluate((element) => getComputedStyle(element).backgroundImage))
      .toBe("none");
    await expect
      .poll(() => uploadingTitle.evaluate((element) => getComputedStyle(element).color))
      .not.toBe("rgba(0, 0, 0, 0)");

    const group = demo(page, "group").locator('[data-slot="attachment-group"]');
    await group.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect
      .poll(() => group.evaluate((element) => getComputedStyle(element).outlineWidth))
      .toBe("2px");

    const forcedTrigger = demo(page, "trigger").getByRole("button", {
      name: "Open rotor-case.cas",
    });
    await forcedTrigger.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect
      .poll(() =>
        forcedTrigger.evaluate((element) => getComputedStyle(element.parentElement!).outlineWidth),
      )
      .toBe("2px");
  });
});
