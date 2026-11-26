import { expect, test } from "@playwright/test";

const examplePath = "/examples/appshell/paneled-workspace";

for (const mode of ["expanded", "collapsed", "mobile"] as const) {
  test(`Explore groups Templates and Community in ${mode} navigation`, async ({ page }) => {
    await page.setViewportSize({ width: mode === "mobile" ? 390 : 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${examplePath}?view=Dashboard`);
    await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
    if (mode === "mobile") await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
    const nav = page.getByRole(mode === "mobile" ? "dialog" : "navigation", { name: "Paneled workspace navigation", exact: true });
    if (mode === "collapsed") await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();

    const explore = nav.getByRole("link", { name: "Explore", exact: true });
    await expect(explore).toHaveAttribute("href", "?view=Explore");
    await expect(explore).not.toHaveAttribute("aria-expanded");
    await expect(nav.getByRole("link", { name: /^(Templates|Community)$/ })).toHaveCount(0);
    await explore.click();
    await expect(page).toHaveURL(/view=Explore$/);
    await expect(page.getByRole("heading", { name: "Explore", exact: true })).toBeVisible();
    const templates = page.getByRole("tab", { name: "Templates", exact: true });
    const community = page.getByRole("tab", { name: "Community", exact: true });
    await expect(templates).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("button", { name: /^Preview / })).toHaveCount(18);
    if (mode === "mobile") await expect(nav).toBeHidden();
    else await expect(explore).toHaveAttribute("aria-current", "page");

    await templates.focus();
    await templates.press("ArrowRight");
    await expect(community).toBeFocused();
    await expect(community).toHaveAttribute("aria-selected", "true");
    await expect(page).toHaveURL(/view=Community$/);
    const communityProjects = page.getByRole("tab", { name: "Community projects", exact: true });
    const publicProjects = page.getByRole("tab", { name: "Public projects", exact: true });
    const publicGroups = page.getByRole("tab", { name: "Public groups", exact: true });
    await expect(communityProjects).toHaveAttribute("aria-selected", "true");
    const communityGallery = page.getByRole("list", { name: "Community projects", exact: true });
    await expect(communityGallery.getByRole("link", { name: "Helicopter", exact: true })).toBeVisible();
    await communityProjects.focus();
    await communityProjects.press("ArrowRight");
    await expect(publicProjects).toBeFocused();
    await expect(publicProjects).toHaveAttribute("aria-selected", "true");
    await expect(community).toHaveAttribute("aria-selected", "true");
    await expect(communityGallery).toBeHidden();
    const publicTable = page.getByRole("table", { name: "Public projects", exact: true });
    await expect(publicTable.getByRole("link", { name: "Wind Aero Study", exact: true })).toBeVisible();
    await expect(publicTable.getByRole("link", { name: "Helicopter", exact: true })).toHaveCount(0);

    await publicProjects.press("ArrowRight");
    await expect(publicGroups).toBeFocused();
    await expect(publicGroups).toHaveAttribute("aria-selected", "true");
    await expect(page).toHaveURL(/view=Public\+groups$/);
    const groups = page.getByRole("table", { name: "Public groups", exact: true });
    await expect(groups.getByRole("row")).toHaveCount(5);
    await groups.getByRole("button", { name: "Open Aerodynamics", exact: true }).click();
    const details = page.getByRole("dialog", { name: "Open Aerodynamics", exact: true });
    await details.getByRole("link", { name: "Wind Aero Study", exact: true }).click();
    await expect(page).toHaveURL(/view=Wind\+Aero\+Study&project=WA-01$/);
    await expect(page.getByRole("heading", { name: "Applications", exact: true })).toBeVisible();
    await page.goBack();
    await expect(publicGroups).toHaveAttribute("aria-selected", "true");
    await page.reload();
    await expect(publicGroups).toHaveAttribute("aria-selected", "true");
    await page.goBack();
    await expect(publicProjects).toHaveAttribute("aria-selected", "true");
    await templates.click();
    await expect(page).toHaveURL(/view=Explore$/);
    await expect(page.getByRole("button", { name: /^Preview / })).toHaveCount(18);
  });
}

test("Explore sections are available through search without project context", async ({ page }) => {
  await page.goto(`${examplePath}?view=Helicopter&project=HC-02`);
  await expect(page.getByRole("heading", { name: "Applications", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Search or go to…", exact: true }).click();
  const palette = page.getByRole("dialog", { name: "Search paneled workspace", exact: true });
  const input = palette.getByRole("combobox", { name: "Search pages and simulation runs", exact: true });
  await input.fill("Public groups");
  await expect(palette.getByRole("option")).toHaveCount(1);
  await input.press("Enter");
  await expect(page).toHaveURL(/view=Public\+groups$/);
  await expect(page.getByRole("heading", { name: "Explore", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Community", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab", { name: "Public groups", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("button", { name: /^Switch project:/ })).toHaveCount(0);
});

for (const [view, tab] of [["All templates", "Templates"], ["Community", "Community"]]) {
  test(`existing ${view} URL opens its Explore tab`, async ({ page }) => {
    await page.goto(`${examplePath}?${new URLSearchParams({ view })}`);
    await expect(page.getByRole("heading", { name: "Explore", exact: true })).toBeVisible();
    await expect(page.getByRole("tab", { name: tab, exact: true })).toHaveAttribute("aria-selected", "true");
    const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
    await expect(nav.getByRole("link", { name: "Explore", exact: true })).toHaveAttribute("aria-current", "page");
  });
}

test("Community projects filters the image gallery and keeps project links", async ({ page }) => {
  await page.goto(`${examplePath}?view=Community`);
  const gallery = page.getByRole("list", { name: "Community projects", exact: true });
  await expect(gallery.getByRole("listitem")).toHaveCount(6);
  const search = page.getByRole("searchbox", { name: "Search community projects", exact: true });
  await search.fill("Sam Rivera");
  await expect(gallery.getByRole("link")).toHaveText([/Drone/, /Propeller Noise/]);
  await search.fill("");
  const tags = page.getByRole("group", { name: "Filter community projects by tag", exact: true });
  await tags.getByRole("button", { name: "Rotors", exact: true }).click();
  await tags.getByRole("button", { name: "Meshing", exact: true }).click();
  await expect(gallery.getByRole("link")).toHaveCount(1);
  await expect(gallery.getByRole("link", { name: "Drone", exact: true })).toHaveAttribute("href", "?view=Drone&project=DR-03");
  await search.fill("no-matching-project");
  await expect(page.getByRole("heading", { name: "No projects found", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters", exact: true }).first().click();
  await expect(gallery.getByRole("listitem")).toHaveCount(6);
  await gallery.getByRole("link", { name: "Helicopter", exact: true }).click();
  await expect(page).toHaveURL(/view=Helicopter&project=HC-02$/);
  await expect(page.getByRole("heading", { name: "Applications", exact: true })).toBeVisible();
});

test("Explore uses the available panel width and wraps Community sections on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  for (const view of ["Explore", "Community", "Public projects", "Public groups"]) {
    await page.goto(`${examplePath}?${new URLSearchParams({ view })}`);
    await expect(page.getByRole("heading", { name: "Explore", exact: true })).toBeVisible();
    const tabs = page.getByRole("tablist", { name: "Explore", exact: true });
    const content = page.getByRole("region", { name: "Workspace page", exact: true });
    const tabBounds = (await tabs.boundingBox())!;
    const contentBounds = (await content.boundingBox())!;
    expect(tabBounds.width).toBeGreaterThan(contentBounds.width - 50);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const sections = page.getByRole("tablist", { name: "Community sections", exact: true });
  const bounds = (await sections.boundingBox())!;
  for (const tab of await sections.getByRole("tab").all()) {
    const tabBounds = (await tab.boundingBox())!;
    expect(tabBounds.x).toBeGreaterThanOrEqual(bounds.x);
    expect(tabBounds.x + tabBounds.width).toBeLessThanOrEqual(bounds.x + bounds.width);
  }
});

test("Templates keep topic icons and preview details below their images", async ({ page, request }) => {
  await page.goto(`${examplePath}?view=Explore`);
  const catalog = page.getByRole("list", { name: "All templates", exact: true });
  await expect(catalog.getByRole("listitem")).toHaveCount(18);
  const cards = catalog.getByRole("article");
  await expect(cards.locator("img")).toHaveCount(18);
  const imageUrls = await cards.locator("img").evaluateAll(images =>
    [...new Set(images.map(image => (image as HTMLImageElement).src))],
  );
  for (const url of imageUrls) {
    const response = await request.get(url);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");
  }
  const rotor = cards.filter({ has: page.getByRole("heading", { name: "Rotor hover", exact: true }) });
  await expect(rotor).toContainText("Aerodynamics");
  await expect(rotor.locator("svg")).toBeVisible();
  await expect(rotor).toContainText("v1.1.0");
  await rotor.getByRole("button", { name: "Preview Rotor hover", exact: true }).click();
  const preview = page.getByRole("dialog", { name: "Rotor hover", exact: true });
  await expect(preview).toContainText("Rotating reference frame");
  await expect(preview).toContainText("Thrust and torque reports");
  await preview.getByRole("button", { name: "Close preview", exact: true }).click();
  await expect(rotor.getByRole("button", { name: "Preview Rotor hover", exact: true })).toBeFocused();
});
