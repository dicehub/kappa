import { expect, test, type Page } from "@playwright/test";

const readClipboard = (page: Page) => page.evaluate(() => navigator.clipboard.readText());

test.beforeEach(async ({ context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
});

test.describe("Copy Page", () => {


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
