import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-text-demo="${variant}"]`);

test.describe("Text documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/text");
  });

  test("renders examples, references, navigation, TOC, composition, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Text" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator("[data-text-demo]")).toHaveCount(10);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(10);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(
      page.locator('.docs-code-full pre[data-language="vue"]').filter({
        hasNotText: '@dicehub/kappa/components/text',
      }),
    ).toHaveCount(0);

    await expect(page.locator("#composition")).toContainText(
      "use semantic HTML and set typography and spacing on the container.",
    );
    await expect(page.locator('.docs-page-header__title-row a[href*="ark-ui.com"]')).toHaveCount(0);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Text", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Tag Input" })).toHaveAttribute(
      "href",
      "/docs/components/tag-input",
    );
    await expect(compact.getByRole("link", { name: "Next page: Timer" })).toHaveAttribute(
      "href",
      "/docs/components/timer",
    );
    await expect(footer.getByRole("link", { name: "Tag Input", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Timer", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Overview",
      "Variants",
      "Sizes",
      "Semantic HTML",
      "Inline Text",
      "Monospace",
      "Truncate",
      "Right to Left",
      "Accessibility",
      "API Reference",
      "Text",
      "Slots",
      "Data Slots",
      "Exports",
    ]);

    const composition = page.locator('#composition [data-composition-tree="text"]');
    await expect(composition).toContainText("Text <p | span | semantic text element>");
    await expect(composition).toContainText("default slot");

    const response = await request.get("/docs/components/text.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Text");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Inline Text](#inline-text)");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("renders semantic elements, compact sizes, variants, and forwarded attributes", async ({
    page,
  }) => {
    const preview = demo(page, "preview").locator('[data-slot="text"]');
    await expect(preview).toHaveJSProperty("tagName", "P");
    await expect(preview).toHaveAttribute("data-variant", "body");
    await expect(preview).toHaveAttribute("data-size", "base");
    await expect(preview).toHaveCSS("font-size", "14px");
    await expect(preview).toHaveCSS("line-height", "20px");

    const overviewRows = demo(page, "overview").locator("[data-text-overview-row]");
    await expect(overviewRows).toHaveCount(13);
    await expect(
      demo(page, "overview").locator('[data-text-overview-row="body-xs"] [data-overview-sample]'),
    ).toHaveCSS("font-size", "12px");
    await expect(
      demo(page, "overview").locator('[data-text-overview-row="heading-lg"] [data-overview-sample]'),
    ).toHaveCSS("font-size", "20px");
    await expect(
      demo(page, "overview").locator('[data-text-overview-row="body-bold"] [data-overview-sample]'),
    ).toHaveCSS("font-weight", "550");

    const variants = demo(page, "variants");
    const heading = variants.getByRole("heading", { level: 3, name: "Project status" });
    const success = variants.getByText("Connection restored", { exact: true });
    const error = variants.getByText("Connection failed", { exact: true });
    await expect(heading).toHaveAttribute("data-variant", "heading");
    await expect(heading).toHaveCSS("font-weight", "650");
    await expect(success).toHaveAttribute("data-variant", "success");
    await expect(error).toHaveAttribute("data-variant", "error");
    await expect(success).not.toHaveCSS("color", await preview.evaluate((node) => getComputedStyle(node).color));
    await expect(error).not.toHaveCSS("color", await preview.evaluate((node) => getComputedStyle(node).color));

    const sizes = demo(page, "sizes").locator('[data-slot="text"]');
    await expect(sizes).toHaveCount(4);
    await expect(sizes.nth(0)).toHaveCSS("font-size", "12px");
    await expect(sizes.nth(1)).toHaveCSS("font-size", "13px");
    await expect(sizes.nth(2)).toHaveCSS("font-size", "14px");
    await expect(sizes.nth(3)).toHaveCSS("font-size", "16px");

    const semantic = demo(page, "semantic");
    await expect(semantic.getByRole("heading", { level: 2, name: "Account security" })).toHaveCSS(
      "font-size",
      "20px",
    );
    await expect(semantic.locator("p")).toContainText("Review active sessions");
    await expect(demo(page, "inline").locator("p > span[data-slot='text']")).toContainText(
      "42 seconds",
    );
    await expect(demo(page, "monospace").locator("code")).toHaveAttribute("data-variant", "mono");
    await expect(demo(page, "monospace").locator("time")).toHaveAttribute(
      "datetime",
      "2026-08-28T16:40:00+02:00",
    );
  });

  test("truncates one line and follows theme, direction, and narrow layouts", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(message.text())) {
        errors.push(message.text());
      }
      if (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const truncated = demo(page, "truncate").locator('[data-slot="text"]');
    const truncateContainer = demo(page, "truncate").locator(".text-demo__truncate");
    await expect(truncated).toHaveAttribute("data-truncate", "");
    await expect(truncated).toContainText("This is a long piece of text");
    await expect(truncateContainer).toHaveCSS("border-top-style", "solid");
    await expect(truncateContainer).toHaveCSS("border-radius", "8px");
    await expect(truncated).toHaveCSS("overflow", "hidden");
    await expect(truncated).toHaveCSS("text-overflow", "ellipsis");
    await expect(truncated).toHaveCSS("white-space", "nowrap");
    await expect
      .poll(() =>
        truncated.evaluate(
          (element) => element.scrollWidth - Math.round(element.getBoundingClientRect().width),
        ),
      )
      .toBeGreaterThan(0);

    const rtl = demo(page, "rtl").locator('[dir="rtl"]');
    await expect(rtl).toHaveCSS("direction", "rtl");
    const secondary = rtl.locator('[data-variant="secondary"]');
    const lightColor = await secondary.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => secondary.evaluate((element) => getComputedStyle(element).color))
      .not.toBe(lightColor);

    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
});
