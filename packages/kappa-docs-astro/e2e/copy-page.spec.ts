import { expect, test, type Page } from "@playwright/test";

const readClipboard = (page: Page) => page.evaluate(() => navigator.clipboard.readText());

test.beforeEach(async ({ context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
});

test.describe("Copy Page", () => {
  test("copies Markdown and exposes the full keyboard menu", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/installation");

    const desktopControls = page.locator(".docs-page-header__desktop-actions");
    const mobileControls = page.locator(".docs-page-header__mobile-actions");
    const copyPage = desktopControls.getByRole("button", { name: "Copy page", exact: true });
    const options = desktopControls.getByRole("button", { name: "Copy page options" });

    await expect(desktopControls).toBeVisible();
    await expect(mobileControls).toBeHidden();

    await copyPage.click();
    await expect(desktopControls.getByRole("status")).toHaveText("Page copied");
    await expect.poll(() => readClipboard(page)).toContain("# Installation");
    await expect.poll(() => readClipboard(page)).toContain("pnpm add @dicehub/kappa vue@^3.5.0");

    await options.focus();
    await page.keyboard.press("ArrowDown");

    const menu = page.getByRole("menu");
    const menuItems = menu.getByRole("menuitem");
    await expect(menu).toBeVisible();
    await expect(menuItems).toHaveCount(4);
    await expect(menu).toBeFocused();
    await page.keyboard.press("Home");
    await page.keyboard.press("Enter");
    await expect(menu).toBeHidden();
    await expect(desktopControls.getByRole("status")).toHaveText("Page link copied");
    await expect.poll(() => readClipboard(page)).toBe(page.url());

    await options.focus();
    await page.keyboard.press("ArrowDown");
    await expect(menu).toBeVisible();
    await expect(menu).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(options).toBeFocused();

    await page.evaluate(() => {
      const testWindow = window as Window & { __kappaOpenedUrls?: string[] };
      testWindow.__kappaOpenedUrls = [];
      window.open = ((url?: string | URL) => {
        testWindow.__kappaOpenedUrls?.push(String(url));
        return null;
      }) as typeof window.open;
    });

    await options.click();
    await page.getByRole("menuitem", { name: "View Page as Markdown" }).click();
    await options.click();
    await page.getByRole("menuitem", { name: "Open in Claude" }).click();

    const openedUrls = await page.evaluate(
      () => (window as Window & { __kappaOpenedUrls?: string[] }).__kappaOpenedUrls ?? [],
    );
    expect(openedUrls[0]).toMatch(/\/docs\/installation\.md$/);
    expect(openedUrls[1]).toContain("https://claude.ai/new?q=");
    expect(decodeURIComponent(openedUrls[1] ?? "")).toContain("Kappa documentation");
  });

  test("uses the mobile control without clipping its menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs/components");

    const mobileControls = page.locator(".docs-page-header__mobile-actions");
    const desktopControls = page.locator(".docs-page-header__desktop-actions");

    await expect(mobileControls).toBeVisible();
    await expect(desktopControls).toBeHidden();

    await mobileControls.getByRole("button", { name: "Copy page", exact: true }).click();
    await expect(mobileControls.getByRole("status")).toHaveText("Page copied");
    const markdown = await readClipboard(page);
    expect(markdown).toContain("# Components");
    expect(markdown).toContain("[Button](/docs/components/button)");
    expect(markdown).not.toContain("On this page");

    await mobileControls.getByRole("button", { name: "Copy page options" }).click();
    const menuBox = await page.getByRole("menu").boundingBox();
    expect(menuBox).not.toBeNull();
    expect(menuBox?.x).toBeGreaterThanOrEqual(0);
    expect((menuBox?.x ?? 0) + (menuBox?.width ?? 0)).toBeLessThanOrEqual(390);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });

  test("rehydrates the control after soft navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components");

    await page
      .getByRole("navigation", { name: "Component directory" })
      .getByRole("link", { name: "Button", exact: true })
      .click();
    await expect(page).toHaveURL(/\/docs\/components\/button\/?$/);

    const desktopControls = page.locator(".docs-page-header__desktop-actions");
    await desktopControls.getByRole("button", { name: "Copy page", exact: true }).click();
    await expect.poll(() => readClipboard(page)).toContain("# Button");
  });
});
