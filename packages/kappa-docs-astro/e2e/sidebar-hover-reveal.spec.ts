import { expect, test, type Page, type Locator } from "@playwright/test";

const nav = (page: Page) => page.locator('[data-slot="sidebar"]');
const trigger = (page: Page) => page.locator('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]');
const article = (page: Page) => page.locator('.sidebar-hover-demo__article');
const settle = (locator: Locator) => locator.evaluate(el => Promise.all(el.getAnimations().map(a => a.finished.catch(() => {}))));
async function ownership(page: Page) {
  await page.goto('/examples/components/sidebar/ownership');
  await expect.poll(() => page.locator('astro-island').evaluate(el => el.hasAttribute('ssr'))).toBe(false);
}
async function published(page: Page, query = '') {
  await page.goto(`/examples/components/sidebar-layout/centering?collapsible=offcanvas${query}`);
  await expect(page.locator('.centering-fixture')).toHaveAttribute('data-ready', 'true');
}
async function collapse(page: Page) {
  await nav(page).locator('[data-slot="sidebar-header"]').hover();
  await nav(page).getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await article(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await settle(nav(page));
}
async function reveal(page: Page) {
  await trigger(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await settle(nav(page));
}
async function center(page: Page) {
  const box = await article(page).boundingBox();
  return box!.x + box!.width / 2;
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/examples/components/sidebar/hover-reveal');
  await expect.poll(() => page.locator('[data-sidebar-demo="hover-reveal"]').evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
  await expect(trigger(page)).toHaveAttribute('data-peek', '');
});

test('hover floats below the header, crosses its gap, and pins without moving the reading center', async ({ page }) => {
  expect(await center(page)).toBe(720);
  await collapse(page);
  const before = await article(page).boundingBox();
  await page.mouse.move(2, 400);
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await page.mouse.move(1, 20);
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await settle(nav(page));
  expect(await article(page).boundingBox()).toEqual(before);
  await expect(page.locator('.kappa-sidebar__shell')).toHaveCSS('width', '0px');
  await expect(nav(page)).not.toHaveAttribute('inert');
  await expect(nav(page)).not.toHaveAttribute('aria-hidden');
  await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
  await expect(article(page).getByRole('status')).toContainText('1 open requests');
  const box = await nav(page).boundingBox();
  expect(box).toMatchObject({ x: 0, y: 59, width: 260, height: 809 });
  await page.mouse.move(120, 50);
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await nav(page).getByRole('link', { name: 'Create a project', exact: true }).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await article(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await expect(nav(page)).toHaveAttribute('inert');
  await trigger(page).click();
  await expect(nav(page)).toHaveAttribute('data-state', 'expanded');
  await article(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'expanded');
  expect(await center(page)).toBe(720);
});

test('keyboard pinning, focus retention and Escape preserve page focus', async ({ page }) => {
  await collapse(page);
  await trigger(page).focus();
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await page.keyboard.press('Enter');
  await expect(nav(page)).toHaveAttribute('data-state', 'expanded');
  await collapse(page);
  const outside = article(page).getByRole('button', { name: 'Lock state', exact: true });
  await outside.focus();
  await reveal(page);
  await page.keyboard.press('Escape');
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await expect(outside).toBeFocused();
  await article(page).hover();
  await reveal(page);
  await nav(page).getByRole('link', { name: 'Create a project', exact: true }).focus();
  await article(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await page.keyboard.press('Escape');
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await expect(trigger(page)).toBeFocused();
  await expect(nav(page).getByRole('link')).toHaveCount(0);
});

test('nested portalled menus remain usable and receive Escape first', async ({ page }) => {
  await collapse(page);
  await reveal(page);
  await nav(page).getByRole('button', { name: 'Casey Rivera', exact: true }).click();
  const menu = page.getByRole('menu', { name: 'Casey Rivera', exact: true });
  const subTrigger = menu.getByRole('menuitem', { name: 'Switch profile', exact: true });
  await subTrigger.hover();
  const submenu = page.getByRole('menu', { name: 'Switch profile', exact: true });
  await expect(submenu).toBeVisible();
  const selected = submenu.getByRole('menuitemradio', { name: 'Casey Rivera', exact: true });
  const indicatorInset = await selected.evaluate(row => {
    const indicator = row.querySelector('[data-slot="dropdown-radio-item-indicator"]');
    if (!indicator) throw new Error('Selected profile has no checkmark');
    return row.getBoundingClientRect().right - indicator.getBoundingClientRect().right;
  });
  expect(indicatorInset).toBeCloseTo(8, 0);
  await submenu.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true }).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await page.keyboard.press('Escape');
  await expect(submenu).toBeHidden();
  await expect(menu).toBeHidden();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await page.keyboard.press('Escape');
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await expect(trigger(page)).toBeFocused();
});

test('a controlled parent can reject pinning while hover remains temporary', async ({ page }) => {
  await collapse(page);
  await article(page).getByRole('button', { name: 'Lock state', exact: true }).click();
  await reveal(page);
  await trigger(page).click();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await expect(article(page).getByRole('status')).toContainText('2 open requests');
  await article(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await trigger(page).focus();
  await page.keyboard.press('Enter');
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
});

for (const rtl of [false, true]) {
  for (const end of [false, true]) {
    test(`logical placement and gap, rtl=${rtl}, end=${end}`, async ({ page }) => {
      if (rtl) await article(page).getByRole('button', { name: 'Use RTL', exact: true }).click();
      if (end) await article(page).getByRole('button', { name: 'Change side', exact: true }).click();
      await collapse(page);
      await page.mouse.move(rtl !== end ? 1439 : 1, 20);
      await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
      await settle(nav(page));
      const box = await nav(page).boundingBox();
      expect(box!.x).toBe(rtl !== end ? 1180 : 0);
      expect(box!.y).toBe(59);
      await page.mouse.move(box!.x + 120, 50);
      await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
      expect(await center(page)).toBe(720);
    });
  }
}

test('mobile uses the modal drawer instead of hover reveal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(trigger(page)).not.toHaveAttribute('data-peek');
  await trigger(page).hover();
  const drawer = page.getByRole('dialog', { name: 'Hover navigation', exact: true });
  await expect(drawer).toBeHidden();
  await trigger(page).click();
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: 'Close navigation', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(trigger(page)).toBeFocused();
});

test('slide and fade use 200ms ease, reverse smoothly, and keep the page stationary', async ({ page }) => {
  await collapse(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const before = await article(page).boundingBox();
  await nav(page).evaluate(el => {
    el.addEventListener('transitionrun', () => el.getAnimations().forEach(a => { a.pause(); a.currentTime = 100; }), { once: true });
  });
  await trigger(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await expect.poll(() => nav(page).evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0);
  const midpoint = await nav(page).evaluate(el => ({
    opacity: Number(getComputedStyle(el).opacity),
    duration: getComputedStyle(el).transitionDuration,
    ease: getComputedStyle(el).transitionTimingFunction,
    x: el.getBoundingClientRect().x,
  }));
  expect(midpoint.duration).toBe('0.2s, 0.2s');
  expect(midpoint.ease).toBe('ease, ease');
  expect(midpoint.opacity).toBeGreaterThan(0);
  expect(midpoint.opacity).toBeLessThan(1);
  expect(midpoint.x).toBeLessThan(0);
  expect(await article(page).boundingBox()).toEqual(before);
  await article(page).hover();
  await expect(nav(page)).toHaveCSS('pointer-events', 'none');
  const exitStart = await nav(page).evaluate(el => el.getBoundingClientRect().x);
  expect(Math.abs(exitStart - midpoint.x)).toBeLessThan(80);
  await settle(nav(page));
  await expect(nav(page)).toHaveCSS('opacity', '0');
  expect(await article(page).boundingBox()).toEqual(before);
});

test('nested Providers keep hover triggers and keyboard dismissal in their own scope', async ({ page }) => {
  await ownership(page);
  const outer = page.locator('#outer-sidebar-nav');
  const inner = page.locator('#inner-sidebar-nav');
  const innerTrigger = page.locator('[data-slot="sidebar-trigger"][aria-controls="inner-sidebar-nav"]');
  await innerTrigger.hover();
  await expect(inner).toHaveAttribute('data-state', 'peeking');
  await expect(outer).toHaveAttribute('data-state', 'collapsed');
  await inner.getByRole('link', { name: 'Inner page' }).focus();
  await page.keyboard.press('Escape');
  await expect(inner).toHaveAttribute('data-state', 'collapsed');
  await expect(innerTrigger).toBeFocused();
  await expect(outer).toHaveAttribute('data-state', 'collapsed');
});

test('published hover styles disable centering motion under reduced motion', async ({ page }) => {
  await published(page);
  const durations = () => page.locator('.kappa-sidebar-layout__content-frame').evaluate(el =>
    ['::before', '::after'].map(part => getComputedStyle(el, part).transitionDuration));
  expect(await durations()).toEqual(['0s', '0s']);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  expect(await durations()).toEqual(['0.2s', '0.2s']);
  await page.locator('.kappa-sidebar-layout').evaluate(el => el.setAttribute('data-resizing', ''));
  expect(await durations()).toEqual(['0s', '0s']);
});

test('a hovered asChild trigger can be disabled or lose peek without pointer movement', async ({ page }) => {
  await ownership(page);
  const inner = page.locator('#inner-sidebar-nav');
  const hoverTrigger = page.getByRole('button', { name: 'Inner toggle', exact: true });
  const outside = page.getByRole('button', { name: 'Outside navigation', exact: true });
  await outside.focus();
  await hoverTrigger.hover();
  await expect(inner).toHaveAttribute('data-state', 'peeking');
  await page.keyboard.press('d');
  await expect(hoverTrigger).toBeDisabled();
  await expect(inner).toHaveAttribute('data-state', 'collapsed');
  await outside.hover();
  await page.keyboard.press('e');
  await hoverTrigger.hover();
  await expect(inner).toHaveAttribute('data-state', 'peeking');
  await page.keyboard.press('p');
  await expect(hoverTrigger).not.toHaveAttribute('data-peek');
  await expect(inner).toHaveAttribute('data-state', 'collapsed');
});

for (const rtl of [false, true]) {
  test(`hidden panels do not widen unclipped layouts, rtl=${rtl}`, async ({ page }) => {
    await published(page, rtl ? '&rtl' : '&side=end');
    const layout = page.locator('.kappa-sidebar-layout');
    await expect(layout).toHaveCSS('overflow-x', 'clip');
    await expect(layout).toHaveCSS('overflow-y', 'visible');
    await trigger(page).click();
    await page.locator('.centering-fixture__article').hover();
    await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
    await settle(nav(page));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1440);
  });
}
