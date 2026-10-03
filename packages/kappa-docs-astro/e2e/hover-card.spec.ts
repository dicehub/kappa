import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-hover-card-demo="${variant}"]`);
const surface = (page: Page, variant: string) =>
  page.locator(`[data-hover-card-demo-surface="${variant}"]`);

async function openHoverCard(trigger: Locator, content: Locator) {
  await trigger.scrollIntoViewIfNeeded();
  await trigger.hover();
  await expect(content).toBeVisible();
  return content;
}

test.describe("Hover Card documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/hover-card");
  });

  test("renders the complete docs surface and copy-ready references", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Hover Card" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);

    for (const variant of [
      "preview",
      "usage",
      "interactive-preview",
      "placement",
      "delay-control",
      "controlled",
      "custom-arrow",
      "long-preview",
      "disabled",
    ]) {
      await expect(demo(page, variant)).toHaveCount(1);
    }

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/hover-card",
    );
    await expect(page.locator('[data-composition-tree="hoverCard"]')).toContainText(
      "HoverCard.ArrowTip",
    );
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator("pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/hover-card"',
    );

    const response = await request.get("/docs/components/hover-card.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Hover Card");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("HoverCard.Content");
    expect(markdown).not.toContain("On this page");
  });

  test("opens from hover and focus, keeps interactive content reachable, and follows placement", async ({
    page,
  }) => {
    const preview = demo(page, "preview");
    const previewTrigger = preview.getByRole("button", { name: "Inspect run" });
    const previewContent = await openHoverCard(previewTrigger, surface(page, "preview"));
    await expect(previewContent).toContainText("Wake refinement");
    await expect(previewContent.locator("a", { hasText: "Open run report" })).toBeVisible();
    await expect(previewContent).not.toHaveCSS("pointer-events", "none");
    await expect(previewContent).toHaveAttribute("data-side", /.+/);
    const previewArrow = previewContent
      .locator("xpath=..")
      .locator('[data-slot="hover-card-arrow"]');
    await expect(previewArrow).toHaveCSS("animation-name", "kappa-hover-card-arrow-in");
    await expect(previewArrow).toHaveCSS("z-index", "2");

    await page.mouse.move(2, 2);
    await expect(previewContent).toBeHidden();
    await previewTrigger.focus();
    await expect(previewContent).toBeVisible();
    await page.mouse.move(2, 2);

    const placements = demo(page, "placement");
    const placementBoxes = Object.fromEntries(
      await Promise.all(
        ["Top", "Bottom", "Left", "Right"].map(async (label) => [
          label.toLowerCase(),
          await placements.getByRole("button", { name: label, exact: true }).boundingBox(),
        ]),
      ),
    );
    expect(placementBoxes.left!.x).toBeLessThan(placementBoxes.top!.x);
    expect(placementBoxes.right!.x).toBeGreaterThan(placementBoxes.top!.x);
    expect(placementBoxes.top!.y).toBeLessThan(placementBoxes.left!.y);
    expect(placementBoxes.bottom!.y).toBeGreaterThan(placementBoxes.left!.y);
    for (const side of ["top", "bottom", "left", "right"] as const) {
      const label = side[0].toUpperCase() + side.slice(1);
      const trigger = placements.getByRole("button", { name: label, exact: true });
      const content = await openHoverCard(trigger, surface(page, `placement-${side}`));
      await expect(content).toHaveAttribute("data-side", side);
      await expect(
        content.locator("xpath=..").locator('[data-slot="hover-card-arrow-tip"]'),
      ).toHaveCSS("clip-path", "polygon(0px 0px, 100% 0px, 0px 100%)");
      await page.mouse.move(2, 2);
      await expect(content).toBeHidden();
    }

    const custom = demo(page, "custom-arrow");
    const customContent = await openHoverCard(
      custom.getByRole("button", { name: "Custom arrow" }),
      surface(page, "custom-arrow"),
    );
    const customTip = customContent
      .locator("xpath=..")
      .locator('[data-slot="hover-card-arrow-tip"]');
    await expect(customTip).toHaveCSS("background-color", "rgb(36, 121, 182)");
    await expect(customTip).toHaveCSS("clip-path", /polygon/);
  });

  test("supports controlled state, disabled state, reduced motion, and viewport bounds", async ({
    page,
  }) => {
    const controlled = demo(page, "controlled");
    const controlledTrigger = controlled.getByRole("button", { name: "Hover or focus" });
    await expect(controlled.getByRole("status")).toHaveText("State: closed");
    await controlledTrigger.hover();
    await expect(controlled.getByRole("status")).toHaveText("State: open");
    await page.mouse.move(2, 2);
    await expect(controlled.getByRole("status")).toHaveText("State: closed");

    const disabled = demo(page, "disabled");
    await expect(disabled.getByRole("button", { name: "Unavailable run" })).toBeDisabled();
    await expect(surface(page, "disabled")).toBeHidden();

    const longPreview = demo(page, "long-preview");
    const longTrigger = longPreview.getByRole("button", { name: "Long preview" });
    const longContent = await openHoverCard(longTrigger, surface(page, "long-preview"));
    const bounds = await longContent.boundingBox();
    expect(bounds).toBeTruthy();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(longContent).toHaveCSS("animation-name", "none");
  });
});
