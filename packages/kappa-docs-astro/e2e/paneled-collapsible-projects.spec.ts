import { expect, test, type Page } from "@playwright/test";

const path = "/examples/appshell/paneled-workspace?view=Dashboard";
async function toggleFlag(page: Page, name: string) {
  await page.getByRole("button", { name: "Feature flags", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name, exact: true }).click();
}
async function open(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
}

for (const linked of [false, true]) {
  test(`Projects icon controls the list separately from heading links ${linked}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await open(page);
    const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
    const collapse = nav.getByRole("button", { name: "Collapse projects", exact: true });
    const expand = nav.getByRole("button", { name: "Expand projects", exact: true });
    const wind = nav.getByRole("link", { name: "Wind Aero Study", exact: true });
    await expect(collapse).toHaveCount(0);
    if (linked) await toggleFlag(page, "Clickable Projects heading");
    await toggleFlag(page, "Collapsible projects");
    await expect(collapse).toHaveAttribute("aria-expanded", "true");
    await expect(collapse.locator(".paneled-project-disclosure__icon")).toHaveCSS("opacity", "1");
    await collapse.hover();
    await expect(collapse.locator(".paneled-project-disclosure__icon")).toHaveCSS("opacity", "0");
    await expect(collapse.locator(".paneled-project-disclosure__chevron")).toHaveCSS("opacity", "1");
    await expect(collapse.locator(".paneled-project-disclosure__chevron")).toHaveCSS("transform", "matrix(0, 1, -1, 0, 0, 0)");
    await collapse.click();
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await expect(expand.locator(".paneled-project-disclosure__chevron")).toHaveCSS("transform", "none");
    await expect(wind).toBeHidden();
    await expect(page).toHaveURL(/view=Dashboard$/);
    await expand.hover();
    await expect(page.locator('[data-paneled-flyout="Projects"]')).not.toBeVisible();
    if (linked) {
      await nav.getByRole("link", { name: "Projects", exact: true }).click();
    } else {
      await page.keyboard.press("Control+k");
      await page.getByRole("option", { name: "All projects", exact: true }).click();
    }
    await expect(page).toHaveURL(/view=All\+projects$/);
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Control+k");
    await page.getByRole("option", { name: "Wind Aero Study", exact: true }).click();
    await nav.getByRole("link", { name: "Back to Projects", exact: true }).click();
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await expect(linked ? nav.getByRole("link", { name: "Projects", exact: true }) : expand).toBeFocused();
    await expand.press("Space");
    await expect(wind).toBeVisible();
    await expect(collapse.locator(".paneled-project-disclosure__chevron")).toHaveCSS("opacity", "1");
    await toggleFlag(page, "Project guide line");
    await nav.getByRole("button", { name: "Show more (18)", exact: true }).click();
    const lastProject = nav.getByRole("link", { name: "Avionics Bay Cooling", exact: true });
    await expect(lastProject).toBeVisible();
    await collapse.press("Enter");
    await expect(lastProject).toBeHidden();
    await expand.press("Enter");
    await expect(lastProject).toBeVisible();
    await collapse.click();
    await expand.hover();
    await nav.getByRole("button", { name: "Create project", exact: true }).click();
    await expect(page).toHaveURL(/view=New\+project$/);
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await page.reload();
    await expect(collapse).toHaveAttribute("aria-expanded", "true");
    await collapse.click();
    await toggleFlag(page, "Collapsible projects");
    await expect(wind).toBeVisible();
    await expect(expand).toHaveCount(0);
  });
}

test("the icon rail keeps its Projects flyout and restores the closed list", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  await toggleFlag(page, "Collapsible projects");
  const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  await nav.getByRole("button", { name: "Collapse projects", exact: true }).click();
  await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  const projects = nav.getByRole("link", { name: "Projects", exact: true });
  await projects.press("ArrowDown");
  const flyout = page.locator('[data-paneled-flyout="Projects"]');
  await expect(flyout.getByRole("link", { name: "Overview", exact: true })).toBeFocused();
  await expect(flyout.getByRole("link", { name: "Wind Aero Study", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(projects).toBeFocused();
  await nav.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await expect(nav.getByRole("button", { name: "Expand projects", exact: true })).toHaveAttribute("aria-expanded", "false");
  await expect(nav.getByRole("link", { name: "Wind Aero Study", exact: true })).toBeHidden();
});

test("the closed Projects list survives desktop and mobile layout changes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  await toggleFlag(page, "Collapsible projects");
  await page.getByRole("button", { name: "Collapse projects", exact: true }).click();
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await expect(drawer.getByRole("button", { name: "Expand projects", exact: true })).toHaveAttribute("aria-expanded", "false");
  await expect(drawer.getByRole("link", { name: "Wind Aero Study", exact: true })).toBeHidden();
  await page.setViewportSize({ width: 1440, height: 1000 });
  const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  await expect(nav.getByRole("button", { name: "Expand projects", exact: true })).toHaveAttribute("aria-expanded", "false");
  await expect(nav.getByRole("link", { name: "Wind Aero Study", exact: true })).toBeHidden();
});

test.describe("touch navigation", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("the chevron is visible and tapping it does not close the drawer", async ({ page }) => {
    await open(page);
    await toggleFlag(page, "Collapsible projects");
    await page.getByRole("button", { name: "Open sidebar", exact: true }).tap();
    const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
    const collapse = drawer.getByRole("button", { name: "Collapse projects", exact: true });
    const wind = drawer.getByRole("link", { name: "Wind Aero Study", exact: true });
    await expect(collapse.locator(".paneled-project-disclosure__icon")).toHaveCSS("opacity", "0");
    await expect(collapse.locator(".paneled-project-disclosure__chevron")).toHaveCSS("opacity", "1");
    await collapse.tap();
    await expect(drawer).toBeVisible();
    await expect(wind).toBeHidden();
    await drawer.getByRole("button", { name: "Expand projects", exact: true }).tap();
    await expect(wind).toBeVisible();
    await wind.tap();
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Back to Projects", exact: true })).toBeVisible();
  });
});
