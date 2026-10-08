import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  test(`neutral hover and popup states stay visible on control and canvas surfaces in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/docs/components/button');
    await page.evaluate(theme => { document.documentElement.dataset.kappaTheme = theme; }, theme);
    const border = theme === 'light' ? 'rgb(199, 205, 214)' : 'rgb(82, 82, 91)';
    const fill = theme === 'light' ? 'rgb(250, 250, 250)' : 'rgb(38, 38, 38)';
    for (const surface of ['control', 'canvas']) {
      for (const variant of ['secondary', 'outline', 'ghost']) {
        const root = page.locator(`[data-button-demo="${variant}"]`);
        await root.scrollIntoViewIfNeeded();
        await root.evaluate((el, surface) => { (el as HTMLElement).style.background = `var(--kappa-${surface})`; }, surface);
        const button = root.locator('.kappa-button');
        await page.mouse.move(0, 0);
        const restingBorder = await button.evaluate(el => getComputedStyle(el).borderColor);
        await button.hover();
        await expect(button).toHaveCSS('background-color', fill);
        await expect(button).toHaveCSS('border-color', border);
        expect(border).not.toBe(restingBorder);
        await button.evaluate(el => {
          el.setAttribute('aria-expanded', 'true');
          el.setAttribute('aria-haspopup', 'menu');
        });
        await page.mouse.move(0, 0);
        await expect(button).toHaveCSS('border-color', border);
        await expect(button).toHaveCSS('background-color', fill);
        await button.evaluate(el => el.setAttribute('aria-haspopup', 'false'));
        await expect(button).toHaveCSS('border-color', restingBorder);
        await button.evaluate(el => {
          el.removeAttribute('aria-expanded');
          el.removeAttribute('aria-haspopup');
          el.setAttribute('aria-invalid', 'true');
        });
        const invalidBorder = await button.evaluate(el => getComputedStyle(el).borderColor);
        expect(invalidBorder).not.toBe(border);
        expect(invalidBorder).not.toBe('rgba(0, 0, 0, 0)');
        await button.hover();
        await expect(button).toHaveCSS('border-color', invalidBorder);
        await button.evaluate(el => {
          el.setAttribute('aria-expanded', 'true');
          el.setAttribute('aria-haspopup', 'menu');
        });
        await page.mouse.move(0, 0);
        await expect(button).toHaveCSS('border-color', invalidBorder);
        await button.evaluate(el => {
          el.removeAttribute('aria-expanded');
          el.removeAttribute('aria-haspopup');
          el.removeAttribute('aria-invalid');
          (el as HTMLButtonElement).disabled = true;
        });
        const box = (await button.boundingBox())!;
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await expect(button).toHaveCSS('border-color', restingBorder);
        await button.evaluate(el => { (el as HTMLButtonElement).disabled = false; });
      }
    }
  });
}

test('File Browser refresh has visible hover feedback on the light canvas', async ({ page }) => {
  await page.goto('/examples/file-browser/async');
  await expect.poll(() => page.locator('.file-browser-demo').evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
  await page.evaluate(() => { document.documentElement.dataset.kappaTheme = 'light'; });
  const button = page.locator('.kappa-file-browser__location .kappa-button');
  await expect(button).toBeEnabled();
  const before = await button.evaluate(el => getComputedStyle(el).borderColor);
  await button.hover();
  await expect(button).toHaveCSS('background-color', 'rgb(250, 250, 250)');
  await expect(button).toHaveCSS('border-color', 'rgb(199, 205, 214)');
  expect(before).not.toBe('rgb(199, 205, 214)');
});
