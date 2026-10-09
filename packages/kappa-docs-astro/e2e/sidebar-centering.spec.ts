import { expect, test, type Page } from "@playwright/test";

const shell = (page: Page) => page.locator('.centering-fixture__shell');
const article = (page: Page) => page.locator('.centering-fixture__article');
const toggle = (page: Page) => shell(page).locator('[data-slot="sidebar-trigger"]');
async function offset(page: Page) {
  return article(page).evaluate(node => {
    const page = node.getBoundingClientRect();
    const shell = node.closest('.kappa-sidebar-layout')!.getBoundingClientRect();
    return page.x + page.width / 2 - shell.x - shell.width / 2;
  });
}
async function centered(page: Page) {
  await expect.poll(() => offset(page)).toBeCloseTo(0, 0);
  expect(await article(page).evaluate(node => node.getBoundingClientRect().width)).toBeGreaterThan(200);
}
async function ready(page: Page, query = '') {
  await page.goto(`/examples/components/sidebar-layout/centering${query}`);
  await expect(page.locator('.centering-fixture')).toHaveAttribute('data-ready', 'true');
  await expect(article(page)).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const variant of ['workspace', 'rail', 'inset', 'floating', 'split', 'header']) {
  test(`${variant} centers through resizing, rail collapse, and placement changes`, async ({ page }) => {
    await ready(page, `?variant=${variant}`);
    await centered(page);
    for (const width of [180, 400]) {
      await page.getByRole('button', { name: `${width}px`, exact: true }).click();
      await expect(shell(page).locator('.kappa-sidebar__shell')).toHaveCSS('width', `${width}px`);
      await centered(page);
    }
    const separator = page.getByRole('separator', { name: 'Resize sidebar' });
    const bounds = (await separator.boundingBox())!;
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + 100);
    await page.mouse.down();
    await page.mouse.move(bounds.x + bounds.width / 2 - 60, bounds.y + 100, { steps: 6 });
    await centered(page);
    await page.mouse.up();
    await centered(page);
    await toggle(page).click();
    await expect(shell(page)).toHaveAttribute('data-state', 'collapsed');
    await centered(page);
    await page.getByRole('button', { name: 'Change side' }).click();
    await centered(page);
    await toggle(page).press('Enter');
    await centered(page);
  });
}

for (const variant of ['workspace', 'inset', 'floating']) {
  test(`${variant} offcanvas collapse balances spacing with end placement and RTL`, async ({ page }) => {
    await ready(page, `?variant=${variant}&collapsible=offcanvas&side=end&rtl`);
    await centered(page);
    await toggle(page).click();
    await expect(shell(page).locator('.kappa-sidebar__shell')).toHaveCSS('width', '0px');
    await centered(page);
    await toggle(page).click();
    await centered(page);
  });
}

test('CSS sidebar lengths and non-collapsible navigation remain centered', async ({ page }) => {
  await ready(page, '?css-width&collapsible=none');
  await expect(shell(page).locator('.kappa-sidebar__shell')).toHaveCSS('width', '320px');
  await centered(page);
  await expect(toggle(page)).toBeDisabled();
});

test('peeking keeps only the rail reservation', async ({ page }) => {
  await ready(page);
  await toggle(page).click();
  await centered(page);
  const before = await article(page).boundingBox();
  await page.getByRole('button', { name: 'Projects', exact: true }).hover();
  await expect(shell(page)).toHaveAttribute('data-state', 'peeking');
  await expect(shell(page).locator('.kappa-sidebar__shell')).toHaveCSS('width', '52px');
  await centered(page);
  expect(await article(page).boundingBox()).toEqual(before);
});

test('embedded shells and changing scrollbar visibility preserve the center', async ({ page }) => {
  await ready(page);
  await page.locator('.centering-fixture').evaluate(node => {
    const element = node as HTMLElement;
    element.style.paddingInline = '0';
    element.style.marginInlineStart = '72px';
    element.style.width = '1100px';
  });
  await centered(page);
  const scroller = shell(page).locator('.kappa-sidebar-layout__content');
  await expect(scroller).toHaveCSS('scrollbar-gutter', 'stable both-edges');
  const toolbar = shell(page).locator('.kappa-sidebar-layout__toolbar');
  const before = await toolbar.boundingBox();
  await page.getByRole('button', { name: 'Toggle long page' }).click();
  await expect(article(page).locator('p')).toHaveCount(40);
  await expect.poll(() => scroller.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true);
  await centered(page);
  await scroller.evaluate(node => { node.scrollTop = node.scrollHeight; });
  expect(await scroller.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  expect((await toolbar.boundingBox())!.y).toBe(before!.y);
  await centered(page);
  await page.getByRole('button', { name: 'Toggle long page' }).click();
  await centered(page);
});

test('available alignment retains the space beside navigation', async ({ page }) => {
  await ready(page, '?available');
  await expect.poll(() => offset(page)).toBeCloseTo(130, 0);
  await expect(shell(page)).not.toHaveAttribute('content-alignment');
  await expect(shell(page)).not.toHaveAttribute('contentalignment');
});

test('published styles honor reduced motion without docs overrides', async ({ page }) => {
  await ready(page);
  const durations = () => shell(page).locator('.kappa-sidebar-layout__content-frame').evaluate(node =>
    ['::before', '::after'].map(part => getComputedStyle(node, part).transitionDuration));
  expect(await durations()).toEqual(['0s', '0s']);
  await toggle(page).click();
  await centered(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  expect(await durations()).toEqual(['0.16s', '0.16s']);
});

for (const mode of ['light', 'dark']) {
  test(`${mode} mobile drawer and desktop return stay centered without overflow`, async ({ page }) => {
    await ready(page, '?variant=floating');
    await page.evaluate(mode => { document.documentElement.dataset.kappaTheme = mode; }, mode);
    await page.getByRole('button', { name: '400px', exact: true }).click();
    await centered(page);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const width of [999, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await expect(shell(page)).toHaveAttribute('data-mobile', '');
      await centered(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await toggle(page).click();
    const drawer = page.getByRole('dialog', { name: 'Centering navigation', exact: true });
    await expect(drawer).toBeVisible();
    await centered(page);
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(toggle(page)).toBeFocused();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(shell(page)).not.toHaveAttribute('data-mobile');
    await expect(shell(page).locator('.kappa-sidebar__shell')).toHaveCSS('width', '400px');
    await centered(page);
  });
}

test('animated collapse stays centered on each frame', async ({ page }) => {
  await ready(page, '?variant=inset&collapsible=offcanvas');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await centered(page);
  const offsets = await shell(page).evaluate(async node => {
    const values: number[] = [];
    const article = node.querySelector('.centering-fixture__article')!;
    (node.querySelector('[data-slot="sidebar-trigger"]') as HTMLElement).click();
    await new Promise<void>(resolve => {
      const started = performance.now();
      function frame(now: number) {
        const outer = node.getBoundingClientRect();
        const inner = article.getBoundingClientRect();
        values.push(inner.x + inner.width / 2 - outer.x - outer.width / 2);
        if (now - started < 240) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
    return values;
  });
  expect(offsets.length).toBeGreaterThan(3);
  expect(Math.max(...offsets.map(Math.abs))).toBeLessThan(1);
  await centered(page);
});

for (const variant of ['grouped', 'collapsible-sections', 'submenus', 'floating-submenus', 'collapsible-submenus', 'dropdown-submenus', 'workspace-pages']) {
  test(`${variant} full-page reading example uses shell centering and its drawer breakpoint`, async ({ page }) => {
    await page.goto(`/examples/sidebar/${variant}`);
    const layout = page.locator('.kappa-sidebar-layout');
    await expect.poll(() => layout.evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
    await expect(layout).toHaveAttribute('data-content-alignment', 'shell');
    const article = layout.locator('.sidebar-grouped-demo__article, .sidebar-pages-demo__page');
    await expect.poll(() => article.evaluate(node => {
      const rect = node.getBoundingClientRect();
      return rect.x + rect.width / 2 - innerWidth / 2;
    })).toBeCloseTo(0, 0);
    await page.setViewportSize({ width: 1199, height: 900 });
    await expect(layout).toHaveAttribute('data-mobile', '');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
