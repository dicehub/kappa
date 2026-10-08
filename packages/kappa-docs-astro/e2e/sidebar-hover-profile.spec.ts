import { expect, test } from '@playwright/test';

test.use({ hasTouch: true });

for (const width of [320, 390]) {
  for (const rtl of [false, true]) {
    test(`mobile Hover Reveal profiles fit readable names and right checks, width=${width}, rtl=${rtl}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width, height: 740 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/examples/components/sidebar/hover-reveal');
      const root = page.locator('[data-sidebar-demo="hover-reveal"]');
      await expect.poll(() => root.evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
      if (rtl) await root.getByRole('button', { name: 'Use RTL', exact: true }).tap();
      await page.locator('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]').tap();
      const drawer = page.getByRole('dialog', { name: 'Hover navigation', exact: true });
      await drawer.getByRole('button', { name: 'Casey Rivera', exact: true }).tap();
      const menu = page.getByRole('menu', { name: 'Casey Rivera', exact: true });
      await menu.getByRole('menuitem', { name: 'Switch profile', exact: true }).tap();
      const profiles = page.getByRole('menu', { name: 'Switch profile', exact: true });
      await expect(profiles).toBeVisible();
      await expect.poll(() => profiles.evaluate(el => {
        const box = el.getBoundingClientRect();
        const parent = el.closest('[role="dialog"]')!.getBoundingClientRect();
        return box.left >= parent.left && box.right <= parent.right && box.top >= 0 && box.bottom <= innerHeight;
      })).toBe(true);
      for (const name of ['Casey Rivera', 'Jordan Lee']) {
        const item = profiles.getByRole('menuitemradio', { name, exact: true });
        expect(await item.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      }
      const selected = profiles.getByRole('menuitemradio', { name: 'Casey Rivera', exact: true });
      const check = selected.locator('[data-slot="dropdown-radio-item-indicator"]');
      await expect(check).toBeVisible();
      const row = (await selected.boundingBox())!;
      const indicator = (await check.boundingBox())!;
      expect(rtl ? indicator.x - row.x : row.x + row.width - indicator.x - indicator.width).toBeCloseTo(8, 0);
      const text = await selected.evaluate(el => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          if (node.textContent?.trim() !== 'Casey Rivera') continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          const box = range.getBoundingClientRect();
          return { left: box.left, right: box.right };
        }
        throw new Error('Missing profile name');
      });
      if (rtl) expect(text.left).toBeGreaterThanOrEqual(indicator.x + indicator.width + 4);
      else expect(text.right).toBeLessThanOrEqual(indicator.x - 4);
      await profiles.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true }).tap();
      const trigger = drawer.getByRole('button', { name: 'Jordan Lee', exact: true });
      await expect(profiles).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.tap();
      await page.getByRole('menu', { name: 'Jordan Lee', exact: true }).getByRole('menuitem', { name: 'Switch profile', exact: true }).tap();
      await expect(page.getByRole('menu', { name: 'Switch profile', exact: true }).getByRole('menuitemradio', { name: 'Jordan Lee', exact: true })).toHaveAttribute('aria-checked', 'true');
      await page.keyboard.press('Escape');
      await expect(page.getByRole('menu', { name: 'Jordan Lee', exact: true })).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(drawer).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
}
