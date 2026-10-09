import { expect, type Locator, type Page, test } from "@playwright/test";
import { waitForDocsIsland } from "./helpers/docs-island";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-button-group-demo="${variant}"]`);

const group = (scope: Locator, name: string) =>
  scope.getByRole("group", { name, exact: true });

const directControls = (scope: Locator) =>
  scope.locator(
    ':scope > [data-slot="button"], :scope > [data-slot="link-button"]',
  );

test.describe("Button Group documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/button-group");
  });

  test("renders examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Button Group" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator("[data-preview-group]")).toHaveCount(1);

    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(17);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('.docs-code-full pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator(".docs-code-full pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/button-group"',
    );
    await expect(page.locator('pre:has-text("../../../kappa/src")')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "View Code" })).toHaveCount(17);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Button Group", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Button" })).toHaveAttribute(
      "href",
      "/docs/components/button",
    );
    await expect(compact.getByRole("link", { name: "Next page: Card" })).toHaveAttribute(
      "href",
      "/docs/components/card",
    );
    await expect(footer.getByRole("link", { name: "Button", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Card", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Basic",
      "Orientation",
      "Sizes",
      "Nested",
      "Separator",
      "Split",
      "Input",
      "Input Group",
      "Dropdown Menu",
      "Select",
      "Popover",
      "Text and asChild",
      "Link Buttons",
      "RTL",
      "Accessibility",
      "API Reference",
      "ButtonGroup",
      "ButtonGroup.Text",
      "ButtonGroup.Separator",
      "Exports",
    ]);

    const response = await request.get("/docs/components/button-group.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Button Group");
    expect(markdown).toContain('from "@lucide/vue"');
    expect(markdown).toContain("### [Basic](#basic)");
    expect(markdown).toContain("### [Input](#input)");
    expect(markdown).toContain("### [Input Group](#input-group)");
    expect(markdown).toContain("### [Dropdown Menu](#dropdown-menu)");
    expect(markdown).toContain("### [Select](#select)");
    expect(markdown).toContain("### [Popover](#popover)");
    expect(markdown).toContain("### [Text and asChild](#text-as-child)");
    expect(markdown).toContain("resolveButtonGroupSeparatorOrientation");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("keeps semantic grouping and native sequential keyboard behavior", async ({ page }) => {
    const basic = group(demo(page, "basic"), "Result actions");
    const controls = directControls(basic);

    await expect(basic).toHaveAttribute("role", "group");
    await expect(basic).toHaveAttribute("data-slot", "button-group");
    await expect(basic).toHaveAttribute("data-orientation", "horizontal");
    await expect(basic).not.toHaveAttribute("aria-orientation");
    await expect(controls).toHaveCount(3);
    for (const control of await controls.all()) {
      await expect(control).toHaveAttribute("type", "button");
    }

    const open = basic.getByRole("button", { name: "Open" });
    const compare = basic.getByRole("button", { name: "Compare" });
    const exportButton = basic.getByRole("button", { name: "Export" });
    await open.focus();
    await page.keyboard.press("Tab");
    await expect(compare).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(compare).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(exportButton).toBeFocused();

    await compare.focus();
    const focused = await compare.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        outline: styles.outlineStyle,
        outlineWidth: Number.parseFloat(styles.outlineWidth),
        zIndex: styles.zIndex,
      };
    });
    expect(focused.outline).not.toBe("none");
    expect(focused.outlineWidth).toBeGreaterThanOrEqual(2);
    expect(focused.zIndex).toBe("2");
    await compare.evaluate((element) => {
      (element as HTMLElement).blur();
      element.setAttribute("aria-invalid", "true");
    });
    await expect.poll(() => compare.evaluate((element) => getComputedStyle(element).zIndex)).toBe(
      "2",
    );
    await compare.evaluate((element) => element.removeAttribute("aria-invalid"));

    const seams = await controls.evaluateAll((elements) =>
      elements.map((element) => {
        const styles = getComputedStyle(element);
        return {
          borderLeft: styles.borderLeftWidth,
          endRadius: styles.borderTopRightRadius,
          startRadius: styles.borderTopLeftRadius,
        };
      }),
    );
    expect(seams[0]?.startRadius).not.toBe("0px");
    expect(seams[0]?.endRadius).toBe("0px");
    expect(seams[1]?.borderLeft).toBe("0px");
    expect(seams[2]?.endRadius).not.toBe("0px");
  });

  test("supports orientations, child-owned sizes, and nested clusters", async ({ page }) => {
    const orientation = demo(page, "orientation");
    const horizontal = group(orientation, "Horizontal zoom controls");
    const vertical = group(orientation, "Vertical zoom controls");
    await expect(horizontal).toHaveAttribute("data-orientation", "horizontal");
    await expect(vertical).toHaveAttribute("data-orientation", "vertical");

    const horizontalBoxes = await directControls(horizontal).evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect()),
    );
    const verticalBoxes = await directControls(vertical).evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect()),
    );
    expect(horizontalBoxes[0]!.x).toBeLessThan(horizontalBoxes[1]!.x);
    expect(verticalBoxes[0]!.y).toBeLessThan(verticalBoxes[1]!.y);
    expect(Math.abs(verticalBoxes[0]!.x - verticalBoxes[1]!.x)).toBeLessThanOrEqual(1);

    const sizeNames = ["xs", "sm", "base", "lg"];
    const expectedRadii = [4, 4, 4, 4];
    const sizeHeights: number[] = [];
    for (const [index, size] of sizeNames.entries()) {
      const sizeGroup = demo(page, "sizes").locator(`[data-size-group="${size}"]`);
      const controls = directControls(sizeGroup);
      const heights = await controls.evaluateAll((elements) =>
        elements.map((element) => element.getBoundingClientRect().height),
      );
      expect(new Set(heights).size).toBe(1);
      sizeHeights.push(heights[0]!);
      await expect(controls.first()).toHaveAttribute("data-size", size);
      const outerRadii = await Promise.all([
        controls.first().evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).borderTopLeftRadius),
        ),
        controls.last().evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).borderTopRightRadius),
        ),
      ]);
      expect(outerRadii).toEqual([expectedRadii[index], expectedRadii[index]]);
    }
    expect(sizeHeights).toEqual([...sizeHeights].sort((a, b) => a - b));

    const nested = group(demo(page, "nested"), "Editor actions");
    const clusters = nested.locator(':scope > [data-slot="button-group"]');
    await expect(clusters).toHaveCount(2);
    await expect(clusters.nth(0)).toHaveAccessibleName("History actions");
    await expect(clusters.nth(1)).toHaveAccessibleName("Editor state actions");
    await expect(nested).toHaveCSS("gap", "8px");
    const clusterBoxes = await clusters.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect()),
    );
    expect(clusterBoxes[1]!.x - (clusterBoxes[0]!.x + clusterBoxes[0]!.width)).toBeGreaterThan(0);
  });

  test("renders semantic separators, split actions, text asChild, and links", async ({ page }) => {
    const separatorDemo = demo(page, "separator");
    const horizontal = group(separatorDemo, "Clipboard actions");
    const verticalSeparator = horizontal.getByRole("separator");
    await expect(verticalSeparator).toHaveAttribute("data-slot", "button-group-separator");
    await expect(verticalSeparator).toHaveAttribute("aria-orientation", "vertical");
    await expect(horizontal.getByRole("button", { name: "Copy" })).toHaveAttribute(
      "data-variant",
      "ghost",
    );
    await expect
      .poll(() =>
        horizontal
          .getByRole("button", { name: "Copy" })
          .evaluate((element) => getComputedStyle(element).borderRightWidth),
      )
      .toBe("0px");
    const verticalLine = await verticalSeparator.boundingBox();
    expect(verticalLine).not.toBeNull();
    expect(verticalLine!.width).toBeLessThan(verticalLine!.height);

    const vertical = group(separatorDemo, "Case lifecycle");
    const horizontalSeparator = vertical.getByRole("separator");
    await expect(horizontalSeparator).toHaveAttribute("aria-orientation", "horizontal");
    await expect
      .poll(() =>
        vertical
          .getByRole("button", { name: "Prepare" })
          .evaluate((element) => getComputedStyle(element).borderBottomWidth),
      )
      .toBe("0px");
    const horizontalLine = await horizontalSeparator.boundingBox();
    expect(horizontalLine).not.toBeNull();
    expect(horizontalLine!.height).toBeLessThan(horizontalLine!.width);

    const split = group(demo(page, "split"), "Run case");
    const duplicate = split.getByRole("button", { name: "Duplicate case and run" });
    await expect(split.getByRole("separator")).toHaveCount(1);
    await expect(duplicate).not.toHaveAttribute("aria-haspopup");
    await expect(duplicate.locator("svg")).toHaveClass(/lucide-copy/);

    const text = demo(page, "text");
    const defaultText = text.locator("[data-text-default]");
    const customText = text.locator("[data-text-as-child]");
    await expect(defaultText).toHaveJSProperty("tagName", "DIV");
    await expect(defaultText).toHaveAttribute("data-slot", "button-group-text");
    await expect(customText).toHaveJSProperty("tagName", "STRONG");
    await expect(customText).toHaveAttribute("data-slot", "button-group-text");
    await expect(customText).toHaveClass(/kappa-button-group__text/);
    const [textBox, baseButtonBox] = await Promise.all([
      defaultText.boundingBox(),
      group(text, "Time step limit").getByRole("button", { name: "0.002 s" }).boundingBox(),
    ]);
    expect(textBox).not.toBeNull();
    expect(baseButtonBox).not.toBeNull();
    expect(Math.abs(textBox!.height - baseButtonBox!.height)).toBeLessThanOrEqual(1);

    const links = group(demo(page, "links"), "Run navigation");
    await expect(links.getByRole("link")).toHaveCount(2);
    await expect(links.getByRole("link", { name: "Summary" })).toHaveAttribute(
      "href",
      "#usage",
    );
    await expect(links.getByRole("link", { name: "Fields" })).toHaveAttribute(
      "href",
      "#examples",
    );
    await expect(links.getByRole("link", { name: "Fields" })).toHaveClass(/kappa-button/);
    await expect(directControls(links)).toHaveCount(3);
  });

  test("preserves interaction states, themes, reduced motion, and mobile width", async ({ page }) => {
    const preview = demo(page, "preview");
    await waitForDocsIsland(preview);
    await preview.getByRole("button", { name: "Validate" }).click();
    await expect(preview.getByRole("status")).toHaveText("Validated");

    const basic = group(demo(page, "basic"), "Result actions");
    const compare = basic.getByRole("button", { name: "Compare" });
    const baseGroupStyle = await basic.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { backgroundImage: styles.backgroundImage, boxShadow: styles.boxShadow };
    });
    expect(baseGroupStyle.backgroundImage).toBe("none");
    expect(baseGroupStyle.boxShadow).toBe("none");

    const compareBox = await compare.boundingBox();
    expect(compareBox).not.toBeNull();
    await page.mouse.move(
      compareBox!.x + compareBox!.width / 2,
      compareBox!.y + compareBox!.height / 2,
    );
    await page.mouse.down();
    await expect.poll(() => compare.evaluate((element) => getComputedStyle(element).transform)).toBe(
      "none",
    );
    await page.mouse.up();

    const textSurface = demo(page, "text").locator("[data-text-default]");
    const lightBackground = await textSurface.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => textSurface.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(lightBackground);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() =>
        compare.evaluate((element) =>
          Math.max(
            ...getComputedStyle(element)
              .transitionDuration.split(",")
              .map(Number.parseFloat),
          ),
        ),
      )
      .toBeLessThanOrEqual(0.001);

    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    const separator = group(demo(page, "separator"), "Clipboard actions").getByRole("separator");
    await expect
      .poll(() => separator.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe("rgba(0, 0, 0, 0)");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(demo(page, "preview").locator("[data-preview-group]")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });

  test("uses logical seams and directional icons in RTL", async ({ page }) => {
    const rtl = group(demo(page, "rtl"), "إجراءات الحالة");
    await expect(rtl).toHaveCSS("direction", "rtl");
    const controls = directControls(rtl);
    await expect(controls).toHaveCount(3);
    const boxes = await controls.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect()),
    );
    expect(boxes[0]!.x).toBeGreaterThan(boxes[1]!.x);
    expect(boxes[1]!.x).toBeGreaterThan(boxes[2]!.x);

    const logicalStyles = await controls.evaluateAll((elements) =>
      elements.map((element) => {
        const styles = getComputedStyle(element);
        return {
          borderRight: styles.borderRightWidth,
          leftRadius: styles.borderTopLeftRadius,
          rightRadius: styles.borderTopRightRadius,
        };
      }),
    );
    expect(logicalStyles[0]?.rightRadius).not.toBe("0px");
    expect(logicalStyles[0]?.leftRadius).toBe("0px");
    expect(logicalStyles[1]?.borderRight).toBe("0px");
    expect(logicalStyles[2]?.leftRadius).not.toBe("0px");
    await expect(rtl.getByRole("button", { name: "العودة" }).locator("svg")).toHaveClass(
      /lucide-arrow-right/,
    );
  });
});
