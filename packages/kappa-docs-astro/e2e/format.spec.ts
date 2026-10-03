import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-format-demo="${variant}"]`);

test.describe("Format documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/format");
  });

  test("renders examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Format" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-format")).toHaveCount(4);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/format"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(5);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Format", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Flow" })).toHaveAttribute(
      "href",
      "/docs/components/flow",
    );
    await expect(compact.getByRole("link", { name: "Next page: Grid" })).toHaveAttribute(
      "href",
      "/docs/components/grid",
    );
    await expect(footer.getByRole("link", { name: "Flow", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Grid", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Locales and Overrides",
      "Relative Time",
      "Time Display",
      "Accessibility",
      "API Reference",
      "Format",
      "Parts",
      "Data Slots",
      "Exports",
    ]);

    const response = await request.get("/docs/components/format.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Format");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("FormatRelativeTimeProps");
    expect(markdown).not.toContain("View Code");
  });

  test("formats technical values with locale and part-specific semantics", async ({ page }) => {
    const preview = demo(page, "preview");
    for (const part of ["byte", "number", "relative-time", "time"]) {
      const value = preview.locator(`[data-format-card="${part}"] .kappa-format`);
      await expect(value).toHaveCount(1);
      await expect(value).not.toHaveText("");
      await expect(value).toHaveAttribute("data-slot", `format-${part}`);
    }

    await expect(demo(page, "preview").locator('[data-format-card="time"]')).toContainText(":");
    await expect(demo(page, "locale").locator(".kappa-format")).toHaveCount(3);
    await expect(demo(page, "locale").locator(".format-demo__locale")).toHaveAttribute("lang", "de");
    await expect(demo(page, "relative").locator(".kappa-format")).toContainText(/ago|in|day|week|month/i);
    await expect(demo(page, "time").locator(".kappa-format")).toHaveCount(2);
  });

  test("supports both themes and a narrow viewport without warnings", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !text.startsWith("Failed to load resource:")) errors.push(text);
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(text)) errors.push(text);
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const card = demo(page, "preview").locator('[data-format-card="byte"]');
    const lightBackground = await card.evaluate((element) => getComputedStyle(element).backgroundColor);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => card.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
      lightBackground,
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-format").first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});
