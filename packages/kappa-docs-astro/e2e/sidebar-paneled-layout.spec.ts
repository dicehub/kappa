import { expect, test, type Locator, type Page } from "@playwright/test";

const path = "/examples/appshell/paneled-workspace";
const navigation = (page: Page) => page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
async function open(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${path}?view=Simulation+runs`);
  await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
}
async function bounds(locator: Locator, expected: Record<string, number>) {
  await expect.poll(async () => {
    const box = await locator.boundingBox();
    return box && Object.fromEntries(Object.keys(expected).map(key => [key, Math.round(box[key as keyof typeof box])]));
  }).toEqual(expected);
}

test("selected paneled navigation indicators sit at the sidebar edge", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  const project = navigation(page).getByRole("link", { name: "Dashboard", exact: true });
  const expectIndicator = async (link: Locator) => {
    await expect(link).toHaveAttribute("aria-current", "page");
    expect(await link.evaluate(node => {
      const row = node.getBoundingClientRect();
      const sidebar = node.closest('[data-slot="sidebar"]')!.getBoundingClientRect();
      const indicator = getComputedStyle(node, "::before");
      let visibleLeft = row.left + parseFloat(indicator.left);
      let visibleRight = visibleLeft + parseFloat(indicator.width);
      for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        if (getComputedStyle(parent).overflowX === "visible") continue;
        const clip = parent.getBoundingClientRect();
        visibleLeft = Math.max(visibleLeft, clip.left);
        visibleRight = Math.min(visibleRight, clip.right);
      }
      return {
        edge: row.left + parseFloat(indicator.left) - sidebar.left,
        gap: -parseFloat(indicator.left) - parseFloat(indicator.width),
        top: parseFloat(indicator.top), bottom: parseFloat(indicator.bottom),
        width: parseFloat(indicator.width), height: parseFloat(indicator.height),
        visibleWidth: Math.max(0, visibleRight - visibleLeft),
      };
    })).toEqual({ edge: 0, gap: 6, top: 4, bottom: 4, width: 2, height: 20, visibleWidth: 2 });
  };
  await expectIndicator(navigation(page).getByRole("link", { name: "Simulation runs", exact: true }));
  await project.click();
  await expectIndicator(project);
  await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expectIndicator(project);
  await page.evaluate(() => document.documentElement.setAttribute("data-kappa-theme", "dark"));
  await expectIndicator(project);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  await expectIndicator(page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true })
    .getByRole("link", { name: "Dashboard", exact: true }));
});

test("paneled navigation has no pinned section, pin controls, or feature catalog", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  await expect(page.getByRole("button", { name: "Pinned", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^(Pin|Unpin) / })).toHaveCount(0);
  await expect(navigation(page).getByRole("link", { name: "Simulation runs", exact: true })).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Feature catalog", exact: true })).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "Feature catalog", exact: true, includeHidden: true })).toHaveCount(0);
  await expect(page.locator('[data-slot="sidebar-separator"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Feature catalog", exact: true })).toHaveCount(0);
  await expect(page.locator('[data-slot="sidebar-separator"]')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Pinned", exact: true })).toHaveCount(0);
  await expect(drawer.getByRole("button", { name: /^(Pin|Unpin) / })).toHaveCount(0);
  await expect(drawer.getByRole("button", { name: "Feature catalog", exact: true })).toHaveCount(0);
  await expect(drawer.locator('[data-slot="sidebar-separator"]')).toHaveCount(0);
});

test("paneled navigation puts Dashboard under Your work in the scrolling navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  const heading = nav.locator(".paneled-workspace-demo__context-label");
  const project = nav.getByRole("link", { name: "Dashboard", exact: true });
  const help = page.getByRole("navigation", { name: "Workspace tools", exact: true }).getByRole("button", { name: "Help", exact: true });
  const collapse = nav.getByRole("button", { name: "Collapse sidebar", exact: true });
  await bounds(nav, { x: 0, y: 48, width: 240, height: 944 });
  await bounds(nav.getByRole("button", { name: "Workspace: Ros.Space", exact: true }), { x: 8, y: 956, width: 224, height: 28 });
  await bounds(heading, { x: 16, y: 62, height: 21 });
  await bounds(project, { x: 8, y: 100, width: 224, height: 28 });
  await expect(project.locator(".lucide-layout-dashboard")).toBeVisible();
  await expect(nav.locator('[data-slot="sidebar-separator"]')).toHaveCount(0);
  await bounds(nav.getByRole("button", { name: "Projects", exact: true }), { x: 8, y: 160, width: 224, height: 28 });
  await bounds(help, { x: 1408, y: 960, width: 24, height: 24 });
  await bounds(collapse, { x: 200, y: 56, width: 32, height: 32 });
  await expect(project).toHaveCSS("font-size", "14px");
  await expect(page.locator(".kappa-app-shell__panels")).toHaveCSS("font-size", "14px");

  await collapse.click();
  await bounds(nav, { width: 44 });
  await bounds(project, { x: 8, y: 100, width: 28, height: 28 });
  await expect(project.locator(".lucide-layout-dashboard")).toBeVisible();
  await bounds(nav.getByRole("button", { name: "Projects", exact: true }), { x: 8, y: 160, height: 28 });
  await bounds(page.locator(".kappa-app-shell__panel-frame"), { x: 44, y: 48, width: 1356, height: 944 });
  await nav.getByRole("button", { name: "Expand sidebar", exact: true }).click();

  await page.setViewportSize({ width: 1440, height: 500 });
  const scroll = nav.getByRole("region", { name: "Workspace links", exact: true });
  await scroll.hover();
  await page.mouse.wheel(0, 500);
  await expect.poll(() => scroll.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  await expect.poll(async () => (await project.boundingBox())?.y ?? 100).toBeLessThan(100);
  await bounds(heading, { x: 16, y: 62 });
  await bounds(help, { y: 460 });
  await bounds(collapse, { y: 56 });
});

test("paneled sidebar resizes without moving bounded content and retains its width", async ({ page }) => {
  await page.setViewportSize({ width: 2000, height: 1000 });
  await open(page);
  await navigation(page).getByRole("link", { name: "Dashboard", exact: true }).click();
  const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  const handle = page.getByRole("separator", { name: "Resize sidebar", exact: true });
  const content = page.locator('.paneled-workspace-demo__page-content[data-width="limited"]');
  const before = (await content.boundingBox())!;
  const grip = (await handle.boundingBox())!;
  await expect(handle).toHaveAttribute("aria-valuenow", "240");
  await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
  await page.mouse.down();
  await page.mouse.move(grip.x + grip.width / 2 + 80, grip.y + grip.height / 2, { steps: 8 });
  await bounds(nav, { width: 320 });
  await bounds(content, { x: Math.round(before.x), width: Math.round(before.width) });
  await page.mouse.up();

  await handle.focus();
  await handle.press("ArrowRight");
  await expect.poll(async () => Number(await handle.getAttribute("aria-valuenow"))).toBeGreaterThan(320);
  const resizedWidth = Number(await handle.getAttribute("aria-valuenow"));
  await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await bounds(nav, { width: 44 });
  await nav.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await bounds(nav, { width: resizedWidth });
  await bounds(content, { x: Math.round(before.x), width: Math.round(before.width) });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(handle).toHaveCount(0);
  await page.setViewportSize({ width: 2000, height: 1000 });
  await bounds(nav, { width: resizedWidth });
  await handle.press("End");
  await bounds(nav, { width: 420 });
});

test("paneled frame and tools rail follow the desktop, tablet, and phone insets", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  for (const { width, x, panelWidth, height, railX, railY, railWidth, railHeight } of [
    { width: 1440, x: 240, panelWidth: 1160, height: 944, railX: 1400, railY: 48, railWidth: 40, railHeight: 944 },
    { width: 1200, x: 240, panelWidth: 920, height: 944, railX: 1160, railY: 48, railWidth: 40, railHeight: 944 },
    { width: 1199, x: 8, panelWidth: 1151, height: 944, railX: 1159, railY: 48, railWidth: 40, railHeight: 944 },
    { width: 992, x: 8, panelWidth: 944, height: 944, railX: 952, railY: 48, railWidth: 40, railHeight: 944 },
    { width: 991, x: 8, panelWidth: 975, height: 912, railX: 8, railY: 960, railWidth: 975, railHeight: 40 },
    { width: 576, x: 8, panelWidth: 560, height: 912, railX: 8, railY: 960, railWidth: 560, railHeight: 40 },
    { width: 575, x: 0, panelWidth: 575, height: 912, railX: 0, railY: 960, railWidth: 575, railHeight: 40 },
    { width: 390, x: 0, panelWidth: 390, height: 912, railX: 0, railY: 960, railWidth: 390, railHeight: 40 },
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    await bounds(page.locator(".kappa-app-shell__panel-frame"), { x, y: 48, width: panelWidth, height });
    await bounds(page.locator(".kappa-app-shell__rail"), { x: railX, y: railY, width: railWidth, height: railHeight });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("paneled mobile drawer keeps the same navigation spacing and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const toggle = page.getByRole("button", { name: "Open sidebar", exact: true });
  await toggle.click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await bounds(drawer, { x: 0, y: 0, width: 312, height: 844 });
  await bounds(drawer.locator(".paneled-workspace-demo__context-label"), { x: 16, y: 20, height: 21 });
  await bounds(drawer.getByRole("link", { name: "Dashboard", exact: true }), { x: 8, y: 64, width: 296, height: 28 });
  await expect(drawer.getByRole("button", { name: "Help", exact: true })).toHaveCount(0);
  await bounds(drawer.getByRole("button", { name: "Workspace: Ros.Space", exact: true }), { x: 4, y: 796, width: 300, height: 44 });
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("tools stay in the shell when the complete panel container is removed", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await open(page);
    const rail = page.getByRole("navigation", { name: "Workspace tools", exact: true });
    const before = (await rail.boundingBox())!;
    // Reproduce removing the panel container in DevTools. No Vue state is changed.
    await page.locator(".kappa-app-shell__panels-body").evaluate(node => node.remove());
    await expect(page.locator(".kappa-app-shell__panels-body")).toHaveCount(0);
    await expect(rail.getByRole("button", { name: "Activities", exact: true })).toBeVisible();
    await bounds(rail, before);
    if (viewport.width >= 1200) {
      await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
      await expect(page.getByRole("button", { name: "Expand sidebar", exact: true })).toBeVisible();
      await bounds(rail, before);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("conditional panels mount and unmount without moving the shell tools", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/examples/components/app-shell/rail");
    await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
    const rail = page.getByRole("navigation", { name: "Project tools", exact: true });
    const content = page.getByRole("heading", { name: "Project content", exact: true });
    const before = (await rail.boundingBox())!;
    await expect(content).toHaveCount(0);
    for (let cycle = 0; cycle < 2; cycle++) {
      await page.getByRole("button", { name: "Show panels", exact: true }).click();
      await expect(content).toBeVisible();
      await bounds(rail, before);
      await page.getByRole("button", { name: "Hide panels", exact: true }).click();
      await expect(content).toHaveCount(0);
      await bounds(rail, before);
    }
    await page.getByRole("button", { name: "Hide tools", exact: true }).click();
    await expect(rail).toHaveCount(0);
    await page.getByRole("button", { name: "Show tools", exact: true }).click();
    await bounds(rail, before);
    if (viewport.width >= 1200) {
      const toggle = rail.getByRole("button", { name: "Toggle navigation", exact: true });
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await bounds(rail, before);
    }
  }
});

test("the footer switcher changes workspace in expanded, collapsed, and mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  const nav = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  const dashboard = nav.getByRole("link", { name: "Dashboard", exact: true });
  const trigger = nav.getByRole("button", { name: /^Workspace: / });
  await trigger.click();
  const menu = page.locator('[data-workspace-switcher]:not([inert])');
  await expect(menu.getByRole("menuitemradio", { name: "Ros.Space", exact: true })).toHaveAttribute("aria-checked", "true");
  await expect(menu.getByRole("menuitemradio")).toHaveCount(3);
  await expect(menu.getByRole("menuitemradio", { name: "Engineering", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitemradio", { name: "Ros.Space", exact: true }).locator(".kappa-avatar")).toHaveCSS("border-radius", "50%");
  await expect(menu.locator('[data-slot="workspace-switcher-current"] .kappa-avatar')).toHaveCSS("border-radius", "50%");
  await menu.getByRole("menuitemradio", { name: "Research", exact: true }).click();
  await expect(trigger).toHaveAccessibleName("Workspace: Research");
  await expect(page.getByRole("navigation", { name: "Workspace breadcrumb" }).getByRole("link", { name: "Research" })).toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(dashboard.locator(".lucide-layout-dashboard")).toBeVisible();

  await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(dashboard).toBeVisible();
  await trigger.click();
  await expect(menu.getByRole("menuitemradio", { name: "Research", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  await page.setViewportSize({ width: 390, height: 844 });
  const opener = page.getByRole("button", { name: "Open sidebar", exact: true });
  await opener.click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await drawer.getByRole("button", { name: "Workspace: Research", exact: true }).click();
  const mobileMenu = drawer.locator('[data-workspace-switcher]');
  await mobileMenu.getByRole("menuitemradio", { name: "Ros.Space", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Workspace breadcrumb" }).getByRole("link", { name: "Ros.Space" })).toBeVisible();
});

test("Dashboard opens its summary without a dropdown", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  const project = navigation(page).getByRole("link", { name: "Dashboard", exact: true });
  await expect(project).toHaveAttribute("href", "?view=Dashboard");
  await expect(project).not.toHaveAttribute("aria-haspopup", /.+/);
  await project.click();
  await expect(page).toHaveURL(/\?view=Dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(project).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("menu")).toHaveCount(0);

  await page.goBack();
  await expect(project).not.toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await project.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(page.getByRole("menu")).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await drawer.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(page.getByRole("menu")).toHaveCount(0);
});
