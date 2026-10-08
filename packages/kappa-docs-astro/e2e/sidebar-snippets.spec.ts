import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const names = ["preview", "anatomy", "nested", "routing", "namespace-selector", "profile-selector", "quick-search", "resizable",
  "resizable-controlled", "peeking", "hover-reveal", "scroll-to-item", "sliding-views", "compact", "collapsed",
  "offcanvas", "static", "controlled", "end", "rtl", "mobile", "full-screen-mobile", "scrollable", "loading"];

async function open(page: Page, name: string) {
  await page.goto(`/examples/components/sidebar/snippets?variant=${name}`);
  await expect(page.locator(`[data-snippet="${name}"]`)).toBeVisible();
  await expect.poll(() => page.locator("astro-island").getAttribute("ssr")).toBeNull();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("code copy and Markdown contain the focused Vue files", async ({ page, context, request }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/components/sidebar");
  const markdown = await request.get("/docs/components/sidebar.md");
  expect(markdown.ok()).toBe(true);
  const text = await markdown.text();
  for (const name of names) {
    const source = readFileSync(new URL(`../src/snippets/sidebar/${name}.vue`, import.meta.url), "utf8").trimEnd();
    const block = page.locator(`#sidebar-${name}-code`).locator("..");
    await block.getByRole("button", { name: "View Code", exact: true }).click();
    expect((await block.locator("code").textContent())?.trimEnd()).toBe(source);
    await block.getByRole("button", { name: "Copy code", exact: true }).click();
    await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).trimEnd()).toBe(source);
    expect(text).toContain(source);
  }
  expect(text).not.toMatch(/<style\b|sidebar-hover-demo|ResizeObserver|onShortcut\(/);
});

test("copied namespace and profile menus select values and restore focus", async ({ page }) => {
  await open(page, "namespace-selector");
  const namespace = page.getByRole("button", { name: "Namespace: Engineering", exact: true });
  await namespace.click();
  await page.getByRole("menuitemradio", { name: "Research", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Research", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Namespace: Research", exact: true })).toBeFocused();
  await open(page, "profile-selector");
  await page.getByRole("button", { name: "Casey Rivera", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "Casey Rivera", exact: true })).toHaveAttribute('aria-current', 'true');
  await page.getByRole("menuitem", { name: "Jordan Lee", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Jordan Lee", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Jordan Lee", exact: true })).toBeFocused();
});

test("copied search selects a page and returns focus", async ({ page }) => {
  await open(page, "quick-search");
  const trigger = page.getByRole("button", { name: "Quick search", exact: true });
  await trigger.click();
  const input = page.getByRole("dialog", { name: "Search navigation", exact: true }).getByRole("combobox");
  await input.fill("Settings");
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
  await expect(trigger).toBeFocused();
});

test("copied hover reveal opens, pins, and resizes without application handlers", async ({ page }) => {
  await open(page, "hover-reveal");
  const trigger = page.locator(".kappa-sidebar-layout__toolbar [data-slot=sidebar-trigger]");
  const nav = page.getByRole("navigation", { name: "Workspace navigation", exact: true, includeHidden: true });
  await trigger.click();
  await expect(nav).toHaveAttribute("data-state", "collapsed");
  await page.getByRole("heading", { name: "Overview", exact: true }).hover();
  await trigger.hover();
  await expect(nav).toHaveAttribute("data-state", "peeking");
  await trigger.click();
  await expect(nav).toHaveAttribute("data-state", "expanded");
  const separator = page.getByRole("separator", { name: "Resize sidebar", exact: true });
  await separator.focus();
  await separator.press("End");
  await expect(separator).toHaveAttribute("aria-valuenow", "600");
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(page.locator('.kappa-sidebar-layout')).toHaveAttribute('data-content-alignment', 'available');
  const content = page.locator('.kappa-sidebar-layout__content');
  expect(await content.evaluate(el => el.scrollWidth - el.clientWidth)).toBe(0);
  await expect(page.getByRole('heading', { name: 'Overview', exact: true })).toBeVisible();
});

test("copied scroll action moves only the navigation and leaves focus on its button", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 500 });
  await open(page, "scroll-to-item");
  const content = page.getByRole("region", { name: "Navigation links", exact: true });
  const button = page.getByRole("button", { name: "Scroll to Settings", exact: true });
  const scrollBefore = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
  await expect(content).toHaveJSProperty("scrollTop", 0);
  await button.click();
  await expect.poll(() => content.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }))).toEqual(scrollBefore);
  await expect(button).toBeFocused();
  const settings = content.getByRole("button", { name: "Settings", exact: true });
  expect(await settings.evaluate(el => {
    const box = el.getBoundingClientRect();
    const parent = el.closest('[data-slot="sidebar-content"]')!.getBoundingClientRect();
    return box.top >= parent.top && box.bottom <= parent.bottom;
  })).toBe(true);
});

test("copied mobile composition keeps menus in the drawer and has a Close button", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, "namespace-selector");
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Workspace navigation", exact: true });
  await drawer.getByRole("button", { name: "Namespace: Engineering", exact: true }).click();
  await expect(drawer.getByRole("menu")).toBeVisible();
  await drawer.getByRole("menuitemradio", { name: "Research", exact: true }).click();
  await drawer.getByRole("button", { name: "Close navigation", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("button", { name: "Open sidebar", exact: true })).toBeFocused();
});

test("copied controlled state, width, and sliding views accept user changes", async ({ page }) => {
  await open(page, "controlled");
  await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(page.getByRole("navigation")).toHaveAttribute("data-state", "collapsed");
  await page.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await expect(page.getByRole("navigation")).toHaveAttribute("data-state", "expanded");
  await open(page, "resizable-controlled");
  const separator = page.getByRole("separator", { name: "Resize sidebar", exact: true });
  await separator.focus();
  await separator.press("End");
  await expect(separator).toHaveAttribute("aria-valuenow", "400");
  await open(page, "sliding-views");
  await page.getByRole("button", { name: "Rotor study", exact: true }).click();
  await expect(page.getByRole("button", { name: "Back to workspace", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Back to workspace", exact: true }).click();
  await expect(page.getByRole("button", { name: "Rotor study", exact: true })).toBeFocused();
});
