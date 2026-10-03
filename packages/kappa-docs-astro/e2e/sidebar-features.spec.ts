import { expect, test, type Locator, type Page } from "@playwright/test";

const demo = (page: Page, name: string) => page.locator(`[data-sidebar-demo="${name}"]`);
const nav = (page: Page, name: string) => demo(page, name).getByRole("navigation", { name: `${name} navigation`, exact: true });
const trigger = (page: Page, name: string) => demo(page, name).locator('.sidebar-demo__topbar [data-slot="sidebar-trigger"]');
const handle = (page: Page, name = "resizable") => demo(page, name).getByRole("separator", { name: "Resize sidebar" });
const width = (element: Locator) => element.evaluate(node => node.getBoundingClientRect().width);

async function drag(page: Page, separator: Locator, delta: number) {
  await separator.scrollIntoViewIfNeeded();
  const box = await separator.boundingBox();
  const x = box!.x + box!.width / 2;
  const y = box!.y + Math.min(80, box!.height / 2);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + delta, y, { steps: 8 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/sidebar");
  await expect.poll(() => demo(page, "resizable").evaluate(el => el.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
});

test("new feature examples are linked and use unique section anchors", async ({ page }) => {
  for (const id of ["resizable", "namespace-selector", "profile-selector", "quick-search", "loading", "peeking", "scroll-to-item", "sliding-views", "full-screen-mobile"]) {
    await expect(page.locator(`h3[id="${id}"]`)).toHaveCount(1);
    await expect(demo(page, id)).toHaveCount(1);
  }
});

test("separator drag resizes, clamps, collapses, expands and keeps other instances unchanged", async ({ page }) => {
  const root = nav(page, "resizable");
  await expect(root).toHaveCSS("width", "240px");
  await expect(handle(page)).toHaveAttribute("aria-orientation", "vertical");
  await expect(handle(page)).toHaveAttribute("aria-controls", (await root.getAttribute("id"))!);
  await drag(page, handle(page), 70);
  await expect.poll(() => width(root)).toBeCloseTo(310, 0);
  await expect(handle(page)).toHaveAttribute("aria-valuenow", "310");
  await expect(nav(page, "preview")).toHaveCSS("width", "260px");
  await drag(page, handle(page), 400);
  await expect(root).toHaveCSS("width", "400px");
  await drag(page, handle(page), -370);
  await expect(root).toHaveAttribute("data-state", "collapsed");
  await expect(root).toHaveCSS("width", "52px");
  await expect(handle(page)).toHaveAttribute("aria-valuetext", "Collapsed");
  await drag(page, handle(page), 200);
  await expect(root).toHaveAttribute("data-state", "expanded");
  await expect.poll(() => width(root)).toBeCloseTo(252, 0);
  await expect(demo(page, "resizable").locator('[data-slot="sidebar-provider"]')).not.toHaveAttribute("data-resizing");
});

test("separator keyboard controls preserve the expanded width and visible focus", async ({ page }) => {
  const separator = handle(page);
  const root = nav(page, "resizable");
  await separator.focus();
  await expect(separator).toBeFocused();
  await separator.press("ArrowRight");
  await expect.poll(() => width(root)).toBeGreaterThan(240);
  const saved = await width(root);
  await separator.press("Enter");
  await expect(root).toHaveAttribute("data-state", "collapsed");
  await trigger(page, "resizable").click();
  await expect.poll(() => width(root)).toBeCloseTo(saved, 0);
  await separator.press("Home");
  await expect(root).toHaveAttribute("data-state", "collapsed");
  await separator.press("End");
  await expect(root).toHaveCSS("width", "400px");
  await expect(separator).toHaveAttribute("aria-valuemax", "400");
});

test("controlled resize requests can be rejected", async ({ page }) => {
  const name = "resizable-controlled";
  await demo(page, name).getByRole("button", { name: "Lock width" }).click();
  await drag(page, handle(page, name), 60);
  await expect(nav(page, name)).toHaveCSS("width", "240px");
  await demo(page, name).getByRole("button", { name: "Unlock width" }).click();
  await drag(page, handle(page, name), 60);
  await expect.poll(() => width(nav(page, name))).toBeCloseTo(300, 0);
});

test("resize follows end placement and right-to-left direction", async ({ page }) => {
  for (const name of ["end", "rtl"]) {
    await handle(page, name).scrollIntoViewIfNeeded();
    const edge = await handle(page, name).boundingBox();
    const root = await nav(page, name).boundingBox();
    expect(Math.abs(edge!.x + edge!.width / 2 - root!.x)).toBeLessThan(4);
    await drag(page, handle(page, name), -60);
    await expect.poll(() => width(nav(page, name))).toBeCloseTo(300, 0);
    await handle(page, name).press("ArrowLeft");
    await expect.poll(() => width(nav(page, name))).toBeGreaterThan(300);
    await handle(page, name).press("Enter");
    await expect(nav(page, name)).toHaveAttribute("data-state", "collapsed");
    await handle(page, name).press("Enter");
    await expect(nav(page, name)).toHaveAttribute("data-state", "expanded");
  }
});

test("resize width survives mobile transitions and the separator is desktop-only", async ({ page }) => {
  await drag(page, handle(page), 60);
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger(page, "resizable").click();
  const sheet = page.getByRole("dialog", { name: "resizable navigation", exact: true });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("separator", { name: "Resize sidebar" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect.poll(() => width(nav(page, "resizable"))).toBeCloseTo(300, 0);
});

test("peeking supports hover and focus without changing the page width or saved open state", async ({ page }) => {
  const root = nav(page, "peeking");
  await demo(page, "peeking").scrollIntoViewIfNeeded();
  const main = demo(page, "peeking").locator(".sidebar-demo__main");
  const before = await main.evaluate(node => ({ x: node.getBoundingClientRect().x, width: node.getBoundingClientRect().width, top: (node as HTMLElement).offsetTop }));
  await root.getByRole("link", { name: "Overview", exact: true }).hover();
  await expect(root).toHaveAttribute("data-state", "peeking");
  expect(await main.evaluate(node => ({ x: node.getBoundingClientRect().x, width: node.getBoundingClientRect().width, top: (node as HTMLElement).offsetTop }))).toEqual(before);
  await expect(trigger(page, "peeking")).toHaveAttribute("aria-expanded", "false");
  await root.getByRole("link", { name: "Overview", exact: true }).focus();
  await main.hover({ position: { x: 350, y: 100 } });
  await expect(root).toHaveAttribute("data-state", "peeking");
  await trigger(page, "peeking").focus();
  await expect(root).toHaveAttribute("data-state", "collapsed");
  await root.getByRole("link", { name: "Overview", exact: true }).focus();
  await expect(root).toHaveAttribute("data-state", "peeking");
});

test("namespace and profile popup selection stays usable while peeking", async ({ page }) => {
  const root = nav(page, "peeking");
  const namespace = root.getByRole("button", { name: "Namespace: Engineering" });
  await namespace.hover();
  await namespace.click();
  const menu = page.getByRole("menu", { name: "Namespace: Engineering", exact: true });
  await menu.getByRole("menuitem", { name: "Research", exact: true }).hover();
  await expect(root).toHaveAttribute("data-state", "peeking");
  await menu.getByRole("menuitem", { name: "Research", exact: true }).click();
  await expect(root.getByRole("button", { name: "Namespace: Research" })).toBeFocused();
  await expect(demo(page, "peeking").locator(".sidebar-demo__eyebrow")).toHaveText("Research");
  await root.getByRole("button", { name: "Profile: Casey Rivera" }).click();
  const profile = page.getByRole("menu", { name: "Profile: Casey Rivera", exact: true });
  await profile.getByRole("menuitemradio", { name: "Jordan Lee" }).hover();
  await expect(root).toHaveAttribute("data-state", "peeking");
  await profile.getByRole("menuitemradio", { name: "Jordan Lee" }).click();
  await expect(root.getByRole("button", { name: "Profile: Jordan Lee" })).toBeFocused();
});

test("quick search filters, handles empty results, selects with the keyboard and restores focus", async ({ page }) => {
  const button = nav(page, "quick-search").getByRole("button", { name: "Quick search …" });
  await button.click();
  const palette = page.getByRole("dialog", { name: "Search navigation", exact: true });
  const input = palette.getByRole("combobox");
  await input.fill("no-such-page");
  await expect(palette.getByText("No pages found.")).toBeVisible();
  await input.fill("refine");
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(palette).toBeHidden();
  await expect(demo(page, "quick-search").locator(".sidebar-demo__title")).toHaveText("Refinement");
  await expect(button).toBeFocused();
  await button.click();
  await palette.getByRole("combobox").press("Escape");
  await expect(button).toBeFocused();
});

test("sliding navigation hides inactive links, retains state, and restores the previous view focus", async ({ page }) => {
  const root = nav(page, "sliding-views");
  const workspace = root.locator('[data-slot="sidebar-sliding-view"][data-value="workspace"]');
  const project = root.locator('[data-slot="sidebar-sliding-view"][data-value="project"]');
  await expect(project).toHaveAttribute("inert");
  await root.getByRole("button", { name: "Rotor study", exact: true }).click();
  await expect(workspace).toHaveAttribute("inert");
  await expect(workspace).toHaveAttribute("aria-hidden", "true");
  await expect(project).toBeFocused();
  await expect(project).not.toHaveAttribute("inert");
  await root.getByRole("button", { name: "Geometry", exact: true }).click();
  await root.getByRole("button", { name: "Back to workspace" }).click();
  await expect(root.getByRole("button", { name: "Rotor study", exact: true })).toBeFocused();
  await root.getByRole("button", { name: "Rotor study", exact: true }).click();
  await expect(root.getByRole("button", { name: "Geometry", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(project).toHaveCSS("transition-duration", "0s");
});

test("full-screen mobile supports namespace, profile and nested search without losing focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/examples/components/sidebar/full-screen-mobile");
  const opener = trigger(page, "full-screen-mobile");
  await opener.click();
  const sheet = page.getByRole("dialog", { name: "full-screen-mobile navigation", exact: true });
  await expect(sheet).toHaveCSS("width", "390px");
  await sheet.getByRole("button", { name: "Namespace: Engineering" }).click();
  await page.getByRole("menuitem", { name: "Research", exact: true }).click();
  await expect(sheet).toBeVisible();
  await sheet.getByRole("button", { name: "Profile: Casey Rivera" }).click();
  await page.getByRole("menuitemradio", { name: "Jordan Lee", exact: true }).click();
  await expect(sheet.getByRole("button", { name: "Profile: Jordan Lee" })).toBeFocused();
  const search = sheet.getByRole("button", { name: "Quick search …" });
  await search.click();
  const palette = page.getByRole("dialog", { name: "Search navigation", exact: true });
  await palette.getByRole("combobox").press("Escape");
  await expect(sheet).toBeVisible();
  await expect(search).toBeFocused();
  await search.click();
  await palette.getByRole("combobox").fill("projects");
  await palette.getByRole("combobox").press("ArrowDown");
  await palette.getByRole("combobox").press("Enter");
  await expect(sheet).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(demo(page, "full-screen-mobile").locator(".sidebar-demo__title")).toHaveText("Projects");
  await expect(demo(page, "full-screen-mobile").locator(".sidebar-demo__breadcrumb")).toContainText("Research");
  await opener.click();
  await sheet.getByRole("button", { name: "Profile: Jordan Lee" }).click();
  await page.getByRole("menuitem", { name: "Account", exact: true }).click();
  await expect(sheet).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(demo(page, "full-screen-mobile").locator(".sidebar-demo__title")).toHaveText("Account");
});

test("sliding views animate without exposing inactive controls to keyboard focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const root = nav(page, "sliding-views");
  const workspace = root.locator('[data-slot="sidebar-sliding-view"][data-value="workspace"]');
  const project = root.locator('[data-slot="sidebar-sliding-view"][data-value="project"]');
  await root.getByRole("button", { name: "Rotor study", exact: true }).click();
  await expect(workspace).toHaveAttribute("inert");
  await expect(project).toBeFocused();
  await expect(project).not.toHaveClass(/-enter-active/);
  await expect(workspace).toBeHidden();
  await root.getByRole("button", { name: "Back to workspace" }).click();
  await expect(project).toHaveAttribute("inert");
  await expect(workspace).not.toHaveClass(/-enter-active/);
  await expect(root.getByRole("button", { name: "Rotor study", exact: true })).toBeFocused();
});

test("application profile and sliding view state survive desktop/mobile remounts", async ({ page }) => {
  await nav(page, "profile-selector").getByRole("button", { name: "Profile: Casey Rivera" }).click();
  await page.getByRole("menuitemradio", { name: "Jordan Lee", exact: true }).click();
  await nav(page, "sliding-views").getByRole("button", { name: "Rotor study", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger(page, "profile-selector").click();
  const profileSheet = page.getByRole("dialog", { name: "profile-selector navigation", exact: true });
  await expect(profileSheet.getByRole("button", { name: "Profile: Jordan Lee" })).toBeVisible();
  await profileSheet.getByRole("button", { name: "Close sidebar", exact: true }).click();
  await trigger(page, "sliding-views").click();
  const projectSheet = page.getByRole("dialog", { name: "sliding-views navigation", exact: true });
  await expect(projectSheet.getByRole("button", { name: "Back to workspace" })).toBeVisible();
  await projectSheet.getByRole("button", { name: "Close sidebar", exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(nav(page, "profile-selector").getByRole("button", { name: "Profile: Jordan Lee" })).toBeVisible();
  await expect(nav(page, "sliding-views").getByRole("button", { name: "Back to workspace" })).toBeVisible();
});
