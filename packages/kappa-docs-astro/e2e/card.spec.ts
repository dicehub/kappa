import { expect, test } from "@playwright/test";

test.describe("Card documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/card");
  });

  test("renders the complete contract, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Card" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator(".docs-component-example")).toHaveCount(8);
    await expect(page.locator("#composition [data-composition-tree='card']")).toContainText(
      "Card.Header",
    );
    await expect(page.locator("#composition [data-composition-tree='card']")).toContainText(
      "Card.Primary",
    );
    await expect(page.locator("#card-api").locator("..")).toContainText('"form"');
    await expect(page.locator("#standard-parts").locator("..")).toContainText("Card.Action");
    await expect(page.locator("#layered-parts").locator("..")).toContainText('"a"');
    await expect(page.locator("#preview [data-code-full] pre[data-language]")).toContainText(
      'from "@dicehub/kappa/components/card"',
    );
    await expect(page.locator('.docs-page-header__title-row a[href*="ark-ui.com"]')).toHaveCount(0);
    await expect(
      page.locator('[data-card-demo="event"] .kappa-card__title'),
    ).toHaveCSS("margin-top", "0px");

    const standard = page.locator('[data-card-demo="test-ids"]');
    await expect(standard.getByTestId("card-root")).toHaveAttribute("data-slot", "card");
    await expect(standard.getByTestId("card-header")).toHaveAttribute("data-slot", "card-header");
    await expect(standard.getByTestId("card-title")).toHaveAttribute("data-slot", "card-title");
    await expect(standard.getByTestId("card-content")).toHaveAttribute("data-slot", "card-content");
    await expect(standard.getByTestId("card-footer")).toHaveAttribute("data-slot", "card-footer");

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(compact.getByRole("link", { name: "Previous page: Button Group" })).toHaveAttribute(
      "href",
      "/docs/components/button-group",
    );
    await expect(compact.getByRole("link", { name: "Next page: Checkbox" })).toHaveAttribute(
      "href",
      "/docs/components/checkbox",
    );
    await expect(footer.getByRole("link", { name: "Button Group", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Checkbox", exact: true })).toBeVisible();

    const markdownResponse = await request.get("/docs/components/card.md");
    expect(markdownResponse.ok()).toBe(true);
    const markdown = await markdownResponse.text();
    expect(markdown).toContain("# Card");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("CardHeader / CardTitle");
    expect(markdown).not.toContain("View Code");
  });

  test("supports the form, filter, and linked primary interactions", async ({ page }) => {
    const preview = page.locator('[data-card-demo="preview"]');
    await expect(preview.locator("form.kappa-card")).toHaveAttribute("data-size", "base");
    await expect(preview.getByRole("heading", { name: "Sign in to your account" })).toHaveJSProperty(
      "tagName",
      "H3",
    );
    await preview.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(preview.getByText("Sign-in requested for alex@example.com")).toBeVisible();

    const filterDemo = page.locator('[data-card-demo="filter"]');
    const rows = filterDemo.locator('[role="row"]:not(.card-demo__row--header)');
    const input = filterDemo.getByRole("textbox", { name: "Filter origins" });
    await expect(rows).toHaveCount(3);
    await input.fill("legacy");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("legacy.example.com");
    await input.clear();
    await filterDemo.getByRole("button", { name: "4xx" }).click();
    await expect(rows).toHaveCount(1);
    await expect(filterDemo.getByText("Showing 1 of 3")).toBeVisible();

    const linkedPrimary = page.locator("[data-linked-primary]");
    await expect(linkedPrimary).toHaveAttribute("href", "#composition");
    await linkedPrimary.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(linkedPrimary).toBeFocused();
    await expect(linkedPrimary).toHaveCSS("outline-style", "solid");
    await expect(linkedPrimary).toHaveCSS("outline-width", "2px");
  });

  test("keeps layered edges square and both themes within mobile bounds", async ({ page }) => {
    const layered = page.locator('[data-card-demo="layered"] .kappa-card');
    const secondary = layered.locator(".kappa-card__secondary");
    const primary = layered.locator(".kappa-card__primary");
    const lightColors = await Promise.all([
      secondary.evaluate((element) => getComputedStyle(element).backgroundColor),
      primary.evaluate((element) => getComputedStyle(element).backgroundColor),
    ]);
    expect(lightColors[0]).not.toBe(lightColors[1]);
    await expect(primary).toHaveCSS("border-top-left-radius", "0px");
    await expect(primary).toHaveCSS("border-top-right-radius", "0px");

    await page.locator(".docs-header").getByRole("button", { name: "Toggle theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-kappa-theme", "dark");
    const darkColors = await Promise.all([
      secondary.evaluate((element) => getComputedStyle(element).backgroundColor),
      primary.evaluate((element) => getComputedStyle(element).backgroundColor),
    ]);
    expect(darkColors[0]).not.toBe(darkColors[1]);
    expect(darkColors).not.toEqual(lightColors);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('[data-card-demo="filter"] .card-demo__toolbar')).toHaveCSS(
      "flex-direction",
      "column",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });
});
