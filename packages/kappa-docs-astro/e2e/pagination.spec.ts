import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-pagination-demo="${variant}"]`);

test.describe("Pagination documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/pagination");
    await expect.poll(() => demo(page, "preview").evaluate(el => el.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
  });

  test("renders documentation, snippets, composition, and API data", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Pagination" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").getByRole("navigation", { name: "Results pages" })).toBeVisible();
    await expect(page.locator("pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/pagination"',
    );
    await expect(page.locator("pre").filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.getByText("PaginationPageChangeDetails")).toBeVisible();
    await expect(page.locator('[data-composition-tree="pagination"]')).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Text Labels",
      "Simple Controls",
      "Right-to-left",
      "Link Mode",
      "Controlled",
      "Sibling Pages",
      "Boundary States",
      "Accessibility",
      "Keyboard Support",
      "API Reference",
      "Pagination.Root",
      "Pagination.Item",
      "Pagination.Controls",
      "Navigation Triggers",
      "Parts",
      "Events",
      "Slots",
      "Data Attributes",
      "Exports",
    ]);

    const markdownResponse = await request.get("/docs/components/pagination.md");
    expect(markdownResponse.ok()).toBe(true);
    const markdown = await markdownResponse.text();
    expect(markdown).toContain("# Pagination");
    expect(markdown).toContain("PaginationProps");
    expect(markdown).not.toContain("On this page");
  });

  test("supports page selection, boundary disabling, links, and controlled pages", async ({ page }) => {
    const preview = demo(page, "preview");
    await expect(preview.getByRole("textbox", { name: "Page number" })).toHaveValue("4");
    await expect(preview.getByRole("button", { name: "previous page" })).toBeEnabled();
    await preview.getByRole("button", { name: "next page" }).click();
    await expect(preview.getByRole("textbox", { name: "Page number" })).toHaveValue("5");
    await expect(preview.locator(".pagination-demo__info")).toHaveText("Showing 41–50 of 120");

    const states = demo(page, "states");
    await expect(states.getByRole("button", { name: "first page" })).toBeDisabled();
    await expect(states.getByRole("button", { name: "previous page" })).toBeDisabled();
    await expect(states.getByRole("button", { name: "next page" })).toBeEnabled();

    const links = demo(page, "link");
    await expect(links.getByRole("link", { name: "page 1" })).toHaveAttribute(
      "href",
      "/runs?page=1&pageSize=10",
    );

    const controlled = demo(page, "controlled");
    await controlled.getByRole("button", { name: "next page" }).click();
    await expect(controlled.getByRole("status")).toHaveText("Page 4");
  });

  test("renders single and double arrows by default and optional text labels", async ({ page }) => {
    const preview = demo(page, "preview");
    for (const name of ["first page", "previous page", "next page", "last page"]) {
      const button = preview.getByRole("button", { name, exact: true });
      await expect(button).toHaveText("");
      await expect(button.locator("svg")).toHaveCount(1);
      await expect(button.locator("svg")).toHaveAttribute("aria-hidden", "true");
      await expect(button.locator("svg")).toHaveCSS("width", "16px");
      await expect(button).toHaveCSS("width", "32px");
      if (name !== "first page") await expect(button).toHaveCSS("border-inline-start-width", "1px");
      const visibleLabel = name.charAt(0).toUpperCase() + name.slice(1).replace(" page", "");
      await expect(demo(page, "labels").getByRole("button", { name, exact: true })).toHaveText(visibleLabel);
    }
    const firstPath = await preview.getByRole("button", { name: "first page", exact: true }).locator("path").getAttribute("d");
    const previousPath = await preview.getByRole("button", { name: "previous page", exact: true }).locator("path").getAttribute("d");
    expect(firstPath).not.toBe(previousPath);
    await expect(demo(page, "simple").getByRole("button")).toHaveCount(2);
    await expect(demo(page, "simple").getByRole("textbox")).toHaveCount(0);
    await expect(demo(page, "link").getByRole("link", { name: "next page", exact: true }).locator("svg")).toHaveCount(1);
    await expect(demo(page, "link").getByRole("link", { name: "next page", exact: true })).toHaveAttribute("href", "/runs?page=2&pageSize=10");
  });

  test("commits valid pages, clamps boundaries, and restores invalid or cancelled drafts", async ({ page }) => {
    const preview = demo(page, "preview");
    const input = preview.getByRole("textbox", { name: "Page number" });
    await input.fill("7");
    await expect(preview.locator(".pagination-demo__info")).toHaveText("Showing 31–40 of 120");
    await input.press("Enter");
    await expect(input).toHaveValue("7");
    await expect(preview.locator(".pagination-demo__info")).toHaveText("Showing 61–70 of 120");
    for (const text of ["", "abc", "1.5", "Infinity"]) {
      await input.fill(text);
      await input.press("Enter");
      await expect(input).toHaveValue("7");
    }
    await input.fill("3");
    await input.press("Escape");
    await expect(input).toHaveValue("7");
    await input.fill("999");
    await input.press("Enter");
    await expect(input).toHaveValue("12");
    await expect(preview.getByRole("button", { name: "last page", exact: true })).toBeDisabled();
    await input.fill("0");
    await input.press("Tab");
    await expect(input).toHaveValue("1");
    await expect(preview.getByRole("button", { name: "first page", exact: true })).toBeDisabled();
    await preview.getByRole("button", { name: "last page", exact: true }).click();
    await expect(input).toHaveValue("12");
    await preview.getByRole("button", { name: "first page", exact: true }).click();
    await expect(input).toHaveValue("1");

    const controlled = demo(page, "controlled");
    await controlled.getByRole("textbox").fill("6");
    await controlled.getByRole("textbox").press("Enter");
    await expect(controlled.getByRole("status")).toHaveText("Page 6");
    await expect(controlled.getByRole("textbox")).toHaveValue("6");
  });

  test("preserves keyboard focus, RTL arrows, and narrow-screen boundary controls", async ({ page }) => {
    const preview = demo(page, "preview");
    const first = preview.getByRole("button", { name: "first page", exact: true });
    await first.focus();
    await expect(first).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Tab");
    await expect(preview.getByRole("button", { name: "previous page", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(preview.getByRole("textbox")).toBeFocused();
    const rtl = demo(page, "rtl");
    await expect(rtl.getByRole("navigation")).toHaveAttribute("dir", "rtl");
    await expect(rtl.getByRole("button", { name: "previous page", exact: true }).locator("svg")).toHaveCSS("transform", "matrix(-1, 0, 0, -1, 0, 0)");
    await expect(rtl.getByRole("button", { name: "next page", exact: true }).locator("svg")).toHaveCSS("transform", "none");
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(first).toBeVisible();
    await expect(preview.getByRole("button", { name: "last page", exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test("keeps theme, narrow layout, and console clean", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !text.startsWith("Failed to load resource:")) errors.push(text);
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(text)) errors.push(text);
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const root = demo(page, "usage").getByRole("navigation", { name: "Search results" });
    const lightForeground = await root.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => root.evaluate((element) => getComputedStyle(element).color)).not.toBe(lightForeground);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").getByRole("navigation", { name: "Results pages" })).toBeVisible();
    expect(errors).toEqual([]);
  });
});
