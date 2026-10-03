import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-download-trigger-demo="${variant}"]`);

test.describe("Download Trigger documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/download-trigger");
  });

  test("renders examples, navigation, composition, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Download Trigger" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(6);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(6);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/utilities/download-trigger",
    );

    const composition = page.locator('#composition [data-composition-tree="downloadTrigger"]');
    await expect(composition).toContainText("DownloadTrigger <button>");

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(
      compact.getByRole("link", { name: "Previous page: Direction Provider" }),
    ).toHaveAttribute("href", "/docs/components/direction-provider");
    await expect(compact.getByRole("link", { name: "Next page: Drag Selection" })).toHaveAttribute(
      "href",
      "/docs/components/drag-selection",
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
      "Generated Data",
      "Async Data",
      "States",
      "Custom Child",
      "Accessibility",
      "API Reference",
      "DownloadTrigger",
      "Slots",
      "Data Attributes",
      "Exports",
    ]);

    const response = await request.get("/docs/components/download-trigger.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Download Trigger");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Async Data](#async-data)");
    expect(markdown).toContain("DownloadTriggerProps / DownloadTriggerSlots");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("downloads string and asynchronously generated data", async ({ page }) => {
    const plainDownload = page.waitForEvent("download");
    await demo(page, "usage").getByRole("button", { name: "Download release notes" }).click();
    expect((await plainDownload).suggestedFilename()).toBe("release-notes.txt");

    const asyncDownload = page.waitForEvent("download");
    await demo(page, "async").getByRole("button", { name: "Build and download CSV" }).click();
    expect((await asyncDownload).suggestedFilename()).toBe("run-status.csv");
  });

  test("keeps default download icons compact", async ({ page }) => {
    for (const variant of ["preview", "generated", "async"]) {
      const icon = demo(page, variant).locator('[data-slot="download-trigger-icon"]');
      await expect(icon).toHaveCSS("width", "14px");
      await expect(icon).toHaveCSS("height", "14px");
    }
  });

  test("centers label capitals without unused line-box space", async ({ page }) => {
    await page.evaluate(() => document.fonts.ready);
    const label = demo(page, "generated").locator('[data-slot="download-trigger-label"]');
    const metrics = await label.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const button = element.closest("button")!.getBoundingClientRect();
      const style = getComputedStyle(element);
      const context = document.createElement("canvas").getContext("2d")!;
      context.font = style.font;
      return {
        supportsTrim: CSS.supports("text-box", "trim-both cap alphabetic"),
        height: bounds.height,
        capHeight: context.measureText("H").actualBoundingBoxAscent,
        lineHeight: Number.parseFloat(style.lineHeight),
        centerOffset: Math.abs(bounds.y + bounds.height / 2 - button.y - button.height / 2),
        overflow: style.overflow,
      };
    });
    expect(metrics.centerOffset).toBeLessThanOrEqual(0.5);
    expect(metrics.overflow).toBe("visible");
    if (metrics.supportsTrim) {
      expect(Math.abs(metrics.height - metrics.capHeight)).toBeLessThanOrEqual(1);
    } else {
      expect(metrics.height).toBe(metrics.lineHeight);
    }
  });

  test("keeps disabled, loading, custom-child, theme, and mobile states usable", async ({ page }) => {
    const states = demo(page, "states");
    const buttons = states.getByRole("button");
    await expect(buttons).toHaveCount(3);
    await expect(buttons.nth(1)).toBeDisabled();
    await expect(buttons.nth(2)).toBeDisabled();
    await expect(buttons.nth(2)).toHaveAttribute("aria-busy", "true");
    await expect(buttons.nth(2).locator('[data-slot="download-trigger-spinner"]')).toHaveCount(1);

    const custom = demo(page, "as-child").getByRole("button", { name: "Save a local copy" });
    await expect(custom).toHaveCount(1);
    await expect(custom).toHaveAttribute("data-slot", "download-trigger");
    await expect(custom).toHaveClass(/kappa-download-trigger/);

    const preview = demo(page, "preview").getByRole("button", { name: "Download configuration" });
    await preview.focus();
    await expect(preview).toBeFocused();
    await expect(preview).toHaveCSS("outline-width", "2px");

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(demo(page, "preview").locator('[data-slot="download-trigger"]')).toBeVisible();
  });
});
