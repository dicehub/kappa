import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-label-demo="${variant}"]`);

test.describe("Label documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/label");
  });

  test("renders examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Label" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-label")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/label"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Label", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Kbd" })).toHaveAttribute(
      "href",
      "/docs/components/kbd",
    );
    await expect(compact.getByRole("link", { name: "Next page: Layer Card" })).toHaveAttribute(
      "href",
      "/docs/components/layer-card",
    );
    await expect(footer.getByRole("link", { name: "Kbd", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Layer Card", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Optional Text",
      "htmlFor Alias",
      "Wrapped Control",
      "Content Composition",
      "Persistent Guidance",
      "Disabled",
      "Right to Left",
      "Accessibility",
      "API Reference",
      "Label",
      "Slots",
      "Data Slots",
      "Exports",
    ]);

    const response = await request.get("/docs/components/label.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Label");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("### [Content Composition](#content-composition)");
    expect(markdown).toContain("LabelProps / LabelSlots");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("associates native labels and supports both association APIs", async ({ page }) => {
    const basic = demo(page, "basic");
    const basicLabel = basic.locator(".kappa-label");
    const basicInput = basic.locator("input");
    await expect(basicLabel).toHaveJSProperty("tagName", "LABEL");
    await expect(basicLabel).toHaveAttribute("for", "label-basic-email");
    await basicLabel.click();
    await expect(basicInput).toBeFocused();
    await expect(basicInput).toHaveAccessibleName("Email address");

    const association = demo(page, "association");
    const aliasLabel = association.locator(".kappa-label");
    await expect(aliasLabel).toHaveAttribute("for", "label-association-account");
    await aliasLabel.click();
    await expect(association.locator("input")).toBeFocused();
  });

  test("renders optional text, wrapped controls, and content mode", async ({ page }) => {
    const optional = demo(page, "optional");
    const markers = optional.locator('[data-slot="label-optional"]');
    await expect(markers).toHaveCount(2);
    await expect(markers.nth(0)).toHaveText("(optional)");
    await expect(markers.nth(1)).toHaveText("(facultatif)");

    const wrapped = demo(page, "wrapped");
    const nativeCheckbox = wrapped.locator('input[type="checkbox"]');
    await expect(nativeCheckbox).toBeChecked();
    await wrapped.locator(".kappa-label").click();
    await expect(nativeCheckbox).not.toBeChecked();

    const content = demo(page, "content");
    const contentLabel = content.locator('[data-slot="label"]');
    await expect(contentLabel).toHaveJSProperty("tagName", "SPAN");
    await expect(contentLabel).toHaveAttribute("data-content", "");
    await expect(contentLabel).not.toHaveAttribute("for");
    const checkboxRoot = content.locator('[data-scope="checkbox"][data-part="root"]');
    const checkboxLabel = content.locator('[data-scope="checkbox"][data-part="label"]');
    await expect(content.locator("label")).toHaveCount(1);
    await expect(checkboxRoot).toHaveJSProperty("tagName", "LABEL");
    await expect(checkboxLabel).toHaveJSProperty("tagName", "SPAN");
    await expect(checkboxRoot.locator('[data-slot="label"]')).toHaveCount(1);
    await expect(checkboxLabel).toContainText(
      "Share anonymous usage data",
    );
  });

  test("connects guidance and presents disabled and RTL states", async ({ page }) => {
    const guidance = demo(page, "guidance");
    const input = guidance.locator("input");
    await expect(input).toHaveAttribute("aria-describedby", "label-guidance-help");
    await expect(input).toHaveAccessibleDescription(
      "Use the 8-character code from your invitation email.",
    );

    const disabled = demo(page, "disabled");
    await expect(disabled.locator("input")).toBeDisabled();
    await expect(disabled.locator(".kappa-label")).toHaveAttribute("data-disabled", "");
    await expect(disabled.locator(".kappa-label")).toHaveCSS("cursor", "not-allowed");

    const rtl = demo(page, "rtl");
    const rtlRegion = rtl.locator('[dir="rtl"]');
    await expect(rtlRegion).toHaveAttribute("dir", "rtl");
    await expect(rtlRegion.locator('[data-slot="label-optional"]')).toHaveText("(اختياري)");
    await rtlRegion.locator(".kappa-label").click();
    await expect(rtlRegion.locator("input")).toBeFocused();
  });

  test("supports themes and mobile layout without runtime warnings", async ({ page }) => {
    const errors: string[] = [];
    const isDevToolbarRequest = (url: string) =>
      url.includes("/astro/runtime/client/dev-toolbar/");
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !text.startsWith("Failed to load resource:")) {
        errors.push(text);
      }
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(text)) {
        errors.push(text);
      }
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400 && !isDevToolbarRequest(response.url())) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on("requestfailed", (request) => {
      const errorText = request.failure()?.errorText ?? "request failed";
      if (errorText !== "net::ERR_ABORTED" && !isDevToolbarRequest(request.url())) {
        errors.push(`${errorText} ${request.url()}`);
      }
    });
    await page.reload();

    const label = demo(page, "basic").locator(".kappa-label");
    const lightColor = await label.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => label.evaluate((element) => getComputedStyle(element).color)).not.toBe(
      lightColor,
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-label").first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});
