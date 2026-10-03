import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-rating-demo="${variant}"]`);

test.describe("Rating documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/rating");
    await expect(
      demo(page, "preview").locator("xpath=ancestor::astro-island[1]"),
    ).not.toHaveAttribute("ssr", "");
  });

  test("renders the public API, examples, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Rating" })).toBeVisible();
    for (const variant of ["preview", "sizes", "half", "controlled", "custom", "states"]) {
      await expect(demo(page, variant)).toHaveCount(1);
    }

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/rating-group",
    );
    await expect(page.locator('pre[data-language="javascript"]').nth(1)).toContainText(
      'from "@dicehub/kappa/components/rating"',
    );

    const navigation = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(navigation.getByRole("link", { name: "Previous page: Radio" })).toHaveAttribute(
      "href",
      "/docs/components/radio",
    );
    await expect(navigation.getByRole("link", { name: "Next page: Resizable" })).toHaveAttribute(
      "href",
      "/docs/components/resizable",
    );

    const markdownResponse = await request.get("/docs/components/rating.md");
    expect(markdownResponse.ok()).toBe(true);
    const markdown = await markdownResponse.text();
    expect(markdown).toContain("# Rating");
    expect(markdown).toContain("Rating.Control");
    expect(markdown).not.toContain("On this page");
  });

  test("changes whole values by pointer and keyboard", async ({ page }) => {
    const preview = demo(page, "preview");
    const items = preview.locator('[data-slot="rating-item"]');
    await expect(items).toHaveCount(5);

    await items.nth(1).click();
    await expect(preview.getByRole("status")).toHaveText("2 / 5");

    await page.mouse.move(0, 0);
    await items.nth(1).focus();
    await page.keyboard.press("ArrowRight");
    await expect(preview.getByRole("status")).toHaveText("3 / 5");
  });

  test("renders half values, custom icons, sizes, and form states", async ({ page }) => {
    const half = demo(page, "half");
    await expect(half.locator('[data-slot="rating-item"][data-half]')).toHaveCount(1);
    await expect(half.getByRole("status")).toContainText("3.5");

    const custom = demo(page, "custom");
    await expect(custom.locator(".rating-demo__hexagon")).toHaveCount(5);

    const sizes = demo(page, "sizes");
    await expect(sizes.locator('[data-slot="rating"][data-size="sm"]')).toHaveCount(1);
    await expect(sizes.locator('[data-slot="rating"][data-size="base"]')).toHaveCount(1);
    await expect(sizes.locator('[data-slot="rating"][data-size="lg"]')).toHaveCount(1);

    const states = demo(page, "states");
    await expect(states.locator('[data-slot="rating"][data-disabled]')).toHaveCount(1);
    await expect(states.locator('[data-slot="rating"][data-readonly]')).toHaveCount(1);
    await expect(states.locator('[data-slot="rating"][data-invalid]')).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
