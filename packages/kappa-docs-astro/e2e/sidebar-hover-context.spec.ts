import { expect, test, type Page } from "@playwright/test";

const nav = (page: Page) => page.locator('[data-slot="sidebar"]');
const tab = (page: Page, name: string) => nav(page).getByRole('tab', { name, exact: true });
const panel = (page: Page, name: string) => nav(page).getByRole('tabpanel', { name, exact: true });
const article = (page: Page) => page.locator('.sidebar-hover-demo__article');
const outside = (page: Page) => page.locator('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]');
const names = ['Home', 'AI Chat', 'Projects', 'Inbox'];

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/examples/components/sidebar/hover-reveal');
  await expect.poll(() => page.locator('[data-sidebar-demo="hover-reveal"]').evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
  await page.evaluate(() => document.fonts.ready.then(() => {}));
});

test('four contexts share one row, reveal only the active label, and preserve the current page', async ({ page }) => {
  const list = nav(page).getByRole('tablist', { name: 'Navigation context', exact: true });
  await expect(list.getByRole('tab')).toHaveCount(4);
  const before = await article(page).boundingBox();
  for (const name of names) {
    await tab(page, name).click();
    await expect(tab(page, name)).toHaveAttribute('aria-selected', 'true');
    await expect(panel(page, name)).toBeVisible();
    await expect(article(page).locator('h2')).toHaveText('Create a project');
    expect(await article(page).boundingBox()).toEqual(before);
    for (const other of names) {
      const label = tab(page, other).locator('.sidebar-hover-demo__context-label');
      await expect(label).toHaveCSS('opacity', other === name ? '1' : '0');
      if (other !== name) {
        await expect(panel(page, other)).toBeHidden();
        expect(await label.evaluate(el => el.getBoundingClientRect().width)).toBe(0);
      }
    }
  }
  const search = nav(page).getByRole('button', { name: 'Search workspace pages', exact: true });
  const searchBox = (await search.boundingBox())!;
  const listBox = (await list.boundingBox())!;
  expect(searchBox.x).toBeGreaterThan(listBox.x + listBox.width);
  expect(Math.abs(searchBox.y + searchBox.height / 2 - listBox.y - listBox.height / 2)).toBeLessThan(1);
  await expect(list).toHaveCSS('border-bottom-width', '0px');
});

test('native tab keyboard controls keep focus and work in both directions', async ({ page }) => {
  await tab(page, 'Home').focus();
  await page.keyboard.press('ArrowRight');
  await expect(tab(page, 'AI Chat')).toBeFocused();
  await expect(tab(page, 'AI Chat')).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(tab(page, 'Inbox')).toBeFocused();
  await page.keyboard.press('Home');
  await expect(tab(page, 'Home')).toBeFocused();
  await page.getByRole('button', { name: 'Use RTL', exact: true }).click();
  await tab(page, 'Home').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(tab(page, 'AI Chat')).toBeFocused();
  await expect(tab(page, 'AI Chat')).toHaveAttribute('aria-selected', 'true');
  await expect(article(page).locator('h2')).toHaveText('Create a project');
});

test('inactive icons have tooltips and hidden context links stay outside keyboard navigation', async ({ page }) => {
  await tab(page, 'AI Chat').hover();
  await expect(page.getByRole('tooltip', { name: 'AI Chat', exact: true })).toBeVisible();
  await tab(page, 'AI Chat').click();
  await expect(page.getByRole('tooltip', { name: 'AI Chat', exact: true })).toBeHidden();
  await expect(nav(page).getByRole('link', { name: 'Create a project', exact: true })).toHaveCount(0);
  await page.keyboard.press('Tab');
  await expect(nav(page).getByRole('button', { name: 'Search workspace pages', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(panel(page, 'AI Chat').getByRole('button', { name: 'Recent chats', exact: true })).toBeFocused();
});

test('context groups keep their state through selection, hover reveal, and mobile changes', async ({ page }) => {
  await panel(page, 'Home').getByRole('button', { name: 'Reference', exact: true }).click();
  await tab(page, 'AI Chat').click();
  await panel(page, 'AI Chat').getByRole('button', { name: 'Recent chats', exact: true }).click();
  await tab(page, 'Projects').click();
  await panel(page, 'Projects').getByRole('link', { name: 'Rotor study', exact: true }).click();
  await expect(article(page).locator('h2')).toHaveText('Rotor study');
  await tab(page, 'Home').click();
  await expect(panel(page, 'Home').getByRole('button', { name: 'Reference', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(article(page).locator('h2')).toHaveText('Rotor study');
  await nav(page).locator('[data-slot="sidebar-header"]').hover();
  await nav(page).getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await article(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await outside(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await tab(page, 'AI Chat').click();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await expect(panel(page, 'AI Chat').getByRole('button', { name: 'Recent chats', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await outside(page).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await outside(page).click();
  await expect(tab(page, 'AI Chat')).toHaveAttribute('aria-selected', 'true');
  await expect(panel(page, 'AI Chat').getByRole('button', { name: 'Recent chats', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await tab(page, 'Inbox').click();
  await expect(page.getByRole('dialog', { name: 'Hover navigation', exact: true })).toBeVisible();
  await panel(page, 'Inbox').getByRole('link', { name: 'Geometry files uploaded', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Hover navigation', exact: true })).toBeHidden();
  await expect(outside(page)).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(tab(page, 'Inbox')).toHaveAttribute('aria-selected', 'true');
  await expect(panel(page, 'Inbox').getByRole('link', { name: 'Geometry files uploaded', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('search selects a page across contexts, opens its group, and returns focus', async ({ page }) => {
  await tab(page, 'Projects').click();
  await panel(page, 'Projects').getByRole('button', { name: 'Projects', exact: true }).click();
  await tab(page, 'Home').click();
  const search = nav(page).getByRole('button', { name: 'Search workspace pages', exact: true });
  await search.click();
  const dialog = page.getByRole('dialog', { name: 'Search workspace pages', exact: true });
  const input = dialog.getByRole('combobox');
  await input.fill('Heat exchanger');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(search).toBeFocused();
  await expect(tab(page, 'Projects')).toHaveAttribute('aria-selected', 'true');
  await expect(panel(page, 'Projects').getByRole('button', { name: 'Projects', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(panel(page, 'Projects').getByRole('link', { name: 'Heat exchanger', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(article(page).locator('h2')).toHaveText('Heat exchanger');
});

for (const rtl of [false, true]) {
  test(`mobile contexts keep 44px targets and the active label visible, rtl=${rtl}`, async ({ page }) => {
    if (rtl) await page.getByRole('button', { name: 'Use RTL', exact: true }).click();
    await page.evaluate(() => document.documentElement.dataset.kappaTheme = 'dark');
    await page.setViewportSize({ width: 320, height: 568 });
    await outside(page).click();
    const list = nav(page).getByRole('tablist', { name: 'Navigation context', exact: true });
    for (const name of names) {
      await tab(page, name).click();
      await expect.poll(async () => {
        const target = (await tab(page, name).boundingBox())!;
        const bounds = (await list.boundingBox())!;
        return target.x >= bounds.x && target.x + target.width <= bounds.x + bounds.width;
      }).toBe(true);
      const target = (await tab(page, name).boundingBox())!;
      expect(target.width).toBeGreaterThanOrEqual(44);
      expect(target.height).toBeGreaterThanOrEqual(44);
    }
    const search = nav(page).getByRole('button', { name: 'Search workspace pages', exact: true });
    const searchBox = (await search.boundingBox())!;
    expect(searchBox.width).toBeGreaterThanOrEqual(44);
    expect(searchBox.height).toBeGreaterThanOrEqual(44);
    await search.click();
    const input = page.getByRole('dialog', { name: 'Search workspace pages', exact: true }).getByRole('combobox');
    await input.fill('Heat exchanger');
    await input.press('ArrowDown');
    await input.press('Enter');
    await expect(page.getByRole('dialog', { name: 'Hover navigation', exact: true })).toBeHidden();
    await expect(outside(page)).toBeFocused();
    await expect(article(page).locator('h2')).toHaveText('Heat exchanger');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  });
}

test('active labels animate their width and respect reduced motion', async ({ page }) => {
  await expect(tab(page, 'Home').locator('.sidebar-hover-demo__context-label')).toHaveCSS('transition-duration', '0s');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const label = tab(page, 'AI Chat').locator('.sidebar-hover-demo__context-label');
  await expect(label).toHaveCSS('transition-duration', '0.16s, 0.16s, 0.16s');
  await label.evaluate(el => {
    el.addEventListener('transitionrun', () => {
      el.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 80; });
      el.setAttribute('data-animation-paused', '');
    }, { once: true });
  });
  await tab(page, 'AI Chat').click();
  await expect(label).toHaveAttribute('data-animation-paused');
  const middle = await label.evaluate(el => ({ width: el.getBoundingClientRect().width, textWidth: el.firstElementChild!.scrollWidth, opacity: Number(getComputedStyle(el).opacity) }));
  expect(middle.width).toBeGreaterThan(0);
  expect(middle.width).toBeLessThan(middle.textWidth);
  expect(middle.opacity).toBeGreaterThan(0);
  expect(middle.opacity).toBeLessThan(1);
  await label.evaluate(el => el.getAnimations().forEach(animation => animation.finish()));
  await expect(label).toHaveCSS('opacity', '1');
});

test('resizing reveals every context label when wide and restores compact labels when narrow', async ({ page }) => {
  const handle = page.getByRole('separator', { name: 'Resize sidebar', exact: true });
  async function resizeTo(width: number) {
    const current = Number(await handle.getAttribute('aria-valuenow'));
    const box = (await handle.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + width - current, box.y + box.height / 2, { steps: 8 });
    await page.mouse.up();
    await expect(handle).toHaveAttribute('aria-valuenow', String(width));
  }
  for (const width of [360, 380, 420, 500, 600, 360, 260]) {
    await resizeTo(width);
    const wide = width >= 380;
    for (const name of names) {
      const label = tab(page, name).locator('.sidebar-hover-demo__context-label');
      await expect(label).toHaveCSS('opacity', wide || name === 'Home' ? '1' : '0');
      if (wide) {
        expect(await label.evaluate(el => el.getBoundingClientRect().width)).toBeGreaterThan(0);
        expect(await label.locator('span').evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
      }
    }
    await expect(tab(page, 'Home')).toHaveAttribute('aria-selected', 'true');
    await expect(article(page).locator('h2')).toHaveText('Create a project');
    const bounds = (await nav(page).boundingBox())!;
    const search = (await nav(page).getByRole('button', { name: 'Search workspace pages', exact: true }).boundingBox())!;
    expect(bounds.x + bounds.width - search.x - search.width).toBeLessThan(12);
    expect(await nav(page).locator('[data-slot="sidebar-content"]').evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  }
  await resizeTo(500);
  await page.clock.install();
  await tab(page, 'AI Chat').hover();
  await page.clock.runFor(800);
  await expect(page.getByRole('tooltip', { name: 'AI Chat', exact: true })).toBeHidden();
  await tab(page, 'Projects').click();
  await page.keyboard.press('ArrowRight');
  await expect(tab(page, 'Inbox')).toBeFocused();
  await expect(tab(page, 'Inbox')).toHaveAttribute('aria-selected', 'true');
  await resizeTo(320);
  await expect(tab(page, 'Inbox').locator('.sidebar-hover-demo__context-label')).toHaveCSS('opacity', '1');
  await expect(tab(page, 'Home').locator('.sidebar-hover-demo__context-label')).toHaveCSS('opacity', '0');
  await tab(page, 'AI Chat').hover();
  await page.clock.runFor(800);
  await expect(page.getByRole('tooltip', { name: 'AI Chat', exact: true })).toBeVisible();
  await expect(article(page).locator('h2')).toHaveText('Create a project');
});

test('a saved wide desktop width returns to compact context labels inside the mobile drawer', async ({ page }) => {
  const handle = page.getByRole('separator', { name: 'Resize sidebar', exact: true });
  const box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 240, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(tab(page, 'AI Chat').locator('.sidebar-hover-demo__context-label')).toHaveCSS('opacity', '1');
  await page.setViewportSize({ width: 390, height: 844 });
  await outside(page).click();
  await expect(tab(page, 'AI Chat').locator('.sidebar-hover-demo__context-label')).toHaveCSS('opacity', '0');
  await tab(page, 'AI Chat').click();
  await expect(tab(page, 'AI Chat').locator('.sidebar-hover-demo__context-label')).toHaveCSS('opacity', '1');
  await expect(tab(page, 'Home').locator('.sidebar-hover-demo__context-label')).toHaveCSS('opacity', '0');
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const name of names) await expect(tab(page, name).locator('.sidebar-hover-demo__context-label')).toHaveCSS('opacity', '1');
  await expect(tab(page, 'AI Chat')).toHaveAttribute('aria-selected', 'true');
});

test('label expansion follows the text size instead of a fixed sidebar breakpoint', async ({ page }) => {
  const handle = page.getByRole('separator', { name: 'Resize sidebar', exact: true });
  const box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  const label = tab(page, 'AI Chat').locator('.sidebar-hover-demo__context-label');
  await expect(label).toHaveCSS('opacity', '1');
  const style = await page.addStyleTag({ content: '.sidebar-hover-demo__context-tab.kappa-tabs__trigger { font-size: 18px; line-height: 20px; }' });
  await expect(label).toHaveCSS('opacity', '0');
  await style.evaluate(el => el.parentNode?.removeChild(el));
  await expect(label).toHaveCSS('opacity', '1');
  await expect(tab(page, 'Home')).toHaveAttribute('aria-selected', 'true');
});
