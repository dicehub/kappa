import { expect, test, type Page } from '@playwright/test';

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/dropdown-submenus');
  await expect.poll(() => page.locator('[data-sidebar-block="dropdown-submenus"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

test('parent rows open popup links with keyboard selection and dismissal', async ({ page }) => {
  await openExample(page);
  const parent = page.getByRole('button', { name: 'Project workflow', exact: true });
  await expect(parent).toHaveAttribute('aria-haspopup', 'menu');
  await expect(parent).not.toHaveAttribute('aria-current', 'page');
  await parent.focus();
  await parent.press('ArrowDown');
  const menu = page.getByRole('menu', { name: 'Project workflow', exact: true });
  await expect(menu).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Create a project', exact: true })).toBeVisible();
  const first = menu.getByRole('menuitem', { name: 'Import geometry', exact: true });
  await expect(first).toHaveAttribute('href', '?page=import-geometry');
  await expect(menu).toBeFocused();
  await expect(first).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Prepare a mesh', exact: true })).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/examples\/sidebar\/dropdown-submenus$/);
  await expect(menu).toBeHidden();
  await expect(parent).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Prepare a mesh', exact: true })).toBeVisible();
  await parent.click();
  await expect(menu.locator('[aria-current="page"]')).toHaveText('Prepare a mesh');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(parent).toBeFocused();
  await parent.click();
  await page.getByRole('heading', { name: 'Prepare a mesh', exact: true }).click();
  await expect(menu).toBeHidden();
});

test('search and mobile popup selection preserve state and drawer focus', async ({ page }) => {
  await openExample(page);
  const search = page.getByRole('searchbox');
  await search.fill(' missing ');
  await expect(page.getByRole('status')).toHaveText('No pages found.');
  await search.press('Escape');
  await search.fill(' MESH ');
  await expect(page.getByRole('button', { name: 'Reference', exact: true })).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Documentation navigation', exact: true });
  await expect(drawer.getByRole('searchbox')).toHaveValue(' MESH ');
  const parent = drawer.getByRole('button', { name: 'Project workflow', exact: true });
  await parent.click();
  const menu = drawer.getByRole('menu', { name: 'Project workflow', exact: true });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem')).toHaveCount(1);
  const item = menu.getByRole('menuitem', { name: 'Prepare a mesh', exact: true });
  await expect.poll(async () => (await item.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(drawer).toBeVisible();
  await expect(parent).toBeFocused();
  await parent.click();
  await item.click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Prepare a mesh', exact: true })).toBeVisible();
});

test('gallery keeps existing examples and provides complete source and markdown', async ({ page, request }) => {
  await page.goto('/docs/blocks/sidebar');
  await expect(page.locator('[data-block-example]')).toHaveCount(15);
  const example = page.locator('[data-block-example="dropdown-submenus"]');
  await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/dropdown-submenus');
  const code = example.locator('[data-code-full] code');
  await expect(code).toContainText('standalone: true');
  await expect(code).toContainText('Dropdown.LinkItem');
  await expect(code).toContainText('<style>');
  await expect(code).not.toContainText('style src=');
  expect(await (await request.get('/docs/blocks/sidebar.md')).text()).toContain('Dropdown Submenus');
});
