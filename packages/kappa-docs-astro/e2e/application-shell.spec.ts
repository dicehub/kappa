import { expect, test, type Locator, type Page } from "@playwright/test";

async function openWorkspace(page: Page) {
  await page.goto("/examples/sidebar/workspace");
  await expect.poll(() => page.locator('[data-sidebar-block="workspace"]').evaluate(node => node.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
}

async function expectSingleEdge(nav: Locator) {
  const handle = nav.locator('[data-slot="sidebar-resize-handle"]');
  await expect(handle).toHaveCSS("width", "12px");
  const bounds = (await nav.boundingBox())!;
  const target = (await handle.boundingBox())!;
  const line = await handle.evaluate(node => {
    const css = getComputedStyle(node, "::after");
    return { width: parseFloat(css.width), offset: parseFloat(css.left) };
  });
  expect(line.width).toBe(1);
  const right = (await nav.getAttribute("data-side") === "start") === (await nav.evaluate(node => getComputedStyle(node).direction) === "ltr");
  expect(target.x + line.offset).toBeCloseTo(right ? bounds.x + bounds.width - 1 : bounds.x, 1);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("namespace spacing, framed icon, and header heights stay aligned when collapsed", async ({ page }) => {
  await openWorkspace(page);
  const nav = page.getByRole("navigation", { name: "workspace application navigation", exact: true });
  const trigger = nav.getByRole("button", { name: "Namespace: Engineering", exact: true });
  const icon = trigger.locator('.sidebar-block-demo__namespace-icon');
  await expect(trigger).toHaveCSS("height", "48px");
  await expect(trigger).toHaveCSS("gap", "8px");
  await expect(icon).toHaveCSS("width", "32px");
  await expect(icon).toHaveCSS("height", "32px");
  await expect(icon.locator("svg")).toHaveCSS("width", "16px");
  await expect(nav.locator('[data-slot="sidebar-header"]')).toHaveCSS("height", "64px");
  await expect(page.locator('.kappa-sidebar-layout__toolbar')).toHaveCSS("height", "64px");
  const tile = (await icon.boundingBox())!;
  const text = (await trigger.locator('.sidebar-block-demo__identity').boundingBox())!;
  expect(text.x - tile.x - tile.width).toBeCloseTo(8, 1);
  expect(text.y + text.height / 2).toBeCloseTo(tile.y + tile.height / 2, 1);
  await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(trigger).toHaveCSS("height", "32px");
  const rail = (await nav.boundingBox())!;
  const collapsedTile = (await icon.boundingBox())!;
  expect(collapsedTile.x).toBeGreaterThanOrEqual(rail.x);
  expect(collapsedTile.x + collapsedTile.width).toBeLessThanOrEqual(rail.x + rail.width);
});

test("search is a visible bordered button with keyboard and mobile dialog behavior", async ({ page }) => {
  await openWorkspace(page);
  const search = page.getByRole("button", { name: "Quick search …", exact: true });
  const nav = page.getByRole("navigation", { name: "workspace application navigation", exact: true });
  await expect(search).toHaveCSS("border-top-width", "1px");
  await expect(search).toHaveCSS("border-top-style", "solid");
  await expect(search).toHaveCSS("height", "32px");
  expect(await search.evaluate(node => getComputedStyle(node).color)).toBe(await nav.evaluate(node => getComputedStyle(node).color));
  await search.focus();
  await expect(search).toHaveCSS("outline-style", "solid");
  await search.press("Enter");
  const palette = page.getByRole("dialog", { name: "Search navigation", exact: true });
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").press("Escape");
  await expect(palette).toBeHidden();
  await expect(search).toBeFocused();
  const light = await search.evaluate(node => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-mode", "dark");
    document.documentElement.setAttribute("data-kappa-theme", "dark");
  });
  await expect.poll(() => search.evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe(light);
  expect(await search.evaluate(node => getComputedStyle(node).color)).toBe(await nav.evaluate(node => getComputedStyle(node).color));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "workspace application navigation", exact: true });
  await expect(drawer.getByRole("button", { name: "Namespace: Engineering", exact: true })).toHaveCSS("height", "48px");
  const mobileSearch = drawer.getByRole("button", { name: "Quick search …", exact: true });
  expect((await mobileSearch.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await mobileSearch.click();
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").press("Escape");
  await expect(mobileSearch).toBeFocused();
});

test("resize indicators overlap the existing border in start, end, and RTL layouts", async ({ page }) => {
  await page.goto("/docs/components/sidebar");
  for (const variant of ["resizable", "end", "rtl"]) {
    const demo = page.locator(`[data-sidebar-demo="${variant}"]`);
    await demo.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await expectSingleEdge(demo.getByRole("navigation"));
  }
  await openWorkspace(page);
  await page.mouse.move(0, 0);
  const nav = page.getByRole("navigation", { name: "workspace application navigation", exact: true });
  await expectSingleEdge(nav);
  const handle = nav.locator('[data-slot="sidebar-resize-handle"]');
  await handle.hover();
  await expect.poll(() => handle.evaluate(node => getComputedStyle(node, "::after").width)).toBe("3px");
  await handle.focus();
  await handle.press("ArrowRight");
  await expect.poll(async () => (await nav.boundingBox())!.width).toBeGreaterThan(260);
});

test("the first gallery preview has no unnecessary navigation scrollbar", async ({ page }) => {
  await page.goto("/docs/blocks/sidebar");
  const content = page.locator('[data-sidebar-block="workspace"] [data-slot="sidebar-content"]');
  await expect(content).toBeVisible();
  await expect.poll(() => content.evaluate(node => node.scrollHeight <= node.clientHeight)).toBe(true);
});

test("inset header dividers and scroll areas align across collapse and RTL", async ({ page }) => {
  await page.goto("/examples/sidebar/inset");
  const demo = page.locator('[data-sidebar-block="inset"]');
  await expect.poll(() => demo.evaluate(node => node.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
  for (const direction of ["ltr", "rtl"]) {
    await demo.evaluate((node, dir) => node.setAttribute("dir", dir), direction);
    for (const state of ["expanded", "collapsed"]) {
      const nav = demo.locator('.kappa-sidebar-layout__navigation');
      await expect(nav).toHaveAttribute("data-state", state);
      const header = (await nav.locator('[data-slot="sidebar-header"]').boundingBox())!;
      const toolbar = (await demo.locator('.kappa-sidebar-layout__toolbar').boundingBox())!;
      const links = (await nav.locator('[data-slot="sidebar-content"]').boundingBox())!;
      const content = (await demo.locator('.kappa-sidebar-layout__content').boundingBox())!;
      expect(header.y).toBeCloseTo(toolbar.y, 2);
      expect(header.y + header.height).toBeCloseTo(toolbar.y + toolbar.height, 2);
      expect(links.y).toBeCloseTo(content.y, 2);
      await demo.locator('[data-slot="sidebar-trigger"]').click();
    }
  }
});
