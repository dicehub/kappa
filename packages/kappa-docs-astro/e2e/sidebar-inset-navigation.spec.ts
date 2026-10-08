import { expect, test, type Page } from '@playwright/test';

async function openExample(page: Page) {
  await page.goto('/examples/sidebar/inset-navigation');
  await expect.poll(() => page.locator('[data-sidebar-block="inset-navigation"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
}

test('inset switcher opens below and profile menu above in both sidebar states', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openExample(page);
  for (const state of ['expanded', 'collapsed']) {
    const namespace = page.getByRole('button', { name: 'Namespace: Engineering', exact: true });
    await namespace.press('Enter');
    const namespaceMenu = page.getByRole('menu', { name: 'Namespace: Engineering', exact: true });
    await expect(namespaceMenu).toHaveAttribute('data-placement', 'bottom-start');
    await namespaceMenu.evaluate(async node => { await Promise.all(node.getAnimations().map(animation => animation.finished.catch(() => {}))); });
    const namespaceBounds = (await namespace.boundingBox())!;
    const popup = (await namespaceMenu.boundingBox())!;
    expect(popup.y).toBeGreaterThanOrEqual(namespaceBounds.y + namespaceBounds.height);
    expect(popup.x).toBeCloseTo(namespaceBounds.x, 1);
    await page.keyboard.press('Escape');
    await expect(namespace).toBeFocused();
    const profile = page.getByRole('button', { name: 'Profile: Ros.Space', exact: true });
    await profile.press('Enter');
    const profileMenu = page.getByRole('menu', { name: 'Profile: Ros.Space', exact: true });
    await expect(profileMenu).toHaveAttribute('data-placement', 'top-start');
    await profileMenu.evaluate(async node => { await Promise.all(node.getAnimations().map(animation => animation.finished.catch(() => {}))); });
    const profileBounds = (await profile.boundingBox())!;
    const menu = (await profileMenu.boundingBox())!;
    expect(menu.y + menu.height).toBeLessThanOrEqual(profileBounds.y);
    expect(menu.x).toBeCloseTo(profileBounds.x, 1);
    await page.keyboard.press('Escape');
    await expect(profile).toBeFocused();
    if (state === 'expanded') await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  }
});

test('inset headers align and secondary links remain above the profile when primary navigation scrolls', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 650 });
  await openExample(page);
  const nav = page.getByRole('navigation', { name: 'Inset application navigation', exact: true });
  const panel = page.locator('.kappa-sidebar-layout__main');
  await expect(page.locator('.kappa-sidebar-layout')).toHaveAttribute('data-variant', 'inset');
  await expect(panel).toHaveCSS('border-top-left-radius', '10px');
  const header = (await nav.locator('[data-slot="sidebar-header"]').boundingBox())!;
  const toolbar = (await page.locator('.kappa-sidebar-layout__toolbar').boundingBox())!;
  expect(header.y + header.height).toBeCloseTo(toolbar.y + toolbar.height, 2);
  await nav.getByRole('button', { name: 'Mesh', exact: true }).click();
  await nav.getByRole('button', { name: 'Settings', exact: true }).click();
  const support = nav.getByRole('link', { name: 'Support', exact: true });
  const feedback = nav.getByRole('link', { name: 'Feedback', exact: true });
  const profile = nav.getByRole('button', { name: 'Profile: Ros.Space', exact: true });
  const before = (await support.boundingBox())!;
  const feedbackBounds = (await feedback.boundingBox())!;
  expect(feedbackBounds.y + feedbackBounds.height).toBeLessThan((await profile.boundingBox())!.y);
  const scroll = nav.getByRole('region', { name: 'Navigation links' });
  await scroll.evaluate(node => { node.scrollTop = node.scrollHeight; });
  await expect.poll(() => scroll.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  expect((await support.boundingBox())!.y).toBeCloseTo(before.y, 2);
  await support.focus();
  await support.press('Enter');
  await expect(page.getByRole('heading', { name: 'Support', exact: true })).toBeVisible();
  await expect(support).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('table')).toBeHidden();
  await support.press('Tab');
  await expect(feedback).toBeFocused();
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await expect(nav).toHaveAttribute('data-state', 'collapsed');
  await feedback.click();
  await expect(page.getByRole('heading', { name: 'Feedback', exact: true })).toBeVisible();
  await expect(feedback).toHaveAttribute('aria-current', 'page');
  const light = await panel.evaluate(node => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => {
    document.documentElement.dataset.mode = 'dark';
    document.documentElement.dataset.kappaTheme = 'dark';
  });
  await expect(panel).not.toHaveCSS('background-color', light);
});

test('inset namespace, profile, search, and project shortcuts retain local state', async ({ page }) => {
  await openExample(page);
  await page.getByRole('button', { name: 'Namespace: Engineering', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await page.getByRole('button', { name: 'Profile: Ros.Space', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Switch profile', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Jordan Lee', exact: true }).click();
  await page.getByRole('link', { name: 'Rotor study', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Rotor study', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Quick search', exact: false }).click();
  const search = page.getByRole('dialog', { name: 'Search navigation', exact: true });
  await search.getByPlaceholder('Search navigation…').fill('Feedback');
  await page.keyboard.press('Enter');
  await expect(search).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Feedback', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Namespace: Research', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Profile: Jordan Lee', exact: true })).toBeVisible();
});

test('mobile uses a full-screen drawer and secondary navigation restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const toggle = page.getByRole('button', { name: 'Open sidebar', exact: true });
  await toggle.click();
  const drawer = page.getByRole('dialog', { name: 'Inset application navigation', exact: true });
  await expect(drawer).toHaveCSS('width', '390px');
  await expect(drawer).toHaveCSS('height', '844px');
  await expect(drawer).toHaveCSS('border-top-left-radius', '0px');
  const namespace = drawer.getByRole('button', { name: 'Namespace: Engineering', exact: true });
  await namespace.click();
  const namespaceMenu = drawer.getByRole('menu', { name: 'Namespace: Engineering', exact: true });
  await expect(namespaceMenu).toHaveAttribute('data-placement', 'bottom-start');
  await namespaceMenu.getByRole('menuitemradio', { name: 'Research', exact: true }).click();
  await expect(drawer.getByRole('button', { name: 'Namespace: Research', exact: true })).toBeFocused();
  const support = drawer.getByRole('link', { name: 'Support', exact: true });
  expect((await support.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await support.click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Support', exact: true })).toBeVisible();
  await toggle.click();
  await expect(support).toHaveAttribute('aria-current', 'page');
  await drawer.getByRole('button', { name: 'Profile: Ros.Space', exact: true }).click({ position: { x: 16, y: 16 } });
  const profile = drawer.getByRole('menu', { name: 'Profile: Ros.Space', exact: true });
  await expect(profile).toBeVisible();
  await expect(profile).toHaveAttribute('data-placement', 'top-start');
  await profile.evaluate(async node => { await Promise.all(node.getAnimations().map(animation => animation.finished.catch(() => {}))); });
  const profileBounds = (await profile.boundingBox())!;
  const buttonBounds = (await drawer.getByRole('button', { name: 'Profile: Ros.Space', exact: true }).boundingBox())!;
  expect(profileBounds.y + profileBounds.height).toBeLessThanOrEqual(buttonBounds.y);
  await page.keyboard.press('Escape');
  await expect(profile).toBeHidden();
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: 'Close navigation', exact: true }).click();
  await expect(toggle).toBeFocused();
});

test('gallery keeps Inset Content and provides complete inset navigation source', async ({ page, request }) => {
  await page.goto('/docs/blocks/sidebar');
  await expect(page.locator('[data-block-example]')).toHaveCount(15);
  await expect(page.locator('[data-block-example="inset"]')).toHaveCount(1);
  const example = page.locator('[data-block-example="inset-navigation"]');
  await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', '/examples/sidebar/inset-navigation');
  const code = example.locator('[data-code-full] code');
  await expect(code).toContainText('variant: "inset", standalone: true');
  await expect(code).toContainText('insetNavigation: true');
  await expect(code).toContainText('<style>');
  await expect(code).not.toContainText('style src=');
  expect(await (await request.get('/docs/blocks/sidebar.md')).text()).toContain('Inset Navigation');
});
