import { expect, test, type Page } from "@playwright/test";

const examplePath = "/examples/appshell/paneled-workspace";
const optionName = "Clickable Projects heading";

async function openExample(page: Page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${examplePath}?view=Dashboard`);
  await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
}

async function toggleLayout(page: Page, name: string) {
  await page.getByRole("button", { name: "Feature flags", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name, exact: true }).click();
}

for (const inset of [false, true]) {
  test(`Projects heading option navigates, restores focus, and persists with inset header ${inset}`, async ({ page }) => {
    await openExample(page);
    if (inset) await toggleLayout(page, "Inset header");
    const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
    const projects = nav.getByRole("link", { name: "Projects", exact: true });
    const overview = nav.getByRole("link", { name: "Overview", exact: true });
    await expect(overview).toBeVisible();
    await toggleLayout(page, optionName);
    await expect(overview).toHaveCount(0);
    await expect(projects).toHaveAttribute("href", "?view=All+projects");
    await expect(projects).toHaveCSS("font-size", "14px");
    await expect(projects).toHaveCSS("font-weight", "425");
    await projects.focus();
    await projects.press("Enter");
    await expect(page).toHaveURL(/view=All\+projects$/);
    await expect(projects).toHaveAttribute("aria-current", "page");
    await nav.getByRole("link", { name: "Wind Aero Study", exact: true }).click();
    await nav.getByRole("link", { name: "Back to Projects", exact: true }).click();
    await expect(projects).toBeFocused();
    await projects.hover();
    await nav.getByRole("button", { name: "Create project", exact: true }).click();
    await expect(page).toHaveURL(/view=New\+project$/);
    await page.reload();
    await expect(projects).toBeVisible();
    await expect(overview).toHaveCount(0);
    await page.getByRole("button", { name: "Feature flags", exact: true }).click();
    await expect(page.getByRole("menuitemcheckbox", { name: optionName, exact: true })).toHaveAttribute("aria-checked", "true");
    await page.getByRole("menuitemcheckbox", { name: optionName, exact: true }).click();
    await expect(projects).toHaveCount(0);
    await expect(overview).toBeVisible();
    await page.reload();
    await expect(overview).toBeVisible();
    await expect(projects).toHaveCount(0);
  });
}

for (const mode of ["expanded", "collapsed", "mobile"] as const) {
  test(`linked Projects heading keeps Show more and overview navigation in ${mode} navigation`, async ({ page }) => {
    await openExample(page);
    await toggleLayout(page, optionName);
    await toggleLayout(page, "Project guide line");
    if (mode === "mobile") {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
    }
    const nav = page.getByRole(mode === "mobile" ? "dialog" : "navigation", { name: "Paneled workspace navigation", exact: true });
    if (mode === "collapsed") {
      await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
      await nav.getByRole("link", { name: "Projects", exact: true }).press("ArrowDown");
    }
    const scope = mode === "collapsed" ? page.locator('[data-paneled-flyout="Projects"]') : nav;
    const projects = scope.getByRole("link", { name: "Projects", exact: true });
    if (mode === "collapsed") await expect(projects).toBeFocused();
    await expect(scope.getByRole("link", { name: "Overview", exact: true })).toHaveCount(0);
    await scope.getByRole("button", { name: "Show more (18)", exact: true }).click();
    await expect(scope.getByRole("link", { name: "Aster VTOL", exact: true })).toBeFocused();
    await expect(scope.getByRole("link", { name: "Avionics Bay Cooling", exact: true })).toBeVisible();
    await expect(page).toHaveURL(/view=Dashboard$/);
    await projects.click();
    await expect(page).toHaveURL(/view=All\+projects$/);
    if (mode === "mobile") await expect(nav).toBeHidden();
  });
}
