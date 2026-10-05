import { expect, test, type Locator, type Page } from "@playwright/test";

async function hydrated(page: Page) {
  await expect.poll(() => page.locator('astro-island[ssr]').count()).toBe(0);
}
async function popup(page: Page, trigger: Locator) {
  const id = await trigger.getAttribute('aria-controls');
  const menu = page.locator(`[id="${id}"]`);
  await expect(menu).toBeVisible();
  const body = menu.locator('.kappa-workspace-switcher__body');
  await expect(body).toHaveCSS('overflow-x', 'hidden');
  await expect.poll(() => body.evaluate(node => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(1);
  return menu;
}
async function selectedCheck(menu: Locator, name: string, rtl = false) {
  const item = menu.getByRole('menuitemradio', { name, exact: true });
  await expect(item).toHaveAttribute('aria-checked', 'true');
  await expect(menu.locator('[data-slot="dropdown-radio-item-indicator"]:not([hidden])')).toHaveCount(1);
  const indicator = item.locator('[data-slot="dropdown-radio-item-indicator"]');
  await expect(indicator.locator('path')).toHaveCount(1);
  const box = (await item.boundingBox())!;
  const check = (await indicator.boundingBox())!;
  const text = (await item.locator('.kappa-workspace-switcher__name').boundingBox())!;
  if (rtl) {
    expect(check.x + check.width).toBeLessThan(text.x);
    expect(check.x - box.x).toBeLessThan(10);
  } else {
    expect(check.x).toBeGreaterThan(text.x + text.width);
    expect(box.x + box.width - check.x - check.width).toBeLessThan(10);
  }
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const variant of ['minimal-workspace', 'workspace', 'rail', 'inset', 'floating', 'collapsible-icons', 'inset-navigation', 'workspace-pages']) {
  test(`${variant} uses the shared switcher and moves the right checkmark`, async ({ page }) => {
    await page.goto(`/examples/sidebar/${variant}`);
    await hydrated(page);
    const initial = variant === 'minimal-workspace' ? 'Ros.Space' : 'Engineering';
    const trigger = page.getByRole('button', { name: `Namespace: ${initial}`, exact: true });
    await trigger.click();
    const menu = await popup(page, trigger);
    await expect(menu).toHaveClass(/kappa-workspace-switcher/);
    await expect(menu).toHaveCSS('width', '300px');
    await expect(menu.locator('[data-slot="workspace-switcher-current"]')).toContainText(initial);
    await expect(menu.locator('[data-slot="workspace-switcher-current"]')).toContainText(/plan · \d+ members?/);
    await selectedCheck(menu, initial);
    for (const name of ['Upgrade', 'Settings', 'Invite members', 'Add account', 'Add namespace', 'Log out']) {
      await expect(menu.getByRole('menuitem', { name, exact: true })).toBeVisible();
    }
    await menu.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
    await expect(menu).toBeHidden();
    const updated = page.getByRole('button', { name: 'Namespace: Research', exact: true });
    await expect(updated).toBeFocused();
    await updated.press('Enter');
    const reopened = await popup(page, updated);
    await selectedCheck(reopened, 'Research');
    await page.keyboard.press('Escape');
    await expect(reopened).toHaveAttribute('hidden', '');
    await expect(reopened).toHaveCSS('display', 'none');
    await expect(updated).toBeFocused();
  });
}

test('default trigger, action callbacks, attributes, and Markdown use the public block', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/docs/blocks/workspace-switcher');
  await hydrated(page);
  await expect(page.getByRole('heading', { level: 1, name: 'Workspace Switcher', exact: true })).toBeVisible();
  await expect(page.locator('#desktop-navigation a[aria-current="page"]')).toHaveText('Workspace Switcher');
  const demo = page.locator('[data-workspace-demo="preview"]');
  const trigger = demo.getByRole('button', { name: 'Workspaces: Ros.Space', exact: true });
  await trigger.click();
  const menu = await popup(page, trigger);
  await expect(menu).toHaveAttribute('data-example-attribute', 'forwarded');
  await selectedCheck(menu, 'Ros.Space');
  await menu.getByRole('menuitem', { name: 'Settings', exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(demo.getByRole('status')).toHaveText('Settings preview.');
  const markdown = await request.get('/docs/blocks/workspace-switcher.md');
  expect(markdown.ok()).toBe(true);
  expect(await markdown.text()).toContain('@dicehub/kappa/blocks/workspace-switcher');
  expect(errors).toEqual([]);
});

test('controlled selection can reject updates without moving the checkmark', async ({ page }) => {
  await page.goto('/docs/blocks/workspace-switcher');
  await hydrated(page);
  const demo = page.locator('[data-workspace-demo="controlled"]');
  let trigger = demo.getByRole('button', { name: 'Workspaces: Ros.Space', exact: true });
  await trigger.click();
  let menu = await popup(page, trigger);
  await menu.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(demo.getByRole('status')).toContainText('Selected: Ros.Space · Requested: Research');
  await trigger.click();
  menu = await popup(page, trigger);
  await selectedCheck(menu, 'Ros.Space');
  await expect(menu.getByRole('menuitemradio', { name: 'Research', exact: true })).toHaveAttribute('aria-checked', 'false');
  await page.keyboard.press('Escape');
  await demo.getByRole('button', { name: 'Unlock selection' }).click();
  await trigger.click();
  menu = await popup(page, trigger);
  await menu.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  trigger = demo.getByRole('button', { name: 'Workspaces: Research', exact: true });
  await expect(trigger).toBeFocused();
});

test('long lists scroll during keyboard navigation and skip disabled workspaces', async ({ page }) => {
  await page.goto('/docs/blocks/workspace-switcher');
  await hydrated(page);
  const demo = page.locator('[data-workspace-demo="long"]');
  const trigger = demo.getByRole('button', { name: 'Workspaces: Ros.Space', exact: true });
  await trigger.press('ArrowDown');
  const menu = await popup(page, trigger);
  await expect(menu.getByRole('menuitemradio', { name: 'Restricted workspace', exact: true })).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('p');
  await expect(menu).toHaveAttribute('aria-activedescendant', (await menu.getByRole('menuitemradio', { name: 'Personal', exact: true }).getAttribute('id'))!);
  await page.keyboard.press('ArrowDown');
  await expect(menu).toHaveAttribute('aria-activedescendant', (await menu.getByRole('menuitemradio', { name: 'Workspace 1', exact: true }).getAttribute('id'))!);
  await page.keyboard.press('ArrowUp');
  await expect(menu).toHaveAttribute('aria-activedescendant', (await menu.getByRole('menuitemradio', { name: 'Personal', exact: true }).getAttribute('id'))!);
  await page.keyboard.press('End');
  await expect(menu).toHaveAttribute('aria-activedescendant', (await menu.getByRole('menuitem', { name: 'Log out', exact: true }).getAttribute('id'))!);
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  const body = menu.locator('.kappa-workspace-switcher__body');
  await expect.poll(() => body.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  for (let index = 0; index < 4; index++) {
    await expect.poll(() => menu.evaluate(node => {
      const row = node.querySelector('[data-part="item"][data-highlighted]')!.getBoundingClientRect();
      const body = node.querySelector('.kappa-workspace-switcher__body')!.getBoundingClientRect();
      const footer = node.querySelector('.kappa-workspace-switcher__footer')!.getBoundingClientRect();
      return row.top >= body.top && row.bottom <= footer.top;
    })).toBe(true);
    if (index < 3) await page.keyboard.press('ArrowUp');
  }
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(demo.getByRole('button', { name: 'Workspaces: Workspace 35', exact: true })).toBeFocused();
});

test('RTL puts the selected checkmark at the logical end', async ({ page }) => {
  await page.goto('/docs/blocks/workspace-switcher');
  await hydrated(page);
  const demo = page.locator('[data-workspace-demo="rtl"]');
  const trigger = demo.getByRole('button', { name: 'Workspaces: Ros.Space', exact: true });
  await trigger.click();
  const menu = await popup(page, trigger);
  await expect(menu).toHaveAttribute('dir', 'rtl');
  await selectedCheck(menu, 'Ros.Space', true);
});

test('workspace values cannot collide with action identifiers', async ({ page }) => {
  await page.goto('/docs/blocks/workspace-switcher');
  await hydrated(page);
  const demo = page.locator('[data-workspace-demo="preview"]');
  let trigger = demo.getByRole('button', { name: 'Workspaces: Ros.Space', exact: true });
  await trigger.click();
  let menu = await popup(page, trigger);
  const workspace = menu.getByRole('menuitemradio', { name: 'Engineering', exact: true });
  const action = menu.getByRole('menuitem', { name: 'Settings', exact: true });
  expect(await workspace.getAttribute('id')).not.toBe(await action.getAttribute('id'));
  await workspace.click();
  await expect(demo).toHaveAttribute('data-selected-value', 'workspace-action:primary:settings');
  trigger = demo.getByRole('button', { name: 'Workspaces: Engineering', exact: true });
  await trigger.click();
  menu = await popup(page, trigger);
  await selectedCheck(menu, 'Engineering');
  await menu.getByRole('menuitem', { name: 'Settings', exact: true }).click();
  await expect(demo.getByRole('status')).toHaveText('Settings preview.');
  await expect(demo).toHaveAttribute('data-selected-value', 'workspace-action:primary:settings');
});

for (const mode of ['light', 'dark']) {
  test(`${mode} action colors preserve destructive and disabled states`, async ({ page }) => {
    await page.goto('/docs/blocks/workspace-switcher');
    await hydrated(page);
    await page.evaluate(mode => { document.documentElement.dataset.kappaTheme = mode; }, mode);
    const demo = page.locator('[data-workspace-demo="states"]');
    await demo.getByRole('button', { name: 'Workspaces: Ros.Space', exact: true }).click();
    const menu = await popup(page, demo.getByRole('button', { name: 'Workspaces: Ros.Space', exact: true }));
    const tokenColor = (token: string) => menu.evaluate((node, token) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${token})`;
      node.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }, token);
    const destructive = menu.getByRole('menuitem', { name: 'Remove workspace', exact: true });
    expect(await destructive.getAttribute('id')).not.toBe(await menu.getByRole('menuitem', { name: 'Settings', exact: true }).getAttribute('id'));
    await expect(destructive).toHaveCSS('color', await tokenColor('--kappa-danger-text'));
    await destructive.hover();
    await expect(destructive).toHaveCSS('color', await tokenColor('--kappa-danger-text'));
    for (const name of ['Upgrade', 'Invite members', 'Log out']) {
      const disabled = menu.getByRole('menuitem', { name, exact: true });
      await expect(disabled).toHaveAttribute('aria-disabled', 'true');
      await expect(disabled).toHaveCSS('color', await tokenColor('--kappa-muted'));
    }
  });
}

for (const mode of ['light', 'dark']) {
  test(`${mode} touch menu fits a 320px drawer and restores focus`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await context.newPage();
    try {
      await page.goto('/examples/sidebar/minimal-workspace');
      await hydrated(page);
      await page.evaluate(mode => { document.documentElement.dataset.kappaTheme = mode; document.documentElement.dataset.mode = mode; }, mode);
      const opener = page.getByRole('button', { name: 'Open sidebar', exact: true });
      await opener.tap();
      const drawer = page.getByRole('dialog', { name: 'Minimal workspace navigation', exact: true });
      const trigger = drawer.getByRole('button', { name: 'Namespace: Ros.Space', exact: true });
      await trigger.tap();
      const menu = await popup(page, trigger);
      expect(await drawer.locator('.kappa-workspace-switcher').count()).toBe(1);
      const bounds = (await menu.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(700);
      await expect(menu.getByRole('menuitemradio', { name: 'Research', exact: true })).toHaveCSS('min-height', '44px');
      await selectedCheck(menu, 'Ros.Space');
      const footer = menu.getByRole('menuitem', { name: 'Log out', exact: true });
      const footerBounds = (await footer.boundingBox())!;
      expect(footerBounds.y + footerBounds.height).toBeLessThanOrEqual(bounds.y + bounds.height);
      await menu.getByRole('menuitemradio', { name: 'Research', exact: true }).tap();
      const updated = drawer.getByRole('button', { name: 'Namespace: Research', exact: true });
      await expect(updated).toBeFocused();
      await updated.tap();
      const reopened = await popup(page, updated);
      await selectedCheck(reopened, 'Research');
      await reopened.getByRole('menuitem', { name: 'Settings', exact: true }).tap();
      await expect(drawer).toBeHidden();
      await expect(opener).toBeFocused();
      await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    } finally { await context.close(); }
  });
}
