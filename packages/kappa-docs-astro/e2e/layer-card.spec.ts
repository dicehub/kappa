import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-layer-card-demo="${variant}"]`);

test.describe("Layer Card documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/layer-card");
  });

  test("renders examples, navigation, TOC, composition, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Layer Card" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(7);
    await expect(page.locator('#composition [data-composition-tree="layerCard"]')).toContainText(
      "LayerCard.Primary",
    );
    await expect(page.locator("#layer-card-api").locator("..")).toContainText('"form"');
    await expect(page.locator("#parts").locator("..")).toContainText("LayerCard.Secondary");
    await expect(page.locator("#preview [data-code-full] pre[data-language]")).toContainText(
      'from "@dicehub/kappa/components/layer-card"',
    );
    await expect(page.locator('.docs-page-header__title-row a[href*="ark-ui.com"]')).toHaveCount(0);

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(compact.getByRole("link", { name: "Previous page: Label" })).toHaveAttribute(
      "href",
      "/docs/components/label",
    );
    await expect(compact.getByRole("link", { name: "Next page: Link" })).toHaveAttribute(
      "href",
      "/docs/components/link",
    );
    await expect(footer.getByRole("link", { name: "Label", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Link", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Layered Content",
      "Simple Surface",
      "Interactive Primary Link",
      "Layered States",
      "Filter Toolbar with Small Tabs",
      "Accessibility",
      "API Reference",
      "LayerCard",
      "Parts",
      "Data Slots",
      "Exports",
    ]);

    const response = await request.get("/docs/components/layer-card.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Layer Card");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Layered States](#layered-states)");
    expect(markdown).toContain('import {\n  LayerCard,');
    expect(markdown).toContain("LayerCard");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("keeps the primary surface square inside the rounded outer layer", async ({ page }) => {
    const layered = demo(page, "layered");
    const root = layered.locator(".kappa-layer-card");
    const secondary = layered.locator(".kappa-layer-card__secondary");
    const primary = layered.locator(".kappa-layer-card__primary");

    await expect(root).toHaveAttribute("data-slot", "layer-card");
    await expect(secondary).toHaveAttribute("data-slot", "layer-card-secondary");
    await expect(primary).toHaveAttribute("data-slot", "layer-card-primary");
    await expect(root).toHaveCSS("border-top-left-radius", "10px");
    await expect(root).toHaveCSS("overflow", "hidden");
    for (const corner of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      await expect(primary).toHaveCSS(`border-${corner}-radius`, "0px");
    }
    await expect(primary).toHaveCSS("border-top-width", "0px");
    const primaryRing = await primary.evaluate((element) => getComputedStyle(element).boxShadow);
    expect(primaryRing).not.toBe("none");
    expect(primaryRing).toContain("0px 0px 0px 1px");
    await expect(secondary).toHaveCSS("height", "36px");

    const [rootBox, primaryBox, secondaryBox] = await Promise.all([
      root.boundingBox(),
      primary.boundingBox(),
      secondary.boundingBox(),
    ]);
    expect(Math.abs(rootBox!.x - primaryBox!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(rootBox!.width - primaryBox!.width)).toBeLessThanOrEqual(1);
    expect(
      Math.abs(rootBox!.y + rootBox!.height - (primaryBox!.y + primaryBox!.height)),
    ).toBeLessThanOrEqual(1);
    expect(Math.abs(secondaryBox!.y + secondaryBox!.height - primaryBox!.y)).toBeLessThanOrEqual(1);

    const lightColors = await Promise.all([
      secondary.evaluate((element) => getComputedStyle(element).backgroundColor),
      primary.evaluate((element) => getComputedStyle(element).backgroundColor),
    ]);
    expect(lightColors[0]).not.toBe(lightColors[1]);

    await page.locator(".docs-header").getByRole("button", { name: "Toggle theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-kappa-theme", "dark");
    const darkColors = await Promise.all([
      secondary.evaluate((element) => getComputedStyle(element).backgroundColor),
      primary.evaluate((element) => getComputedStyle(element).backgroundColor),
    ]);
    expect(darkColors[0]).not.toBe(darkColors[1]);
    expect(darkColors).not.toEqual(lightColors);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(primary).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });

  test("supports simple surfaces, attribute forwarding, and linked states", async ({ page }) => {
    const simple = demo(page, "simple").locator(".kappa-layer-card");
    await expect(simple).toHaveJSProperty("tagName", "SECTION");
    await expect(simple).toHaveCSS("padding-left", "16px");
    await expect(simple.locator(".kappa-layer-card__primary")).toHaveCount(0);

    const states = demo(page, "states");
    const rootLink = states.locator("[data-interactive-root]");
    await expect(rootLink).toHaveJSProperty("tagName", "A");
    await expect(rootLink).toHaveAttribute("href", "#layered-states");
    await expect(rootLink).toHaveAttribute("data-slot", "layer-card");
    await expect(rootLink).toHaveCSS("text-decoration-line", "none");
    await rootLink.focus();
    await expect(rootLink).toHaveCSS("outline-style", "solid");

    const linked = demo(page, "linked").locator("[data-interactive-primary]");
    await expect(linked).toHaveJSProperty("tagName", "A");
    await expect(linked).toHaveAttribute("href", "#interactive-primary");
    const restShadow = await linked.evaluate((element) => getComputedStyle(element).boxShadow);
    await linked.hover();
    await expect
      .poll(() => linked.evaluate((element) => getComputedStyle(element).boxShadow))
      .not.toBe(restShadow);

    await linked.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(linked).toBeFocused();
    await expect(linked).toHaveCSS("outline-style", "solid");
    await expect(linked).toHaveCSS("outline-width", "2px");
  });

  test("filters request rows with small tabs and a search input", async ({ page }) => {
    const toolbar = demo(page, "filter-toolbar");
    const rows = toolbar.locator("tbody tr");
    const input = toolbar.getByLabel("Filter origins");
    const tablist = toolbar.getByRole("tablist", { name: "Filter by status" });

    await expect(toolbar.locator(".kappa-layer-card")).toHaveCSS("border-top-left-radius", "10px");
    await expect(input).toHaveCSS("height", "28px");
    await expect(tablist).toHaveCSS("height", "28px");
    await expect(toolbar.getByRole("tab")).toHaveCount(5);
    expect(
      await tablist.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    ).toBe(true);
    await expect(rows).toHaveCount(6);
    await expect(toolbar.getByText("Showing 6 of 6 requests")).toBeVisible();
    await expect(toolbar.getByRole("status")).toHaveCount(0);

    await toolbar.getByRole("tab", { name: "4xx" }).click();
    await expect(toolbar.locator(".kappa-tabs__indicator")).toHaveCount(1);
    await expect(toolbar.locator(".kappa-tabs__indicator")).toBeVisible();
    await expect(rows).toHaveCount(2);
    await expect(toolbar.getByText("Showing 2 of 6 requests")).toBeVisible();

    await input.fill("legacy");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("legacy.dicehub.com /v0/solve");

    await input.fill("missing");
    await expect(rows).toHaveCount(0);
    await expect(toolbar.getByRole("status")).toContainText("No origins match the current filter.");

    await toolbar.getByRole("button", { name: "Reset filters" }).click();
    await expect(rows).toHaveCount(6);
    await expect(input).toHaveValue("");
    await expect(toolbar.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await page.setViewportSize({ width: 420, height: 900 });
    await expect(toolbar.locator(".layer-card-demo__toolbar")).toHaveCSS(
      "flex-direction",
      "column",
    );
  });
});
