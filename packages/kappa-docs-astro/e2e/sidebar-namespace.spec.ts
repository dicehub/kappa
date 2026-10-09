import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/sidebar");
  await expect.poll(() => page.locator('[data-sidebar-demo="preview"]').evaluate(node => node.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
});

test("namespace menu shows current details, actions, and a checkmark on the right", async ({ page }) => {
  const demo = page.locator('[data-sidebar-demo="preview"]');
  const trigger = demo.getByRole("button", { name: "Namespace: Engineering", exact: true });
  await trigger.click();
  const menu = page.getByRole("menu", { name: "Namespace: Engineering", exact: true });
  await expect(menu).toHaveAttribute("data-placement", "bottom-start");
  await expect(menu.getByRole("group", { name: "casey@example.test", exact: true })).toBeVisible();
  await expect(menu.getByRole("menuitem")).toHaveCount(6);
  await expect(menu.getByRole("separator")).toHaveCount(3);
  await expect(menu.locator('[data-slot="dropdown-label"]')).toHaveCSS("text-transform", "none");
  const buttonBox = (await trigger.boundingBox())!;
  const menuBox = (await menu.boundingBox())!;
  expect(menuBox.x).toBeCloseTo(buttonBox.x, 0);
  expect(menuBox.y).toBeCloseTo(buttonBox.y + buttonBox.height + 6, 0);
  expect(menuBox.width).toBeCloseTo(300, 0);
  for (const [index, name] of ["Engineering", "Research", "Personal"].entries()) {
    const item = menu.getByRole("menuitemradio", { name, exact: true });
    await expect(item).toHaveCSS("height", "36px");
    await expect(item.locator(".kappa-workspace-switcher__badge")).toHaveCSS("width", "24px");
    await expect(item.locator(".kappa-workspace-switcher__badge svg")).toHaveCSS("width", "14px");
    await expect(item.locator('[data-slot="dropdown-shortcut"]')).toHaveText(new RegExp(`^(⌘|Ctrl )${index + 1}$`));
  }
  await expect(menu.getByRole("menuitemradio", { name: "Engineering", exact: true })).toHaveAttribute("aria-checked", "true");
  await menu.getByRole("menuitemradio", { name: "Research", exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(demo.getByRole("button", { name: "Namespace: Research", exact: true })).toBeFocused();
  await expect(demo.locator(".sidebar-demo__eyebrow")).toHaveText("Research");
  await demo.locator('.sidebar-demo__topbar [data-slot="sidebar-trigger"]').click();
  await demo.getByRole("button", { name: "Namespace: Research", exact: true }).click();
  const collapsedMenu = page.getByRole("menu", { name: "Namespace: Research", exact: true });
  await expect(collapsedMenu).toHaveCSS("width", "300px");
  await expect(collapsedMenu).toHaveAttribute("data-placement", "bottom-start");
  await expect(collapsedMenu.getByRole("menuitemradio", { name: "Research", exact: true })).toHaveAttribute("aria-checked", "true");
});

test("namespace shortcuts and typeahead select only within the open menu", async ({ page }) => {
  const demo = page.locator('[data-sidebar-demo="namespace-selector"]');
  const trigger = demo.getByRole("button", { name: /^Namespace:/ });
  await trigger.focus();
  await trigger.press("ArrowDown");
  let menu = page.getByRole("menu", { name: "Namespace: Engineering", exact: true });
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-activedescendant", (await menu.getByRole("menuitem", { name: "Upgrade", exact: true }).getAttribute("id"))!);
  await page.keyboard.press("Control+2");
  await expect(menu).toBeHidden();
  await expect(trigger).toHaveAccessibleName("Namespace: Research");
  await expect(trigger).toBeFocused();
  const prevented = await trigger.evaluate(node => !node.dispatchEvent(new KeyboardEvent("keydown", { key: "3", ctrlKey: true, bubbles: true, cancelable: true })));
  expect(prevented).toBe(false);
  await expect(demo.locator(".sidebar-demo__eyebrow")).toHaveText("Research");
  await trigger.press("Enter");
  menu = page.getByRole("menu", { name: "Namespace: Research", exact: true });
  await expect(menu).toBeVisible();
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-activedescendant", (await menu.getByRole("menuitem", { name: "Upgrade", exact: true }).getAttribute("id"))!);
  await page.keyboard.press("p");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-activedescendant", (await menu.getByRole("menuitemradio", { name: "Personal", exact: true }).getAttribute("id"))!);
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAccessibleName("Namespace: Personal");
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  await expect(page.getByRole("menu", { name: "Namespace: Personal", exact: true })).toBeVisible();
  await expect(page.getByRole("menu", { name: "Namespace: Personal", exact: true })).toBeFocused();
  await page.keyboard.press("Meta+1");
  await expect(trigger).toHaveAccessibleName("Namespace: Engineering");
  await expect(trigger).toBeFocused();
});

test("mobile namespace menu stays inside the drawer and its add action returns to the page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/examples/components/sidebar/full-screen-mobile");
  const demo = page.locator('[data-sidebar-demo="full-screen-mobile"]');
  await expect.poll(() => demo.evaluate(
    element => element.closest("astro-island")?.hasAttribute("ssr"),
  )).toBe(false);
  const opener = demo.getByRole("button", { name: "Open navigation", exact: true });
  await opener.click();
  const sheet = page.getByRole("dialog", { name: "full-screen-mobile navigation", exact: true });
  const trigger = sheet.getByRole("button", { name: "Namespace: Engineering", exact: true });
  await trigger.click();
  const menu = sheet.getByRole("menu", { name: "Namespace: Engineering", exact: true });
  await expect(menu).toHaveAttribute("data-placement", "bottom-start");
  await expect(menu.getByRole("menuitemradio", { name: "Research", exact: true })).toHaveCSS("height", "36px");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(sheet).toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await menu.getByRole("menuitem", { name: "Add namespace", exact: true }).click();
  await expect(sheet).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(demo.locator(".sidebar-demo__title")).toHaveText("Add namespace");
  await expect(demo.locator(".sidebar-demo__hint")).toContainText("does not create an account or namespace");
  await expect(demo.locator(".sidebar-demo__eyebrow")).toHaveText("Engineering");
});
