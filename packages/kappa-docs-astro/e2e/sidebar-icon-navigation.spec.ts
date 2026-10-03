import { expect, test, type Page } from '@playwright/test';

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/collapsible-icons');
  await expect.poll(() => page.locator('[data-sidebar-block="collapsible-icons"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

test('icon navigation preserves groups, hides child tab stops, and expands from a rail icon', async ({ page }) => {
  await openExample(page);
  const nav = page.getByRole('navigation', { name: 'Icon application navigation', exact: true });
  const workspace = nav.getByRole('button', { name: 'Workspace', exact: true });
  const mesh = nav.getByRole('button', { name: 'Mesh', exact: true });
  await expect(workspace).toHaveAttribute('aria-expanded', 'true');
  await expect(workspace).not.toHaveAttribute('aria-current', 'page');
  await expect(mesh).toHaveAttribute('aria-expanded', 'false');
  await mesh.focus();
  await mesh.press('Enter');
  await expect(mesh).toHaveAttribute('aria-expanded', 'true');
  await nav.getByRole('link', { name: 'Refinement', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Refinement', exact: true })).toBeVisible();
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await expect(nav).toHaveAttribute('data-state', 'collapsed');
  await expect(nav.getByRole('link', { name: 'Refinement', exact: true })).toBeHidden();
  await mesh.focus();
  await expect(page.getByRole('tooltip', { name: 'Mesh', exact: true })).toBeVisible();
  await mesh.press('Tab');
  await expect(nav.getByRole('button', { name: 'Settings', exact: true })).toBeFocused();
  await mesh.click();
  await expect(nav).toHaveAttribute('data-state', 'expanded');
  await expect(mesh).toHaveAttribute('aria-expanded', 'true');
  await expect(workspace).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('link', { name: 'Refinement', exact: true })).toBeVisible();
});

test('namespace, profile, and search remain usable in the icon rail', async ({ page }) => {
  await openExample(page);
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await page.getByRole('button', { name: 'Namespace: Engineering', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Namespace: Research', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Profile: Ros.Space', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Switch profile', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Profile: Jordan Lee', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Quick search', exact: false }).click();
  const search = page.getByRole('dialog', { name: 'Search navigation', exact: true });
  await search.getByPlaceholder('Search navigation…').fill('Integrations');
  await page.keyboard.press('Enter');
  await expect(search).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Integrations', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Icon application navigation', exact: true }).getByRole('button', { name: 'Settings', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Integrations', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('mobile retains group and account state and restores focus after selection', async ({ page }) => {
  await openExample(page);
  await page.getByRole('button', { name: 'Mesh', exact: true }).click();
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Icon application navigation', exact: true });
  const mesh = drawer.getByRole('button', { name: 'Mesh', exact: true });
  await expect(mesh).toHaveAttribute('aria-expanded', 'true');
  expect((await mesh.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await drawer.getByRole('button', { name: 'Namespace: Engineering', exact: true }).click();
  await drawer.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(drawer).toBeVisible();
  await drawer.getByRole('link', { name: 'Simulation', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Simulation', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Namespace: Research', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Simulation', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('gallery retains the old rail and publishes complete source', async ({ page, request }) => {
  await page.goto('/docs/blocks/sidebar');
  await expect(page.locator('[data-block-example]')).toHaveCount(15);
  await expect(page.locator('[data-block-example="rail"]')).toHaveCount(1);
  const example = page.locator('[data-block-example="collapsible-icons"]');
  await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/collapsible-icons');
  const code = example.locator('[data-code-full] code');
  await expect(code).toContainText('iconNavigation: true');
  await expect(code).toContainText('variant: "workspace", standalone: true');
  await expect(code).toContainText('<style>');
  await expect(code).not.toContainText('style src=');
  expect(await (await request.get('/docs/blocks/sidebar.md')).text()).toContain('Collapsible Icon Navigation');
});
