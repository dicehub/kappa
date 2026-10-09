import { expect, test, type Locator, type Page } from '@playwright/test';

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/collapsible-icons');
  await expect.poll(() => page.locator('[data-sidebar-block="collapsible-icons"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

async function selectedProfileCheck(submenu: Locator, name: string) {
  const item = submenu.getByRole('menuitemradio', { name, exact: true });
  await expect(item).toHaveAttribute('aria-checked', 'true');
  await expect(submenu.locator('[data-slot="dropdown-radio-item-indicator"]:not([hidden])')).toHaveCount(1);
  const indicator = item.locator('[data-slot="dropdown-radio-item-indicator"]');
  await expect(indicator.locator('path')).toHaveCount(1);
  const row = (await item.boundingBox())!;
  const check = (await indicator.boundingBox())!;
  expect(row.x + row.width - check.x - check.width).toBeGreaterThanOrEqual(0);
  expect(row.x + row.width - check.x - check.width).toBeLessThanOrEqual(10);
}

test('namespace menu opens below the expanded and collapsed sidebar trigger', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openExample(page);
  for (const collapsed of [false, true]) {
    if (collapsed) await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
    const trigger = page.getByRole('button', { name: 'Namespace: Engineering', exact: true });
    await trigger.click();
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('data-placement', 'bottom-start');
    await expect.poll(async () => {
      const button = (await trigger.boundingBox())!;
      const popup = (await menu.boundingBox())!;
      return popup.y - button.y - button.height;
    }).toBeGreaterThanOrEqual(0);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  }
});

test('profile menu opens above the expanded and collapsed sidebar trigger', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openExample(page);
  for (const collapsed of [false, true]) {
    if (collapsed) await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
    const trigger = page.getByRole('button', { name: 'Profile: Ros.Space', exact: true });
    await trigger.click();
    const menu = page.getByRole('menu', { name: 'Profile: Ros.Space', exact: true });
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('data-placement', 'top-start');
    await expect.poll(async () => {
      const button = (await trigger.boundingBox())!;
      const popup = (await menu.boundingBox())!;
      return button.y - popup.y - popup.height;
    }).toBeGreaterThanOrEqual(0);
    await expect.poll(async () => {
      const button = (await trigger.boundingBox())!;
      const popup = (await menu.boundingBox())!;
      return Math.abs(popup.x - button.x);
    }).toBeLessThanOrEqual(1);
    await menu.getByRole('menuitem', { name: 'Switch profile', exact: true }).click();
    await expect(page.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true })).toBeVisible();
    await selectedProfileCheck(page.getByRole('menu', { name: 'Switch profile', exact: true }), 'Ros.Space');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('menu', { name: 'Switch profile', exact: true })).toBeHidden();
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-activedescendant', (await menu.getByRole('menuitem', { name: 'Switch profile', exact: true }).getAttribute('id'))!);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  }
  expect(errors).toEqual([]);
});

test('icon navigation preserves groups, hides child tab stops, and expands from a rail icon', async ({ page }) => {
  await openExample(page);
  const nav = page.getByRole('navigation', { name: 'Icon application navigation', exact: true });
  const workspace = nav.getByRole('button', { name: 'Workspace', exact: true });
  const mesh = nav.getByRole('button', { name: 'Mesh', exact: true });
  await expect(workspace).toHaveAttribute('aria-expanded', 'true');
  await expect(workspace).not.toHaveAttribute('aria-current', 'page');
  await expect(mesh).toHaveAttribute('aria-expanded', 'false');
  await mesh.focus();
  await mesh.press('Enter');
  await expect(mesh).toHaveAttribute('aria-expanded', 'true');
  await nav.getByRole('link', { name: 'Refinement', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Refinement', exact: true })).toBeVisible();
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await expect(nav).toHaveAttribute('data-state', 'collapsed');
  await expect(nav.getByRole('link', { name: 'Refinement', exact: true })).toBeHidden();
  await mesh.focus();
  await expect(page.getByRole('tooltip', { name: 'Mesh', exact: true })).toBeVisible();
  await mesh.press('Tab');
  await expect(nav.getByRole('button', { name: 'Settings', exact: true })).toBeFocused();
  await mesh.click();
  await expect(nav).toHaveAttribute('data-state', 'expanded');
  await expect(mesh).toHaveAttribute('aria-expanded', 'true');
  await expect(workspace).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('link', { name: 'Refinement', exact: true })).toBeVisible();
});

test('namespace, profile, and search remain usable in the icon rail', async ({ page }) => {
  await openExample(page);
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await page.getByRole('button', { name: 'Namespace: Engineering', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Namespace: Research', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Profile: Ros.Space', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Switch profile', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Profile: Jordan Lee', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Profile: Jordan Lee', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Switch profile', exact: true }).click();
  await selectedProfileCheck(page.getByRole('menu', { name: 'Switch profile', exact: true }), 'Jordan Lee');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Profile: Jordan Lee', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Quick search', exact: false }).click();
  const search = page.getByRole('dialog', { name: 'Search navigation', exact: true });
  await search.getByPlaceholder('Search navigation…').fill('Integrations');
  await page.keyboard.press('Enter');
  await expect(search).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Integrations', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Icon application navigation', exact: true }).getByRole('button', { name: 'Settings', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Integrations', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('mobile retains group and account state and restores focus after selection', async ({ page }) => {
  await openExample(page);
  await page.getByRole('button', { name: 'Mesh', exact: true }).click();
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Icon application navigation', exact: true });
  const mesh = drawer.getByRole('button', { name: 'Mesh', exact: true });
  await expect(mesh).toHaveAttribute('aria-expanded', 'true');
  expect((await mesh.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await drawer.getByRole('button', { name: 'Namespace: Engineering', exact: true }).click();
  await expect(drawer.getByRole('menu')).toHaveAttribute('data-placement', 'bottom-start');
  await drawer.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(drawer).toBeVisible();
  await drawer.getByRole('link', { name: 'Simulation', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Simulation', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Namespace: Research', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Simulation', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('touch profile submenu keeps names and right-side checkmarks visible', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await openExample(page);
    await page.evaluate(() => { document.documentElement.dataset.kappaTheme = 'dark'; });
    await page.getByRole('button', { name: 'Open sidebar', exact: true }).tap();
    const drawer = page.getByRole('dialog', { name: 'Icon application navigation', exact: true });
    await drawer.getByRole('button', { name: 'Profile: Ros.Space', exact: true }).tap();
    const menu = drawer.getByRole('menu', { name: 'Profile: Ros.Space', exact: true });
    await expect(menu).toHaveAttribute('data-placement', 'top-start');
    await menu.getByRole('menuitem', { name: 'Switch profile', exact: true }).tap();
    const submenu = drawer.getByRole('menu', { name: 'Switch profile', exact: true });
    await expect(submenu).toBeVisible();
    await selectedProfileCheck(submenu, 'Ros.Space');
    const bounds = (await submenu.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(8);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(312);
    for (const name of ['Ros.Space', 'Jordan Lee']) {
      const row = submenu.getByRole('menuitemradio', { name, exact: true });
      expect((await row.boundingBox())!.width).toBeGreaterThanOrEqual(160);
      expect(await row.evaluate(node => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(1);
    }
    await submenu.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true }).tap();
    const trigger = drawer.getByRole('button', { name: 'Profile: Jordan Lee', exact: true });
    await expect(drawer).toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.tap();
    await drawer.getByRole('menuitem', { name: 'Switch profile', exact: true }).tap();
    await selectedProfileCheck(drawer.getByRole('menu', { name: 'Switch profile', exact: true }), 'Jordan Lee');
    expect(errors).toEqual([]);
  } finally {
    await context.close();
  }
});

test('gallery retains the old rail and publishes complete source', async ({ page, request }) => {
  await page.goto('/docs/blocks/sidebar');
  await expect(page.locator('[data-block-example]')).toHaveCount(15);
  await expect(page.locator('[data-block-example="rail"]')).toHaveCount(1);
  const example = page.locator('[data-block-example="collapsible-icons"]');
  await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/collapsible-icons');
  const code = example.locator('[data-code-full] code');
  await expect(code).toContainText('iconNavigation: true');
  await expect(code).toContainText('variant: "workspace", standalone: true');
  await expect(code).toContainText('<style>');
  await expect(code).not.toContainText('style src=');
  expect(await (await request.get('/docs/blocks/sidebar.md')).text()).toContain('Collapsible Icon Navigation');
});
