import { expect, test, type Page } from '@playwright/test';

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/inset-navigation');
  await expect.poll(() => page.locator('[data-sidebar-block="inset-navigation"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

test('profile trigger and menu show the portrait, identity, and grouped local actions', async ({ page }) => {
  await openExample(page);
  const trigger = page.getByRole('button', { name: 'Profile: Ros.Space', exact: true });
  expect((await trigger.boundingBox())!.height).toBe(48);
  const avatar = trigger.locator('[data-slot="avatar"]');
  await expect(avatar).toHaveCSS('width', '32px');
  await expect(avatar).toHaveCSS('border-radius', '8px');
  await expect(avatar.locator('img')).toBeVisible();
  await expect(avatar.locator('img')).toHaveAttribute('src', '/avatars/ros-space-astronaut.webp');
  const search = page.getByRole('button', { name: 'Quick search …', exact: true });
  expect(await search.evaluate(node => {
    const probe = document.createElement('span');
    probe.style.backgroundColor = 'var(--kappa-control)';
    node.append(probe);
    const solid = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return getComputedStyle(node).backgroundColor !== solid;
  })).toBe(true);
  await trigger.press('Enter');
  const menu = page.getByRole('menu', { name: 'Profile: Ros.Space', exact: true });
  await expect(menu.locator('.sidebar-block-demo__profile-summary')).toContainText('ros@example.com');
  for (const name of ['Upgrade to Pro', 'Account', 'Billing', 'Notifications', 'Preferences', 'Switch profile', 'Log out']) await expect(menu.getByRole('menuitem', { name, exact: true })).toBeVisible();
  await menu.getByRole('menuitem', { name: 'Billing', exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Billing', exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('No account, payment, notification, or session is changed.');
});

test('profile submenu switches accounts and the icon rail keeps a 32px portrait', async ({ page }) => {
  await openExample(page);
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  const trigger = page.getByRole('button', { name: 'Profile: Ros.Space', exact: true });
  await expect(trigger).toHaveCSS('height', '32px');
  await trigger.click();
  await page.getByRole('menuitem', { name: 'Switch profile', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true }).click();
  const next = page.getByRole('button', { name: 'Profile: Jordan Lee', exact: true });
  await expect(next).toBeFocused();
  await expect(next.locator('img')).toHaveAttribute('src', '/avatars/mei-chen.webp');
  await next.click();
  await page.keyboard.press('Escape');
  await expect(next).toBeFocused();
});

test('mobile profile submenu stays in the drawer and account selection restores the opener', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Inset application navigation', exact: true });
  const trigger = drawer.getByRole('button', { name: 'Profile: Ros.Space', exact: true });
  await trigger.click({ position: { x: 16, y: 16 } });
  await drawer.getByRole('menuitem', { name: 'Switch profile', exact: true }).click();
  await drawer.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true }).click();
  const next = drawer.getByRole('button', { name: 'Profile: Jordan Lee', exact: true });
  await expect(next).toBeFocused();
  await next.click({ position: { x: 16, y: 16 } });
  await drawer.getByRole('menuitem', { name: 'Log out', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Log out', exact: true })).toBeVisible();
});
