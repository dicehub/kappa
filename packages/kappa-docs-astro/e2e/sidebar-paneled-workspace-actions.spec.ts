import { expect, test, type Page } from "@playwright/test";

const examplePath = "/examples/sidebar/paneled-workspace";
const blockSelector = '[data-sidebar-block="paneled-workspace"]';
const block = (page: Page) => page.locator(blockSelector);
const navigation = (page: Page) =>
  block(page).getByRole("navigation", { name: "Paneled workspace navigation", exact: true });

async function openExample(page: Page) {
  await page.goto(examplePath);
  await expect.poll(() => block(page).evaluate(node =>
    node.closest("astro-island")?.hasAttribute("ssr"),
  )).toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("search opens by button or slash, filters pages and items, and returns focus", async ({ page }) => {
  await openExample(page);
  const searchTrigger = block(page).getByRole("button", {
    name: "Search or go to…",
    exact: true,
  });
  const palette = page.getByRole("dialog", { name: "Search paneled workspace", exact: true });
  const input = palette.getByRole("combobox", {
    name: "Search pages and work items",
    exact: true,
  });

  await searchTrigger.click();
  await expect(input).toBeFocused();
  await input.fill("Refine the rotor mesh");
  await expect(palette.getByRole("option")).toHaveCount(1);
  await expect(palette.getByRole("option").first()).toContainText("Refine the rotor mesh");
  await page.keyboard.press("Enter");
  await expect(palette).toBeHidden();

  const detail = page.getByRole("dialog", { name: "Work item details", exact: true });
  await expect(detail).toBeVisible();
  await expect(detail.getByRole("heading", {
    name: "Refine the rotor mesh",
    exact: true,
  })).toBeFocused();
  await detail.getByRole("button", { name: "Close details", exact: true }).click();
  await expect(detail).toBeHidden();
  await expect(searchTrigger).toBeFocused();

  await page.keyboard.press("/");
  await expect(input).toBeFocused();
  await expect(palette).toBeVisible();
  await input.fill("Milestones");
  await expect(palette.getByRole("option")).toHaveCount(1);
  await expect(palette.getByRole("option").first()).toContainText("Milestones");
  await page.keyboard.press("Escape");
  await expect(palette).toBeHidden();
  await expect(searchTrigger).toBeFocused();
});

test("feature catalog filters pages and keeps navigation pins in sync", async ({ page }) => {
  await openExample(page);
  const nav = navigation(page);
  const catalogTrigger = nav.getByRole("button", { name: "Feature catalog", exact: true });
  const pinned = nav
    .locator(".paneled-workspace-demo__nav-group")
    .filter({ has: page.getByRole("button", { name: "Pinned", exact: true }) });
  const catalog = page.getByRole("dialog", { name: "Feature catalog", exact: true });

  await catalogTrigger.click();
  await expect(catalog).toBeVisible();
  const search = catalog.getByRole("searchbox", { name: "Find a feature", exact: true });
  await search.fill("Milestones");
  await expect(catalog.getByRole("button", { name: "Milestones", exact: true })).toBeVisible();
  const pin = catalog.getByRole("button", { name: "Pin Milestones", exact: true });
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  await pin.click();
  const unpin = catalog.getByRole("button", { name: "Unpin Milestones", exact: true });
  await expect(unpin).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(catalog).toBeHidden();
  await expect(pinned.getByRole("link", { name: "Milestones", exact: true })).toBeVisible();
  await catalogTrigger.click();
  await search.fill("Milestones");

  await unpin.click();
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Escape");
  await expect(catalog).toBeHidden();
  await expect(catalogTrigger).toBeFocused();
  await expect(pinned.getByRole("link", { name: "Milestones", exact: true })).toBeHidden();
});

test("mobile feature catalog opens after the drawer closes and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const shell = block(page);
  const toggle = shell.getByRole("button", { name: "Open sidebar", exact: true });
  await toggle.click();
  const drawer = page.getByRole("dialog").filter({
    has: page.getByRole("button", { name: "Feature catalog", exact: true }),
  });
  await expect(drawer).toBeVisible();

  await drawer.getByRole("button", { name: "Feature catalog", exact: true }).click();
  const catalog = page.getByRole("dialog", { name: "Feature catalog", exact: true });
  await expect(catalog).toBeVisible();
  await expect(drawer).toBeHidden();
  await expect(catalog.getByRole("searchbox", { name: "Find a feature", exact: true })).toBeFocused();
  await catalog.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(catalog).toBeHidden();
  await expect(shell.getByRole("button", { name: "Open sidebar", exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("item status and comments persist while panels switch layout", async ({ page }) => {
  await openExample(page);
  await block(page).getByRole("button", { name: "Refine the rotor mesh", exact: true }).click();
  const detail = page.getByRole("dialog", { name: "Work item details", exact: true });
  await detail.getByRole("button", { name: "Close item", exact: true }).click();
  await expect(detail.getByRole("button", { name: "Reopen item", exact: true })).toBeVisible();
  await detail.getByRole("textbox", { name: "Add a comment", exact: true }).fill("The blade-tip mesh passes the quality check.");
  await detail.getByRole("button", { name: "Add comment", exact: true }).click();
  const addedComment = detail.getByRole("listitem").filter({ hasText: "The blade-tip mesh passes the quality check." });
  await expect(addedComment).toContainText("Alex Morgan");
  await navigation(page).getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(block(page).locator("[data-panel-mode]")).toHaveAttribute("data-panel-mode", "split");
  await expect(addedComment).toBeVisible();
  await expect(detail.getByRole("button", { name: "Reopen item", exact: true })).toBeVisible();
  await detail.getByRole("button", { name: "Close details", exact: true }).click();
  await block(page).getByRole("button", { name: "Closed", exact: true }).click();
  await expect(block(page).getByRole("button", { name: "Refine the rotor mesh", exact: true })).toBeVisible();
});

test("mobile item details fit the viewport and Escape returns focus after animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const item = block(page).getByRole("button", { name: "Refine the rotor mesh", exact: true });
  await item.click();
  const detail = page.getByRole("dialog", { name: "Work item details", exact: true });
  await expect(detail).toBeVisible();
  const bounds = (await detail.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  expect(await detail.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(detail).toBeHidden();
  await expect(item).toBeFocused();
});

test("rail links support keyboard entry, new tabs, and browser history", async ({ page, context }) => {
  await openExample(page);
  await navigation(page).getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  const code = navigation(page).getByRole("button", { name: "Code", exact: true });
  await code.focus();
  await code.press("ArrowDown");
  const repositories = page.getByRole("navigation", { name: "Code pages", exact: true }).getByRole("link", { name: "Repositories", exact: true });
  await expect(repositories).toBeFocused();
  await repositories.press("Escape");
  await expect(repositories).toBeHidden();
  await expect(code).toBeFocused();
  await code.press("ArrowDown");
  await expect(repositories).toBeFocused();
  const newPage = context.waitForEvent("page");
  await repositories.click({ modifiers: ["ControlOrMeta"] });
  const tab = await newPage;
  await expect(tab.getByRole("heading", { name: "Repositories", exact: true })).toBeVisible();
  await tab.close();
  await expect(block(page).getByRole("heading", { name: "Work items", exact: true })).toBeVisible();
  await code.press("ArrowDown");
  await repositories.press("Enter");
  await expect(block(page).getByRole("heading", { name: "Repositories", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/view=Repositories/);
  await page.goBack();
  await expect(block(page).getByRole("heading", { name: "Work items", exact: true })).toBeVisible();
});
