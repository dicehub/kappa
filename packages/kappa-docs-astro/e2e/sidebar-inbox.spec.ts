import { expect, test, type Page } from '@playwright/test';

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/inbox-navigation');
  await expect.poll(() => page.locator('[data-sidebar-block="inbox-navigation"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

test('inbox folders, search, unread filter, reading panel, and empty states work', async ({ page }) => {
  await openExample(page);
  const messages = page.getByRole('list', { name: 'Messages', exact: true });
  await expect(messages.getByRole('button')).toHaveCount(7);
  await expect(page.getByRole('heading', { name: 'Mesh review is ready', exact: true })).toBeVisible();
  const search = page.getByRole('searchbox', { name: 'Search messages' });
  await search.fill('boundary condition');
  await expect(messages.getByRole('button')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Boundary condition notes', exact: true })).toBeVisible();
  await search.press('Escape');
  await page.getByRole('checkbox', { name: 'Unread', exact: true }).press('Space');
  await expect(page.getByRole('checkbox', { name: 'Unread', exact: true })).toBeChecked();
  await expect(messages.getByRole('button')).toHaveCount(3);
  const message = messages.getByRole('button', { name: /Geometry files uploaded/ });
  await message.focus();
  await message.press('Enter');
  await expect(message).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('heading', { name: 'Geometry files uploaded', exact: true })).toBeVisible();
  await expect(messages.getByRole('button')).toHaveCount(3);
  await search.fill('no-such-message');
  await expect(page.getByText('No messages found.', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'No message selected', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Drafts', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(page.getByRole('checkbox', { name: 'Unread', exact: true })).not.toBeChecked();
  await expect(page.getByRole('heading', { name: 'Next simulation plan', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Sent', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Review notes shared', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Junk', exact: true }).click();
  await expect(page.getByText('No messages found.', { exact: true })).toBeVisible();
});

test('collapse keeps the rail, folder click expands the list, and profile actions are local', async ({ page }) => {
  await openExample(page);
  const nav = page.getByRole('navigation', { name: 'Inbox navigation', exact: true });
  const header = (await page.locator('.sidebar-inbox-demo__list-header').boundingBox())!;
  const toolbar = (await page.locator('.sidebar-inbox-demo__toolbar').boundingBox())!;
  expect(header.y + header.height).toBeCloseTo(toolbar.y + toolbar.height, 2);
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await expect(nav).toHaveCSS('width', '64px');
  await expect(page.getByRole('searchbox', { name: 'Search messages' })).toBeHidden();
  await page.getByRole('button', { name: 'Trash', exact: true }).press('Enter');
  await expect(nav).toHaveAttribute('data-state', 'expanded');
  await expect(page.getByRole('heading', { name: 'Old meeting time', exact: true })).toBeVisible();
  const trigger = page.getByRole('button', { name: 'Profile: Ros.Space', exact: true });
  await trigger.click();
  const menu = page.getByRole('menu', { name: 'Profile: Ros.Space', exact: true });
  await expect(menu).toContainText('ros@example.com');
  await menu.getByRole('menuitem', { name: 'Billing', exact: true }).click();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Billing', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Back to messages', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Old meeting time', exact: true })).toBeVisible();
});

test('mobile shows folders and messages together, preserves filters, and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Inbox navigation', exact: true });
  await expect(drawer).toHaveCSS('width', '390px');
  await expect(drawer).toHaveCSS('height', '844px');
  await drawer.getByRole('searchbox', { name: 'Search messages' }).fill('geometry');
  await drawer.getByRole('button', { name: /Geometry files uploaded/ }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Geometry files uploaded', exact: true })).toBeVisible();
  await toggle.click();
  await expect(drawer.getByRole('searchbox', { name: 'Search messages' })).toHaveValue('geometry');
  await drawer.getByRole('button', { name: 'Profile: Ros.Space', exact: true }).click();
  await drawer.getByRole('menuitem', { name: 'Account', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole('searchbox', { name: 'Search messages' })).toHaveValue('geometry');
});

test('inbox supports both themes, RTL, narrow layouts, and copyable gallery source', async ({ page, request }) => {
  await openExample(page);
  const layout = page.locator('.sidebar-inbox-demo__layout');
  const light = await layout.evaluate(node => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => {
    document.documentElement.dataset.mode = 'dark';
    document.documentElement.dataset.kappaTheme = 'dark';
    document.documentElement.dir = 'rtl';
  });
  await expect(layout).not.toHaveCSS('background-color', light);
  const nav = (await page.getByRole('navigation', { name: 'Inbox navigation', exact: true }).boundingBox())!;
  const reader = (await page.locator('.sidebar-inbox-demo__main').boundingBox())!;
  expect(nav.x).toBeGreaterThan(reader.x);
  await page.setViewportSize({ width: 320, height: 700 });
  await page.getByRole('button', { name: 'Open sidebar', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Inbox navigation', exact: true });
  expect(await drawer.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
  await page.goto('/docs/blocks/sidebar');
  await expect(page.locator('[data-block-example]')).toHaveCount(15);
  const example = page.locator('[data-block-example="inbox-navigation"]');
  await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/inbox-navigation');
  await expect(example.locator('[data-code-full] code')).toContainText('standalone: true');
  await expect(example.locator('[data-code-full] code')).not.toContainText('style src=');
  expect(await (await request.get('/docs/blocks/sidebar.md')).text()).toContain('Inbox Navigation');
});
