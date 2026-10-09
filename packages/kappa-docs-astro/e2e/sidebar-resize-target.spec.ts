import { expect, test } from '@playwright/test';

for (const rtl of [false, true]) {
  for (const end of [false, true]) {
    test(`resize starts 5px into content with a fixed border line, rtl=${rtl}, end=${end}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`/examples/components/sidebar-layout/centering?collapsible=offcanvas${rtl ? '&rtl' : ''}${end ? '&side=end' : ''}`);
      await expect(page.locator('.centering-fixture')).toHaveAttribute('data-ready', 'true');
      const nav = page.getByRole('navigation', { name: 'Centering navigation', exact: true });
      const handle = page.getByRole('separator', { name: 'Resize sidebar', exact: true });
      await page.mouse.move(700, 900);
      const right = rtl !== end;
      const box = (await nav.boundingBox())!;
      const edge = right ? box.x : box.x + box.width;
      const sign = right ? -1 : 1;
      const x = edge + sign * 5;
      const y = box.y + 120;
      const line = () => handle.evaluate(el => {
        const style = getComputedStyle(el, '::after');
        return { center: el.getBoundingClientRect().left + Number.parseFloat(style.left) + Number.parseFloat(style.width) / 2,
          width: Number.parseFloat(style.width) };
      });
      const before = await line();
      expect(before.width).toBe(1);
      expect(before.center).toBeCloseTo(edge - sign * 0.5, 1);
      await page.mouse.move(x, y);
      expect(await handle.evaluate((el, point) => el === document.elementFromPoint(point.x, point.y), { x, y })).toBe(true);
      await expect(handle).toHaveCSS('cursor', 'col-resize');
      await expect.poll(async () => (await line()).width).toBe(3);
      expect((await line()).center).toBeCloseTo(before.center, 1);
      expect(await handle.evaluate((el, point) => el === document.elementFromPoint(point.x, point.y), { x: edge - sign * 5, y })).toBe(false);
      await page.mouse.down();
      await page.mouse.move(x + sign * 40, y, { steps: 6 });
      await page.mouse.up();
      await expect.poll(async () => (await nav.boundingBox())!.width).toBeCloseTo(box.width + 40, 0);
      await expect(handle).toHaveAttribute('aria-valuenow', '300');
    });
  }
}
