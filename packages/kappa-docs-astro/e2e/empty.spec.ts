import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-empty-demo="${variant}"]`);

test.describe("Empty documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/empty");
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Empty" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-empty")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/empty"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Empty", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Editable" })).toHaveAttribute(
      "href",
      "/docs/components/editable",
    );
    await expect(compact.getByRole("link", { name: "Next page: Expandable Text" })).toHaveAttribute(
      "href",
      "/docs/components/expandable-text",
    );
    await expect(footer.getByRole("link", { name: "Editable", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Expandable Text", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Sizes",
      "Custom Media",
      "Avatar",
      "Avatar Group",
      "With Actions",
      "Outlined Container",
      "Dynamic Status",
      "Right-to-left",
      "Accessibility",
      "API Reference",
      "Empty.Root",
      "Empty.Media",
      "Empty.Title",
      "Parts",
      "Exports",
    ]);

    const response = await request.get("/docs/components/empty.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Empty");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("### [Dynamic Status](#dynamic-status)");
    expect(markdown).toContain("Empty.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("composes parts, sizes, media, actions, and consumer semantics", async ({ page }) => {
    const preview = demo(page, "preview");
    const previewRoot = preview.locator(".kappa-empty");
    await expect(previewRoot).toHaveAttribute("data-size", "base");
    await expect(previewRoot).not.toHaveAttribute("role");
    await expect(preview.locator('[data-slot="empty-header"]')).toHaveCount(1);
    await expect(preview.locator('[data-slot="empty-media"]')).toHaveAttribute("data-variant", "icon");
    await expect(preview.getByRole("heading", { level: 3, name: "No simulation cases" })).toBeVisible();
    await expect(preview.getByRole("button", { name: "Create case" })).toBeVisible();
    await expect(preview.getByRole("button", { name: "Import case" })).toBeVisible();

    const sizes = demo(page, "sizes").locator(".kappa-empty");
    await expect(sizes).toHaveCount(3);
    await expect(sizes.nth(0)).toHaveAttribute("data-size", "sm");
    await expect(sizes.nth(1)).toHaveAttribute("data-size", "base");
    await expect(sizes.nth(2)).toHaveAttribute("data-size", "lg");
    const padding = await sizes.evaluateAll((elements) =>
      elements.map((element) => Number.parseFloat(getComputedStyle(element).paddingBlockStart)),
    );
    expect(padding[0]).toBeLessThan(padding[1]);
    expect(padding[1]).toBeLessThan(padding[2]);

    const customMedia = demo(page, "media");
    await expect(customMedia.locator('[data-slot="empty-media"]')).toHaveAttribute(
      "data-variant",
      "default",
    );
    await expect(customMedia.locator(".empty-demo__plot")).toBeVisible();

    const avatar = demo(page, "avatar");
    await expect(avatar.locator(".kappa-avatar")).toHaveCount(1);
    await expect(avatar.getByRole("img", { name: "Offline" })).toBeVisible();
    await expect(avatar.getByRole("heading", { level: 3, name: "Mei Chen is offline" })).toBeVisible();
    await expect(avatar.getByRole("button", { name: "Leave a note" })).toBeVisible();

    const avatarGroup = demo(page, "avatar-group");
    await expect(avatarGroup.locator(".kappa-avatar-group .kappa-avatar")).toHaveCount(3);
    await expect(avatarGroup.locator('[data-slot="empty-media"]')).toHaveAttribute("aria-hidden", "true");
    await expect(avatarGroup.getByRole("button", { name: "Invite reviewers" })).toBeVisible();

    const outlined = demo(page, "outlined").locator(".kappa-empty");
    await expect(outlined).toHaveCSS("border-top-style", "dashed");

    const status = demo(page, "status");
    await expect(status.getByRole("status")).toHaveAttribute("aria-live", "polite");
    await expect(status.getByRole("heading", { level: 2, name: "No matching runs" })).toBeVisible();
  });

  test("keeps themes, focus, RTL, and mobile layout intact", async ({ page }) => {
    const preview = demo(page, "preview");
    const media = preview.locator('[data-slot="empty-media"]');
    const readStyles = () =>
      media.evaluate((element) => {
        const styles = getComputedStyle(element);
        return { background: styles.backgroundColor, color: styles.color, fontFamily: getComputedStyle(element.closest(".kappa-empty")!).fontFamily };
      });

    const light = await readStyles();
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(async () => (await readStyles()).background).not.toBe(light.background);
    const dark = await readStyles();
    expect(dark.color).not.toBe(light.color);
    expect(dark.fontFamily).toMatch(/Geist/i);

    const createButton = preview.getByRole("button", { name: "Create case" });
    await page.keyboard.press("Tab");
    await createButton.focus();
    await expect(createButton).toBeFocused();
    await expect(createButton).toHaveCSS("outline-style", "solid");

    const rtl = demo(page, "rtl").locator(".kappa-empty");
    await expect(rtl).toHaveAttribute("dir", "rtl");
    await expect(rtl).toHaveCSS("text-align", "center");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-empty")).toBeVisible();
  });
});
