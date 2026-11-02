import { expect, test, type Locator, type Page } from '@playwright/test';
import { parse, compileScript, compileTemplate } from 'vue/compiler-sfc';

const variants = ['peeking', 'hover-reveal'] as const;
const demoFor = (page: Page, variant: string) => page.locator(`[data-sidebar-block="${variant}"]`);
const navigation = (demo: Locator) => demo.locator('[data-slot="sidebar"]');
const toolbarToggle = (demo: Locator) => demo.locator('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]');
const content = (demo: Locator) => demo.locator('.sidebar-block-demo__page, .sidebar-hover-demo__article');
async function ready(demo: Locator) {
  await expect.poll(() => demo.evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
  await demo.evaluate(() => document.fonts.ready);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('both shells have gallery previews, full-screen links, and complete copyable source', async ({ page }) => {
  await page.goto('/docs/blocks/appshell');
  for (const variant of variants) {
    const example = page.locator(`[data-block-example="${variant}"]`);
    await ready(demoFor(page, variant));
    await expect(example.getByRole('link', { name: /Open full example/ })).toHaveAttribute('href', `/examples/appshell/${variant}`);
    const source = await example.locator('[data-code-full] code').textContent();
    expect(source).toContain('peekable');
    expect(source).toContain('AppShell.Root');
    expect(source).not.toContain('<style');
    expect(source).not.toMatch(/from ["']\.\.?\//);
    const parsed = parse(source!, { filename: `${variant}.vue` });
    expect(parsed.errors).toEqual([]);
    const script = compileScript(parsed.descriptor, { id: variant });
    const template = compileTemplate({ source: parsed.descriptor.template!.content, filename: `${variant}.vue`, id: variant, compilerOptions: { bindingMetadata: script.bindings } });
    expect(template.errors).toEqual([]);
  }
});

for (const variant of variants) {
  for (const embedded of [false, true]) {
    test(`${variant} ${embedded ? 'gallery' : 'full-screen'} supports temporary reveal and pinning without moving content`, async ({ page }) => {
      await page.goto(embedded ? `/docs/blocks/appshell#${variant}` : `/examples/appshell/${variant}`);
      const demo = demoFor(page, variant);
      await ready(demo);
      await demo.scrollIntoViewIfNeeded();
      const nav = navigation(demo);
      const toggle = toolbarToggle(demo);
      await expect(demo.locator('.kappa-sidebar-layout')).not.toHaveAttribute('data-mobile');
      await expect(demo.locator('.kappa-sidebar-layout')).toHaveAttribute('data-variant', 'workspace');
      if (variant === 'hover-reveal') {
        await nav.locator('[data-slot="sidebar-header"]').hover();
        await nav.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
      }
      await content(demo).hover();
      await toggle.focus();
      await expect(nav).toHaveAttribute('data-state', 'collapsed');
      const before = await content(demo).boundingBox();
      const scrollBefore = await page.evaluate(() => scrollY);
      if (variant === 'peeking') {
        const railLink = (await nav.getByRole('link', { name: 'Overview', exact: true }).boundingBox())!;
        await page.mouse.move(railLink.x + 10, railLink.y + railLink.height / 2);
      } else await toggle.hover();
      await expect(nav).toHaveAttribute('data-state', 'peeking');
      expect(await content(demo).boundingBox()).toEqual(before);
      expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
      await expect(demo.locator('.kappa-sidebar__shell')).toHaveCSS('width', variant === 'peeking' ? '52px' : '0px');
      await page.keyboard.press('Escape');
      await expect(nav).toHaveAttribute('data-state', 'collapsed');
      await expect(toggle).toBeFocused();
      await content(demo).hover();
      await toggle.press('Enter');
      await expect(nav).toHaveAttribute('data-state', 'expanded');
      await content(demo).hover();
      await expect(nav).toHaveAttribute('data-state', 'expanded');
      if (variant === 'peeking') {
        await nav.getByRole('link', { name: 'Reports', exact: true }).click();
        await expect(content(demo).getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
      } else {
        await expect(content(demo).getByText('Before you start', { exact: true })).toBeVisible();
        await expect(demo.getByRole('button', { name: 'Lock state', exact: true })).toHaveCount(0);
        await content(demo).getByRole('button', { name: 'Find a workspace page', exact: true }).click();
        const search = page.getByRole('dialog', { name: 'Search workspace pages', exact: true });
        await search.getByRole('combobox').fill('Rotor study');
        await search.getByRole('combobox').press('Enter');
        await expect(search).toBeHidden();
        await expect(content(demo).getByRole('heading', { name: 'Rotor study', exact: true })).toBeVisible();
      }
    });
  }

  test(`${variant} mobile drawer selects a page and restores focus in dark mode`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/examples/appshell/${variant}`);
    const demo = demoFor(page, variant);
    await ready(demo);
    await expect(demo.locator('.kappa-sidebar-layout')).toHaveAttribute('data-mobile', '');
    const toggle = toolbarToggle(demo);
    await toggle.click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveCSS('width', '390px');
    const selected = variant === 'peeking' ? 'Reports' : 'Installation';
    await drawer.getByRole('link', { name: selected, exact: true }).click();
    await expect(drawer).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(content(demo).getByRole('heading', { name: selected, exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
