import { expect, test, type Page } from '@playwright/test';

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/minimal-workspace');
  await expect.poll(() => page.locator('[data-sidebar-block="minimal-workspace"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

test('server renders the full shell and both labelled menu groups before hydration', async ({ request }) => {
  const response = await request.get('/examples/sidebar/minimal-workspace');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('data-sidebar-block="minimal-workspace"');
  expect(html).toContain('Help and resources');
  expect(html).toContain('data-slot="dropdown-group"');
  expect(html).toContain('Projects in Ros.Space');
});

test('minimal shell has reference proportions, one toggle, and a filterable project table', async ({ page }) => {
  await openExample(page);
  await expect(page.locator('.kappa-sidebar-layout__site-header')).toHaveCSS('height', '48px');
  const nav = page.getByRole('navigation', { name: 'Minimal workspace navigation', exact: true });
  await expect(nav).toHaveCSS('width', '250px');
  await expect(page.getByRole('button', { name: 'Collapse sidebar', exact: true })).toHaveCount(1);
  const collapse = nav.getByRole('button', { name: 'Collapse sidebar', exact: true });
  await expect(collapse).toHaveCount(1);
  await expect(page.locator('.kappa-sidebar-layout__site-header').getByRole('button', { name: 'Collapse sidebar', exact: true })).toHaveCount(0);
  const helpBox = (await nav.getByRole('button', { name: 'Help', exact: true }).boundingBox())!;
  const collapseBox = (await collapse.boundingBox())!;
  expect(collapseBox.y).toBeGreaterThanOrEqual(helpBox.y + helpBox.height);
  const namespaceHeader = (await nav.locator('.kappa-sidebar__header').boundingBox())!;
  const breadcrumb = (await page.getByRole('navigation', { name: 'Workspace breadcrumb' }).boundingBox())!;
  expect(namespaceHeader.y + namespaceHeader.height).toBeCloseTo(breadcrumb.y + breadcrumb.height, 1);
  const table = page.getByRole('table', { name: 'Projects in Ros.Space', exact: true });
  await expect(table.getByRole('row')).toHaveCount(3);
  const filter = page.getByRole('searchbox', { name: 'Search projects', exact: true });
  await filter.fill('channel');
  await expect(table.getByRole('button', { name: /Channel flow/ })).toBeVisible();
  await expect(table.getByRole('row')).toHaveCount(2);
  await filter.fill('no-such-project');
  await expect(table.getByText('No projects found.', { exact: true })).toBeVisible();
  await filter.press('Escape');
  await expect(filter).toHaveValue('');
  await expect(table.getByRole('row')).toHaveCount(3);
});

test('project creation, templates, namespace selection, and page links use only local data', async ({ page }) => {
  await openExample(page);
  await page.getByRole('button', { name: 'New project', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Untitled project 5', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Namespace: Ros.Space', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Engineering', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  await expect(page.getByRole('table')).toContainText('Heat exchanger');
  await expect(page.getByRole('table')).not.toContainText('Untitled project');
  await page.getByRole('navigation', { name: 'Application pages', exact: true }).getByRole('link', { name: 'Templates', exact: true }).press('Enter');
  await page.getByRole('button', { name: 'Use Flow study', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Flow study 6', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Namespace: Engineering', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Ros.Space', exact: true }).click();
  await expect(page.getByRole('table')).toContainText('Untitled project 5');
  const nav = page.getByRole('navigation', { name: 'Minimal workspace navigation', exact: true });
  for (const label of ['Recently opened', 'Activities', 'User settings', 'Projects', 'Groups']) {
    await nav.getByRole('link', { name: label, exact: true }).click();
    await expect(page.getByRole('heading', { name: label, exact: true, level: 2 })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Research', exact: true }).click();
  await expect(page.getByRole('table')).toContainText('Inlet comparison');
  await expect(page).toHaveURL(/\/examples\/sidebar\/minimal-workspace$/);
});

test('icon collapse retains namespace and Help menus while hiding project shortcuts', async ({ page }) => {
  await openExample(page);
  const nav = page.getByRole('navigation', { name: 'Minimal workspace navigation', exact: true });
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await expect(nav).toHaveCSS('width', '48px');
  await expect(nav.getByRole('list', { name: 'Project shortcuts', exact: true })).toHaveCount(0);
  await expect(nav.getByRole('link', { name: 'Projects', exact: true })).toBeVisible();
  await nav.getByRole('button', { name: 'Namespace: Ros.Space', exact: true }).press('Enter');
  await page.getByRole('menuitemradio', { name: 'Engineering', exact: true }).click();
  await expect(nav.getByRole('button', { name: 'Namespace: Engineering', exact: true })).toBeFocused();
  const help = nav.getByRole('button', { name: 'Help', exact: true });
  await help.press('Enter');
  await expect(page.getByRole('group', { name: 'Help and resources', exact: true })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Documentation', exact: true }).click();
  await expect(help).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Documentation', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
  await expect(nav.getByRole('list', { name: 'Project shortcuts', exact: true })).toContainText('Heat exchanger');
});

test('search remains centered on the full shell across viewport, collapse, and RTL changes', async ({ page }) => {
  await openExample(page);
  for (const width of [1440, 1280, 1024, 768, 640, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const shell = (await page.locator('[data-sidebar-block="minimal-workspace"]').boundingBox())!;
    const search = (await page.getByRole('button', { name: 'Search or go to…', exact: true }).boundingBox())!;
    expect(search.x + search.width / 2).toBeCloseTo(shell.x + shell.width / 2, 1);
    const start = (await page.locator('.minimal-workspace-demo__header-start').boundingBox())!;
    const end = (await page.locator('.minimal-workspace-demo__header-end').boundingBox())!;
    expect(start.x + start.width).toBeLessThanOrEqual(search.x);
    expect(search.x + search.width).toBeLessThanOrEqual(end.x);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
  const search = (await page.getByRole('button', { name: 'Search or go to…', exact: true }).boundingBox())!;
  expect(search.x + search.width / 2).toBeCloseTo(640, 1);
});

test('separator supports drag and keyboard resize and retains width after collapse and mobile', async ({ page }) => {
  await openExample(page);
  const nav = page.getByRole('navigation', { name: 'Minimal workspace navigation', exact: true });
  const handle = page.getByRole('separator', { name: 'Resize sidebar', exact: true });
  const lineOpacity = () => handle.evaluate(node => getComputedStyle(node, '::after').opacity);
  await expect.poll(lineOpacity).toBe('0');
  const search = page.getByRole('button', { name: 'Search or go to…', exact: true });
  const centerBefore = (await search.boundingBox())!;
  const box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect.poll(lineOpacity).toBe('1');
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await nav.boundingBox())!.width).toBeCloseTo(320, 0);
  await page.mouse.move(0, 0);
  await handle.evaluate(node => (node as HTMLElement).blur());
  await expect.poll(lineOpacity).toBe('0');
  await handle.focus();
  await handle.press('ArrowRight');
  await expect.poll(lineOpacity).toBe('1');
  await expect.poll(async () => Number(await handle.getAttribute('aria-valuenow'))).toBeGreaterThan(320);
  const expandedWidth = Number(await handle.getAttribute('aria-valuenow'));
  await expect.poll(async () => (await nav.boundingBox())!.width).toBeCloseTo(expandedWidth, 0);
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).press('Enter');
  await expect(nav).toHaveCSS('width', '48px');
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).press('Enter');
  await expect.poll(async () => (await nav.boundingBox())!.width).toBeCloseTo(expandedWidth, 0);
  const centerAfter = (await search.boundingBox())!;
  expect(centerAfter.x + centerAfter.width / 2).toBeCloseTo(centerBefore.x + centerBefore.width / 2, 1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(handle).toHaveCount(0);
  await page.getByRole('button', { name: 'Open sidebar', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Minimal workspace navigation', exact: true });
  await expect(drawer.getByRole('button', { name: 'Collapse sidebar', exact: true })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect.poll(async () => (await nav.boundingBox())!.width).toBeCloseTo(expandedWidth, 0);
  await handle.press('End');
  await expect.poll(async () => (await nav.boundingBox())!.width).toBeCloseTo(420, 0);
});

test('header search and profile menus support keyboard selection and focus return', async ({ page }) => {
  await openExample(page);
  const search = page.getByRole('button', { name: 'Search or go to…', exact: true });
  await search.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Search minimal workspace', exact: true });
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.fill('not-a-page');
  await expect(dialog.getByText('No results found.', { exact: true })).toBeVisible();
  await input.fill('Channel flow');
  await input.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(search).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Channel flow', exact: true })).toBeVisible();
  await search.click();
  await expect(input).toBeFocused();
  await input.press('Escape');
  await expect(search).toBeFocused();
  const profile = page.getByRole('button', { name: 'Profile: Ros.Space', exact: true });
  await profile.press('Enter');
  await expect(page.getByRole('menu', { name: 'Profile: Ros.Space', exact: true })).toContainText('ros@example.com');
  await page.getByRole('menuitem', { name: 'Sign out', exact: true }).click();
  await expect(profile).toBeFocused();
  await expect(page.getByText('Local preview only. Your real session stays signed in.', { exact: true })).toBeVisible();
});

test('mobile drawer, Browse menu, and global search remain usable at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  await expect(page.locator('.kappa-sidebar-layout__site-header')).toHaveCSS('height', '48px');
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Minimal workspace navigation', exact: true });
  await expect(drawer).toHaveCSS('width', '390px');
  await expect(drawer).toHaveCSS('height', '844px');
  await drawer.getByRole('button', { name: 'Namespace: Ros.Space', exact: true }).click();
  await drawer.getByRole('menuitemradio', { name: 'Engineering', exact: true }).click();
  await drawer.getByRole('link', { name: 'Heat exchanger', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Heat exchanger', exact: true })).toBeVisible();
  await toggle.click();
  await drawer.getByRole('button', { name: 'Help', exact: true }).click();
  await drawer.getByRole('menuitem', { name: 'Support', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  const browse = page.getByRole('button', { name: 'Browse application pages', exact: true });
  await browse.click();
  await expect(page.getByRole('group', { name: 'Application pages', exact: true })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Community', exact: true }).click();
  await expect(browse).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Community', exact: true })).toBeVisible();
  const search = page.getByRole('button', { name: 'Search or go to…', exact: true });
  await search.click();
  const input = page.getByRole('dialog', { name: 'Search minimal workspace', exact: true }).getByRole('combobox');
  await expect(input).toBeFocused();
  await input.fill('Dashboard');
  await input.press('Enter');
  await expect(search).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole('button', { name: 'Namespace: Engineering', exact: true })).toBeVisible();
});

test('minimal shell supports both themes, RTL, reduced motion, and 320px width', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openExample(page);
  const header = page.locator('.kappa-sidebar-layout__site-header');
  const light = await header.evaluate(node => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => { document.documentElement.dataset.mode = 'dark'; document.documentElement.dataset.kappaTheme = 'dark'; document.documentElement.dir = 'rtl'; });
  await expect(header).not.toHaveCSS('background-color', light);
  const nav = (await page.getByRole('navigation', { name: 'Minimal workspace navigation', exact: true }).boundingBox())!;
  const content = (await page.locator('.minimal-workspace-demo__page').boundingBox())!;
  expect(nav.x).toBeGreaterThan(content.x);
  await page.setViewportSize({ width: 320, height: 700 });
  await expect(page.locator('.kappa-sidebar-layout')).toHaveAttribute('data-mobile', '');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.kappa-sidebar-layout__content').evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open sidebar', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Minimal workspace navigation', exact: true });
  await expect(drawer.getByRole('link', { name: 'Dashboard', exact: true })).toHaveCSS('min-height', '44px');
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
});

test('gallery publishes complete Minimal Workspace source and keeps every prior example', async ({ page, request }) => {
  await page.goto('/docs/blocks/sidebar#minimal-workspace');
  await expect(page.locator('[data-block-example]')).toHaveCount(15);
  const example = page.locator('[data-block-example="minimal-workspace"]');
  await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/minimal-workspace');
  await expect(example.locator('[data-code-full] code')).toContainText('standalone: true');
  await expect(example.locator('[data-code-full] code')).toContainText('@dicehub/kappa/components/dicehub-logo');
  await expect(example.locator('[data-code-full] code')).not.toContainText('style src=');
  await expect(example.locator('[data-code-full] code')).not.toContainText('localhost:8080');
  for (const id of ['workspace', 'workspace-pages', 'inbox-navigation', 'inset', 'floating', 'rail']) await expect(page.locator(`[data-block-example="${id}"]`)).toHaveCount(1);
  for (const removed of ['split', 'header']) await expect(page.locator(`[data-block-example="${removed}"]`)).toHaveCount(0);
  expect(await (await request.get('/docs/blocks/sidebar.md')).text()).toContain('Minimal Workspace');
});
