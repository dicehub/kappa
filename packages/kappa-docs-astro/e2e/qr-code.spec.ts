import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-qr-code-demo="${variant}"]`);

test.describe("QR Code documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/qr-code");
    await expect(page.locator("astro-island[ssr]:has([data-qr-code-demo])")).toHaveCount(0);
  });

  test("renders documentation, examples, composition, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "QR Code" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(5);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(5);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/qr-code",
    );

    const composition = page.locator('#composition [data-composition-tree="qrCode"]');
    await expect(composition).toContainText("QrCode.Root");
    await expect(composition).toContainText("QrCode.Pattern <path>");

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(compact.getByRole("link", { name: "Previous page: Property List" })).toHaveAttribute(
      "href",
      "/docs/components/property-list",
    );
    await expect(compact.getByRole("link", { name: "Next page: Radio" })).toHaveAttribute(
      "href",
      "/docs/components/radio",
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
      "Controlled",
      "Overlay",
      "Download",
      "Accessibility",
      "API Reference",
      "QrCode.Root",
      "QrCode.DownloadTrigger",
      "Parts",
      "Events",
      "Exports",
    ]);

    const response = await request.get("/docs/components/qr-code.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# QR Code");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Download](#download)");
    expect(markdown).toContain("QrCode props, events, API, and generator types");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("renders a matrix and synchronizes controlled values through context", async ({ page }) => {
    const preview = demo(page, "preview");
    const frame = preview.getByRole("img", { name: "QR code for the getting started guide" });
    await expect(frame).toHaveAttribute("viewBox", /0 0 \d+ \d+/);
    await expect(frame.locator('[data-slot="qr-code-pattern"]')).toHaveAttribute("d", /M\d/);

    const controlled = demo(page, "controlled");
    const input = controlled.getByRole("textbox", { name: "Destination" });
    const pattern = controlled.locator('[data-slot="qr-code-pattern"]');
    const initialPattern = await pattern.getAttribute("d");
    await input.fill("https://example.com/releases");
    await expect.poll(() => pattern.getAttribute("d")).not.toBe(initialPattern);

    await controlled.getByRole("button", { name: "Use support link" }).click();
    await expect(input).toHaveValue("https://example.com/support");
  });

  test("renders an overlay, downloads PNG, and remains scan-safe across themes", async ({ page }) => {
    const overlay = demo(page, "overlay").locator('[data-slot="qr-code-overlay"]');
    await expect(overlay).toHaveText("K");
    await expect(overlay).toHaveAttribute("aria-hidden", "true");

    const downloadEvent = page.waitForEvent("download");
    await demo(page, "download").getByRole("button", { name: "Download PNG" }).click();
    expect((await downloadEvent).suggestedFilename()).toBe("contact-link.png");

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect(demo(page, "preview").locator('[data-slot="qr-code-frame"]')).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(demo(page, "preview").locator('[data-slot="qr-code-frame"]')).toBeVisible();
  });
});
