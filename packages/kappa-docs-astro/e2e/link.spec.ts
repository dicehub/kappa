import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-link-demo="${variant}"]`);

test.describe("Link documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/link");
  });

  test("renders examples, navigation, TOC, composition, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Link" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-link")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/guides/composition",
    );

    const exampleFrames = page.locator(".docs-component-example");
    await expect(exampleFrames).toHaveCount(9);
    await expect(exampleFrames.first()).toHaveCSS("border-top-width", "1px");
    await expect(page.locator("#usage .docs-component-preview")).not.toHaveCSS(
      "padding-top",
      "0px",
    );
    const vueExamples = page.locator('.docs-code-full pre[data-language="vue"]');
    await expect(vueExamples).toHaveCount(9);
    expect(
      await vueExamples.evaluateAll((examples) =>
        examples.every((example) =>
          example.textContent?.includes('@dicehub/kappa/components/link'),
        ),
      ),
    ).toBe(true);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator(".docs-code-full pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/link"',
    );
    await expect(page.getByRole("button", { name: "View Code" })).toHaveCount(9);

    const composition = page.locator('#composition [data-composition-tree="link"]');
    await expect(composition).toContainText("Link <a>");
    await expect(composition).toContainText("Link.ExternalIcon");
    await expect(composition).toContainText("RouterLink / framework link");

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Link", exact: true });
    const compact = page.getByRole("navigation", {
      name: "Adjacent documentation pages",
    });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Layer Card" })).toHaveAttribute(
      "href",
      "/docs/components/layer-card",
    );
    await expect(compact.getByRole("link", { name: "Next page: Loader" })).toHaveAttribute(
      "href",
      "/docs/components/loader",
    );
    await expect(footer.getByRole("link", { name: "Layer Card", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Loader", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Variants",
      "Inline in Paragraph",
      "External Link",
      "Current Color",
      "Router Link",
      "Current Page",
      "Right to Left",
      "Accessibility",
      "API Reference",
      "Link",
      "Slots",
      "Data Attributes",
      "Exports",
    ]);

    const response = await request.get("/docs/components/link.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Link");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Router Link](#router-link)");
    expect(markdown).toContain("### [Inline in Paragraph](#inline-in-paragraph)");
    expect(markdown).toContain("import { Link, LinkExternalIcon }");
    expect(markdown).toContain("LinkProps / LinkSlots / LinkVariant");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("preserves native anchor semantics and resolves every variant", async ({ page }) => {
    const preview = demo(page, "preview").getByRole("link", {
      name: "installation guide",
    });
    await expect(preview).toHaveJSProperty("tagName", "A");
    await expect(preview).toHaveAttribute("href", "/docs/installation");
    await expect(preview).toHaveAttribute("data-slot", "link");
    await expect(preview).toHaveAttribute("data-variant", "inline");

    const variants = demo(page, "variants");
    const inline = variants.getByRole("link", { name: "Inline link" });
    const current = variants.getByRole("link", { name: "Current-color link" });
    const plain = variants.getByRole("link", { name: "Plain link" });
    await expect(inline).toHaveAttribute("data-variant", "inline");
    await expect(current).toHaveAttribute("data-variant", "current");
    await expect(plain).toHaveAttribute("data-variant", "plain");
    await expect(inline).toHaveCSS("text-decoration-line", "underline");
    await expect(current).toHaveCSS("text-decoration-line", "underline");
    await expect(plain).toHaveCSS("text-decoration-line", "none");
    await plain.hover();
    await expect(plain).toHaveCSS("text-decoration-line", "underline");
  });

  test("adds safe external defaults and a decorative indicator", async ({ page }) => {
    const external = demo(page, "external").getByRole("link", {
      name: "Ark UI composition",
    });
    await expect(external).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/guides/composition",
    );
    await expect(external).toHaveAttribute("target", "_blank");
    await expect(external).toHaveAttribute("rel", "noopener noreferrer");
    await expect(external).toHaveAttribute("data-external", "");

    const icon = external.locator('[data-slot="link-external-icon"]');
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon).toHaveAttribute("focusable", "false");
    expect(await external.getAttribute("aria-label")).toBeNull();
    expect(Math.round((await icon.boundingBox())?.width ?? 0)).toBeGreaterThan(0);
  });

  test("composes one router anchor and exposes current navigation state", async ({ page }) => {
    const router = demo(page, "router");
    const routerLink = router.getByRole("link", { name: "Component index" });
    await expect(router.locator("a")).toHaveCount(1);
    await expect(routerLink).toHaveAttribute("href", "/docs/components");
    await expect(routerLink).toHaveAttribute("data-router-link", "");
    await expect(routerLink).toHaveClass(/kappa-link/);
    await expect(routerLink).toHaveAttribute("data-slot", "link");

    const notice = demo(page, "current").locator(".link-demo__notice");
    const currentLink = notice.getByRole("link", { name: "View details" });
    expect(await currentLink.evaluate((element) => getComputedStyle(element).color)).toBe(
      await notice.evaluate((element) => getComputedStyle(element).color),
    );

    const navigation = demo(page, "current-page").getByRole("navigation", {
      name: "Account sections",
    });
    const active = navigation.getByRole("link", { name: "Activity" });
    await expect(active).toHaveAttribute("aria-current", "page");
    await expect(active).toHaveCSS("font-weight", "600");
    await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
  });

  test("supports keyboard focus, themes, RTL, and mobile without runtime warnings", async ({
    page,
  }) => {
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

    const link = demo(page, "preview").getByRole("link", { name: "installation guide" });
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-style", "solid");
    await expect(link).toHaveCSS("outline-width", "2px");

    const lightColor = await link.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => link.evaluate((element) => getComputedStyle(element).color)).not.toBe(
      lightColor,
    );

    const rtl = demo(page, "rtl").locator('[dir="rtl"]');
    await expect(rtl).toHaveAttribute("dir", "rtl");
    await expect(rtl.getByRole("link", { name: "إرشادات إمكانية الوصول" })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-link")).toBeVisible();
    expect(errors).toEqual([]);
  });
});
