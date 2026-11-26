import { expect, test, type Page } from "@playwright/test";

const path = "/examples/appshell/paneled-workspace?view=Dashboard";
async function toggleFlag(page: Page, name: string) {
  await page.getByRole("button", { name: "Feature flags", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name, exact: true }).click();
}
async function open(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(path);
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
}

for (const linked of [false, true]) {
  test(`Projects section controls the whole group with heading link ${linked}`, async ({ page }) => {
    await open(page);
    const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
    const section = nav.getByRole("button", { name: "Projects section", exact: true });
    const title = nav.getByRole("heading", { name: "My Projects", exact: true });
    const wind = nav.getByRole("link", { name: "Wind Aero Study", exact: true });
    await expect(section).toHaveCount(0);
    if (linked) await toggleFlag(page, "Clickable Projects heading");
    await toggleFlag(page, "Projects section header");
    await expect(section).toHaveAttribute("aria-expanded", "true");
    await expect(title).toBeVisible();
    await expect(nav.locator(".paneled-workspace-demo__projects-separator")).toHaveCount(0);
    await nav.getByRole("button", { name: "Show more (18)", exact: true }).click();
    const last = nav.getByRole("link", { name: "Avionics Bay Cooling", exact: true });
    await expect(last).toBeVisible();
    await section.click();
    await expect(section).toHaveAttribute("aria-expanded", "false");
    await expect(title).toBeHidden();
    await expect(wind).toBeHidden();
    await expect(nav.getByRole("button", { name: "Create project", exact: true })).toBeHidden();
    await expect(page).toHaveURL(/view=Dashboard$/);
    await section.press("Space");
    await expect(last).toBeVisible();
    if (linked) {
      await nav.getByRole("link", { name: "My Projects", exact: true }).click();
      await expect(page).toHaveURL(/view=All\+projects$/);
    }
    await section.press("Enter");
    await page.keyboard.press("Control+k");
    await page.getByRole("option", { name: "Wind Aero Study", exact: true }).click();
    await nav.getByRole("link", { name: "Back to Projects", exact: true }).click();
    await expect(section).toHaveAttribute("aria-expanded", "false");
    await expect(section).toBeFocused();
    await page.reload();
    await expect(section).toHaveAttribute("aria-expanded", "true");
    await section.click();
    await toggleFlag(page, "Projects section header");
    await expect(section).toHaveCount(0);
    await expect(nav.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
    await expect(wind).toBeVisible();
    if (linked) await expect(nav.locator(".paneled-workspace-demo__projects-separator")).toBeVisible();
  });
}

test("section, inner list, and icon rail keep independent states", async ({ page }) => {
  await open(page);
  for (const name of ["Clickable Projects heading", "Collapsible projects", "Project guide line", "Projects section header"]) await toggleFlag(page, name);
  const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  const section = nav.getByRole("button", { name: "Projects section", exact: true });
  await nav.getByRole("button", { name: "Collapse My Projects", exact: true }).click();
  await section.click();
  await section.press("Enter");
  await expect(nav.getByRole("button", { name: "Expand My Projects", exact: true })).toHaveAttribute("aria-expanded", "false");
  await section.click();
  await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  const projects = nav.getByRole("link", { name: "My Projects", exact: true });
  await projects.press("ArrowDown");
  const flyout = page.locator('[data-paneled-flyout="Projects"]');
  await expect(flyout.getByRole("link", { name: "My Projects", exact: true })).toBeFocused();
  await expect(flyout.getByRole("link", { name: "Wind Aero Study", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(projects).toBeFocused();
  await nav.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await expect(section).toHaveAttribute("aria-expanded", "false");
  await section.click();
  await expect(nav.getByRole("button", { name: "Expand My Projects", exact: true })).toBeVisible();
});

test.describe("touch navigation", () => {
  test.use({ isMobile: true, hasTouch: true });
  test("the section keeps its state across desktop and mobile layouts", async ({ page }) => {
    await open(page);
    await toggleFlag(page, "Projects section header");
    await page.getByRole("button", { name: "Projects section", exact: true }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open sidebar", exact: true }).tap();
    const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
    const section = drawer.getByRole("button", { name: "Projects section", exact: true });
    await expect(section).toHaveAttribute("aria-expanded", "false");
    await section.tap();
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Wind Aero Study", exact: true })).toBeVisible();
    await section.tap();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(page.getByRole("button", { name: "Projects section", exact: true })).toHaveAttribute("aria-expanded", "false");
  });
});
