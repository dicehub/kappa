import { expect, test, type Page } from '@playwright/test';

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/collapsible-submenus');
  await expect.poll(() => page.locator('[data-sidebar-block="collapsible-submenus"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

test('parent buttons toggle indented links without navigating and skip hidden children', async ({ page }) => {
  await openExample(page);
  const nav = page.getByRole('navigation', { name: 'Documentation navigation', exact: true });
  const start = nav.getByRole('button', { name: 'Getting started', exact: true });
  const workflow = nav.getByRole('button', { name: 'Project workflow', exact: true });
  await expect(start).toHaveAttribute('aria-expanded', 'true');
  await expect(workflow).toHaveAttribute('aria-expanded', 'false');
  const startChevron = (await start.locator('[data-slot="sidebar-menu-chevron"]').boundingBox())!;
  const workflowChevron = (await workflow.locator('[data-slot="sidebar-menu-chevron"]').boundingBox())!;
  expect(startChevron.x).toBeCloseTo(workflowChevron.x, 1);
  await start.focus();
  await start.press('Enter');
  await expect(start).toHaveAttribute('aria-expanded', 'false');
  await expect(nav.getByRole('link', { name: 'Installation', exact: true })).toBeHidden();
  await start.press('Tab');
  await expect(workflow).toBeFocused();
  await workflow.press('Space');
  await expect(workflow).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('heading', { name: 'Create a project', exact: true })).toBeVisible();
  const children = nav.getByRole('list', { name: 'Project workflow', exact: true });
  await expect(children).toBeVisible();
  await children.getByRole('link', { name: 'Prepare a mesh', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Prepare a mesh', exact: true })).toBeVisible();
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
});

test('search reveals closed submenus, handles empty results, and retains mobile state', async ({ page }) => {
  await openExample(page);
  const nav = page.getByRole('navigation', { name: 'Documentation navigation', exact: true });
  const search = nav.getByRole('searchbox');
  await search.fill('configuration');
  await expect(nav.getByRole('button', { name: 'Reference', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('link', { name: 'Configuration', exact: true })).toBeVisible();
  await search.fill('missing page');
  await expect(nav.getByRole('status')).toHaveText('No pages found.');
  await search.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Documentation navigation', exact: true });
  await expect(drawer.getByRole('button', { name: 'Reference', exact: true })).toHaveAttribute('aria-expanded', 'true');
  const workflow = drawer.getByRole('button', { name: 'Project workflow', exact: true });
  await expect(workflow).toHaveAttribute('aria-expanded', 'false');
  expect((await workflow.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await drawer.getByRole('link', { name: 'Configuration', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Configuration', exact: true })).toBeVisible();
});

test('gallery exposes a complete example without replacing the existing layouts', async ({ page, request }) => {
  await page.goto('/docs/blocks/sidebar');
  await expect(page.locator('[data-block-example]')).toHaveCount(15);
  const example = page.locator('[data-block-example="collapsible-submenus"]');
  await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/collapsible-submenus');
  const code = example.locator('[data-code-full] code');
  await expect(code).toContainText('collapsible: true');
  await expect(code).toContainText('Sidebar.CollapsibleContent');
  await expect(code).toContainText('<style>');
  await expect(code).not.toContainText('style src=');
  expect(await (await request.get('/docs/blocks/sidebar.md')).text()).toContain('Collapsible Submenus');
});
