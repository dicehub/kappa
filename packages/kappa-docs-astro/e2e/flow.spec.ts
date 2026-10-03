import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-flow-demo="${variant}"]`);

test.describe("Flow documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/flow");
    await expect(
      demo(page, "preview").locator('[data-flow-positioned="true"]'),
    ).toHaveCount(6);
  });

  test("renders the public contract, examples, composition, navigation, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Flow" }),
    ).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(14);
    await expect(page.locator("[data-flow-demo]")).toHaveCount(14);
    await expect(
      page.locator("#composition [data-composition-tree='flow']"),
    ).toContainText("Flow.Parallel");
    await expect(page.locator("#root-api").locator("..")).toContainText(
      "onOverflowChange",
    );
    await expect(
      page.locator("#parts-api").locator("..").locator("tbody tr"),
    ).toHaveCount(5);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(
      2,
    );
    await expect(
      page.locator("#preview pre[data-language]").first(),
    ).toContainText('from "@dicehub/kappa/components/flow"');
    await expect(
      page.locator('.docs-page-header__title-row a[href*="ark-ui.com"]'),
    ).toHaveCount(0);

    const compact = page.getByRole("navigation", {
      name: "Adjacent documentation pages",
    });
    await expect(
      compact.getByRole("link", { name: "Previous page: Floating Panel" }),
    ).toHaveAttribute("href", "/docs/components/floating-panel");
    await expect(
      compact.getByRole("link", { name: "Next page: Format" }),
    ).toHaveAttribute("href", "/docs/components/format");

    const response = await request.get("/docs/components/flow.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Flow");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("FlowRootProps");
    expect(markdown).not.toContain("View Code");
  });

  test("lays out branches, anchors, disabled paths, vertical paths, and keyboard panning", async ({
    page,
  }) => {
    const preview = demo(page, "preview");
    await expect(preview.locator(".kappa-flow__connector-path")).toHaveCount(7);
    for (const path of await preview
      .locator(".kappa-flow__connector-path")
      .all()) {
      await expect(path).toHaveAttribute("d", /^M /);
      await expect(path).toHaveAttribute(
        "marker-end",
        /^url\(#kappa-flow-arrow-/,
      );
    }

    const spline = demo(page, "spline");
    await expect(spline.locator('[data-slot="flow"]')).toHaveAttribute(
      "data-connector",
      "spline",
    );
    const splinePaths = await spline
      .locator(".kappa-flow__connector-path")
      .evaluateAll((paths) =>
        paths.map((path) => path.getAttribute("d") ?? ""),
      );
    expect(splinePaths).toHaveLength(6);
    expect(splinePaths.every((path) => path.includes("C"))).toBe(true);

    const vertical = demo(page, "vertical");
    const verticalNodes = vertical.locator(".kappa-flow-node");
    await expect(verticalNodes).toHaveCount(3);
    const verticalTops = await verticalNodes.evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().top),
    );
    expect(verticalTops[0]).toBeLessThan(verticalTops[1]);
    expect(verticalTops[1]).toBeLessThan(verticalTops[2]);
    const verticalCenters = await verticalNodes.evaluateAll((nodes) =>
      nodes.map((node) => {
        const bounds = node.getBoundingClientRect();
        return bounds.left + bounds.width / 2;
      }),
    );
    expect(verticalCenters[0]).toBeCloseTo(verticalCenters[1], 1);
    expect(verticalCenters[1]).toBeCloseTo(verticalCenters[2], 1);
    const verticalPaths = await vertical
      .locator(".kappa-flow__connector-path")
      .evaluateAll((paths) =>
        paths.map((path) => path.getAttribute("d") ?? ""),
      );
    expect(verticalPaths.every((path) => !path.includes("Q"))).toBe(true);

    const customAnchor = demo(page, "anchor").locator(
      '[data-slot="flow-anchor"]',
    );
    await expect(customAnchor).toHaveCount(2);
    await expect(customAnchor.nth(0)).toHaveAttribute(
      "data-flow-anchor",
      "end",
    );
    await expect(customAnchor.nth(1)).toHaveAttribute(
      "data-flow-anchor",
      "start",
    );

    const disabled = demo(page, "disabled");
    await expect(
      disabled.locator('[data-slot="flow-node"][aria-disabled="true"]'),
    ).toHaveCount(1);
    await expect(
      disabled.locator(".kappa-flow__connector--disabled"),
    ).toHaveCount(2);

    const panning = demo(page, "panning").locator('[data-slot="flow"]');
    await expect(panning).toHaveClass(/kappa-flow--can-pan/);
    await expect(panning).toHaveAttribute("tabindex", "0");
    const content = panning.locator('[data-slot="flow-content"]');
    const scrollbar = panning.locator('[data-slot="flow-scrollbar-x"] span');
    const initialTransform = await content.getAttribute("style");
    const initialThumbLeft = await scrollbar.evaluate(
      (element) => getComputedStyle(element).left,
    );

    await panning.focus();
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() => content.getAttribute("style"))
      .not.toBe(initialTransform);
    await expect
      .poll(() =>
        scrollbar.evaluate((element) => getComputedStyle(element).left),
      )
      .not.toBe(initialThumbLeft);

    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });
});
