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
async function geometry(root: Locator) {
  return root.locator('.sidebar-hover-demo__article').evaluate(el => {
    const article = el.getBoundingClientRect();
    const content = el.closest('.kappa-sidebar-layout__content')!.getBoundingClientRect();
    const shell = el.closest('.kappa-sidebar-layout')!.getBoundingClientRect();
    return {
      x: article.x,
      width: article.width,
      center: article.x + article.width / 2,
      shellCenter: shell.x + shell.width / 2,
      oppositeSpace: content.right - article.right - (article.left - content.left),
    };
  });
}
async function resize(root: Locator, key: 'Home' | 'End') {
  const separator = root.getByRole('separator', { name: 'Resize sidebar', exact: true });
  await separator.focus();
  await separator.press(key);
  await expect.poll(() => separator.evaluate((node, key) =>
    node.getAttribute('aria-valuenow') === node.getAttribute(key === 'End' ? 'aria-valuemax' : 'aria-valuemin'), key)).toBe(true);
  await readable(root);
}

for (const width of [1920, 1440, 1280, 1024, 768, 390]) {
  test(`embedded content stays readable at ${width}px and the maximum sidebar width`, async ({ page }) => {
    await loaded(page, '/docs/components/sidebar#hover-reveal', width);
    const root = demo(page);
    await root.scrollIntoViewIfNeeded();
    const shell = root.locator('.kappa-sidebar-layout');
    await expect(shell).toHaveAttribute('data-content-alignment', 'shell');
    await readable(root);
    const separator = root.getByRole('separator', { name: 'Resize sidebar', exact: true });
    if (width >= 768) {
      await expect(shell).not.toHaveAttribute('data-mobile');
      await resize(root, 'End');
      await root.getByRole('link', { name: 'Troubleshooting', exact: true }).click();
      await expect(root.getByRole('heading', { name: 'Troubleshooting', exact: true })).toBeVisible();
      await resize(root, 'Home');
    } else {
      await expect(shell).toHaveAttribute('data-mobile');
      await expect(separator).toHaveCount(0);
      const trigger = root.locator('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]');
      const drawer = page.getByRole('dialog', { name: 'Hover navigation', exact: true });
      const before = await geometry(root);
      await trigger.click();
      await expect(drawer).toBeVisible();
      expect(await geometry(root)).toMatchObject({ x: before.x, width: before.width });
      await drawer.getByRole('link', { name: 'Troubleshooting', exact: true }).click();
      await expect(drawer).toBeHidden();
      await expect(root.getByRole('heading', { name: 'Troubleshooting', exact: true })).toBeVisible();
      await readable(root);
      await trigger.click();
      await expect(drawer).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(drawer).toBeHidden();
      await expect(trigger).toBeFocused();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

test('standalone releases opposite space before narrowing the page', async ({ page }) => {
  await loaded(page, '/examples/components/sidebar/hover-reveal', 1920);
  const root = demo(page);
  await resize(root, 'End');
  const roomy = await geometry(root);
  expect(roomy.center).toBeCloseTo(roomy.shellCenter, 0);
  expect(roomy.width).toBe(672);
  expect(roomy.oppositeSpace).toBeGreaterThan(500);
  await resize(root, 'Home');
  expect((await geometry(root)).center).toBeCloseTo(roomy.shellCenter, 0);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await resize(root, 'End');
  const constrained = await geometry(root);
  expect(constrained.width).toBe(roomy.width);
  expect(constrained.oppositeSpace).toBeGreaterThan(0);
  expect(constrained.oppositeSpace).toBeLessThan(roomy.oppositeSpace);

  for (const width of [1024, 768]) {
    await page.setViewportSize({ width, height: 1000 });
    await resize(root, 'End');
    const narrow = await geometry(root);
    expect(narrow.width).toBeLessThan(roomy.width);
    expect(Math.abs(narrow.oppositeSpace)).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
});
