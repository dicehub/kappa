import { expect, test, type Locator, type Page } from "@playwright/test";

const variants = ["workspace", "rail", "inset", "floating"];
const demo = (page: Page, variant = "workspace") => page.locator(`[data-sidebar-block="${variant}"]`);
const navigation = (page: Page, variant = "workspace") => demo(page, variant).getByRole("navigation", { name: `${variant} application navigation`, exact: true });
const toggle = (page: Page, variant = "workspace") => demo(page, variant).locator('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]');
const width = (element: Locator) => element.evaluate(node => node.getBoundingClientRect().width);
async function ready(page: Page, variant = "workspace") {
  await expect.poll(() => demo(page, variant).evaluate(el => el.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("Blocks is a separate section with a gallery, source, and full-page previews", async ({ page, request }) => {
  await page.goto("/docs/blocks");
  await expect(page.getByRole("heading", { name: "Blocks", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Browse Application Shell layouts" }).click();
  await ready(page);
  await expect(page.getByRole("heading", { level: 1, name: "Application Shell", exact: true })).toBeVisible();
  await expect(page.locator('#desktop-navigation a[aria-current="page"]')).toHaveText("Application Shell");
  await expect(page.locator('#desktop-navigation a[aria-current="page"]')).toHaveAttribute("href", "/docs/blocks/sidebar");
  const components = page.locator('#overview table');
  await expect(components.getByRole('columnheader')).toHaveText(['Kappa component', 'Purpose']);
  for (const [name, slug] of [['Sidebar', 'sidebar'], ['Dropdown', 'dropdown'], ['Command Palette', 'command-palette'], ['Button', 'button'], ['Table', 'table']]) {
    await expect(components.getByRole('link', { name, exact: true })).toHaveAttribute('href', `/docs/components/${slug}`);
  }
  await expect(page.locator('article a[href*="ark-ui.com"]')).toHaveCount(0);
  for (const variant of variants) {
    const example = page.locator(`[data-block-example="${variant}"]`);
    await expect(example).toHaveCount(1);
    await expect(example.getByRole("link", { name: /Open full example/ })).toHaveAttribute("href", `/examples/sidebar/${variant}`);
    const source = example.locator("[data-code-full] code");
    await expect(source).toContainText('@dicehub/kappa/blocks/sidebar-layout');
    await expect(source).toContainText(`variant: "${variant}", standalone: true`);
    await expect(source).toContainText("<style>");
    await expect(source).not.toContainText('style src="./');
  }
  const markdown = await request.get("/docs/blocks/sidebar.md");
  expect(markdown.ok()).toBe(true);
  const markdownText = await markdown.text();
  expect(markdownText).toContain("# Application Shell");
  expect(markdownText).not.toContain("Two-column Navigation");
  expect(markdownText).not.toContain("Top Header");
  for (const removed of ["split", "header"]) {
    await expect(page.locator(`[data-block-example="${removed}"]`)).toHaveCount(0);
    await expect(page.locator(`a[data-toc-link="${removed}"]`)).toHaveCount(0);
    expect((await request.get(`/examples/sidebar/${removed}`)).status()).toBe(404);
  }
  expect(markdownText).not.toMatch(/\bArk\b/);
});

for (const variant of variants) {
  test(`${variant} layout preserves desktop navigation and collapse`, async ({ page }) => {
    await page.goto(`/examples/sidebar/${variant}`);
    await expect(page).toHaveTitle(/Application Shell — Kappa Blocks/);
    await ready(page, variant);
    const nav = navigation(page, variant);
    await expect(nav).toHaveAttribute("data-state", variant === "rail" ? "collapsed" : "expanded");
    if (variant === "rail") await toggle(page, variant).click();
    await nav.getByRole("link", { name: "Reports", exact: true }).click();
    await expect(demo(page, variant).getByRole("heading", { name: "Reports", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Reports", exact: true })).toHaveAttribute("aria-current", "page");
    await toggle(page, variant).click();
    await expect(nav).toHaveCSS("width", "52px");
    await expect(nav.getByRole("link", { name: "Reports", exact: true })).toBeVisible();
    await toggle(page, variant).press("Enter");
    await expect(nav).toHaveCSS("width", "260px");
    await expect(toggle(page, variant)).toBeFocused();
  });
}

test("namespace, profile, search, and project actions stay local and functional", async ({ page }) => {
  await page.goto("/docs/blocks/sidebar");
  await ready(page);
  const current = demo(page);
  await current.getByRole("button", { name: "Namespace: Engineering" }).click();
  await page.getByRole("menuitemradio", { name: "Research", exact: true }).click();
  await expect(current.getByRole("button", { name: "Namespace: Research" })).toBeFocused();
  const popupId = await current.getByRole("button", { name: "Namespace: Research" }).getAttribute("aria-controls");
  await expect(page.locator(`[id="${popupId}"]`)).toHaveAttribute("inert", "");
  await expect(demo(page, "inset").getByRole("button", { name: "Namespace: Engineering" })).toBeVisible();
  await current.getByRole("button", { name: "Profile: Ros.Space" }).click();
  await page.getByRole("menuitem", { name: "Switch profile", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "Jordan Lee", exact: true }).click();
  await expect(current.getByRole("button", { name: "Profile: Jordan Lee" })).toBeFocused();
  await current.getByRole("button", { name: "Quick search …" }).click();
  const search = page.getByRole("dialog", { name: "Search navigation", exact: true });
  await search.getByRole("combobox").fill("missing page");
  await expect(search.getByText("No pages found.")).toBeVisible();
  await search.getByRole("combobox").fill("refine");
  await search.getByRole("combobox").press("ArrowDown");
  await search.getByRole("combobox").press("Enter");
  await expect(current.getByRole("heading", { name: "Refinement", exact: true })).toBeVisible();
  await expect(current.getByRole("button", { name: "Quick search …" })).toBeFocused();
  await current.getByRole("button", { name: "New project", exact: true }).click();
  await expect(current.getByRole("heading", { name: "Untitled project 1", exact: true })).toBeVisible();
  await expect(current.getByRole("row")).toHaveCount(5);
  await expect(demo(page, "inset").getByRole("row")).toHaveCount(4);
  await page.setViewportSize({ width: 390, height: 844 });
  await toggle(page).click();
  const mobile = page.getByRole("dialog", { name: "workspace application navigation", exact: true });
  await expect(mobile.getByRole("button", { name: "Namespace: Research" })).toBeVisible();
  await expect(mobile.getByRole("button", { name: "Profile: Jordan Lee" })).toBeVisible();
});

test("resize changes the sidebar and available content width", async ({ page }) => {
  await page.goto("/examples/sidebar/workspace");
  await ready(page);
  const separator = page.getByRole("separator", { name: "Resize sidebar" });
  const content = demo(page).locator(".kappa-sidebar-layout__main");
  const before = await width(content);
  const box = (await separator.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 80, box.y + 100, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => width(navigation(page))).toBeCloseTo(340, 0);
  await expect.poll(() => width(content)).toBeCloseTo(before - 80, 0);
  await separator.press("Enter");
  await expect(navigation(page)).toHaveCSS("width", "52px");
  await toggle(page).click();
  await expect(navigation(page)).toHaveCSS("width", "340px");
});

for (const variant of variants) {
  test(`${variant} mobile drawer fills the viewport and restores focus`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/examples/sidebar/${variant}`);
    await ready(page, variant);
    await toggle(page, variant).click();
    const mobile = page.getByRole("dialog", { name: `${variant} application navigation`, exact: true });
    await expect(mobile).toHaveCSS("width", "390px");
    await expect(mobile).toHaveCSS("height", "844px");
    await mobile.getByRole("link", { name: "Reports", exact: true }).click();
    await expect(mobile).toBeHidden();
    await expect(toggle(page, variant)).toBeFocused();
    await toggle(page, variant).click();
    await page.keyboard.press("Escape");
    await expect(mobile).toBeHidden();
    await expect(toggle(page, variant)).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("toolbar stays fixed while page content scrolls, with light and dark surfaces", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/docs/blocks/sidebar");
  await ready(page);
  const header = demo(page).locator(".kappa-sidebar-layout__toolbar");
  await header.scrollIntoViewIfNeeded();
  const before = await header.boundingBox();
  for (let index = 0; index < 12; index++) await demo(page).getByRole("button", { name: "New project", exact: true }).click();
  const content = demo(page).locator(".kappa-sidebar-layout__content");
  await content.evaluate(el => { el.scrollTop = el.scrollHeight; });
  expect(await content.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  expect((await header.boundingBox())!.y).toBeCloseTo(before!.y, 0);
  const surface = demo(page, "inset").locator(".kappa-sidebar-layout__main");
  const light = await surface.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  await expect(surface).not.toHaveCSS("background-color", light);
  for (const variant of variants) {
    const block = demo(page, variant);
    expect(await block.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("controlled layouts forward attributes, translated labels, rejected requests, and secondary focus", async ({ page }) => {
  await page.goto("/docs/blocks/sidebar");
  const contract = page.locator("[data-sidebar-layout-state]");
  await expect.poll(() => contract.evaluate(el => el.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
  const nav = contract.getByRole("navigation", { name: "Controlled navigation", exact: true });
  const separator = contract.getByRole("separator", { name: "Resize navigation" });
  await expect(contract.locator(".kappa-sidebar-layout")).toHaveAttribute("data-example-attribute", "forwarded");
  await contract.getByRole("button", { name: "Lock changes" }).click();
  await contract.getByRole("button", { name: "Collapse navigation", exact: true }).click();
  await expect(nav).toHaveAttribute("data-state", "expanded");
  await separator.press("ArrowRight");
  await expect(nav).toHaveCSS("width", "352px");
  await contract.getByRole("button", { name: "Unlock changes" }).click();
  await separator.press("ArrowRight");
  await expect.poll(() => width(nav)).toBeGreaterThan(352);
  await contract.getByRole("button", { name: "Close project list", exact: true }).click();
  await expect(nav).toHaveAttribute("data-state", "collapsed");
  await expect(contract.getByRole("button", { name: "Expand navigation", exact: true })).toBeFocused();
  await contract.getByRole("button", { name: "Expand navigation", exact: true }).click();
  await contract.getByRole("button", { name: "End placement", exact: true }).click();
  const ltrEdge = (await separator.boundingBox())!;
  expect(Math.abs(ltrEdge.x + ltrEdge.width / 2 - (await nav.boundingBox())!.x)).toBeLessThan(4);
  await contract.getByRole("button", { name: "RTL", exact: true }).click();
  const rtlEdge = (await separator.boundingBox())!;
  const rtlNav = (await nav.boundingBox())!;
  expect(Math.abs(rtlEdge.x + rtlEdge.width / 2 - rtlNav.x - rtlNav.width)).toBeLessThan(4);
  await page.setViewportSize({ width: 390, height: 844 });
  await contract.getByRole("button", { name: "Open navigation", exact: true }).click();
  const mobile = page.getByRole("dialog", { name: "Controlled navigation", exact: true });
  await mobile.getByRole("button", { name: "Dismiss navigation", exact: true }).click();
  await expect(mobile).toBeHidden();
  await expect(contract.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
});
