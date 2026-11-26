import { expect, test, type Page } from "@playwright/test";

const path = "/examples/appshell/paneled-workspace?view=Dashboard";
const navigation = (page: Page) => page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
const workspaceLinks = (page: Page) => navigation(page).getByRole("region", { name: "Workspace links", exact: true }).locator(':scope > [data-slot="sidebar-menu"]');
const pinned = (page: Page) => page.getByRole("list", { name: "Pinned pages", exact: true });
async function open(page: Page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
}
async function toggleFeature(page: Page) {
  await page.getByRole("button", { name: "Feature flags", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "Pinned section", exact: true }).click();
}

test("Pinned is optional and stays in workspace navigation", async ({ page }) => {
  await open(page);
  const nav = navigation(page);
  await expect(nav.getByRole("button", { name: "Pinned", exact: true })).toHaveCount(0);
  await toggleFeature(page);
  await expect(pinned(page).getByRole("link")).toHaveText(["Simulation runs", "All projects", "Explore"]);
  const toggle = nav.getByRole("button", { name: "Pinned", exact: true });
  await toggle.focus();
  await toggle.press("Enter");
  await expect(pinned(page)).toBeHidden();
  await toggle.press("Space");
  await expect(pinned(page)).toBeVisible();
  await pinned(page).getByRole("link", { name: "All projects", exact: true }).click();
  await expect(page).toHaveURL(/view=All\+projects$/);
  await expect(pinned(page).getByRole("link", { name: "All projects", exact: true })).toHaveAttribute("aria-current", "page");
  await toggle.click();
  await nav.getByRole("link", { name: "Drone", exact: true }).click();
  await expect(nav.getByRole("button", { name: "Pinned", exact: true })).toHaveCount(0);
  await nav.getByRole("link", { name: "Back to Projects", exact: true }).click();
  await expect(nav.getByRole("link", { name: "Overview", exact: true })).toBeFocused();
  await toggle.click();
  await nav.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(nav.getByRole("button", { name: "Pinned", exact: true })).toHaveCount(0);
  await nav.getByRole("link", { name: "Back to Dashboard", exact: true }).click();
  await expect(pinned(page)).toBeVisible();
  await toggleFeature(page);
  await expect(pinned(page)).toHaveCount(0);
  await toggleFeature(page);
  await expect(pinned(page).getByRole("link")).toHaveText(["Simulation runs", "All projects", "Explore"]);
  await toggleFeature(page);
  await page.reload();
  await expect(nav.getByRole("button", { name: "Pinned", exact: true })).toHaveCount(0);
});

test("workspace rows show a pin on hover and keep pinning separate from navigation", async ({ page }) => {
  await open(page);
  await toggleFeature(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const main = workspaceLinks(page);
  const link = main.getByRole("link", { name: "Recents", exact: true });
  const pin = main.getByRole("button", { name: "Pin Recents", exact: true });
  await page.mouse.move(700, 300);
  await expect(pin).toHaveCSS("opacity", "0");
  await expect(pin).toHaveCSS("pointer-events", "none");
  await link.hover();
  await expect(pin).toHaveCSS("opacity", "0");
  await expect(pin).toHaveCSS("opacity", "1");
  await expect(pin).toHaveCSS("pointer-events", "auto");
  await pin.click();
  await expect(page).toHaveURL(/view=Dashboard$/);
  const unpin = main.getByRole("button", { name: "Unpin Recents", exact: true });
  await expect(unpin).toHaveAttribute("aria-pressed", "true");
  await expect(pinned(page).getByRole("link", { name: "Recents", exact: true })).toBeVisible();
  await page.mouse.move(700, 300);
  await expect(unpin).toHaveCSS("opacity", "0");
  await expect(unpin).toHaveCSS("pointer-events", "none");
  await main.getByRole("link", { name: "Activities", exact: true }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(unpin).toBeFocused();
  await expect(unpin).toHaveCSS("opacity", "1");
  await unpin.click();
  await expect(pinned(page).getByRole("link", { name: "Recents", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Edit pinned pages", exact: true })).toHaveCount(0);
});

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`pin replaces the create action and count after hover (${reducedMotion})`, async ({ page }) => {
    await open(page);
    await toggleFeature(page);
    await page.emulateMedia({ reducedMotion });
    for (const name of ["Clickable Projects heading", "Projects section header", "Collapsible projects"]) {
      await page.getByRole("button", { name: "Feature flags", exact: true }).click();
      await page.getByRole("menuitemcheckbox", { name, exact: true }).click();
    }
    const nav = navigation(page);
    const heading = nav.getByRole("link", { name: "My Projects", exact: true });
    const source = nav.locator(".paneled-workspace-demo__nav-group");
    const pin = source.getByRole("button", { name: "Unpin All projects", exact: true });
    const create = source.getByRole("button", { name: "Create project", exact: true });
    await page.mouse.click(700, 300);
    await heading.hover();
    await expect(create).toHaveCSS("opacity", "1");
    await expect(pin).toHaveCSS("opacity", "0");
    await expect(pin).toHaveCSS("pointer-events", "none");
    const createBox = await create.boundingBox();
    await expect(pin).toHaveCSS("opacity", "1");
    await expect(create).toHaveCSS("opacity", "0");
    await expect(create).toHaveCSS("pointer-events", "none");
    expect(await pin.boundingBox()).toEqual(createBox);
    await pin.hover();
    const disclosure = nav.getByRole("button", { name: "Collapse My Projects", exact: true });
    await expect(disclosure).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await page.mouse.move(700, 300);
    await heading.focus();
    await heading.press("Tab");
    await expect(pin).toBeFocused();
    await expect(pin).toHaveCSS("opacity", "1");
    await pin.press("Tab");
    await expect(create).toBeFocused();
    await expect(create).toHaveCSS("opacity", "1");
    await expect(pin).toHaveCSS("opacity", "0");
    await page.mouse.click(700, 300);
    const runs = workspaceLinks(page).getByRole("link", { name: "Simulation runs", exact: true });
    const count = runs.locator(".paneled-workspace-demo__count");
    const runPin = workspaceLinks(page).getByRole("button", { name: "Unpin Simulation runs", exact: true });
    await expect(count).toHaveCSS("opacity", "1");
    expect((await count.boundingBox())?.x).toEqual((await runPin.boundingBox())?.x);
    await runs.hover();
    await expect(runPin).toHaveCSS("opacity", "1");
    await expect(count).toHaveCSS("opacity", "0");
  });
}

test("the project overview remains pinnable with either heading layout", async ({ page }) => {
  await open(page);
  await toggleFeature(page);
  const nav = navigation(page);
  const overview = nav.getByRole("link", { name: "Overview", exact: true });
  await overview.focus();
  await overview.press("Tab");
  const action = nav.locator('.paneled-workspace-demo__nav-group').getByRole("button", { name: "Unpin All projects", exact: true });
  await expect(action).toBeFocused();
  await action.press("Enter");
  await expect(pinned(page).getByRole("link", { name: "All projects", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Feature flags", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "Clickable Projects heading", exact: true }).click();
  const heading = nav.getByRole("link", { name: "Projects", exact: true });
  await heading.focus();
  await heading.press("Tab");
  await nav.getByRole("button", { name: "Pin All projects", exact: true }).press("Enter");
  await expect(pinned(page).getByRole("link", { name: "All projects", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/view=Dashboard$/);
});

test("pin choices survive reload and removing the final pin keeps focus", async ({ page }) => {
  await open(page);
  await toggleFeature(page);
  const activityLink = workspaceLinks(page).getByRole("link", { name: "Activities", exact: true });
  await activityLink.focus();
  await activityLink.press("Tab");
  const action = workspaceLinks(page).getByRole("button", { name: "Pin Activities", exact: true });
  await expect(action).toBeFocused();
  await action.press("Enter");
  await expect(workspaceLinks(page).getByRole("button", { name: "Unpin Activities", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/view=Dashboard$/);
  await page.reload();
  await expect(pinned(page).getByRole("link")).toHaveText(["Simulation runs", "All projects", "Explore", "Activities"]);
  for (const name of ["Simulation runs", "All projects", "Explore", "Activities"]) {
    const unpin = pinned(page).getByRole("button", { name: `Unpin ${name}`, exact: true });
    const link = pinned(page).getByRole("link", { name, exact: true });
    await link.focus();
    await link.press("Tab");
    await expect(unpin).toBeFocused();
    await unpin.press("Enter");
  }
  await expect(navigation(page).getByRole("button", { name: "Pinned", exact: true })).toBeFocused();
  await expect(page.getByText("No pinned pages. Use the pin beside a workspace page.", { exact: true })).toBeVisible();
  await page.reload();
  await expect(pinned(page).getByRole("link")).toHaveCount(0);
  const settingsLink = workspaceLinks(page).getByRole("link", { name: "Settings", exact: true });
  await settingsLink.focus();
  await settingsLink.press("Tab");
  await workspaceLinks(page).getByRole("button", { name: "Pin Settings", exact: true }).press("Enter");
  await pinned(page).getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page).toHaveURL(/view=Account\+details$/);
});

test("pinned pages work in the collapsed sidebar and mobile drawer", async ({ page }) => {
  await open(page);
  await toggleFeature(page);
  const nav = navigation(page);
  for (const name of ["Recents", "Settings"]) {
    const link = workspaceLinks(page).getByRole("link", { name, exact: true });
    await link.focus();
    await link.press("Tab");
    await workspaceLinks(page).getByRole("button", { name: `Pin ${name}`, exact: true }).press("Enter");
  }
  await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  const trigger = nav.getByRole("button", { name: "Pinned", exact: true });
  await trigger.click();
  const popup = page.getByRole("dialog", { name: "Pinned pages", exact: true });
  await expect(popup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await popup.getByRole("link", { name: "Recents", exact: true }).click();
  await expect(page).toHaveURL(/view=Recents$/);
  await expect(popup).toBeHidden();
  await trigger.click();
  await popup.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(nav.getByRole("link", { name: "Account details", exact: true })).toBeFocused();
  await nav.getByRole("link", { name: "Back to Dashboard", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  const activity = drawer.getByRole("link", { name: "Activities", exact: true });
  await activity.focus();
  await activity.press("Tab");
  await drawer.getByRole("button", { name: "Pin Activities", exact: true }).press("Enter");
  await expect(drawer).toBeVisible();
  await drawer.getByRole("list", { name: "Pinned pages", exact: true }).getByRole("link", { name: "Activities", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(page).toHaveURL(/view=Activities$/);
});
