import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { implementedComponentLinks } from "../src/data/docs-nav";

const { version: kappaVersion } = JSON.parse(
  readFileSync(new URL("../../kappa/package.json", import.meta.url), "utf8"),
);

const expectNoHorizontalOverflow = async (page: Page) => {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth <= root.clientWidth;
      }),
    )
    .toBe(true);
};

test.describe("Docs shell", () => {
  test("defaults to light mode and persists an explicit theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");

    const root = page.locator("html");
    const toggle = page.locator(".docs-header").getByRole("button", { name: "Toggle theme" });

    await expect(root).toHaveAttribute("data-mode", "light");
    await expect(root).toHaveAttribute("data-kappa-theme", "light");
    await expect(root).toHaveCSS("color-scheme", "light");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();

    await toggle.click();
    await expect(root).toHaveAttribute("data-mode", "dark");
    await expect(root).toHaveAttribute("data-kappa-theme", "dark");
    await expect(root).toHaveCSS("color-scheme", "dark");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

    await page.reload();
    await expect(root).toHaveAttribute("data-mode", "dark");
    await expect(root).toHaveAttribute("data-kappa-theme", "dark");
    await expect(root).toHaveCSS("color-scheme", "dark");
  });

  test("keeps the desktop sidebar collapsed across soft navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");

    const app = page.locator("[data-docs-app]");
    const desktopSidebar = page.locator("#desktop-navigation");
    const desktopHeader = page.locator(".docs-header");
    const mainShell = page.locator(".docs-main-shell");
    const sidebarToggle = desktopHeader.getByRole("button", { name: "Collapse navigation" });
    const marker = `soft-navigation-${Date.now()}`;

    await expect(page.locator(".docs-mobile-header")).toBeHidden();
    await expect(page.locator(".docs-sidebar-panel--desktop")).toBeVisible();
    await expect(desktopHeader).toBeVisible();
    await expect(desktopHeader.getByRole("button", { name: "Search documentation" })).toBeVisible();
    await expect(desktopSidebar.getByRole("button", { name: "Search documentation" })).toHaveCount(0);
    await expect(sidebarToggle.locator(".docs-sidebar-toggle__mark")).toBeVisible();
    await expect(desktopHeader.locator(".docs-sidebar-collapse__icon")).toHaveCount(0);
    await expect(app).toHaveAttribute("data-sidebar-open", "true");
    await expect(desktopSidebar).toHaveAttribute("aria-hidden", "false");
    await expect(desktopSidebar).not.toHaveAttribute("inert", "");
    await expect(mainShell).toHaveCSS("margin-left", "256px");
    expect(await desktopHeader.boundingBox()).toMatchObject({ x: 0, width: 1440, height: 64 });
    expect(await desktopSidebar.boundingBox()).toMatchObject({ x: 0, y: 74, width: 256, height: 840 });

    await page.evaluate((value) => {
      (window as Window & { __kappaSoftNavigationMarker?: string }).__kappaSoftNavigationMarker = value;
    }, marker);
    await sidebarToggle.hover();
    await expect(sidebarToggle.locator(".docs-mark__stem")).toHaveCSS("opacity", "0");
    await expect(sidebarToggle.locator(".docs-mark__node")).toHaveCSS("opacity", "0");
    await sidebarToggle.click();
    await expect(app).toHaveAttribute("data-sidebar-open", "false");
    await expect(desktopSidebar).toHaveAttribute("aria-hidden", "true");
    await expect(desktopSidebar).toHaveAttribute("inert", "");
    await expect(mainShell).toHaveCSS("margin-left", "0px");

    await page.getByRole("link", { name: "Kappa home" }).click();
    await expect(page).toHaveURL(/\/docs\/?$/);
    await expect(page).toHaveTitle("Kappa");
    await expect(app).toHaveAttribute("data-sidebar-open", "false");
    await expect(page.getByRole("button", { name: "Expand navigation" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await expect(page.getByRole("button", { name: "Expand navigation" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(desktopSidebar).toHaveAttribute("aria-hidden", "true");
    await expect(desktopSidebar).toHaveAttribute("inert", "");
    expect(
      await page.evaluate((value) => {
        return (
          (window as Window & { __kappaSoftNavigationMarker?: string }).__kappaSoftNavigationMarker === value
        );
      }, marker),
    ).toBe(true);
  });

  test("uses the mobile shell without overflow and closes its drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs/components/button");

    const app = page.locator("[data-docs-app]");
    const mainShell = page.locator(".docs-main-shell");
    const mobileHeader = page.locator(".docs-mobile-header");
    const mobileSidebar = page.locator(".docs-sidebar-panel--mobile");
    const openMenu = mobileHeader.locator("[data-mobile-sidebar-toggle]");
    const closeMenu = mobileSidebar.locator("[data-mobile-sidebar-close]");
    const mobileThemeToggle = mobileHeader.getByRole("button", { name: "Toggle theme" });
    const mobileSearch = mobileHeader.getByRole("button", { name: "Search documentation" });

    await expect(mobileHeader).toBeVisible();
    expect(await mobileHeader.boundingBox()).toMatchObject({ x: 0, y: 0, width: 390, height: 56 });
    await expect(page.locator(".docs-sidebar-panel--desktop")).toBeHidden();
    await expect(page.locator(".docs-header")).toBeHidden();
    await expect(openMenu.locator("[data-mobile-menu-icon]")).toBeVisible();
    await expect(openMenu.locator("[data-mobile-menu-icon]")).toHaveAttribute("aria-hidden", "true");
    await expect(openMenu.locator(".docs-mark")).toHaveCount(0);
    await expect(openMenu).toHaveAttribute("aria-expanded", "false");
    await expect(mobileSidebar).toHaveAttribute("aria-hidden", "true");
    await expect(mobileSidebar).toHaveAttribute("inert", "");
    await expect(mobileSearch).toBeVisible();
    await expect(mobileSearch).toHaveAttribute("aria-expanded", "false");
    await expect(mobileSidebar.getByRole("button", { name: "Search documentation" })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);

    await openMenu.focus();
    await page.keyboard.press("Tab");
    await expect(mobileSearch).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(mobileThemeToggle).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(mobileSidebar.locator(":focus")).toHaveCount(0);

    await openMenu.click();
    await expect(app).toHaveAttribute("data-mobile-sidebar-open", "true");
    await expect(openMenu).toHaveAttribute("aria-expanded", "true");
    await expect(mobileSidebar).toHaveAttribute("aria-hidden", "false");
    await expect(mobileSidebar).not.toHaveAttribute("inert", "");
    await expect(mobileHeader).toHaveAttribute("aria-hidden", "true");
    await expect(mobileHeader).toHaveAttribute("inert", "");
    await expect(mainShell).toHaveAttribute("aria-hidden", "true");
    await expect(mainShell).toHaveAttribute("inert", "");
    await expect(closeMenu).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(app).toHaveAttribute("data-mobile-sidebar-open", "false");
    await expect(openMenu).toHaveAttribute("aria-expanded", "false");
    await expect(openMenu).toBeFocused();
    await expect(mobileSidebar).toHaveAttribute("aria-hidden", "true");
    await expect(mobileSidebar).toHaveAttribute("inert", "");
    await expect(mobileHeader).toHaveAttribute("aria-hidden", "false");
    await expect(mobileHeader).not.toHaveAttribute("inert", "");
    await expect(mainShell).toHaveAttribute("aria-hidden", "false");
    await expect(mainShell).not.toHaveAttribute("inert", "");
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");

    await openMenu.click();
    await mobileSidebar.getByRole("link", { name: "Installation", exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/installation\/?$/);
    await expect(app).toHaveAttribute("data-mobile-sidebar-open", "false");
    await expect(openMenu).toHaveAttribute("aria-expanded", "false");
    await expectNoHorizontalOverflow(page);
  });

  test("keeps flat navigation groups visible and keyboard-accessible", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");

    const desktopSidebar = page.locator("#desktop-navigation");
    const groupLabels = desktopSidebar.locator(".docs-nav-group__label");
    const chartsGroup = groupLabels.filter({ hasText: /^Charts$/ }).locator("..");
    const mapsLink = chartsGroup.locator('a[href="/docs/charts/maps"]');
    const buttonLink = desktopSidebar.getByRole("link", { name: "Button", exact: true });
    const componentList = buttonLink.locator("xpath=ancestor::ul[1]");

    await expect(groupLabels).toHaveText(["Sections", "Components", "Charts", "Blocks"]);
    await expect(
      desktopSidebar.getByRole("button", { name: "Charts", exact: true }),
    ).toHaveCount(0);
    await expect(buttonLink).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect
      .poll(async () => {
        const [linkBox, listBox] = await Promise.all([
          buttonLink.boundingBox(),
          componentList.boundingBox(),
        ]);
        return Math.abs((linkBox?.width ?? 0) - (listBox?.width ?? 0));
      })
      .toBeLessThanOrEqual(1);
    await expect(mapsLink).toBeVisible();
    await mapsLink.hover();
    await expect(mapsLink).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await mapsLink.focus();
    await expect(mapsLink).toBeFocused();
    await expect(mapsLink).toHaveCSS("outline-style", "solid");
  });

  test("marks only the most specific visible navigation link as current", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/charts/maps");

    const visibleCurrentLinks = page.locator('a[aria-current="page"]:visible');

    await expect(visibleCurrentLinks).toHaveCount(1);
    await expect(visibleCurrentLinks).toHaveAccessibleName("Maps");
    await expect(visibleCurrentLinks).toHaveAttribute("href", "/docs/charts/maps");
  });

  test("renders the component directory and table of contents responsively", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs/components");

    const directory = page.getByRole("navigation", { name: "Component directory" });
    const links = directory.getByRole("link");
    const recentHeading = page.getByRole("heading", { level: 2, name: "Recently added" });
    const sectionHeading = page.getByRole("heading", { level: 2, name: "All components" });
    const sectionAnchor = sectionHeading.getByRole("link", { name: "All components" });
    const tableOfContents = page.getByRole("complementary", { name: "On this page" });
    const recentTableOfContentsLink = tableOfContents.getByRole("link", {
      name: "Recently added",
    });
    const tableOfContentsLink = tableOfContents.getByRole("link", { name: "All components" });

    await expect(page.getByRole("heading", { level: 1, name: "Components" })).toBeVisible();
    await expect(recentHeading).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Dialog Layout Arrange the header, content, and actions/ }),
    ).toBeVisible();
    await expect(sectionAnchor).toHaveAttribute("href", "#all-components");
    await expect(tableOfContents).toBeHidden();
    await expect(links).toHaveCount(implementedComponentLinks.length);

    const labels = (await links.allTextContents()).map((label) => label.trim());
    const sortedLabels = [...labels].sort((first, second) =>
      first.localeCompare(second, "en", { sensitivity: "base" }),
    );
    expect(labels).toEqual(sortedLabels);

    const mobileBoxes = await Promise.all([
      links.nth(0).boundingBox(),
      links.nth(1).boundingBox(),
      links.nth(2).boundingBox(),
    ]);
    expect(mobileBoxes[0]?.y).toBe(mobileBoxes[1]?.y);
    expect(mobileBoxes[2]?.y).toBeGreaterThan(mobileBoxes[0]?.y ?? 0);

    await links.first().focus();
    await page.keyboard.press("Tab");
    await expect(links.nth(1)).toBeFocused();
    await expectNoHorizontalOverflow(page);

    await page.setViewportSize({ width: 1024, height: 900 });
    const desktopBoxes = await Promise.all([
      links.nth(0).boundingBox(),
      links.nth(1).boundingBox(),
      links.nth(2).boundingBox(),
      links.nth(3).boundingBox(),
    ]);
    expect(desktopBoxes[0]?.y).toBe(desktopBoxes[1]?.y);
    expect(desktopBoxes[0]?.y).toBe(desktopBoxes[2]?.y);
    expect(desktopBoxes[3]?.y).toBeGreaterThan(desktopBoxes[0]?.y ?? 0);

    await page.setViewportSize({ width: 1440, height: 1000 });
    const currentLinks = page.locator('a[aria-current="page"]:visible');
    await expect(currentLinks).toHaveCount(1);
    await expect(currentLinks).toHaveAccessibleName("Components");
    await expect(tableOfContents).toBeVisible();
    await expect(tableOfContents.locator('[data-slot="table-of-contents"]')).toHaveCount(1);
    await expect(tableOfContents.locator('[data-part="indicator"]')).toHaveCount(1);
    await expect(recentTableOfContentsLink).toHaveAttribute("href", "#recently-added");
    await expect(tableOfContentsLink).toHaveAttribute("href", "#all-components");
    await expect(recentTableOfContentsLink).toHaveAttribute("aria-current", "location");
    await expectNoHorizontalOverflow(page);

    await tableOfContentsLink.click();
    await expect(page).toHaveURL(/\/docs\/components\/?#all-components$/);

    await directory.getByRole("link", { name: "Button", exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/components\/button\/?$/);
  });

  test("indents nested table of contents links", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");

    const tableOfContents = page.getByRole("complementary", { name: "On this page" });
    const installation = tableOfContents.getByRole("link", { name: "Installation", exact: true });
    const barrel = tableOfContents.getByRole("link", { name: "Barrel", exact: true });
    const granular = tableOfContents.getByRole("link", { name: "Granular", exact: true });
    const paddingInlineStart = (link: typeof installation) =>
      link.evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingInlineStart));

    await expect(tableOfContents).toBeVisible();
    await expect(tableOfContents.locator('[data-slot="table-of-contents"]')).toHaveCount(1);
    const [installationPadding, barrelPadding, granularPadding] = await Promise.all([
      paddingInlineStart(installation),
      paddingInlineStart(barrel),
      paddingInlineStart(granular),
    ]);

    await expect(installation).toHaveCSS("font-size", "13px");
    await expect(barrel).toHaveCSS("font-size", "13px");
    await expect(granular).toHaveCSS("font-size", "13px");
    expect(barrelPadding).toBeGreaterThan(installationPadding);
    expect(granularPadding).toBe(barrelPadding);
  });

  test("exposes the home heading and package metadata", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Introduction");
    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(4);
    await expect(page.locator(".docs-home__facts").first()).toContainText(
      `${implementedComponentLinks.length}Documented components`,
    );
    await expect(page.getByRole("link", { name: "Install Kappa" })).toHaveAttribute(
      "href",
      "/docs/installation",
    );
    await expect(page.getByRole("link", { name: "Browse components" })).toHaveAttribute(
      "href",
      "/docs/components",
    );
    await expect(page.locator(".docs-header__package")).toHaveText("@dicehub/kappa");
    await expect(page.locator(".docs-header__version")).toHaveText(`v${kappaVersion}`);
  });

  test("identifies exactly one active installation table-of-contents location", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/installation");

    const tableOfContents = page.getByRole("complementary", { name: "On this page" });
    const activeLocation = tableOfContents.locator('a[aria-current="location"]');

    await expect(activeLocation).toHaveCount(1);
    await expect(activeLocation).toHaveAccessibleName("Requirements");

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await expect(activeLocation).toHaveAccessibleName("Next Steps");
  });

  test("keeps the mobile shell on tablets and switches at 1024px", async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto("/docs/installation");

    const app = page.locator("[data-docs-app]");

    await expect(page.locator(".docs-mobile-header")).toBeVisible();
    await expect(page.locator(".docs-sidebar-panel--desktop")).toBeHidden();
    await expect(page.locator(".docs-header")).toBeHidden();
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(app).toHaveAttribute("data-mobile-sidebar-open", "true");

    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(app).toHaveAttribute("data-mobile-sidebar-open", "false");
    await expect(page.locator(".docs-mobile-header")).toBeHidden();
    await expect(page.locator(".docs-sidebar-panel--desktop")).toBeVisible();
    await expect(page.locator(".docs-header")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("hydrates Vue controls after soft navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/installation");
    await page.evaluate(() => {
      (window as Window & { __kappaVueHydrationMarker?: boolean }).__kappaVueHydrationMarker = true;
    });

    await page
      .locator(".docs-sidebar-panel--desktop")
      .getByRole("link", { name: "Home", exact: true })
      .click();
    await expect(page).toHaveURL(/\/docs\/?$/);
    expect(
      await page.evaluate(() => {
        return (window as Window & { __kappaVueHydrationMarker?: boolean }).__kappaVueHydrationMarker;
      }),
    ).toBe(true);

    await page.getByRole("button", { name: "Copy page options" }).click();
    await expect(page.getByRole("menuitem", { name: "Copy page link" })).toBeVisible();
  });
});
