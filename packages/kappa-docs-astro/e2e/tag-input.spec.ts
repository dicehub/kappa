import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-tag-input-demo="${variant}"]`);
const entry = (container: Locator) => container.locator('[data-slot="tag-input-input"]');
const items = (container: Locator) => container.locator('[data-slot="tag-input-item-preview"]');

test.describe("Tag Input documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/tag-input");
    const demoIslands = page
      .locator("[data-tag-input-demo]")
      .locator("xpath=ancestor::astro-island");
    await expect(demoIslands).toHaveCount(6);
    for (let index = 0; index < 6; index += 1) {
      await expect(demoIslands.nth(index)).not.toHaveAttribute("ssr", "");
    }
  });

  test("renders the compound API, states, docs link, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Tag Input" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(items(demo(page, "preview"))).toHaveCount(3);
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(4);
    await expect(demo(page, "sizes").locator('[data-slot="tag-input"]')).toHaveCount(4);
    await expect(demo(page, "states").locator('[data-slot="tag-input"][data-invalid]')).toHaveCount(1);
    await expect(demo(page, "states").locator('[data-slot="tag-input"][data-readonly]')).toHaveCount(1);
    await expect(demo(page, "states").locator('[data-slot="tag-input"][data-disabled]')).toHaveCount(1);

    const primitive = page.getByRole("link", { name: "View Ark UI documentation" });
    await expect(primitive).toHaveAttribute("href", "https://ark-ui.com/docs/components/tags-input");
    await expect(primitive).toHaveAttribute("target", "_blank");

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/tag-input"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);

    const response = await request.get("/docs/components/tag-input.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Tag Input");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("TagInput.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("adds, edits, removes, clears, validates, pastes, and controls tags", async ({ page }) => {
    const usage = demo(page, "usage");
    const usageEntry = entry(usage);
    await usageEntry.focus();
    await expect(usage.locator('[data-slot="tag-input-control"]')).toHaveAttribute("data-focus", "");
    await usageEntry.pressSequentially("queued");
    await usageEntry.press("Enter");
    await expect(items(usage)).toHaveCount(3);
    await expect(usage.locator('[data-slot="tag-input-item-text"]')).toContainText([
      "geometry",
      "ready",
      "queued",
    ]);

    await items(usage).first().dblclick();
    const itemInput = usage.locator('[data-slot="tag-input-item-input"]:visible');
    await expect(itemInput).toBeVisible();
    await itemInput.fill("cad");
    await itemInput.press("Enter");
    await expect(usage.locator('[data-slot="tag-input-item-text"]').first()).toHaveText("cad");

    await usage.locator('[data-slot="tag-input-item-delete-trigger"]').first().click();
    await expect(items(usage)).toHaveCount(2);
    await usage.locator('[data-slot="tag-input-clear-trigger"]').click();
    await expect(items(usage)).toHaveCount(0);
    await expect(usage.locator('[data-slot="tag-input-hidden-input"]')).toHaveAttribute("name", "labels");

    const controlled = demo(page, "controlled");
    await entry(controlled).fill("approved");
    await entry(controlled).press("Enter");
    await expect(controlled.getByRole("status")).toHaveText("mesh · review · approved");

    const paste = demo(page, "paste");
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.evaluate(() => navigator.clipboard.writeText("api,worker,worker"));
    await entry(paste).focus();
    await page.keyboard.press("Control+V");
    await expect(paste.locator('[data-slot="tag-input-item-text"]')).toContainText(["api", "worker"]);
    await entry(paste).fill("!");
    await entry(paste).press("Enter");
    await expect(items(paste)).toHaveCount(2);

    const heights = await demo(page, "sizes")
      .locator('[data-slot="tag-input-control"]')
      .evaluateAll((controls) => controls.map((control) => control.getBoundingClientRect().height));
    expect(heights).toHaveLength(4);
    expect(heights[0]).toBeLessThan(heights[1]);
    expect(heights[1]).toBeLessThan(heights[2]);
    expect(heights[2]).toBeLessThan(heights[3]);
  });
});
