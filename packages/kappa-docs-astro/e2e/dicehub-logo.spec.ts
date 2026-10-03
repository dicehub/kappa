import { expect, test } from "@playwright/test";

test.describe("DicehubLogo documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/dicehub-logo");
  });

  test("renders the public component and usage guidance", async ({ page }) => {
    const preview = page.locator('[data-logo-demo="basic"]');
    const logo = preview.locator(".kappa-dicehub-logo");
    const usageLogo = page.getByTestId("logo-attribute-forwarding");

    await expect(page.getByRole("heading", { level: 1, name: "DicehubLogo" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(logo).toHaveCount(1);
    await expect(logo).toHaveAttribute("role", "img");
    await expect(logo).toHaveAttribute("aria-label", "dicehub logo");
    await expect(logo).toHaveAttribute("viewBox", "0 0 137 41");
    await expect(logo.locator("path")).toHaveCount(13);
    await expect(logo.locator("path").first()).toHaveAttribute("fill", "currentColor");
    await expect(usageLogo).toHaveAttribute("aria-label", "Primary dicehub logo");
    await expect(usageLogo).toHaveAttribute("data-testid", "logo-attribute-forwarding");

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/dicehub-logo"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(snippets.filter({ hasText: 'lang="ts"' })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(3);
  });

  test("preserves official geometry and color variants", async ({ page }) => {
    const previewLogo = page.locator('[data-logo-demo="basic"] .kappa-dicehub-logo');
    const glyph = page.locator('[data-logo-demo="glyph"] .kappa-dicehub-logo');
    const colors = page.locator('[data-logo-demo="colors"]');
    const glyphColors = page.locator('[data-logo-demo="glyph-colors"]');
    const sizes = page.locator('[data-logo-demo="sizes"] .kappa-dicehub-logo');
    const powered = page.locator("#powered-by-dicehub .kappa-powered-by-dicehub");

    await expect(glyph).toHaveAttribute("viewBox", "0 0 33 36");
    await expect(glyph).toHaveClass(/kappa-dicehub-logo--glyph/);
    await expect(glyph.locator("path")).toHaveCount(5);
    await expect(colors.locator(".kappa-dicehub-logo--color")).toHaveCSS(
      "color",
      "rgb(51, 51, 51)",
    );
    await expect(colors.locator(".kappa-dicehub-logo--black")).toHaveCSS(
      "color",
      "rgb(0, 0, 0)",
    );
    await expect(colors.locator(".kappa-dicehub-logo--white")).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
    await expect(colors.locator(".dicehub-logo-demo__surface--dark")).toHaveCSS(
      "background-color",
      "rgb(0, 0, 0)",
    );
    await expect(glyphColors.locator(".kappa-dicehub-logo--glyph")).toHaveCount(3);
    await expect(glyphColors.locator(".kappa-dicehub-logo--white")).toHaveCount(1);
    await expect(sizes.nth(0)).toHaveCSS("width", "80px");
    await expect(sizes.nth(1)).toHaveCSS("width", "112px");
    await expect(sizes.nth(2)).toHaveCSS("width", "176px");

    const bounds = await previewLogo.boundingBox();
    expect(bounds).not.toBeNull();
    expect(Math.abs((bounds?.width ?? 0) / (bounds?.height ?? 1) - 137 / 41)).toBeLessThan(
      0.02,
    );
    await expect(powered).toHaveCount(5);
    await expect(powered.first()).toHaveAttribute("href", "https://dicehub.com");
    await expect(powered.first()).toHaveAttribute("target", "_blank");
    await expect(powered.first()).toHaveAttribute("rel", "noopener noreferrer");
    await expect(powered.first()).toHaveAccessibleName("Powered by dicehub");
  });

  test("provides the complete brand-assets example with native controls", async ({ context, page }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    const example = page.locator('[data-logo-demo="copy"]');
    const details = example.locator("details");
    const disclosure = example.locator("summary");
    const copyMark = example.getByRole("button", { name: "Copy mark as SVG" });

    await expect(details).not.toHaveAttribute("open", "");
    await expect(disclosure).toContainText("Logo");
    await disclosure.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await expect(copyMark).toBeVisible();
    await expect(example.getByRole("button", { name: "Copy full logo as SVG" })).toBeVisible();
    await expect(example.getByRole("button", { name: "Download brand assets" })).toBeVisible();
    await expect(example.getByRole("link", { name: "Visit brand guidelines" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );

    await copyMark.click();
    await expect(disclosure).toBeFocused();
    await expect(details).not.toHaveAttribute("open", "");
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/^<svg/);
  });

  test("keeps sidebar and adjacent-page navigation intact", async ({ page }) => {
    const sidebarLink = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "dicehub logo", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    const tableOfContents = page.getByRole("complementary", { name: "On this page" });

    await expect(sidebarLink).toHaveAttribute("aria-current", "page");
    await expect(
      compact.getByRole("link", { name: "Previous page: Dialog Layout" }),
    ).toHaveAttribute("href", "/docs/components/dialog-layout");
    await expect(
      compact.getByRole("link", { name: "Next page: Diff Viewer" }),
    ).toHaveAttribute("href", "/docs/components/diff-viewer");
    await expect(footer.getByRole("link", { name: "Dialog Layout", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Diff Viewer", exact: true })).toBeVisible();
    await expect(tableOfContents.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Glyph Only",
      "Color Variants",
      "Glyph Color Variants",
      "Sizing",
      "Brand Assets Menu",
      "PoweredByDicehub",
      "Basic Usage",
      "Color Variants",
      "Footer Example",
      "SVG Generation",
      "API Reference",
      "DicehubLogo",
      "PoweredByDicehub",
    ]);
  });

  test("fits previews and API content on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    const preview = page.locator('[data-logo-demo="basic"]');
    const logo = preview.locator(".kappa-dicehub-logo");
    const apiTables = page.locator(".docs-api-table");
    const [previewBox, logoBox] = await Promise.all([preview.boundingBox(), logo.boundingBox()]);

    expect(previewBox).not.toBeNull();
    expect(logoBox).not.toBeNull();
    expect(logoBox?.width ?? 0).toBeLessThanOrEqual(previewBox?.width ?? 0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await expect(apiTables).toHaveCount(2);
    for (const apiTable of await apiTables.all()) {
      expect(
        await apiTable.evaluate((element) => element.scrollWidth >= element.clientWidth),
      ).toBe(true);
    }
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
