import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-expandable-text-demo="${variant}"]`);

async function waitForMeasurement(root: Locator) {
  await expect(root).toHaveAttribute("data-measured", "");
}

test.describe("Expandable Text documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/expandable-text");
  });

  test("renders examples, navigation, TOC, composition, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Expandable Text" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/collapsible",
    );
    await expect(page.locator("[data-expandable-text-demo]")).toHaveCount(5);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(5);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator("pre[data-language]").first()).toContainText(
      '@dicehub/kappa/components/expandable-text',
    );

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Expandable Text", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Empty" })).toHaveAttribute(
      "href",
      "/docs/components/empty",
    );
    await expect(compact.getByRole("link", { name: "Next page: Field" })).toHaveAttribute(
      "href",
      "/docs/components/field",
    );
    await expect(footer.getByRole("link", { name: "Empty", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Field", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Line Count",
      "Controlled",
      "Custom Trigger",
      "Short Content",
      "Accessibility",
      "API Reference",
      "ExpandableText",
      "Slots",
      "Data Slots",
      "Events",
      "Exports",
    ]);

    await expect(
      page.locator('#composition [data-composition-tree="expandableText"]'),
    ).toContainText("ArkCollapsible.Root");

    const response = await request.get("/docs/components/expandable-text.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Expandable Text");
    expect(markdown).toContain("v-model:open");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("measures overflow and toggles with pointer and keyboard input", async ({ page }) => {
    const root = demo(page, "preview").locator('[data-slot="expandable-text"]');
    const content = root.locator('[data-slot="expandable-text-content"]');
    const body = root.locator('[data-slot="expandable-text-body"]');
    await waitForMeasurement(root);
    await expect(root).toHaveAttribute("data-overflowing", "");

    const trigger = root.getByRole("button", { name: "Show more" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    const contentId = await content.getAttribute("id");
    expect(contentId).not.toBeNull();
    await expect(trigger).toHaveAttribute("aria-controls", contentId!);
    const collapsed = await content.boundingBox();
    const naturalHeight = await body.evaluate((element) => element.scrollHeight);
    expect(collapsed).not.toBeNull();
    expect(naturalHeight).toBeGreaterThan(collapsed!.height + 10);

    await trigger.click();
    const collapse = root.getByRole("button", { name: "Show less" });
    await expect(collapse).toHaveAttribute("aria-expanded", "true");
    await expect(content).toHaveAttribute("data-state", "open");
    await content.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });
    expect((await content.boundingBox())!.height).toBeGreaterThan(collapsed!.height + 10);
    await expect(collapse).toBeFocused();

    await page.keyboard.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(content).toHaveAttribute("data-state", "closed");
  });

  test("supports line counts, controlled state, custom labels, and short content", async ({ page }) => {
    const lineRoots = demo(page, "lines").locator('[data-slot="expandable-text"]');
    await expect(lineRoots).toHaveCount(2);
    await waitForMeasurement(lineRoots.nth(0));
    await waitForMeasurement(lineRoots.nth(1));
    const heights = await lineRoots
      .locator('[data-slot="expandable-text-content"]')
      .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
    expect(heights[1]).toBeGreaterThan(heights[0] * 1.8);

    const controlled = demo(page, "controlled");
    const controlledRoot = controlled.locator('[data-slot="expandable-text"]');
    await waitForMeasurement(controlledRoot);
    await controlled.getByRole("button", { name: "Expand externally" }).click();
    await expect(controlled.getByRole("status")).toHaveText("Expanded");
    await expect(controlledRoot.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    const custom = demo(page, "custom-trigger");
    const customRoot = custom.locator('[data-slot="expandable-text"]');
    await waitForMeasurement(customRoot);
    await expect(customRoot).toHaveCSS("overflow-anchor", "none");
    await customRoot.scrollIntoViewIfNeeded();
    const initialTop = (await customRoot.boundingBox())!.y;
    await custom.getByRole("button", { name: "Read run note" }).click();
    await expect(custom.getByRole("button", { name: "Close run note" })).toContainText("Close run note");
    await customRoot
      .locator('[data-slot="expandable-text-content"]')
      .evaluate(async (element) => {
        await Promise.all(element.getAnimations().map((animation) => animation.finished));
      });
    expect(Math.abs((await customRoot.boundingBox())!.y - initialTop)).toBeLessThan(1);

    const short = demo(page, "short");
    const shortRoot = short.locator('[data-slot="expandable-text"]');
    await waitForMeasurement(shortRoot);
    await expect(shortRoot).not.toHaveAttribute("data-overflowing", "");
    await expect(shortRoot.getByRole("button")).toHaveCount(0);
    await expect(short.getByText("The case is ready to run.", { exact: false })).toBeVisible();
  });

  test("removes motion when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const root = demo(page, "preview").locator('[data-slot="expandable-text"]');
    await waitForMeasurement(root);
    await root.getByRole("button", { name: "Show more" }).click();
    const content = root.locator('[data-slot="expandable-text-content"]');
    expect(await content.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
    expect(await content.evaluate((element) => element.getAnimations().length)).toBe(0);
    await expect(root.locator('[data-slot="expandable-text-indicator"]')).toHaveCSS(
      "transition-duration",
      /^(?:0s|0\.00001s|1e-05s)$/,
    );
  });
});
