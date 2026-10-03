import { expect, test, type Page } from '@playwright/test';

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/workspace-pages');
  await expect.poll(() => page.locator('[data-sidebar-block="workspace-pages"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

test('workspace groups use keyboard disclosure; Favorites open the selected page group', async ({ page }) => {
  await openExample(page);
  const projects = page.getByRole('button', { name: 'Projects', exact: true });
  const links = page.getByRole('list', { name: 'Projects pages', exact: true });
  await expect(projects).toHaveAttribute('aria-expanded', 'true');
  await projects.press('Enter');
  await expect(links).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Project brief', exact: true })).toBeVisible();
  await projects.press('Space');
  await links.getByRole('link', { name: 'Mesh notes', exact: true }).press('Enter');
  await expect(page.getByRole('heading', { name: 'Mesh notes', exact: true })).toBeVisible();
  await expect(links.getByRole('link', { name: 'Mesh notes', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('list', { name: 'Favorites', exact: true }).getByRole('link', { name: 'Meeting notes', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Team', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('heading', { name: 'Meeting notes', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Workspace pages navigation', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Team', exact: true })).toHaveAttribute('aria-expanded', 'true');
});

test('Favorites support add, remove, and empty state; namespace state is independent', async ({ page }) => {
  await openExample(page);
  const favorites = page.getByRole('list', { name: 'Favorites', exact: true });
  await page.getByRole('button', { name: 'Remove Project brief from Favorites', exact: true }).click();
  await expect(favorites.getByRole('link')).toHaveCount(2);
  await page.getByRole('button', { name: 'Namespace: Engineering', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Study plan', exact: true })).toBeVisible();
  await expect(favorites.getByRole('link')).toHaveCount(1);
  const remove = page.getByRole('button', { name: 'Remove Study plan from Favorites', exact: true });
  await remove.press('Enter');
  await expect(page.getByText('No Favorites yet. Open a page and select its star.', { exact: true })).toBeVisible();
  const add = page.getByRole('button', { name: 'Add Study plan to Favorites', exact: true });
  await expect(add).toBeFocused();
  await expect(add).toHaveAttribute('aria-pressed', 'false');
  await add.press('Space');
  await expect(favorites.getByRole('link', { name: 'Study plan', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Namespace: Research', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Engineering', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Project brief', exact: true })).toBeVisible();
  await expect(favorites.getByRole('link')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Add Project brief to Favorites', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('Quick search filters the active namespace; Home and utility links navigate locally', async ({ page }) => {
  await openExample(page);
  const search = page.getByRole('button', { name: 'Quick search …', exact: true });
  await search.click();
  const dialog = page.getByRole('dialog', { name: 'Search workspace pages', exact: true });
  const input = dialog.getByRole('combobox');
  await input.fill('Study plan');
  await expect(dialog.getByText('No pages found.', { exact: true })).toBeVisible();
  await input.fill('Guidelines');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(search).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Guidelines', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Resources', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await search.click();
  await page.keyboard.press('Escape');
  await expect(search).toBeFocused();
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await page.locator('.sidebar-pages-demo__index').getByRole('button', { name: 'Mesh notes', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mesh notes', exact: true })).toBeVisible();
  for (const title of ['Calendar', 'Settings', 'Trash', 'Help']) {
    await page.getByRole('list', { name: 'Utility links', exact: true }).getByRole('link', { name: title, exact: true }).click();
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }
  await expect(page).toHaveURL(/\/examples\/sidebar\/workspace-pages$/);
});

test('mobile namespace and search stay usable; selection restores focus and survives viewport changes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Workspace pages navigation', exact: true });
  await expect(drawer).toHaveCSS('width', '390px');
  await expect(drawer).toHaveCSS('height', '844px');
  await drawer.getByRole('button', { name: 'Namespace: Engineering', exact: true }).click();
  await drawer.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(drawer.getByRole('button', { name: 'Namespace: Research', exact: true })).toBeFocused();
  const search = drawer.getByRole('button', { name: 'Quick search …', exact: true });
  await search.click();
  const dialog = page.getByRole('dialog', { name: 'Search workspace pages', exact: true });
  await expect(dialog.getByRole('combobox')).toBeFocused();
  await dialog.getByRole('combobox').press('Escape');
  await expect(drawer).toBeVisible();
  await expect(search).toBeFocused();
  await search.click();
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.fill('Reading list');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(drawer).toBeHidden();
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Reading list', exact: true })).toBeVisible();
  await toggle.click();
  await expect(drawer.getByRole('button', { name: 'Library', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await drawer.getByRole('list', { name: 'Favorites', exact: true }).getByRole('link', { name: 'Study plan', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole('button', { name: 'Namespace: Research', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Library', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('heading', { name: 'Study plan', exact: true })).toBeVisible();
});

test('workspace pages support dark mode, RTL, reduced motion, and narrow mobile navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openExample(page);
  const layout = page.locator('.sidebar-pages-demo .kappa-sidebar-layout');
  const light = await layout.evaluate(node => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => { document.documentElement.dataset.mode = 'dark'; document.documentElement.dataset.kappaTheme = 'dark'; document.documentElement.dir = 'rtl'; });
  await expect(layout).not.toHaveCSS('background-color', light);
  const nav = (await page.getByRole('navigation', { name: 'Workspace pages navigation', exact: true }).boundingBox())!;
  const content = (await page.locator('.sidebar-pages-demo__page').boundingBox())!;
  expect(nav.x).toBeGreaterThan(content.x);
  await page.setViewportSize({ width: 320, height: 700 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open sidebar', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Workspace pages navigation', exact: true });
  expect(await drawer.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
  await drawer.getByRole('button', { name: 'Team', exact: true }).press('Enter');
  await drawer.getByRole('list', { name: 'Team pages', exact: true }).getByRole('link', { name: 'Team directory', exact: true }).press('Enter');
  await expect(drawer).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Team directory', exact: true })).toBeVisible();
});

test('gallery adds a separate copyable example and retains the original Workspace', async ({ page, request }) => {
  await page.goto('/docs/blocks/sidebar');
  await expect(page.locator('[data-block-example]')).toHaveCount(15);
  const example = page.locator('[data-block-example="workspace-pages"]');
  await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/workspace-pages');
  await expect.poll(() => example.locator('.kappa-sidebar__content').evaluate(node => node.scrollHeight <= node.clientHeight)).toBe(true);
  const source = example.locator('[data-code-full] code');
  await expect(source).toContainText('standalone: true');
  await expect(source).toContainText('sidebar-pages-demo__namespace');
  await expect(source).not.toContainText('style src=');
  const workspace = page.locator('[data-block-example="workspace"]');
  await expect(workspace.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/workspace');
  expect(await (await request.get('/docs/blocks/sidebar.md')).text()).toContain('Workspace Pages');
  await page.goto('/examples/sidebar/workspace');
  await expect(page.locator('[data-sidebar-block="workspace"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Overview', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Profile: Ros.Space', exact: true })).toBeVisible();
});
