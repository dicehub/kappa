import { expect, test } from '@playwright/test';

for (const motion of ['reduce', 'no-preference'] as const) {
  for (const unmount of [false, true]) {
    for (const mode of ['enabled', 'disabled', 'enable-on-close']) {
      test(`closing Settings preserves focus: ${mode}, unmount=${unmount}, motion=${motion}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: motion });
        const params = new URLSearchParams();
        if (mode !== 'enabled') params.set('disabled', '');
        if (unmount) params.set('unmount', '');
        await page.goto(`/examples/settings/focus?${params}`);
        await expect(page.locator('[data-settings-focus-ready]')).toHaveAttribute('data-settings-focus-ready', 'true');
        const section = page.getByRole('region', { name: 'Draft settings', exact: true });
        const input = section.getByRole('textbox', { name: 'Draft', exact: true });
        const toggle = section.locator('[data-kappa-settings-trigger]');
        await input.focus();
        await expect(input).toBeFocused();
        const action = mode === 'enable-on-close' ? 'Close and enable' : 'Close section';
        await page.getByRole('button', { name: action, exact: true }).evaluate(el => (el as HTMLButtonElement).click());
        await expect(input).toBeHidden();
        const target = mode === 'disabled' ? section.getByRole('heading', { name: 'Draft settings', exact: true }) : toggle;
        await expect(target).toBeFocused();
        await expect(target).toHaveCSS('outline-width', '2px');
        if (mode === 'disabled') await expect(toggle).toBeDisabled();
        else await expect(toggle).toBeEnabled();
      });
    }
  }
}

test('closing Settings preserves focus placed outside by the application', async ({ page }) => {
  await page.goto('/examples/settings/focus?disabled&unmount');
  await expect(page.locator('[data-settings-focus-ready]')).toHaveAttribute('data-settings-focus-ready', 'true');
  const input = page.getByRole('textbox', { name: 'Draft', exact: true });
  await input.focus();
  await page.getByRole('button', { name: 'Close and focus outside', exact: true }).evaluate(el => (el as HTMLButtonElement).click());
  await expect(input).toBeHidden();
  await expect(page.locator('[data-external-focus]')).toBeFocused();
});
