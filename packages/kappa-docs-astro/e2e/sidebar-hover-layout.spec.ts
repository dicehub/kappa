import { expect, test, type Locator, type Page } from "@playwright/test";

const demo = (page: Page) => page.locator('[data-sidebar-demo="hover-reveal"]');
async function readable(root: Locator) {
  const article = root.locator('.sidebar-hover-demo__article');
  await expect.poll(() => article.evaluate(el => ({ width: el.clientWidth, overflow: el.scrollWidth - el.clientWidth })))
    .toEqual({ width: expect.any(Number), overflow: 0 });
  expect(await article.evaluate(el => el.clientWidth)).toBeGreaterThanOrEqual(200);
  expect(await article.evaluate(el => {
    const content = el.closest('.kappa-sidebar-layout__content')!.getBoundingClientRect();
    return [...el.querySelectorAll('button')].every(button => {
      const box = button.getBoundingClientRect();
      return box.left >= content.left && box.right <= content.right;
    });
  })).toBe(true);
}
async function loaded(page: Page, path: string, width: number) {
  await page.setViewportSize({ width, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path);
  await expect.poll(() => demo(page).evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

for (const width of [1440, 1280, 1024, 768, 390]) {
  test(`embedded content stays readable at ${width}px and the maximum sidebar width`, async ({ page }) => {
    await loaded(page, '/docs/components/sidebar#hover-reveal', width);
    const root = demo(page);
    await root.scrollIntoViewIfNeeded();
    await expect(root.locator('.kappa-sidebar-layout')).toHaveAttribute('data-content-alignment', 'available');
    await readable(root);
    const separator = root.getByRole('separator', { name: 'Resize sidebar', exact: true });
    if (width >= 768) {
      await separator.focus();
      await separator.press('End');
      await expect(separator).toHaveAttribute('aria-valuenow', (await separator.getAttribute('aria-valuemax'))!);
      await readable(root);
      await root.getByRole('link', { name: 'Troubleshooting', exact: true }).click();
      await expect(root.getByRole('heading', { name: 'Troubleshooting', exact: true })).toBeVisible();
      await readable(root);
      await separator.focus();
      await separator.press('Home');
      await readable(root);
    } else {
      await expect(separator).toHaveCount(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

for (const width of [1440, 1024, 768]) {
  test(`standalone keeps the screen center and readable content at ${width}px`, async ({ page }) => {
    await loaded(page, '/examples/components/sidebar/hover-reveal', width);
    const root = demo(page);
    await expect(root.locator('.kappa-sidebar-layout')).toHaveAttribute('data-content-alignment', 'shell');
    const separator = root.getByRole('separator', { name: 'Resize sidebar', exact: true });
    for (const key of ['End', 'Home']) {
      await separator.focus();
      await separator.press(key);
      await readable(root);
      const box = (await root.locator('.sidebar-hover-demo__article').boundingBox())!;
      expect(box.x + box.width / 2).toBeCloseTo(width / 2, 0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
