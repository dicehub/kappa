import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-dropdown-demo="${variant}"]`);
const surface = (page: Page, variant: string) =>
  page.locator(`[data-dropdown-surface="${variant}"][data-state="open"]`);
const expectActiveItem = async (menu: Locator, item: Locator) => {
  await expect(menu).toBeFocused();
  const itemId = await item.getAttribute("id");
  expect(itemId).toBeTruthy();
  await expect(menu).toHaveAttribute("aria-activedescendant", itemId!);
};
const openDemo = async (page: Page, variant: string, trigger: Locator) => {
  await trigger.click();
  await expect(surface(page, variant)).toBeVisible();
  return surface(page, variant);
};

test.describe("Dropdown documentation", () => {
  test.beforeEach(async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto("/docs/components/dropdown");
    await page.waitForLoadState("networkidle");
    expect(pageErrors, "Dropdown demos must hydrate without runtime errors").toEqual([]);
  });

  test("renders every example, reference, navigation link, TOC entry, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Dropdown" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);

    for (const variant of [
      "preview",
      "basic",
      "icons-inset",
      "action-callbacks",
      "checkbox-items",
      "radio-group",
      "nested-submenu",
      "custom-trigger",
      "navigation-links",
      "controlled",
      "destructive-disabled",
      "long-list",
      "context-menu",
      "right-to-left",
    ]) {
      await expect(demo(page, variant)).toHaveCount(1);
    }

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/menu",
    );
    await expect(page.locator("#composition")).toContainText(
      "Content owns its portal instead of requiring a separate Portal part.",
    );

    const snippets = page.locator("pre[data-language]");
    const installationSnippets = page.locator('pre[data-language="javascript"]');
    await expect(installationSnippets.nth(1)).toContainText(
      'from "@dicehub/kappa/components/dropdown"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(installationSnippets).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Dropdown", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(
      compact.getByRole("link", { name: "Previous page: Drawer" }),
    ).toHaveAttribute("href", "/docs/components/drawer");
    await expect(compact.getByRole("link", { name: "Next page: Editable" })).toHaveAttribute(
      "href",
      "/docs/components/editable",
    );
    await expect(footer.getByRole("link", { name: "Drawer", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Editable", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Reference Differences",
      "Keyboard Navigation",
      "Behavior and Selection",
      "Examples",
      "Basic",
      "Icons and Inset Alignment",
      "Action Callbacks",
      "Checkbox Items",
      "Radio Group",
      "Nested Submenu",
      "Custom Trigger",
      "Navigation Links",
      "Controlled Open State",
      "Destructive and Disabled Items",
      "Long List",
      "Context Menu",
      "Right-to-left",
      "Accessibility",
      "API Reference",
      "Dropdown.Root",
      "Dropdown.Content",
      "Items",
      "Selection Parts",
      "Parts",
      "Events",
      "Exports",
    ]);

    const response = await request.get("/docs/components/dropdown.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Dropdown");
    expect(markdown).toContain("## [Keyboard Navigation](#keyboard-navigation)");
    expect(markdown).toContain("### [Nested Submenu](#nested-submenu)");
    expect(markdown).toContain("Dropdown.CheckboxItem");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("opens from the keyboard, navigates, selects, dismisses, and restores focus", async ({
    page,
  }) => {
    const preview = demo(page, "preview");
    const trigger = preview.getByRole("button", { name: "Run actions" });
    await expect(trigger.locator('[data-slot="dropdown-indicator"]')).toHaveCSS(
      "margin-inline-start",
      "6px",
    );

    await trigger.focus();
    await trigger.press("Enter");
    const menu = surface(page, "preview");
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute("role", "menu");
    await expect(menu).toHaveAttribute("aria-label", "Run actions");
    await expectActiveItem(menu, menu.getByRole("menuitem", { name: "Open results" }));

    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.press("ArrowDown");
    await expect(menu).toBeVisible();
    await expectActiveItem(menu, menu.getByRole("menuitem", { name: "Open results" }));

    await page.keyboard.type("down");
    await expectActiveItem(menu, menu.getByRole("menuitem", { name: "Download archive" }));
    await page.keyboard.press("Enter");
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(surface(page, "preview")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(surface(page, "preview")).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.getByRole("heading", { level: 1, name: "Dropdown" }).click();
    await expect(surface(page, "preview")).toHaveCount(0);
  });

  test("routes action values and skips disabled items", async ({ page }) => {
    const callbacks = demo(page, "action-callbacks");
    await openDemo(
      page,
      "action-callbacks",
      callbacks.getByRole("button", { name: "Choose action" }),
    );
    await surface(page, "action-callbacks")
      .getByRole("menuitem", { name: "Share result" })
      .click();
    await expect(callbacks.getByRole("status")).toHaveText("share");

    const states = demo(page, "destructive-disabled");
    const trigger = states.getByRole("button", { name: "More actions" });
    await trigger.focus();
    await trigger.press("ArrowDown");
    const menu = surface(page, "destructive-disabled");
    const disabled = menu.getByRole("menuitem", { name: "Restart while active" });
    const destructive = menu.getByRole("menuitem", { name: "Delete permanently" });
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    await page.keyboard.press("ArrowDown");
    await expectActiveItem(menu, destructive);
    await expect(destructive).toHaveAttribute("data-variant", "destructive");
    const destructiveColor = await destructive.evaluate(
      (element) => getComputedStyle(element).color,
    );
    const defaultColor = await menu
      .getByRole("menuitem", { name: "View details" })
      .evaluate((element) => getComputedStyle(element).color);
    expect(destructiveColor).not.toBe(defaultColor);
  });

  test("keeps checkbox and radio menus open while state changes", async ({ page }) => {
    const checkboxDemo = demo(page, "checkbox-items");
    await openDemo(
      page,
      "checkbox-items",
      checkboxDemo.getByRole("button", { name: "Visible columns" }),
    );
    const checkboxMenu = surface(page, "checkbox-items");
    const activity = checkboxMenu.getByRole("menuitemcheckbox", { name: "Activity" });
    const compact = checkboxMenu.getByRole("menuitemcheckbox", { name: "Compact rows" });
    await expect(activity).toHaveAttribute("aria-checked", "true");
    await activity.click();
    await expect(checkboxMenu).toBeVisible();
    await expect(activity).toHaveAttribute("aria-checked", "false");
    await compact.click();
    await expect(compact).toHaveAttribute("aria-checked", "true");
    await expect(checkboxDemo.getByRole("status")).toContainText(
      "Activity hidden · Rows compact",
    );
    await page.keyboard.press("Escape");

    const radioDemo = demo(page, "radio-group");
    await openDemo(
      page,
      "radio-group",
      radioDemo.getByRole("button", { name: /Density: comfortable/ }),
    );
    const radioMenu = surface(page, "radio-group");
    const comfortable = radioMenu.getByRole("menuitemradio", { name: "Comfortable" });
    const compactRadio = radioMenu.getByRole("menuitemradio", { name: "Compact" });
    await expect(comfortable).toHaveAttribute("aria-checked", "true");
    await compactRadio.click();
    await expect(radioMenu).toBeVisible();
    await expect(compactRadio).toHaveAttribute("aria-checked", "true");
    await expect(radioDemo.getByRole("status")).toHaveText("Selected: compact");
  });

  test("opens nested menus with arrow keys and closes the full chain after selection", async ({
    page,
  }) => {
    const nested = demo(page, "nested-submenu");
    const trigger = nested.getByRole("button", { name: "Export" });
    await trigger.focus();
    await trigger.press("ArrowDown");
    const parent = surface(page, "nested-submenu");
    await expectActiveItem(parent, parent.getByRole("menuitem", { name: "Quick export" }));
    const disabledSubTrigger = parent.getByRole("menuitem", { name: "Legacy export" });
    await expect(disabledSubTrigger).toHaveAttribute("aria-disabled", "true");
    const disabledKeyPrevented = await disabledSubTrigger.evaluate((element) => {
      const event = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
      });
      element.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(disabledKeyPrevented).toBe(true);
    await expect(surface(page, "nested-disabled-child")).toHaveCount(0);
    await expect(parent).toBeFocused();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowDown");
    const subTrigger = parent.getByRole("menuitem", { name: "Export as" });
    await expectActiveItem(parent, subTrigger);
    await page.keyboard.press("ArrowRight");

    const child = surface(page, "nested-submenu-child");
    await expect(child).toBeVisible();
    await expectActiveItem(child, child.getByRole("menuitem", { name: "CSV table" }));
    await page.keyboard.press("ArrowDown");
    await expectActiveItem(child, child.getByRole("menuitem", { name: "JSON data" }));
    await page.keyboard.press("Enter");
    await expect(child).toHaveCount(0);
    await expect(parent).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("keeps custom triggers and navigation links semantic", async ({ page }) => {
    const custom = demo(page, "custom-trigger");
    const customTrigger = custom.getByRole("button", { name: "Open account menu" });
    await expect(customTrigger).toHaveClass(/kappa-button/);
    await expect(customTrigger).toHaveClass(/kappa-dropdown__trigger/);
    await customTrigger.click();
    await expect(surface(page, "custom-trigger")).toBeVisible();
    await page.keyboard.press("Escape");

    const links = demo(page, "navigation-links");
    await openDemo(
      page,
      "navigation-links",
      links.getByRole("button", { name: "Documentation" }),
    );
    const linkMenu = surface(page, "navigation-links");
    await expect(linkMenu.getByRole("menuitem", { name: "Button" })).toHaveAttribute(
      "href",
      "/docs/components/button",
    );
    await expect(linkMenu.getByRole("menuitem", { name: "Ark UI Menu" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    await expect(linkMenu.getByRole("menuitem", { name: "Ark UI Menu" })).toHaveAttribute(
      "target",
      "_blank",
    );
    await expect(linkMenu.getByRole("menuitem", { name: "Unavailable guide" })).not.toHaveAttribute(
      "href",
      /.+/,
    );

    await page.keyboard.press("Escape");
    const linkTrigger = links.getByRole("button", { name: "Documentation" });
    await linkTrigger.focus();
    await linkTrigger.press("ArrowDown");
    const keyboardMenu = surface(page, "navigation-links");
    await expectActiveItem(keyboardMenu, keyboardMenu.getByRole("menuitem", { name: "Button" }));
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/docs\/components\/button\/?$/);
  });

  test("opens the context menu from the keyboard", async ({ page }) => {
    const context = demo(page, "context-menu");
    const target = context.getByRole("button", { name: "Right-click or press Shift+F10" });
    await expect(target).toHaveAttribute("aria-haspopup", "menu");
    await expect(target).toHaveAttribute("aria-expanded", "false");
    await expect(target).toHaveAttribute("type", "button");
    await target.focus();
    await page.keyboard.press("Shift+F10");
    const menu = surface(page, "context-menu");
    await expect(menu).toBeVisible();
    await expect(target).toHaveAttribute("aria-expanded", "true");
    const menuId = await menu.getAttribute("id");
    expect(menuId).toBeTruthy();
    await expect(target).toHaveAttribute("aria-controls", menuId!);
    await expect(menu).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expectActiveItem(menu, menu.getByRole("menuitem", { name: "Inspect cell" }));
    await page.keyboard.press("Escape");
    await expect(target).toBeFocused();

    await target.click({ button: "right" });
    await expect(surface(page, "context-menu")).toBeVisible();
  });

  test("uses RTL direction for submenu placement and keyboard navigation", async ({ page }) => {
    const rtl = demo(page, "right-to-left");
    const trigger = rtl.getByRole("button", { name: "إجراءات التشغيل" });
    await trigger.focus();
    await trigger.press("ArrowDown");
    const parent = surface(page, "right-to-left");
    await expect(parent).toHaveAttribute("dir", "rtl");
    await page.keyboard.press("ArrowDown");
    const subTrigger = parent.getByRole("menuitem", { name: "تصدير كـ" });
    await expectActiveItem(parent, subTrigger);
    await page.keyboard.press("ArrowLeft");

    const child = surface(page, "right-to-left-child");
    await expect(child).toBeVisible();
    await expect(child).toHaveAttribute("dir", "rtl");
    await expect(child).toHaveAttribute("data-side", "left");
    await expectActiveItem(child, child.getByRole("menuitem", { name: "جدول CSV" }));
    await page.keyboard.press("ArrowRight");
    await expect(child).toHaveCount(0);
    await expectActiveItem(parent, subTrigger);
  });

  test("supports controlled state, scrolling, themes, reduced motion, and mobile bounds", async ({
    page,
  }) => {
    const controlled = demo(page, "controlled");
    const controlledTrigger = controlled.getByRole("button", { name: "Controlled menu" });
    await expect(controlled.getByRole("status")).toHaveText("State: closed");
    await controlledTrigger.click();
    await expect(controlled.getByRole("status")).toHaveText("State: open");
    await page.keyboard.press("Escape");
    await expect(controlled.getByRole("status")).toHaveText("State: closed");

    const longList = demo(page, "long-list");
    await openDemo(
      page,
      "long-list",
      longList.getByRole("button", { name: "Recent runs" }),
    );
    const listSurface = surface(page, "long-list");
    const dimensions = await listSurface.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(dimensions.clientHeight).toBeLessThanOrEqual(224);
    expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight);
    const lightBackground = await listSurface.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await longList.getByRole("button", { name: "Recent runs" }).click();
    await expect
      .poll(() =>
        surface(page, "long-list").evaluate(
          (element) => getComputedStyle(element).backgroundColor,
        ),
      )
      .not.toBe(lightBackground);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(surface(page, "long-list")).toHaveCSS("animation-name", "none");
    await page.keyboard.press("Escape");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const mobileTrigger = demo(page, "preview").getByRole("button", { name: "Run actions" });
    await mobileTrigger.click();
    const mobileSurface = surface(page, "preview");
    const mobilePositioner = page.locator('[data-slot="dropdown-positioner"]', {
      has: mobileSurface,
    });
    await expect(mobilePositioner).toHaveCSS("z-index", "1000");
    const box = await mobileSurface.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
