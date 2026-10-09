import { expect, test, type Page } from "@playwright/test";

const nav = (page: Page) => page.locator('[data-slot="sidebar"]');
const outside = (page: Page) => page.locator('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]');
const search = (page: Page) => page.locator('[data-hover-search-trigger]');
const palette = (page: Page) => page.getByRole('dialog', { name: 'Search workspace pages', exact: true });
const workspace = (page: Page, value = 'Engineering') => nav(page).getByRole('button', { name: `Workspace: ${value}`, exact: true });
async function ready(page: Page) {
  await page.goto('/examples/components/sidebar/hover-reveal');
  await expect.poll(() => page.locator('[data-sidebar-demo="hover-reveal"]').evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
  await expect(search(page)).toHaveAttribute('aria-controls', /.+/);
  await expect(palette(page)).toBeHidden();
}
async function collapse(page: Page) {
  await nav(page).locator('[data-slot="sidebar-header"]').hover();
  await nav(page).getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await page.locator('.sidebar-hover-demo__article').hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
}
async function reveal(page: Page) {
  await outside(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page);
});

test('workspace menu opens below, marks the selection, and changes the workspace while peeking', async ({ page }) => {
  await collapse(page);
  await reveal(page);
  await workspace(page).click();
  const menu = page.getByRole('menu', { name: 'Workspace: Engineering', exact: true });
  await expect(menu).toHaveAttribute('data-placement', 'bottom-start');
  const triggerBox = await workspace(page).boundingBox();
  await expect.poll(() => menu.evaluate(el => el.getBoundingClientRect().y)).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height);
  const selected = menu.getByRole('menuitemradio', { name: 'Engineering', exact: true });
  await expect(selected).toHaveAttribute('aria-checked', 'true');
  const itemBox = await selected.boundingBox();
  const checkBox = await selected.locator('[data-slot="dropdown-radio-item-indicator"]').boundingBox();
  expect(itemBox!.x + itemBox!.width - checkBox!.x - checkBox!.width).toBeLessThan(10);
  await menu.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(workspace(page, 'Research')).toBeFocused();
  await expect(page.locator('.sidebar-hover-demo__eyebrow')).toHaveText('Research');
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await workspace(page, 'Research').click();
  await page.getByRole('menuitem', { name: 'Add workspace', exact: true }).click();
  await expect(page.locator('.sidebar-hover-demo__article h2')).toHaveText('Add workspace');
  await expect(workspace(page, 'Research')).toBeFocused();
});

test('workspace hover and open menu share their background and chevron without leaving pointer selection highlighted', async ({ page }) => {
  const chevron = (value = 'Engineering') => workspace(page, value).locator('.kappa-sidebar__menu-label > svg');
  await page.locator('.sidebar-hover-demo__article').hover();
  const original = await workspace(page).boundingBox();
  await expect(chevron()).toHaveCSS('opacity', '0');
  await workspace(page).hover();
  await expect(chevron()).toHaveCSS('opacity', '1');
  await workspace(page).evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished.catch(() => {}))));
  const hoverBackground = await workspace(page).evaluate(el => getComputedStyle(el).backgroundColor);
  expect(hoverBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(await workspace(page).boundingBox()).toEqual(original);
  await page.locator('.sidebar-hover-demo__article').hover();
  await expect(chevron()).toHaveCSS('opacity', '0');
  await workspace(page).click();
  const menu = page.getByRole('menu', { name: 'Workspace: Engineering', exact: true });
  await expect(menu).toBeVisible();
  await page.locator('.sidebar-hover-demo__article').hover();
  await expect(chevron()).toHaveCSS('opacity', '1');
  await expect(workspace(page)).toHaveCSS('background-color', hoverBackground);
  await menu.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(workspace(page, 'Research')).toBeFocused();
  await expect(chevron('Research')).toHaveCSS('opacity', '0');
  await expect(workspace(page, 'Research')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('keyboard focus retains its outline and opening the menu reveals the workspace chevron', async ({ page }) => {
  await page.locator('.sidebar-hover-demo__article').hover();
  const chevron = workspace(page).locator('.kappa-sidebar__menu-label > svg');
  await page.keyboard.press('Tab');
  await expect(workspace(page)).toBeFocused();
  await expect(workspace(page)).toHaveCSS('outline-width', '2px');
  await expect(chevron).toHaveCSS('opacity', '0');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu', { name: 'Workspace: Engineering', exact: true })).toBeVisible();
  await expect(chevron).toHaveCSS('opacity', '1');
  await page.keyboard.press('Escape');
  await expect(workspace(page)).toBeFocused();
  await expect(chevron).toHaveCSS('opacity', '0');
});

for (const rtl of [false, true]) {
  test(`workspace placement follows the trigger with end placement, rtl=${rtl}`, async ({ page }) => {
    await page.getByRole('button', { name: 'Change side', exact: true }).click();
    if (rtl) await page.getByRole('button', { name: 'Use RTL', exact: true }).click();
    await collapse(page);
    await reveal(page);
    await workspace(page).click();
    const menu = page.getByRole('menu', { name: 'Workspace: Engineering', exact: true });
    await expect(menu).toHaveAttribute('data-side', 'bottom');
    const box = await workspace(page).boundingBox();
    await expect.poll(() => menu.evaluate(el => el.getBoundingClientRect().y)).toBeGreaterThanOrEqual(box!.y + box!.height);
    await menu.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
    await expect(workspace(page, 'Research')).toBeFocused();
    await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  });
}

test('search traps focus, filters pages, and returns focus to a peeking search trigger', async ({ page }) => {
  await collapse(page);
  await reveal(page);
  await search(page).click();
  const dialog = palette(page);
  await expect(dialog).toBeVisible();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await expect(search(page)).toHaveAttribute('aria-controls', (await dialog.getAttribute('id'))!);
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  for (let index = 0; index < 6; index += 1) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  await input.fill('unknown page');
  await expect(dialog.getByText('No pages found.', { exact: true })).toBeVisible();
  await input.fill('Prepare a mesh');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await input.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(search(page)).toBeFocused();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await search(page).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('combobox')).toBeFocused();
  await dialog.evaluate(el => Promise.all(el.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))));
  await page.mouse.click(1300, 760);
  await expect(dialog).toBeHidden();
  await expect(search(page)).toBeFocused();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await page.keyboard.press('Escape');
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await expect(outside(page)).toBeFocused();
  await reveal(page);
  await search(page).click();
  await input.fill('Prepare a mesh');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(page.locator('.sidebar-hover-demo__article h2')).toHaveText('Prepare a mesh');
  await expect(search(page)).toBeFocused();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
});

test('the slash shortcut works with collapsed navigation and preserves page focus', async ({ page }) => {
  await collapse(page);
  const original = page.getByRole('button', { name: 'Lock state', exact: true });
  await original.focus();
  await page.keyboard.press('/');
  await expect(palette(page)).toBeVisible();
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await palette(page).getByRole('combobox').press('Escape');
  await expect(palette(page)).toBeHidden();
  await expect(original).toBeFocused();
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
});

test('window blur keeps a temporary sidebar hidden while search remains open', async ({ page }) => {
  await collapse(page);
  await reveal(page);
  await search(page).click();
  await expect(palette(page).getByRole('combobox')).toBeFocused();
  await page.evaluate(async () => {
    window.dispatchEvent(new Event('blur'));
    // Flush the resulting attribute observer and its deferred focus updates.
    for (let frame = 0; frame < 4; frame += 1) await new Promise(requestAnimationFrame);
  });
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await expect(palette(page)).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await palette(page).getByRole('combobox').press('Escape');
  await expect(search(page)).toBeFocused();
});

test('the shortcut does not intercept typing or an open workspace menu', async ({ page }) => {
  await page.evaluate(() => {
    const input = document.createElement('textarea');
    input.id = 'shortcut-editor';
    document.querySelector('.sidebar-hover-demo__article')!.append(input);
  });
  const input = page.locator('#shortcut-editor');
  await input.focus();
  await page.keyboard.type('/');
  await expect(input).toHaveValue('/');
  await expect(palette(page)).toBeHidden();
  await workspace(page).click();
  await page.keyboard.press('/');
  await expect(palette(page)).toBeHidden();
  await expect(page.getByRole('menu', { name: 'Workspace: Engineering', exact: true })).toBeVisible();
});

test('mobile keeps the workspace menu inside the drawer and closes both layers after search selection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await outside(page).click();
  const drawer = page.getByRole('dialog', { name: 'Hover navigation', exact: true });
  await expect(drawer).toBeVisible();
  const searchBox = await search(page).boundingBox();
  expect(searchBox!.height).toBeGreaterThanOrEqual(44);
  await workspace(page).click();
  const menu = page.getByRole('menu', { name: 'Workspace: Engineering', exact: true });
  expect(await menu.evaluate(el => !!el.closest('[role="dialog"]'))).toBe(true);
  await menu.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(drawer).toBeVisible();
  await search(page).click();
  await palette(page).getByRole('combobox').press('Escape');
  await expect(drawer).toBeVisible();
  await expect(search(page)).toBeFocused();
  await search(page).click();
  const input = palette(page).getByRole('combobox');
  await input.fill('configuration');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(palette(page)).toBeHidden();
  await expect(drawer).toBeHidden();
  await expect(outside(page)).toBeFocused();
  await expect(page.locator('.sidebar-hover-demo__article h2')).toHaveText('Configuration');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('the embedded example scopes slash to its own controls and documents the composition', async ({ page, request }) => {
  await page.goto('/docs/components/sidebar');
  const demo = page.locator('[data-sidebar-demo="hover-reveal"]');
  await expect.poll(() => demo.evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
  await page.getByRole('heading', { level: 1, name: 'Sidebar', exact: true }).click();
  await page.keyboard.press('/');
  await expect(palette(page)).toBeHidden();
  await demo.getByRole('button', { name: 'Lock state', exact: true }).focus();
  await page.keyboard.press('/');
  await expect(palette(page)).toBeVisible();
  await palette(page).getByRole('combobox').press('Escape');
  await expect(demo.getByRole('button', { name: 'Lock state', exact: true })).toBeFocused();
  const markdown = await request.get('/docs/components/sidebar.md');
  expect(markdown.ok()).toBe(true);
  const text = await markdown.text();
  expect(text).toContain('WorkspaceSwitcher');
  expect(text).toContain('CommandPalette.Root');
});

test('a retained Command Palette stays hidden when closed and preserves its dialog IDs and focus', async ({ page }) => {
  await page.goto('/examples/components/sidebar/ownership');
  await expect.poll(() => page.locator('astro-island').evaluate(el => el.hasAttribute('ssr'))).toBe(false);
  const dialog = page.locator('#retained-command-content');
  await expect(dialog).toBeAttached();
  await expect(dialog).toBeHidden();
  const opener = page.getByRole('button', { name: 'Open retained commands', exact: true });
  await opener.click();
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.press('Escape');
  await expect(dialog).toBeAttached();
  await expect(dialog).toBeHidden();
  await expect(dialog).toHaveAttribute('inert');
  await expect(opener).toBeFocused();
});
