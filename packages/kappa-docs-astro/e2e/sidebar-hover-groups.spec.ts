import { expect, test, type Page } from "@playwright/test";

const nav = (page: Page) => page.locator('[data-slot="sidebar"]');
const outside = (page: Page) => page.locator('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]');
const group = (page: Page, name: string) => nav(page).getByRole('button', { name, exact: true });
const link = (page: Page, name: string) => nav(page).getByRole('link', { name, exact: true });
const article = (page: Page) => page.locator('.sidebar-hover-demo__article');
const groups = [
  { title: 'Getting started', items: ['Introduction', 'Installation', 'Create a project'] },
  { title: 'Project workflow', items: ['Import geometry', 'Prepare a mesh', 'Run a simulation', 'Review results'] },
  { title: 'Reference', items: ['Configuration', 'Keyboard shortcuts', 'Troubleshooting'] },
];

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/examples/components/sidebar/hover-reveal');
  await expect.poll(() => page.locator('[data-sidebar-demo="hover-reveal"]').evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
});

test('uses the existing example groups and documents disclosure composition', async ({ page, request }) => {
  for (const entry of groups) {
    await expect(group(page, entry.title)).toHaveAttribute('aria-expanded', 'true');
    await expect(group(page, entry.title)).toHaveCSS('font-size', '12px');
    await expect(group(page, entry.title)).toHaveCSS('font-weight', '550');
    for (const name of entry.items) await expect(link(page, name)).toBeVisible();
  }
  await expect(link(page, 'Create a project')).toHaveAttribute('aria-current', 'page');
  const markdown = await request.get('/docs/components/sidebar.md');
  expect(markdown.ok()).toBe(true);
  const text = await markdown.text();
  expect(text).toContain('Sidebar.Collapsible');
  expect(text).toContain('[Tabs](/docs/components/tabs)');
  expect(text).not.toContain('openGroups');
});

test('keyboard disclosure is separate from page navigation and skips hidden links', async ({ page }) => {
  const trigger = group(page, 'Project workflow');
  await trigger.focus();
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(link(page, 'Prepare a mesh')).toBeHidden();
  await expect(article(page).locator('h2')).toHaveText('Create a project');
  await page.keyboard.press('Tab');
  await expect(group(page, 'Reference')).toBeFocused();
  await trigger.focus();
  await trigger.press('Space');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await link(page, 'Prepare a mesh').click();
  await expect(article(page).locator('h2')).toHaveText('Prepare a mesh');
  await expect(link(page, 'Prepare a mesh')).toHaveAttribute('aria-current', 'page');
  await expect(link(page, 'Create a project')).not.toHaveAttribute('aria-current');
});

test('group state and the selected page persist through hover, pinning, and mobile navigation', async ({ page }) => {
  await group(page, 'Reference').click();
  await nav(page).locator('[data-slot="sidebar-header"]').hover();
  await nav(page).getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await article(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await outside(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await expect(group(page, 'Reference')).toHaveAttribute('aria-expanded', 'false');
  await outside(page).click();
  await expect(nav(page)).toHaveAttribute('data-state', 'expanded');
  await expect(group(page, 'Reference')).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 390, height: 844 });
  await outside(page).click();
  const drawer = page.getByRole('dialog', { name: 'Hover navigation', exact: true });
  await expect(drawer).toBeVisible();
  await expect(group(page, 'Reference')).toHaveAttribute('aria-expanded', 'false');
  await group(page, 'Reference').click();
  await link(page, 'Configuration').click();
  await expect(drawer).toBeHidden();
  await expect(outside(page)).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(group(page, 'Reference')).toHaveAttribute('aria-expanded', 'true');
  await expect(link(page, 'Configuration')).toHaveAttribute('aria-current', 'page');
  await expect(article(page).locator('h2')).toHaveText('Configuration');
});

test('search opens the selected page group when its links were hidden', async ({ page }) => {
  await group(page, 'Reference').click();
  await nav(page).getByRole('button', { name: 'Search workspace pages', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Search workspace pages', exact: true });
  const input = dialog.getByRole('combobox');
  await input.fill('troubleshooting');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(group(page, 'Reference')).toHaveAttribute('aria-expanded', 'true');
  await expect(link(page, 'Troubleshooting')).toBeVisible();
  await expect(link(page, 'Troubleshooting')).toHaveAttribute('aria-current', 'page');
});

for (const theme of ['light', 'dark']) {
  test(`${theme} RTL groups fit on mobile with accessible disclosure targets`, async ({ page }) => {
    await page.evaluate(theme => document.documentElement.dataset.kappaTheme = theme, theme);
    await page.getByRole('button', { name: 'Use RTL', exact: true }).click();
    await page.getByRole('button', { name: 'Change side', exact: true }).click();
    await page.setViewportSize({ width: 320, height: 568 });
    await outside(page).click();
    const drawer = page.getByRole('dialog', { name: 'Hover navigation', exact: true });
    await expect(drawer).toBeVisible();
    for (const entry of groups) {
      await group(page, entry.title).scrollIntoViewIfNeeded();
      const box = (await group(page, entry.title).boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(320);
    }
    await group(page, 'Reference').click();
    await expect(link(page, 'Configuration')).toBeHidden();
    await group(page, 'Reference').press('Enter');
    await expect(link(page, 'Configuration')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  });
}
