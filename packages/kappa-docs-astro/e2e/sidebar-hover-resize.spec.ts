import { expect, test, type Locator, type Page } from "@playwright/test";

const nav = (page: Page) => page.locator('[data-slot="sidebar"]');
const separator = (page: Page) => page.getByRole('separator', { name: 'Resize sidebar', exact: true });
const outside = (page: Page) => page.locator('.kappa-sidebar-layout__toolbar [data-slot="sidebar-trigger"]');
const article = (page: Page) => page.locator('.sidebar-hover-demo__article');
async function drag(page: Page, handle: Locator, delta: number) {
  const box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + delta, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
}
async function center(page: Page) {
  const box = (await article(page).boundingBox())!;
  return box.x + box.width / 2;
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/examples/components/sidebar/hover-reveal');
  await expect.poll(() => page.locator('[data-sidebar-demo="hover-reveal"]').evaluate(el => el.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
});

test('drag clamps to the width limits without collapse or a moving reading center', async ({ page }) => {
  await expect(separator(page)).toHaveAttribute('aria-valuemin', '260');
  await expect(separator(page)).toHaveAttribute('aria-valuemax', '600');
  await expect(separator(page)).toHaveAttribute('aria-controls', (await nav(page).getAttribute('id'))!);
  await separator(page).hover();
  await expect.poll(() => separator(page).evaluate(el => getComputedStyle(el, '::after').width)).toBe('3px');
  await drag(page, separator(page), 160);
  await expect(separator(page)).toHaveAttribute('aria-valuenow', '420');
  expect(await center(page)).toBe(720);
  await drag(page, separator(page), 600);
  await expect(separator(page)).toHaveAttribute('aria-valuenow', '600');
  await expect(nav(page)).toHaveAttribute('data-state', 'expanded');
  expect(await center(page)).toBe(720);
  await drag(page, separator(page), -700);
  await expect(separator(page)).toHaveAttribute('aria-valuenow', '260');
  await expect(nav(page)).toHaveAttribute('data-state', 'expanded');
  await expect(article(page).getByRole('status')).toContainText('0 open requests');
  expect(await center(page)).toBe(720);
});

test('width stays saved through header collapse, a temporary reveal, and mobile mode', async ({ page }) => {
  await drag(page, separator(page), 80);
  await expect(separator(page)).toHaveAttribute('aria-valuenow', '340');
  await nav(page).locator('[data-slot="sidebar-header"]').hover();
  await nav(page).getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await article(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'collapsed');
  await outside(page).hover();
  await expect(nav(page)).toHaveAttribute('data-state', 'peeking');
  await expect(nav(page)).toHaveCSS('width', '340px');
  await expect(separator(page)).toHaveCount(0);
  await outside(page).click();
  await expect(separator(page)).toHaveAttribute('aria-valuenow', '340');
  await page.setViewportSize({ width: 390, height: 844 });
  await outside(page).click();
  const drawer = page.getByRole('dialog', { name: 'Hover navigation', exact: true });
  await expect(drawer).toBeVisible();
  await expect(separator(page)).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(separator(page)).toHaveAttribute('aria-valuenow', '340');
  expect(await center(page)).toBe(720);
});

for (const rtl of [false, true]) {
  for (const end of [false, true]) {
    test(`pointer and keyboard limits follow physical placement, rtl=${rtl}, end=${end}`, async ({ page }) => {
      if (rtl) await page.getByRole('button', { name: 'Use RTL', exact: true }).click();
      if (end) await page.getByRole('button', { name: 'Change side', exact: true }).click();
      const right = rtl !== end;
      await drag(page, separator(page), right ? -70 : 70);
      await expect(separator(page)).toHaveAttribute('aria-valuenow', '330');
      await separator(page).press('Enter');
      await expect(nav(page)).toHaveAttribute('data-state', 'expanded');
      await separator(page).press(right ? 'ArrowLeft' : 'ArrowRight');
      await expect.poll(async () => Number(await separator(page).getAttribute('aria-valuenow'))).toBeGreaterThan(330);
      await separator(page).press(right ? 'End' : 'Home');
      await expect(separator(page)).toHaveAttribute('aria-valuenow', '260');
      await expect(nav(page)).toHaveAttribute('data-state', 'expanded');
      expect(await center(page)).toBe(720);
    });
  }
}

test('dragging disables layout transitions and releases its state on pointer up', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const box = (await separator(page).boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(page.locator('[data-slot="sidebar-provider"]')).toHaveAttribute('data-resizing');
  const frame = page.locator('.kappa-sidebar-layout__content-frame');
  expect(await frame.evaluate(el => getComputedStyle(el, '::before').transitionDuration)).toBe('0s');
  for (const delta of [30, 60, 100]) {
    await page.mouse.move(box.x + box.width / 2 + delta, box.y + box.height / 2);
    await expect(separator(page)).toHaveAttribute('aria-valuenow', String(260 + delta));
    expect(await center(page)).toBe(720);
  }
  await page.mouse.up();
  await expect(page.locator('[data-slot="sidebar-provider"]')).not.toHaveAttribute('data-resizing');
});

test('an icon rail without resize collapse hides its separator and restores focused controls', async ({ page }) => {
  await page.goto('/examples/components/sidebar/ownership');
  await expect.poll(() => page.locator('astro-island').evaluate(el => el.hasAttribute('ssr'))).toBe(false);
  const root = page.locator('#icon-no-collapse-nav');
  const handle = page.getByRole('separator', { name: 'Resize pinned icon navigation', exact: true });
  const toggle = page.locator('[data-slot="sidebar-trigger"][aria-controls="icon-no-collapse-nav"]');
  await expect(handle).toHaveAttribute('aria-valuemin', '180');
  await expect(handle).toHaveAttribute('aria-valuenow', '240');
  await handle.focus();
  await handle.press('c');
  await expect(root).toHaveAttribute('data-state', 'collapsed');
  await expect(root).toHaveCSS('width', '52px');
  await expect(handle).toHaveCount(0);
  await expect(toggle).toBeFocused();
  await toggle.press('Enter');
  await expect(root).toHaveAttribute('data-state', 'expanded');
  await expect(handle).toHaveAttribute('aria-valuenow', '240');
  await handle.press('Enter');
  await expect(root).toHaveAttribute('data-state', 'expanded');
});
