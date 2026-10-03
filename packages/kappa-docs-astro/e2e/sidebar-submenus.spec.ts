import { expect, test, type Page } from "@playwright/test";

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/submenus');
  await expect.poll(() => page.locator('[data-sidebar-block="submenus"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

test('submenus preserve native nested lists, parent links, and keyboard selection', async ({ page }) => {
  await openExample(page);
  const nav = page.getByRole('navigation', { name: 'Documentation navigation', exact: true });
  const parent = nav.getByRole('link', { name: 'Getting started', exact: true });
  await expect(nav.locator('[data-slot="sidebar-menu-sub"]')).toHaveCount(3);
  await expect(nav.getByRole('searchbox')).toHaveCount(0);
  await expect(parent).not.toHaveAttribute('aria-expanded');
  await parent.focus();
  await parent.press('Enter');
  await expect(page.getByRole('heading', { name: 'Getting started', exact: true })).toBeVisible();
  await expect(parent).toHaveAttribute('aria-current', 'page');
  await parent.press('Tab');
  const child = nav.getByRole('link', { name: 'Introduction', exact: true });
  await expect(child).toBeFocused();
  await child.press('Enter');
  await expect(child).toHaveAttribute('aria-current', 'page');
  await expect(parent).not.toHaveAttribute('aria-current');
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(nav.getByRole('list', { name: 'Reference', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await expect(nav).toBeHidden();
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
  await expect(child).toHaveAttribute('aria-current', 'page');
});

test('submenu mobile selection closes the drawer and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Documentation navigation', exact: true });
  const link = drawer.getByRole('link', { name: 'Prepare a mesh', exact: true });
  expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await link.click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Prepare a mesh', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  const nav = page.getByRole('navigation', { name: 'Documentation navigation', exact: true });
  await expect(nav.getByRole('link', { name: 'Prepare a mesh', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('submenu gallery source is complete and earlier examples remain', async ({ page, request }) => {
  await page.goto('/docs/blocks/sidebar');
  await expect(page.locator('[data-block-example]')).toHaveCount(15);
  const example = page.locator('[data-block-example="submenus"]');
  await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/submenus');
  const code = example.locator('[data-code-full] code');
  await expect(code).toContainText('Sidebar.MenuSub');
  await expect(code).toContainText('standalone: true');
  await expect(code).toContainText('<style>');
  await expect(code).not.toContainText('style src=');
  expect(await (await request.get('/docs/blocks/sidebar.md')).text()).toContain('Submenus uses Sidebar.MenuSub');
});
