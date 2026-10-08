import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/docs/components/sidebar');
});

for (const name of ['preview', 'namespace-selector']) {
  test(`${name} namespace menu opens below in expanded and collapsed navigation`, async ({ page }) => {
    const root = page.locator(`[data-sidebar-demo="${name}"]`);
    await expect.poll(() => root.evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
    await root.scrollIntoViewIfNeeded();
    for (const collapsed of [false, true]) {
      if (collapsed) await root.locator('.sidebar-demo__topbar [data-slot="sidebar-trigger"]').click();
      const trigger = root.getByRole('button', { name: 'Namespace: Engineering', exact: true });
      await trigger.click();
      const menu = page.getByRole('menu', { name: 'Namespace: Engineering', exact: true });
      await expect(menu).toHaveAttribute('data-side', 'bottom');
      const button = (await trigger.boundingBox())!;
      const popup = (await menu.boundingBox())!;
      expect(popup.y).toBeGreaterThanOrEqual(button.y + button.height);
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
    }
  });
}

for (const name of ['preview', 'namespace-selector', 'profile-selector']) {
  test(`${name} profile menu opens above and the active checkmark is on the right`, async ({ page }) => {
    const root = page.locator(`[data-sidebar-demo="${name}"]`);
    await expect.poll(() => root.evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
    await root.scrollIntoViewIfNeeded();
    let trigger = root.getByRole('button', { name: 'Profile: Casey Rivera', exact: true });
    await trigger.click();
    let menu = page.getByRole('menu', { name: 'Profile: Casey Rivera', exact: true });
    await expect(menu).toHaveAttribute('data-side', 'top');
    const button = (await trigger.boundingBox())!;
    const popup = (await menu.boundingBox())!;
    expect(popup.y + popup.height).toBeLessThanOrEqual(button.y);
    async function selected(name: string) {
      const item = menu.getByRole('menuitemradio', { name, exact: true });
      await expect(item).toHaveAttribute('aria-checked', 'true');
      const indicator = item.locator('[data-slot="dropdown-radio-item-indicator"]');
      await expect(indicator).toBeVisible();
      await expect(indicator.locator('svg path')).toHaveAttribute('d', 'm3 8.25 3 3 7-7');
      const bounds = (await item.boundingBox())!;
      const check = (await indicator.boundingBox())!;
      expect(bounds.x + bounds.width - check.x - check.width).toBeCloseTo(8, 0);
    }
    await selected('Casey Rivera');
    await expect(menu.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true }).locator('[data-slot="dropdown-radio-item-indicator"]')).toBeHidden();
    const menuId = (await menu.getAttribute('id'))!;
    await menu.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true }).click();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    trigger = root.getByRole('button', { name: 'Profile: Jordan Lee', exact: true });
    await expect(trigger).toBeFocused();
    const closed = page.locator(`[id="${menuId}"]`);
    await expect(closed).toHaveAttribute('inert', '');
    await closed.evaluate(el => new Promise<void>(resolve => requestAnimationFrame(() => {
      (el as HTMLElement).focus();
      resolve();
    })));
    await expect(trigger).toBeFocused();
    await trigger.click();
    menu = page.getByRole('menu', { name: 'Profile: Jordan Lee', exact: true });
    await selected('Jordan Lee');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
}
