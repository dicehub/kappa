import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-skeleton-line-demo="${variant}"]`);

test.describe("Skeleton Line documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/skeleton-line");
  });

  test("renders examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Skeleton Line" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-skeleton-line")).toHaveCount(14);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/skeleton-line"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Skeleton Line", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Sidebar" })).toHaveAttribute(
      "href",
      "/docs/components/sidebar",
    );
    await expect(compact.getByRole("link", { name: "Next page: Slider" })).toHaveAttribute(
      "href",
      "/docs/components/slider",
    );
    await expect(footer.getByRole("link", { name: "Sidebar", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Slider", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Design",
      "Examples",
      "Exact Widths",
      "Heights",
      "Block Height",
      "Card",
      "Table",
      "Static",
      "Accessibility",
      "API Reference",
      "SkeletonLine",
      "Exports",
    ]);

    const response = await request.get("/docs/components/skeleton-line.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Skeleton Line");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("### [Block Height](#block-height)");
    expect(markdown).toContain("SkeletonLineProps");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("uses exact geometry and one accessible region status", async ({ page }) => {
    const basic = demo(page, "basic");
    const basicRegion = basic.locator('[aria-busy="true"]');
    const basicLines = basic.locator(".kappa-skeleton-line");
    await expect(basicRegion).toHaveCount(1);
    await expect(basicRegion.getByRole("status")).toHaveText("Loading article");
    await expect(basicLines).toHaveCount(3);
    expect(
      await basicLines.evaluateAll((elements) =>
        elements.every(
          (element) => element.getAttribute("aria-hidden") === "true" && !element.hasAttribute("role"),
        ),
      ),
    ).toBe(true);

    const widths = demo(page, "widths").locator(".kappa-skeleton-line");
    await expect(widths).toHaveCount(4);
    const resolvedWidths = await widths.evaluateAll((elements) =>
      elements.map((element) => Math.round(element.getBoundingClientRect().width)),
    );
    expect(resolvedWidths[0]).toBeGreaterThan(resolvedWidths[1]);
    expect(resolvedWidths[1]).toBeGreaterThan(resolvedWidths[2]);
    expect(resolvedWidths[3]).toBe(112);
    await expect(widths.nth(1)).toHaveCSS("--kappa-skeleton-line-width", "78%");

    const heights = demo(page, "heights").locator(".kappa-skeleton-line");
    const resolvedHeights = await heights.evaluateAll((elements) =>
      elements.map((element) => Math.round(element.getBoundingClientRect().height)),
    );
    expect(resolvedHeights).toEqual([8, 12, 20]);
  });

  test("reserves block, card, and table geometry", async ({ page }) => {
    const blocks = demo(page, "block-height").locator('[data-slot="skeleton-line-block"]');
    await expect(blocks).toHaveCount(3);
    const blockHeights = await blocks.evaluateAll((elements) =>
      elements.map((element) => Math.round(element.getBoundingClientRect().height)),
    );
    expect(blockHeights).toEqual([32, 48, 64]);

    for (let index = 0; index < 3; index += 1) {
      const centers = await blocks.nth(index).evaluate((element) => {
        const line = element.querySelector(".kappa-skeleton-line");
        const blockBox = element.getBoundingClientRect();
        const lineBox = line?.getBoundingClientRect();
        return {
          block: blockBox.top + blockBox.height / 2,
          line: lineBox ? lineBox.top + lineBox.height / 2 : 0,
        };
      });
      expect(Math.abs(centers.block - centers.line)).toBeLessThan(1);
    }

    const card = demo(page, "card");
    await expect(card.getByRole("status")).toHaveText("Loading profile");
    await expect(card.locator(".kappa-skeleton-line")).toHaveCount(4);
    const avatar = card.locator(".skeleton-line-demo__avatar");
    await expect(avatar).toHaveCSS("border-radius", "999px");
    await expect(avatar).toHaveCSS("width", "48px");
    await expect(avatar).toHaveCSS("height", "48px");

    const table = demo(page, "table");
    await expect(table.getByRole("status")).toHaveText("Loading records");
    await expect(table.locator(".kappa-skeleton-line")).toHaveCount(12);
  });

  test("supports themes, reduced motion, and mobile layout", async ({ page }) => {
    const basicLine = demo(page, "basic").locator(".kappa-skeleton-line").first();
    expect(
      await basicLine.evaluate((element) => getComputedStyle(element, "::after").animationName),
    ).toBe("kappa-skeleton-line-scan");

    const staticLine = demo(page, "static").locator(".kappa-skeleton-line");
    expect(
      await staticLine.evaluate((element) => getComputedStyle(element, "::after").animationName),
    ).toBe("none");

    const lightBackground = await basicLine.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => basicLine.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(lightBackground);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const reducedLine = demo(page, "basic").locator(".kappa-skeleton-line").first();
    expect(
      await reducedLine.evaluate((element) => getComputedStyle(element, "::after").animationName),
    ).toBe("none");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-skeleton-line").first()).toBeVisible();
  });
});
