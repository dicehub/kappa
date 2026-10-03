import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, name = "preview") => page.locator(`[data-sidebar-demo="${name}"]`);
const sidebar = (page: Page, name = "preview") => demo(page, name).locator('[data-slot="sidebar"]');
const trigger = (page: Page, name = "preview") => demo(page, name).locator('.sidebar-demo__topbar [data-slot="sidebar-trigger"]');
const dialog = (page: Page, name = "mobile") => page.getByRole("dialog", { name: `${name} navigation`, exact: true });

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/sidebar");
  await expect.poll(() => demo(page).evaluate(el => el.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
});

test("sidebar documents real examples, public imports and composition", async ({ page, request }) => {
  await expect(page.getByRole("heading", { level: 1, name: "Sidebar", exact: true })).toBeVisible();
  await expect(page.getByText("Planned documentation")).toHaveCount(0);
  await expect(page.locator('[data-composition-tree="sidebar"]')).toContainText("Sidebar.Provider");
  await expect(page.locator("pre[data-language]").first()).toContainText('@dicehub/kappa/components/sidebar');
  const response = await request.get("/docs/components/sidebar.md");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("# Sidebar");
  const ids = await page.locator('[data-sidebar-demo] [id], [data-slot^="sidebar-"][id]').evaluateAll(nodes => nodes.map(node => node.id));
  expect(ids.length).toBe(new Set(ids).size);
});

test("sidebar keeps link, list, selected and disabled semantics", async ({ page }) => {
  const root = sidebar(page);
  await expect(root).toHaveAttribute("aria-label", "preview navigation");
  await expect(root.getByRole("link", { name: "Overview", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(root.getByRole("link", { name: "Settings", exact: true })).toHaveAttribute("href", "?section=settings");
  await root.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(root.getByRole("link", { name: "Projects", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(root.getByRole("link", { name: "Overview", exact: true })).not.toHaveAttribute("aria-current");
  const disabled = root.getByRole("link", { name: "Runs 0", exact: true });
  await expect(disabled).toHaveAttribute("aria-disabled", "true");
  await expect(disabled).toHaveAttribute("tabindex", "-1");
  await expect(disabled).not.toHaveAttribute("href");
  expect(await root.locator("ul").evaluateAll(nodes => nodes.every(node => Array.from(node.children).every(child => child.tagName === "LI")))).toBe(true);
  await expect(root.locator("button button, a a, a button, button a")).toHaveCount(0);
  const customDisabled = sidebar(page, "scrollable").getByRole("link", { name: "Archived reports", exact: true });
  await expect(customDisabled).toHaveAttribute("aria-disabled", "true");
  await expect(customDisabled).not.toHaveAttribute("href");
  await expect(customDisabled).toHaveAttribute("tabindex", "-1");
  await customDisabled.click({ force: true });
  await expect(demo(page, "scrollable").locator(".sidebar-demo__title")).toHaveText("Overview");
  await customDisabled.focus();
  await page.keyboard.press("Tab");
  await expect(customDisabled).not.toBeFocused();
});

test("demo headers align at 64px with one toggle outside the navigation", async ({ page }) => {
  await expect(page.locator('[data-sidebar-demo] [data-slot="sidebar-footer"] [data-slot="sidebar-trigger"]')).toHaveCount(0);
  for (const name of ["preview", "namespace-selector", "profile-selector", "compact", "collapsed", "offcanvas", "resizable", "end", "rtl", "loading", "scrollable", "peeking", "sliding-views"]) {
    await expect(trigger(page, name)).toHaveCount(1);
    const geometry = await demo(page, name).evaluate(node => {
      const header = node.querySelector('[data-slot="sidebar-header"]')!.getBoundingClientRect();
      const topbar = node.querySelector('.sidebar-demo__topbar')!.getBoundingClientRect();
      return { headerHeight: header.height, topbarHeight: topbar.height, bottomDelta: header.bottom - topbar.bottom };
    });
    expect(geometry, name).toEqual({ headerHeight: 64, topbarHeight: 64, bottomDelta: 0 });
  }
  await trigger(page).click();
  await expect(sidebar(page).locator('[data-slot="sidebar-header"]')).toHaveCSS("height", "64px");
  await expect(demo(page).locator(".sidebar-demo__topbar")).toHaveCSS("height", "64px");
});

test("icon collapse keeps accessible labels, tooltips and section preferences", async ({ page }) => {
  const root = sidebar(page);
  const geometry = root.getByRole("link", { name: "Geometry", exact: true });
  await expect(geometry).toBeVisible();
  await trigger(page).click();
  await expect(root).toHaveAttribute("data-state", "collapsed");
  await expect(root).toHaveCSS("width", "52px");
  await expect(geometry).toBeHidden();
  const overview = root.getByRole("link", { name: "Overview", exact: true });
  await overview.focus();
  await expect(page.getByRole("tooltip", { name: "Overview", exact: true })).toBeVisible();
  await trigger(page).click();
  await expect(root).toHaveCSS("width", "260px");
  await expect(geometry).toBeVisible();
  const mesh = root.getByRole("button", { name: "Mesh", exact: true });
  await mesh.click();
  await expect(geometry).toBeHidden();
  await trigger(page).click();
  await trigger(page).click();
  await expect(geometry).toBeHidden();
  await trigger(page).click();
  await mesh.click();
  await expect(root).toHaveAttribute("data-state", "expanded");
  await expect(geometry).toBeVisible();
});

test("offcanvas removes hidden content from navigation and returns focus outside", async ({ page }) => {
  const root = sidebar(page, "offcanvas");
  const inside = root.getByRole("link", { name: "Overview", exact: true });
  await inside.focus();
  // External state changes must restore focus when the focused link becomes inert.
  // Programmatic activation leaves focus inside until the provider handles collapse.
  await trigger(page, "offcanvas").evaluate(node => (node as HTMLButtonElement).click());
  await expect(root).toHaveAttribute("inert", "");
  await expect(root).toHaveAttribute("aria-hidden", "true");
  await expect(trigger(page, "offcanvas")).toBeFocused();
  await trigger(page, "offcanvas").press("Space");
  await expect(root).toBeVisible();
  await expect(root).not.toHaveAttribute("inert");
});

test("controlled desktop state can reject requests without changing the view", async ({ page }) => {
  const box = demo(page, "controlled");
  await box.getByRole("button", { name: "Lock state", exact: true }).click();
  await trigger(page, "controlled").click();
  await expect(sidebar(page, "controlled")).toHaveAttribute("data-state", "expanded");
  await expect(box.locator("output")).toContainText("1 requests");
  await box.getByRole("button", { name: "Unlock state", exact: true }).click();
  await trigger(page, "controlled").click();
  await expect(sidebar(page, "controlled")).toHaveAttribute("data-state", "collapsed");
  await expect(box.locator("output")).toContainText("2 requests");
  await box.getByRole("button", { name: "Set expanded", exact: true }).click();
  await expect(sidebar(page, "controlled")).toHaveAttribute("data-state", "expanded");
});

test("non-collapsible mode stays expanded on desktop", async ({ page }) => {
  await expect(trigger(page, "static")).toBeDisabled();
  await expect(sidebar(page, "static")).toHaveAttribute("data-state", "expanded");
});

test("mobile traps focus, handles all dismissal paths and restores the opener", async ({ page }) => {
  await page.goto("/examples/components/sidebar/mobile");
  const opener = trigger(page, "mobile");
  await opener.click();
  const sheet = dialog(page);
  await expect(sheet).toBeVisible();
  await expect(sheet).toHaveAttribute("aria-modal", "true");
  expect(await sheet.evaluate(el => el.contains(document.activeElement))).toBe(true);
  for (const key of ["Shift+Tab", ...Array(12).fill("Tab")]) {
    await page.keyboard.press(key);
    expect(await sheet.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await sheet.getByRole("button", { name: "Close sidebar", exact: true }).first().click();
  await expect(sheet).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await page.locator('[data-slot="sidebar-backdrop"][data-state="open"]').click({ position: { x: 800, y: 100 } });
  await expect(sheet).toBeHidden();
  await expect(opener).toBeFocused();
});

test("mobile link selection closes through the application and updates content", async ({ page }) => {
  await page.goto("/examples/components/sidebar/mobile");
  await trigger(page, "mobile").click();
  await dialog(page).getByRole("link", { name: "Projects", exact: true }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(demo(page, "mobile").locator(".sidebar-demo__title")).toHaveText("Projects");
});

test("controlled mobile opening restores focus to a custom application control", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const opener = demo(page, "controlled").getByRole("button", { name: "Open mobile", exact: true });
  await opener.click();
  await expect(dialog(page, "controlled")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog(page, "controlled")).toBeHidden();
  await expect(opener).toBeFocused();
});

test("viewport changes preserve desktop preference and close stale mobile state", async ({ page }) => {
  await trigger(page, "controlled").click();
  await expect(sidebar(page, "controlled")).toHaveAttribute("data-state", "collapsed");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(trigger(page, "controlled")).toHaveAttribute("aria-haspopup", "dialog");
  await trigger(page, "controlled").click();
  await expect(dialog(page, "controlled")).toBeVisible();
  await expect(dialog(page, "controlled").getByRole("link", { name: "Geometry", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(dialog(page, "controlled")).toHaveCount(0);
  await expect(sidebar(page, "controlled")).toHaveAttribute("data-state", "collapsed");
  await expect(demo(page, "controlled").locator("output")).toContainText("Mobile closed");
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(dialog(page, "controlled")).toBeHidden();
  await expect(trigger(page, "controlled")).toHaveAttribute("aria-expanded", "false");
});

test("compact rows remain compact on desktop and reachable on small screens", async ({ page }) => {
  const link = sidebar(page, "compact").getByRole("link", { name: "Overview", exact: true });
  await expect(link).toHaveCSS("height", "28px");
  await expect(link.locator("svg")).toHaveCSS("width", "16px");
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger(page, "compact").click();
  await expect(dialog(page, "compact").getByRole("link", { name: "Overview", exact: true })).toHaveCSS("height", "44px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.keyboard.press("Escape");
});

test("full-screen mobile fills the viewport and has a visible close control", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/examples/components/sidebar/full-screen-mobile");
  await trigger(page, "full-screen-mobile").click();
  const sheet = dialog(page, "full-screen-mobile");
  await expect(sheet).toHaveCSS("width", "390px");
  await expect(sheet).toHaveCSS("height", "844px");
  await expect(sheet.getByRole("button", { name: "Close sidebar", exact: true }).first()).toBeVisible();
});

test("logical placement follows direction on desktop and mobile", async ({ page }) => {
  for (const name of ["end", "rtl"]) {
    const root = await sidebar(page, name).boundingBox();
    const main = await demo(page, name).locator(".sidebar-demo__main").boundingBox();
    expect(root!.x).toBeGreaterThan(main!.x);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of ["end", "rtl"]) {
    await trigger(page, name).click();
    const sheet = dialog(page, name);
    await expect(sheet).toBeVisible();
    const box = await sheet.boundingBox();
    expect(Math.round(box!.x + box!.width)).toBe(390);
    await page.keyboard.press("Escape");
  }
});

test("long navigation scrolls independently without moving header and footer", async ({ page }) => {
  const root = sidebar(page, "scrollable");
  const header = root.locator('[data-slot="sidebar-header"]');
  const footer = root.locator('[data-slot="sidebar-footer"]');
  await root.scrollIntoViewIfNeeded();
  const beforeHeader = await header.boundingBox();
  const beforeFooter = await footer.boundingBox();
  const content = root.getByRole("region", { name: "Workspace links", exact: true });
  await content.focus();
  await content.press("End");
  await expect.poll(() => content.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  expect(await header.boundingBox()).toEqual(beforeHeader);
  expect(await footer.boundingBox()).toEqual(beforeFooter);
  await expect(root).toHaveCSS("width", "260px");
});

test("loading is deterministic and reduced motion is respected", async ({ page }) => {
  const box = demo(page, "loading");
  await expect(box.getByRole("status", { name: "Loading navigation", exact: true })).toBeVisible();
  await expect(box.locator(".kappa-sidebar__loading-row")).toHaveCount(5);
  await expect(box.locator(".kappa-sidebar__loading-icon").first()).toHaveCSS("animation-name", "none");
  await box.getByRole("button", { name: "Show navigation", exact: true }).click();
  await expect(box.getByRole("status", { name: "Loading navigation", exact: true })).toHaveCount(0);
  await expect(box.getByRole("link", { name: "Overview", exact: true })).toBeVisible();
});

test("light and dark themes preserve contrast surfaces and visible keyboard focus", async ({ page }) => {
  const root = sidebar(page);
  const light = await root.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-mode", "dark");
    document.documentElement.setAttribute("data-kappa-theme", "dark");
  });
  await expect.poll(() => root.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(light);
  await root.getByRole("link", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(root.getByRole("link", { name: "Projects", exact: true })).toBeFocused();
  await expect(root.getByRole("link", { name: "Projects", exact: true })).toHaveCSS("outline-style", "solid");
  await expect(root.getByRole("link", { name: "Projects", exact: true })).toHaveCSS("outline-width", "2px");
});
