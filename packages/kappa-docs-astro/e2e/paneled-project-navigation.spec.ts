import { expect, test, type Page } from "@playwright/test";

const examplePath = "/examples/appshell/paneled-workspace";
const projectUrl = `${examplePath}?view=Helicopter&project=HC-02`;

async function openProject(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(projectUrl);
  await expect.poll(() => page.locator('[data-sidebar-block="paneled-workspace"]').evaluate(node =>
    node.closest("astro-island")?.hasAttribute("ssr"),
  )).toBe(false);
}

test("legacy project bookmarks keep context while shared workspace pages stay global", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [requested, resolved] of [
    ["Project Settings", "Settings"], ["Project settings", "Settings"],
    ["Project activity", "Activities"], ["Activity log", "Activities"], ["Activity", "Activities"],
  ]) {
    await page.goto(`${examplePath}?${new URLSearchParams({ view: requested })}`);
    await expect(page).toHaveURL(`${examplePath}?${new URLSearchParams({ view: resolved, project: "AV-07" })}`);
    await expect(page.getByRole("button", { name: "Switch project: Aster VTOL", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: resolved, exact: true })).toBeVisible();
    if (resolved === "Settings") await expect(page.getByRole("textbox", { name: /Project name/ })).toHaveValue("Aster VTOL");
  }
  await page.reload();
  await expect(page).toHaveURL(/view=Activities&project=AV-07$/);
  await expect(page.getByRole("button", { name: "Switch project: Aster VTOL", exact: true })).toBeVisible();
  for (const view of ["Settings", "Activities"]) {
    await page.goto(`${examplePath}?${new URLSearchParams({ view })}`);
    await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
    await expect(page).toHaveURL(`${examplePath}?${new URLSearchParams({ view })}`);
    await expect(page.getByRole("button", { name: /^Switch project:/ })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: view, exact: true })).toBeVisible();
  }
});

test("an individual template bookmark keeps Explore and its Templates tab selected", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${examplePath}?view=Airfoil+aerodynamics`);
  await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
  const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  const templates = nav.getByRole("link", { name: "Explore", exact: true });
  await expect(templates).toHaveAttribute("aria-current", "page");
  await expect(templates).not.toHaveAttribute("aria-expanded");
  await expect(templates).toHaveAttribute("href", "?view=Explore");
  await expect(nav.getByRole("link", { name: "Airfoil aerodynamics", exact: true })).toHaveCount(0);
  await expect(nav.getByRole("button", { name: "Show more (18)", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Explore", exact: true, level: 2 })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Templates", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "Airfoil aerodynamics", exact: true, level: 3 })).toBeVisible();
});

for (const mode of ["expanded", "collapsed", "mobile"] as const) {
  test(`Show more reveals all projects without navigating in ${mode} navigation`, async ({ page }) => {
    await page.setViewportSize({ width: mode === "mobile" ? 390 : 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${examplePath}?view=Dashboard`);
    await expect.poll(() => page.locator('astro-island').evaluate(node => node.hasAttribute('ssr'))).toBe(false);
    if (mode === "mobile") await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
    const navigation = page.getByRole(mode === "mobile" ? "dialog" : "navigation", { name: "Paneled workspace navigation", exact: true });
    const projects = navigation.getByRole("link", { name: "Projects", exact: true });
    if (mode === "collapsed") {
      await navigation.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
      await projects.focus();
      await projects.press("ArrowDown");
    }
    const list = mode === "collapsed"
      ? page.getByRole("navigation", { name: "Projects pages", exact: true })
      : navigation.locator(".paneled-workspace-demo__nav-group").filter({ has: page.getByRole("heading", { name: "Projects", exact: true }) }).locator('[data-slot="sidebar-menu-sub"]');
    const showMore = list.getByRole("button", { name: "Show more (18)", exact: true });
    await expect(list.getByRole("link")).toHaveCount(7);
    await showMore.focus();
    await showMore.press("Enter");
    await expect(list.getByRole("link")).toHaveCount(25);
    await expect(list.getByRole("link", { name: "Aster VTOL", exact: true })).toBeFocused();
    await expect(page).toHaveURL(/view=Dashboard$/);
    await expect(list).toBeVisible();
    await expect(showMore).toHaveCount(0);
    await expect(list.getByRole("link", { name: "Avionics Bay Cooling", exact: true })).toBeVisible();
    await list.getByRole("link", { name: "Rocket Nozzle", exact: true }).click();
    await expect(page).toHaveURL(/project=RN-12$/);
    await navigation.getByRole("link", { name: "Back to Projects", exact: true }).click();
    if (mode === "collapsed") {
      await projects.focus();
      await projects.press("ArrowDown");
    }
    await expect(list.getByRole("link")).toHaveCount(25);
    await expect(showMore).toHaveCount(0);
  });
}

test("Analytics summary retains its navigation selection when the submenu opens", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${examplePath}?view=Analytics&project=WA-01`);
  await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
  const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  const analytics = nav.getByRole("button", { name: "Analytics", exact: true });
  await expect(analytics).toHaveAttribute("aria-current", "page");
  await analytics.click();
  await expect(nav.getByRole("link", { name: "Reports", exact: true })).toBeVisible();
  await expect(analytics).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("table", { name: "Simulation analytics", exact: true })).toBeVisible();
});

test("project search reaches Reports with arrow keys and keeps project context", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openProject(page);
  await page.getByRole("button", { name: "Search or go to…", exact: true }).click();
  const palette = page.getByRole("dialog", { name: "Search paneled workspace", exact: true });
  const input = palette.getByRole("combobox", { name: "Search pages and simulation runs", exact: true });
  const options = palette.getByRole("option");
  await expect(options.filter({ hasText: /^Applications$/ })).toHaveCount(1);
  await expect(options.filter({ hasText: /^Simulation runs$/ })).toHaveCount(1);
  const reports = options.filter({ hasText: /^Reports$/ });
  const reportsId = await reports.getAttribute("id");
  expect(reportsId).toBeTruthy();
  const count = await options.count();
  for (let index = 0; index < count; index++) {
    if (await input.getAttribute("aria-activedescendant") === reportsId) break;
    await input.press("ArrowDown");
  }
  await expect(input).toHaveAttribute("aria-activedescendant", reportsId!);
  await input.press("Enter");
  await expect(palette).toBeHidden();
  await expect(page).toHaveURL(/view=Reports&project=HC-02$/);
  const navigation = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  await expect(navigation.getByRole("link", { name: "Reports", exact: true })).toHaveAttribute("aria-current", "page");
  await page.reload();
  await expect(page.getByRole("button", { name: "Switch project: Helicopter", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reports", exact: true })).toBeVisible();
});

for (const mobile of [false, true]) {
  test(`all-projects switcher link restores navigation focus on ${mobile ? "mobile" : "desktop"}`, async ({ page }) => {
    await page.setViewportSize(mobile ? { width: 390, height: 664 } : { width: 1440, height: 1000 });
    await openProject(page);
    if (mobile) await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
    const navigation = mobile
      ? page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true })
      : page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
    const switcher = navigation.getByRole("button", { name: "Switch project: Helicopter", exact: true });
    await switcher.click();
    const search = page.getByRole("combobox", { name: "Search projects", exact: true });
    await expect(search).toBeFocused();
    await search.press("Escape");
    await expect(switcher).toBeFocused();
    await switcher.press("Enter");
    const allProjects = page.getByRole("link", { name: "Go to all projects", exact: true });
    await allProjects.focus();
    await allProjects.press("Enter");
    await expect(page).toHaveURL(/view=All\+projects$/);
    await expect(navigation.getByRole("link", { name: "Overview", exact: true })).toBeFocused();
    await expect(navigation.getByRole("link", { name: "Overview", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(switcher).toHaveCount(0);
  });
}

test("mobile project switches keep navigation open while ordinary page selection closes it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await openProject(page);
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await drawer.getByRole("button", { name: "Switch project: Helicopter", exact: true }).click();
  const search = page.getByRole("combobox", { name: "Search projects", exact: true });
  await search.fill("DR-03");
  await search.press("Enter");
  await expect(page).toHaveURL(/view=Drone&project=DR-03$/);
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Switch project: Drone", exact: true })).toBeFocused();
  await drawer.getByRole("link", { name: "Results", exact: true }).click();
  await expect(page).toHaveURL(/view=Results&project=DR-03$/);
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("heading", { name: "Results", exact: true })).toBeVisible();
});

test("project rename updates labels while links retain stable project identity", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openProject(page);
  await page.goto(`${examplePath}?view=Project+Settings&project=HC-02`);
  await expect(page.getByRole("button", { name: "Switch project: Helicopter", exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: /Project name/ }).fill("Reports");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("button", { name: "Switch project: Reports", exact: true })).toBeVisible();
  const breadcrumbs = page.getByRole("navigation", { name: "Workspace breadcrumb", exact: true });
  await expect(breadcrumbs.getByRole("link", { name: "Reports", exact: true })).toBeVisible();
  const navigation = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  await navigation.getByRole("button", { name: "Analytics", exact: true }).click();
  await navigation.getByRole("link", { name: "Reports", exact: true }).click();
  await expect(page).toHaveURL(/view=Reports&project=HC-02$/);
  await navigation.getByRole("link", { name: "Applications", exact: true }).click();
  await expect(page).toHaveURL(/view=Applications&project=HC-02$/);
  await expect(page.getByRole("heading", { name: "Applications", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Switch project: Reports", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Applications", exact: true })).toBeVisible();
});

test("browser Back restores workspace focus when project header controls disappear", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${examplePath}?view=All+projects`);
  await expect(page.getByRole("heading", { name: "All projects", exact: true })).toBeVisible();
  const navigation = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  await navigation.getByRole("link", { name: "Helicopter", exact: true }).click();
  for (const control of [
    navigation.getByRole("link", { name: "Back to Projects", exact: true }),
    navigation.getByRole("button", { name: "Switch project: Helicopter", exact: true }),
  ]) {
    await control.focus();
    await page.goBack();
    await expect(page).toHaveURL(/view=All\+projects$/);
    await expect(navigation.getByRole("link", { name: "Overview", exact: true })).toBeFocused();
    await page.goForward();
    await expect(control).toBeVisible();
  }
});

test("project options retain native Shift-click and middle-click navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openProject(page);
  await page.getByRole("button", { name: "Switch project: Helicopter", exact: true }).click();
  const input = page.getByRole("combobox", { name: "Search projects", exact: true });
  await input.fill("DR-03");
  const link = page.getByRole("option").filter({ hasText: "Drone" }).getByRole("link");
  await expect(link).toHaveAttribute("href", "?view=Drone&project=DR-03");
  for (const options of [{ modifiers: ["Shift" as const] }, { button: "middle" as const }]) {
    const created = page.context().waitForEvent("page");
    await link.click(options);
    const opened = await created;
    await expect(opened).toHaveURL(/view=Drone&project=DR-03$/);
    await expect(page).toHaveURL(/view=Helicopter&project=HC-02$/);
    await opened.close();
  }
});

test("the switcher distinguishes the current project from keyboard highlight", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openProject(page);
  await page.getByRole("button", { name: "Switch project: Helicopter", exact: true }).click();
  await page.getByRole("combobox", { name: "Search projects", exact: true }).press("ArrowDown");
  const current = page.getByRole("option").filter({ hasText: "Helicopter" });
  const highlighted = page.getByRole("option").and(page.locator("[data-highlighted]"));
  await expect(current).not.toHaveAttribute("data-highlighted");
  const background = await current.evaluate(node => getComputedStyle(node).backgroundColor);
  await expect(highlighted).not.toHaveCSS("background-color", background);
});

test("a direct project URL does not play a selection slide", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const state = window as typeof window & { sidebarTransitions: string[] };
    state.sidebarTransitions = [];
    document.addEventListener("transitionrun", event => {
      if (event.target instanceof Element && event.target.matches('[data-slot="sidebar-sliding-view"]')) {
        state.sidebarTransitions.push(event.propertyName);
      }
    });
  });
  await page.goto(`${examplePath}?view=Results&project=HC-02`);
  await expect(page.getByRole("button", { name: "Switch project: Helicopter", exact: true })).toBeVisible();
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  expect(await page.evaluate(() => (window as typeof window & { sidebarTransitions: string[] }).sidebarTransitions)).toEqual([]);
});

test("mobile tools rail keeps Help outside the drawer and the switcher offers Create Group", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await openProject(page);
  const help = page.getByRole("navigation", { name: "Workspace tools", exact: true }).getByRole("button", { name: "Help", exact: true });
  await expect(help).toBeVisible();
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await expect(drawer.getByRole("button", { name: "Help", exact: true })).toHaveCount(0);
  const switcher = drawer.getByRole("button", { name: "Workspace: Ros.Space", exact: true });
  await expect(switcher).toBeVisible();
  await switcher.click();
  await page.getByRole("menuitem", { name: "Create Group", exact: true }).click();
  await expect(page.getByRole("heading", { name: "New group", exact: true })).toBeVisible();
  await expect(drawer).toBeHidden();
});

test("search limits project pages to a selected project and includes its top-level links", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openProject(page);
  await page.getByRole("link", { name: "Back to Projects", exact: true }).click();
  const search = page.getByRole("button", { name: "Search or go to…", exact: true });
  await search.click();
  const input = page.getByRole("combobox", { name: "Search pages and simulation runs", exact: true });
  await input.fill("Reports");
  await expect(page.getByRole("option")).toHaveCount(0);
  await input.press("Escape");
  const navigation = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  await navigation.getByRole("link", { name: "Helicopter", exact: true }).click();
  for (const label of ["Activities", "Applications", "Members", "Settings"]) {
    await search.click();
    await input.fill(label);
    await expect(page.getByRole("option", { name: label, exact: true })).toBeVisible();
    await input.press("Enter");
    await expect(page).toHaveURL(/project=HC-02$/);
    await expect(page.getByRole("heading", { name: label, exact: true })).toBeVisible();
  }
});

test("page changes preserve focus when project content and header controls unmount", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openProject(page);
  await page.getByRole("link", { name: "Back to Projects", exact: true }).click();
  const project = page.getByRole("table", { name: "All projects", exact: true }).getByRole("link", { name: "Helicopter", exact: true });
  await project.focus();
  await project.press("Enter");
  await expect(page.getByRole("heading", { name: "Applications", exact: true })).toBeFocused();
  const back = page.getByRole("link", { name: "Back to Projects", exact: true });
  await back.focus();
  await back.press("?");
  await expect(page.getByRole("heading", { name: "Keyboard shortcuts", exact: true, level: 2 })).toBeFocused();
});

test("project avatars preserve the first complete Unicode character", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openProject(page);
  await page.goto(`${examplePath}?view=Project+Settings&project=HC-02`);
  await page.getByRole("textbox", { name: /Project name/ }).fill("🧑🏽‍🚀 Aero");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  const trigger = page.getByRole("button", { name: "Switch project: 🧑🏽‍🚀 Aero", exact: true });
  await expect(trigger.locator('[data-slot="avatar-fallback"]')).toHaveText("🧑🏽‍🚀");
  await trigger.click();
  await expect(page.getByRole("option").filter({ hasText: "🧑🏽‍🚀 Aero" }).locator('[data-slot="avatar-fallback"]')).toHaveText("🧑🏽‍🚀");
});

test("project switcher remains visible during its closing animation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openProject(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Switch project: Helicopter", exact: true }).click();
  const input = page.getByRole("combobox", { name: "Search projects", exact: true });
  await expect(input).toBeFocused();
  const closingVisibility = page.evaluate(() => new Promise<string>(resolve => {
    document.addEventListener("animationstart", function closing(event) {
      if (event.animationName !== "paneled-project-switcher-out" || !(event.target instanceof Element)) return;
      document.removeEventListener("animationstart", closing);
      resolve(getComputedStyle(event.target).visibility);
    });
  }));
  await input.press("Escape");
  expect(await closingVisibility).toBe("visible");
  await expect(input).toBeHidden();
});
