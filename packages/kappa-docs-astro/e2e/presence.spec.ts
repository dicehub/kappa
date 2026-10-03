import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-presence-demo="${variant}"]`);

test.describe("Presence documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/presence");
  });

  test("renders documentation, examples, composition, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Presence" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(4);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(4);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/utilities/presence",
    );

    const composition = page.locator('#composition [data-composition-tree="presence"]');
    await expect(composition).toContainText("Presence <div | custom child>");

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(compact.getByRole("link", { name: "Previous page: Popover" })).toHaveAttribute(
      "href",
      "/docs/components/popover",
    );
    await expect(compact.getByRole("link", { name: "Next page: Progress" })).toHaveAttribute(
      "href",
      "/docs/components/progress",
    );

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Reference Behavior",
      "Examples",
      "Lazy Mount",
      "Custom Child",
      "Accessibility",
      "API Reference",
      "Presence",
      "Events",
      "Exports",
    ]);

    const response = await request.get("/docs/components/presence.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Presence");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Lazy Mount](#lazy-mount)");
    expect(markdown).toContain("PresenceProps / PresenceEmits / PresenceSlots");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("waits for motion, reports lifecycle events, and unmounts lazy content", async ({ page }) => {
    const preview = demo(page, "preview");
    const status = preview.getByRole("region", { name: "Service status" });
    const presence = preview.locator('[data-slot="presence"]');
    await expect(status).toBeVisible();

    await preview.getByRole("button", { name: "Hide status" }).click();
    await expect(presence).toHaveAttribute("data-state", "closed");
    await expect(status).toHaveCount(0);
    await expect(preview.getByText("Exited")).toBeVisible();

    await preview.getByRole("button", { name: "Show status" }).click();
    await expect(preview.getByRole("region", { name: "Service status" })).toBeVisible();
    await expect(preview.getByText("Entered")).toBeVisible();

    const lazy = demo(page, "lazy");
    await expect(lazy.locator("[data-lazy-presence]")).toHaveCount(0);
    await lazy.getByRole("button", { name: "Mount details" }).click();
    await expect(lazy.locator("[data-lazy-presence]")).toBeVisible();
    await lazy.getByRole("button", { name: "Unmount details" }).click();
    await expect(lazy.locator("[data-lazy-presence]")).toHaveCount(0);
  });

  test("merges onto a semantic child and preserves reduced motion and narrow layouts", async ({ page }) => {
    const aside = demo(page, "as-child").getByRole("complementary", { name: "Processing note" });
    await expect(aside).toHaveAttribute("data-slot", "presence");
    await expect(aside).toHaveClass(/kappa-presence/);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const panel = demo(page, "preview").getByRole("region", { name: "Service status" });
    expect(
      await panel.evaluate((element) => Number.parseFloat(getComputedStyle(element).animationDuration)),
    ).toBeLessThanOrEqual(0.001);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(demo(page, "preview")).toBeVisible();
  });
});
