import { expect, test, type Locator, type Page } from '@playwright/test';

const variants = [
  'grouped', 'collapsible-sections', 'submenus', 'floating-submenus',
  'collapsible-submenus', 'dropdown-submenus', 'collapsible-icons', 'peeking', 'hover-reveal',
  'inset-navigation', 'inbox-navigation', 'workspace-pages', 'minimal-workspace',
  'workspace', 'rail', 'inset', 'floating',
];

const demoFor = (page: Page, variant: string) => page.locator(`[data-sidebar-block="${variant}"]`);
const shellFor = (demo: Locator) => demo.locator('.kappa-sidebar-layout, .sidebar-inbox-demo__layout');
const columnFor = (demo: Locator) => demo.locator([
  '.sidebar-grouped-demo__article', '.sidebar-pages-demo__page',
  '.minimal-workspace-demo__page', '.sidebar-block-demo__page',
  '.sidebar-inbox-demo__reader-column', '.sidebar-hover-demo__article',
].join(', '));

function desktopToggle(demo: Locator, variant: string, expanded: boolean) {
  if (variant === 'hover-reveal') return demo.locator('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]');
  return demo.getByRole('button', { name: expanded ? 'Collapse sidebar' : variant === 'peeking' ? 'Pin sidebar open' : 'Expand sidebar', exact: true });
}

async function hydrated(demo: Locator) {
  await expect.poll(() => demo.evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
  await demo.evaluate(() => document.fonts.ready);
}

async function geometry(demo: Locator) {
  const shell = (await shellFor(demo).boundingBox())!;
  const column = (await columnFor(demo).boundingBox())!;
  return { center: column.x + column.width / 2 - shell.x - shell.width / 2, width: column.width };
}

async function centered(demo: Locator) {
  await expect.poll(async () => (await geometry(demo)).center).toBeCloseTo(0, 0);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const variant of variants) {
  test(`${variant} preserves its content column when navigation collapses`, async ({ page }) => {
    await page.goto(`/examples/sidebar/${variant}`);
    const demo = demoFor(page, variant);
    await hydrated(demo);
    const shell = shellFor(demo);
    await expect(shell).not.toHaveAttribute('data-mobile');
    if (await shell.getAttribute('data-state') === 'collapsed') {
      await desktopToggle(demo, variant, false).click();
    }
    await centered(demo);
    const before = await geometry(demo);
    expect(before.width).toBeGreaterThan(600);
    await desktopToggle(demo, variant, true).click();
    if (variant === 'hover-reveal') await columnFor(demo).getByRole('heading', { level: 2 }).click();
    await expect(shell).toHaveAttribute('data-state', 'collapsed');
    await centered(demo);
    expect((await geometry(demo)).width).toBeCloseTo(before.width, 0);
    await desktopToggle(demo, variant, false).click();
    await centered(demo);
    expect((await geometry(demo)).width).toBeCloseTo(before.width, 0);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(shell).toHaveAttribute('data-mobile', '');
    await centered(demo);
    const mobile = await geometry(demo);
    await demo.getByRole('button', { name: 'Open sidebar', exact: true }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();
    await centered(demo);
    expect((await geometry(demo)).width).toBeCloseTo(mobile.width, 0);
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await centered(demo);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('desktop gallery navigation stays visible and open after selection', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/docs/blocks/sidebar#grouped');
  for (const variant of variants) {
    const demo = demoFor(page, variant);
    await hydrated(demo);
    const shell = shellFor(demo);
    await expect(shell, variant).not.toHaveAttribute('data-mobile');
    const navigation = demo.locator('[data-slot="sidebar"]');
    await expect(navigation, variant).toBeVisible();
    await expect(shell, variant).toHaveAttribute('data-state', ['rail', 'peeking'].includes(variant) ? 'collapsed' : 'expanded');
    if (['rail', 'peeking'].includes(variant)) await desktopToggle(demo, variant, false).click();
    if (variant === 'inbox-navigation') {
      await navigation.getByRole('button', { name: 'Drafts', exact: true }).click();
    } else if (variant === 'dropdown-submenus') {
      await navigation.getByRole('button', { name: 'Getting started', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Installation', exact: true }).click();
    } else {
      await navigation.locator('[data-slot="sidebar-content"] [data-slot="sidebar-menu-button"]:not([aria-haspopup])').first().click();
    }
    await expect(shell, variant).toHaveAttribute('data-state', 'expanded');
    await expect(navigation, variant).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  }
});

test('mobile gallery drawers keep content fixed and return focus', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs/blocks/sidebar');
  for (const variant of variants) {
    const demo = demoFor(page, variant);
    await hydrated(demo);
    const shell = shellFor(demo);
    await expect(shell, variant).toHaveAttribute('data-mobile', '');
    await centered(demo);
    const before = await geometry(demo);
    const toggle = demo.getByRole('button', { name: 'Open sidebar', exact: true });
    await toggle.click();
    const drawer = page.getByRole('dialog');
    await expect(drawer, variant).toBeVisible();
    await centered(demo);
    expect((await geometry(demo)).width, variant).toBeCloseTo(before.width, 0);
    await page.keyboard.press('Escape');
    await expect(drawer, variant).toBeHidden();
    await expect(toggle).toBeFocused();
    await centered(demo);
    expect(await demo.evaluate(node => node.scrollWidth <= node.clientWidth), variant).toBe(true);
  }
  expect(page.viewportSize()!.width).toBe(390);
});
