import { expect, test, type Page } from '@playwright/test';

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/floating-submenus');
  await expect.poll(() => page.locator('[data-sidebar-block="floating-submenus"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

test('floating submenus have a wider framed panel, aligned headers, and retained selection', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openExample(page);
  const nav = page.getByRole('navigation', { name: 'Documentation navigation', exact: true });
  await expect(nav).toHaveCSS('width', '304px');
  await expect(nav).toHaveCSS('border-top-width', '1px');
  await expect(nav).toHaveCSS('border-top-left-radius', '10px');
  const bounds = (await nav.boundingBox())!;
  expect(bounds.x).toBe(8);
  expect(bounds.y).toBe(8);
  const header = (await nav.locator('[data-slot="sidebar-header"]').boundingBox())!;
  const toolbar = (await page.locator('.kappa-sidebar-layout__toolbar').boundingBox())!;
  expect(header.y + header.height).toBeCloseTo(toolbar.y + toolbar.height, 2);
  await nav.getByRole('link', { name: 'Installation', exact: true }).click();
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await expect(nav).toBeHidden();
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).press('Enter');
  await expect(nav.getByRole('link', { name: 'Installation', exact: true })).toHaveAttribute('aria-current', 'page');
  const light = await nav.evaluate(node => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => {
    document.documentElement.dataset.mode = 'dark';
    document.documentElement.dataset.kappaTheme = 'dark';
  });
  await expect(nav).not.toHaveCSS('background-color', light);
});

test('floating submenus use the unframed full-screen mobile drawer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Documentation navigation', exact: true });
  await expect(drawer).toHaveCSS('width', '390px');
  await expect(drawer).toHaveCSS('height', '844px');
  await expect.poll(async () => {
    const bounds = (await drawer.boundingBox())!;
    return { x: bounds.x, y: bounds.y };
  }).toEqual({ x: 0, y: 0 });
  await drawer.getByRole('link', { name: 'Review results', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Review results', exact: true })).toBeVisible();
});

test('floating submenu source and the original floating example remain available', async ({ page }) => {
  await page.goto('/docs/blocks/sidebar');
  const example = page.locator('[data-block-example="floating-submenus"]');
  await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/floating-submenus');
  await expect(example.locator('[data-code-full] code')).toContainText('floating: true');
  await expect(example.locator('[data-code-full] code')).toContainText('<style>');
  await expect(page.locator('[data-block-example="floating"]')).toHaveCount(1);
  await expect(page.locator('[data-block-example="submenus"]')).toHaveCount(1);
});
