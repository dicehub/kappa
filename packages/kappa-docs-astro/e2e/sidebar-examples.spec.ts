import { expect, test, type Locator } from "@playwright/test";

async function withinScrollArea(item: Locator, content: Locator) {
  const row = (await item.boundingBox())!;
  const area = (await content.boundingBox())!;
  return row.y >= area.y && row.y + row.height <= area.y + area.height;
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/sidebar");
  await expect.poll(() => page.locator('[data-sidebar-demo="preview"]').evaluate(node => node.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
});

test("peeking explains temporary and pinned states with working controls", async ({ page }) => {
  const demo = page.locator('[data-sidebar-demo="peeking"]');
  const nav = demo.getByRole("navigation");
  const status = demo.locator('[data-sidebar-peek-controls] output');
  await expect(status).toHaveText("Collapsed — ready to peek");
  await nav.getByRole("link", { name: "Overview", exact: true }).hover();
  await expect(status).toHaveText("Peeking — temporary");
  await demo.getByRole("button", { name: "Pin sidebar open", exact: true }).click();
  await expect(nav).toHaveAttribute("data-state", "expanded");
  await expect(status).toHaveText("Expanded — pinned");
  await demo.getByRole("button", { name: "Collapse to try peeking", exact: true }).click();
  await expect(status).toHaveText("Collapsed — ready to peek");
});

test("sliding views expose header and external controls without moving external focus", async ({ page }) => {
  const demo = page.locator('[data-sidebar-demo="sliding-views"]');
  const header = demo.locator('[data-slot="sidebar-header"]');
  const status = demo.locator('[data-sidebar-view-controls] output');
  await header.getByRole("button", { name: "Open project view", exact: true }).click();
  await expect(status).toHaveText("Active view: Rotor study");
  await expect(header.getByRole("button", { name: "Show workspace view", exact: true })).toBeFocused();
  await expect(demo.locator('[data-slot="sidebar-sliding-view"][data-value="workspace"]')).toHaveAttribute("inert");
  const external = demo.locator('[data-sidebar-view-controls]').getByRole("button", { name: "Show workspace view", exact: true });
  await external.click();
  await expect(status).toHaveText("Active view: Workspace");
  await expect(demo.locator('[data-sidebar-view-controls]').getByRole("button", { name: "Open project view", exact: true })).toBeFocused();
});

test("scroll-to-item moves only the list and leaves visible items and focus in place", async ({ page }) => {
  const demo = page.locator('[data-sidebar-demo="scroll-to-item"]');
  await demo.scrollIntoViewIfNeeded();
  const content = demo.getByRole("region", { name: "Report navigation", exact: true });
  const boundary = (await demo.boundingBox())!;
  for (const button of await demo.locator('.sidebar-scroll-demo__buttons button').all()) {
    const box = (await button.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(boundary.y);
    expect(box.y + box.height).toBeLessThanOrEqual(boundary.y + boundary.height);
  }
  expect(await content.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true);
  const pageScroll = await page.evaluate(() => window.scrollY);
  for (const name of ["Settings", "Report 12", "Overview"]) {
    const button = demo.getByRole("button", { name: `Scroll to ${name}`, exact: true });
    const item = content.getByRole("button", { name, exact: true });
    await button.click();
    await expect.poll(() => withinScrollArea(item, content)).toBe(true);
    await expect(item).toHaveAttribute("aria-current", "page");
    await expect(button).toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
  }
  await demo.getByRole("button", { name: "Keep Settings visible", exact: true }).click();
  await expect.poll(() => withinScrollArea(content.getByRole("button", { name: "Settings", exact: true }), content)).toBe(true);
  const before = await content.evaluate(node => node.scrollTop);
  await demo.getByRole("button", { name: "Keep Settings visible", exact: true }).click();
  expect(await content.evaluate(node => node.scrollTop)).toBe(before);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
  await page.setViewportSize({ width: 390, height: 844 });
  await demo.scrollIntoViewIfNeeded();
  expect(await demo.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
});

test("mobile drawer is confined to its preview and leaves the documentation usable", async ({ page }) => {
  const wrapper = page.locator('[data-sidebar-demo="mobile"]');
  await wrapper.scrollIntoViewIfNeeded();
  const frameElement = wrapper.locator('iframe');
  const frame = page.frameLocator('[data-sidebar-frame="mobile"]');
  const opener = frame.getByRole("button", { name: "Open navigation", exact: true });
  await opener.click();
  const sheet = frame.getByRole("dialog", { name: "mobile navigation", exact: true });
  await expect(sheet).toHaveAttribute("aria-modal", "true");
  await expect(sheet).toHaveCSS("width", "288px");
  const boundary = (await frameElement.boundingBox())!;
  const box = (await sheet.boundingBox())!;
  expect(box.x).toBeCloseTo(boundary.x + 1, 0);
  expect(box.y).toBeCloseTo(boundary.y + 1, 0);
  await expect(page.getByRole("dialog", { name: "mobile navigation", exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  for (const key of ["Tab", "Shift+Tab"]) {
    await page.keyboard.press(key);
    expect(await sheet.evaluate(node => node.contains(document.activeElement))).toBe(true);
  }
  await frame.locator('[data-slot="sidebar-backdrop"][data-state="open"]').click({ position: { x: 375, y: 100 } });
  await expect(sheet).toBeHidden();
  await expect(opener).toBeFocused();
});

test("full-screen preview supports different widths, keeps menus inside, and updates route breadcrumbs", async ({ page }) => {
  const wrapper = page.locator('[data-sidebar-demo="full-screen-mobile"]');
  await wrapper.scrollIntoViewIfNeeded();
  const frame = page.frameLocator('[data-sidebar-frame="full-screen-mobile"]');
  const opener = frame.getByRole("button", { name: "Open navigation", exact: true });
  await opener.click();
  const sheet = frame.getByRole("dialog", { name: "full-screen-mobile navigation", exact: true });
  await expect(sheet).toHaveCSS("width", "390px");
  await expect(sheet).toHaveCSS("height", "640px");
  await sheet.getByRole("button", { name: "Close sidebar", exact: true }).click();
  await expect(sheet).toBeHidden();
  await expect(opener).toBeFocused();
  const slider = wrapper.getByRole("slider", { name: "Viewport", exact: true });
  await slider.focus();
  await slider.press("Home");
  await expect(wrapper.locator("output")).toHaveText("320px");
  await opener.click();
  await expect(sheet).toHaveCSS("width", "320px");
  await sheet.getByRole("button", { name: "Namespace: Engineering", exact: true }).click();
  await sheet.getByRole("menuitemradio", { name: "Research", exact: true }).click();
  await sheet.getByRole("link", { name: "Refinement", exact: true }).click();
  await expect(sheet).toBeHidden();
  await expect(opener).toBeFocused();
  const breadcrumb = frame.getByRole("navigation", { name: "Current page", exact: true });
  await expect(breadcrumb).toContainText("Research");
  await expect(breadcrumb).toContainText("Mesh");
  await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText("Refinement");
  await expect(wrapper.getByRole("link", { name: "Open example" })).toHaveAttribute("href", "/examples/components/sidebar/full-screen-mobile");
});

test("preview themes follow documentation and narrow pages report the real viewport width", async ({ page }) => {
  const wrapper = page.locator('[data-sidebar-demo="full-screen-mobile"]');
  const frame = page.frameLocator('[data-sidebar-frame="full-screen-mobile"]');
  const content = frame.locator('.sidebar-demo__main');
  await expect(content).toBeVisible();
  const light = await content.evaluate(node => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => document.documentElement.setAttribute("data-mode", "dark"));
  await expect.poll(() => content.evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe(light);
  await page.setViewportSize({ width: 390, height: 844 });
  await wrapper.scrollIntoViewIfNeeded();
  const width = await content.evaluate(() => window.innerWidth);
  await expect(wrapper.locator('output')).toHaveText(`${width}px`);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
