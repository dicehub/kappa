import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-context-menu-demo="${variant}"]`);
const surface = (page: Page, variant: string) =>
  page.locator(`[data-context-menu-surface="${variant}"][data-state="open"]`);
const waitForHydration = async (target: Locator) => {
  await target.scrollIntoViewIfNeeded();
  await expect(target.locator("xpath=ancestor::astro-island[1]")).not.toHaveAttribute("ssr");
};

test.describe("Context Menu documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/context-menu");
  });

  test("renders the public API, examples, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Context Menu" })).toBeVisible();
    for (const variant of ["preview", "resource-list", "tree-view", "submenu", "options"]) {
      await expect(demo(page, variant)).toHaveCount(1);
    }

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/menu",
    );
    await expect(page.locator('pre[data-language="javascript"]').nth(1)).toContainText(
      'from "@dicehub/kappa/components/context-menu"',
    );

    const navigation = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(navigation.getByRole("link", { name: "Previous page: Content Loader" })).toHaveAttribute(
      "href",
      "/docs/components/content-loader",
    );
    await expect(navigation.getByRole("link", { name: "Next page: Data Grid" })).toHaveAttribute(
      "href",
      "/docs/components/data-grid",
    );

    const markdownResponse = await request.get("/docs/components/context-menu.md");
    expect(markdownResponse.ok()).toBe(true);
    const markdown = await markdownResponse.text();
    expect(markdown).toContain("# Context Menu");
    expect(markdown).toContain("ContextMenu.Trigger");
    expect(markdown).not.toContain("On this page");
  });

  test("opens at the pointer and from the keyboard, then restores focus", async ({ page }) => {
    const preview = demo(page, "preview");
    const trigger = preview.getByRole("button", { name: /Run 4189/ });

    await waitForHydration(trigger);
    await trigger.click({ button: "right" });
    const pointerMenu = surface(page, "preview");
    await expect(pointerMenu).toBeVisible();
    await pointerMenu.getByRole("menuitem", { name: "Copy run ID" }).click();
    await expect(preview.getByRole("status")).toHaveText("copy: Run 4189");

    await trigger.focus();
    await page.keyboard.press("Shift+F10");
    const keyboardMenu = surface(page, "preview");
    await expect(keyboardMenu).toBeVisible();
    await expect(keyboardMenu).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test("binds repeated targets and keeps option changes open", async ({ page }) => {
    const resources = demo(page, "resource-list");
    const caseTarget = resources.getByRole("button", { name: /motorBike/ });
    await waitForHydration(caseTarget);
    await caseTarget.click({ button: "right" });
    const caseMenu = page.locator('[data-context-menu-resource="case"][data-state="open"]');
    await caseMenu.getByRole("menuitem", { name: "Rename" }).click();
    await expect(resources.getByRole("status")).toHaveText("rename: motorBike");

    const options = demo(page, "options");
    const optionsTarget = options.getByRole("button", { name: /Project files/ });
    await waitForHydration(optionsTarget);
    await optionsTarget.click({ button: "right" });
    const optionsMenu = surface(page, "options");
    const hidden = optionsMenu.getByRole("menuitemcheckbox", { name: "Show hidden files" });
    await hidden.click();
    await expect(optionsMenu).toBeVisible();
    await expect(hidden).toHaveAttribute("aria-checked", "true");
    await expect(options.getByRole("status")).toContainText("Hidden shown");
  });

  test("keeps submenus above their parent and composes with Tree View", async ({ page }) => {
    const nested = demo(page, "submenu");
    const nestedTarget = nested.getByRole("button", { name: /mesh.foam/ });
    await waitForHydration(nestedTarget);
    await nestedTarget.click({ button: "right" });
    const parentMenu = surface(page, "submenu");
    await expect(parentMenu.locator("..")).toHaveCSS("position", "fixed");
    await parentMenu.getByRole("menuitem", { name: "Move to" }).hover();
    const childMenu = surface(page, "submenu-child");
    await expect(childMenu).toBeVisible();

    const [parentZIndex, childZIndex] = await Promise.all([
      parentMenu.locator("..").evaluate((element) => Number(getComputedStyle(element).zIndex)),
      childMenu.locator("..").evaluate((element) => Number(getComputedStyle(element).zIndex)),
    ]);
    expect(childZIndex).toBeGreaterThan(parentZIndex);
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");

    const tree = demo(page, "tree-view");
    const file = tree.getByRole("treeitem", { name: /controlDict/ });
    await waitForHydration(file);
    await file.click({ button: "right" });
    const fileMenu = page.locator('[data-context-tree-node="control-dict"][data-state="open"]');
    await fileMenu.getByRole("menuitem", { name: "Rename" }).click();
    await expect(tree.getByRole("status")).toHaveText("rename: controlDict");
  });
});
