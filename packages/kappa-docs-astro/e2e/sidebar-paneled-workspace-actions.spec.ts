import { expect, test, type Page } from "@playwright/test";

const examplePath = "/examples/appshell/paneled-workspace";
const blockSelector = '[data-sidebar-block="paneled-workspace"]';
const block = (page: Page) => page.locator(blockSelector).locator(".kappa-app-shell");
const navigation = (page: Page) =>
  block(page).getByRole("navigation", { name: "Paneled workspace navigation", exact: true });

async function openExample(page: Page) {
  await page.goto(`${examplePath}?view=Simulation+runs`);
  await expect.poll(() => block(page).evaluate(node =>
    node.closest("astro-island")?.hasAttribute("ssr"),
  )).toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("search opens by button or Ctrl+K, finds pages and runs, and returns focus", async ({ page }) => {
  await openExample(page);
  const searchTrigger = block(page).getByRole("button", { name: "Search or go to…", exact: true });
  const palette = page.getByRole("dialog", { name: "Search paneled workspace", exact: true });
  const input = palette.getByRole("combobox", { name: "Search pages and simulation runs", exact: true });
  await searchTrigger.click();
  await expect(input).toBeFocused();
  await expect(palette.locator(".kappa-command-palette__group-label")).toHaveText([
    "Your work", "Projects", "Templates", "Engineering tools", "Recent simulation runs", "Workspaces",
  ]);
  const popupBounds = (await palette.boundingBox())!;
  expect(popupBounds.width).toBeCloseTo(768, 0);
  expect(popupBounds.y).toBeCloseTo(4, 0);
  await expect(palette.getByRole("button", { name: "Search filters", exact: true })).toHaveCount(0);
  await input.fill("Rotor hover · baseline");
  await expect(palette.getByRole("option")).toHaveCount(1);
  await expect(palette.getByRole("option").first()).toContainText("Rotor hover · baseline");
  await page.keyboard.press("Enter");
  await expect(palette).toBeHidden();
  const detail = page.getByRole("dialog", { name: "Simulation run details", exact: true });
  await expect(detail).toBeVisible();
  await expect(detail.getByRole("heading", { name: "Rotor hover · baseline", exact: true })).toBeFocused();
  await detail.getByRole("button", { name: "Close details", exact: true }).click();
  await expect(detail).toBeHidden();
  await expect(searchTrigger).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(input).toBeFocused();
  await input.fill("CFD Templates");
  await expect(palette.getByRole("option")).toHaveCount(1);
  await expect(palette.getByRole("option").first()).toContainText("CFD Templates");
  await input.fill("missing simulation page");
  await expect(palette.getByRole("option")).toHaveCount(0);
  await expect(palette).toContainText("No pages or simulation runs found.");
  await page.keyboard.press("Escape");
  await expect(palette).toBeHidden();
  await expect(searchTrigger).toBeFocused();
});

test("search shortcuts work beside nonmodal panels and defer to text fields and modal dialogs", async ({ page }) => {
  await openExample(page);
  const shell = block(page);
  const search = page.getByRole("dialog", { name: "Search paneled workspace", exact: true });
  const item = shell.getByRole("button", { name: "Rotor hover · baseline", exact: true });

  await item.click();
  const detail = page.getByRole("dialog", { name: "Simulation run details", exact: true, includeHidden: true });
  await expect(detail).toBeVisible();
  await page.keyboard.press("Control+k");
  await expect(search).toBeVisible();
  await expect(detail).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();
  await page.keyboard.press("Control+k");
  await expect(search).toBeVisible();
  await expect(detail).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();

  const comment = detail.getByRole("textbox", { name: "Add a run note", exact: true });
  await comment.fill("");
  await comment.press("/");
  await expect(comment).toHaveValue("/");
  await expect(search).toBeHidden();

  await detail.getByRole("button", { name: "Close details", exact: true }).click();
  const activityButton = shell.getByRole("button", { name: "Activities", exact: true });
  await activityButton.click();
  const activity = page.getByRole("dialog", { name: "Activities", exact: true, includeHidden: true });
  await expect(activity).toBeVisible();
  await page.keyboard.press("Control+k");
  await expect(search).toBeVisible();
  await expect(activity).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();
  await expect(activity).toBeVisible();
  await activity.getByRole("button", { name: "Close Activities", exact: true }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  await shell.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await expect(drawer).toHaveAttribute("aria-modal", "true");
  const project = drawer.getByRole("link", { name: "Dashboard", exact: true });
  await project.focus();
  await page.keyboard.press("Control+k");
  await expect(search).toBeHidden();
  await page.keyboard.press("Control+k");
  await expect(drawer).toBeVisible();
  await expect(search).toBeHidden();
  await expect(project).toBeFocused();
});

test("Help keyboard shortcuts selection follows reload, Back, and Forward", async ({ page }) => {
  await openExample(page);
  await block(page).getByRole("button", { name: "Help", exact: true }).click();
  await page.getByRole("menuitem", { name: "Keyboard shortcuts", exact: true }).click();
  await expect(block(page).getByRole("heading", { name: "Keyboard shortcuts", exact: true, level: 2 })).toBeVisible();
  await expect(page).toHaveURL(/view=Keyboard\+shortcuts|view=Keyboard%20shortcuts/);

  await page.reload();
  await expect.poll(() => block(page).evaluate(node =>
    node.closest("astro-island")?.hasAttribute("ssr"),
  )).toBe(false);
  await expect(block(page).getByRole("heading", { name: "Keyboard shortcuts", exact: true, level: 2 })).toBeVisible();

  await page.goBack();
  await expect(block(page).getByRole("heading", { name: "Simulation runs", exact: true })).toBeVisible();
  await expect(page).not.toHaveURL(/view=Keyboard/);
  await page.goForward();
  await expect(block(page).getByRole("heading", { name: "Keyboard shortcuts", exact: true, level: 2 })).toBeVisible();
  await expect(page).toHaveURL(/view=Keyboard\+shortcuts|view=Keyboard%20shortcuts/);
});

test("page rows navigate directly without pin controls", async ({ page }) => {
  await openExample(page);
  const nav = navigation(page);
  const projectGroup = nav
    .locator(".paneled-workspace-demo__nav-group")
    .filter({ has: page.getByRole("button", { name: "Projects", exact: true }) });
  const applications = projectGroup.getByRole("link", { name: "Wind Aero Study", exact: true });

  await expect(applications).toBeVisible();
  await applications.hover();
  await expect(projectGroup.getByRole("button", { name: /^(Pin|Unpin) / })).toHaveCount(0);
  await applications.click();
  await expect(nav.getByRole("link", { name: "Overview", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(block(page).getByRole("heading", { name: "Wind Aero Study", exact: true })).toBeVisible();
});

test("mobile navigation keeps the shell surface and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const shell = block(page);
  const utilityRail = shell.getByRole("navigation", { name: "Workspace tools", exact: true });
  const searchTrigger = shell.getByRole("button", { name: "Search or go to…", exact: true });
  const toggle = shell.getByRole("button", { name: "Open sidebar", exact: true });
  await expect(utilityRail).toHaveCSS("height", "40px");
  await expect(searchTrigger).toHaveCSS("translate", "none");
  await toggle.click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  await expect(drawer).toBeVisible();
  const shellSurface = await shell.evaluate(node => getComputedStyle(node).backgroundColor);
  const drawerSurface = await drawer.evaluate(node => getComputedStyle(node).backgroundColor);
  expect(drawerSurface).toBe(shellSurface);
  expect(drawerSurface).not.toBe("rgba(0, 0, 0, 0)");

  await expect(drawer.getByRole("button", { name: "Projects", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(shell.getByRole("button", { name: "Open sidebar", exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("run cancellation and notes persist while panels switch layout", async ({ page }) => {
  await openExample(page);
  await block(page).getByRole("button", { name: "Rotor hover · baseline", exact: true }).click();
  const detail = page.getByRole("dialog", { name: "Simulation run details", exact: true });
  await detail.getByRole("button", { name: "Cancel simulation run", exact: true }).click();
  await expect(detail.getByRole("complementary", { name: "Simulation run properties" })).toContainText("Cancelled");
  await expect(detail.getByRole("button", { name: "Cancel simulation run", exact: true })).toHaveCount(0);
  await detail.getByRole("textbox", { name: "Add a run note", exact: true }).fill("The blade-tip mesh passes the quality check.");
  await detail.getByRole("button", { name: "Add note", exact: true }).click();
  const addedComment = detail.getByRole("listitem").filter({ hasText: "The blade-tip mesh passes the quality check." });
  await expect(addedComment).toContainText("Ros.Space");
  await navigation(page).getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(block(page).locator("[data-panel-mode]")).toHaveAttribute("data-panel-mode", "split");
  await expect(addedComment).toBeVisible();
  await expect(detail.getByRole("complementary", { name: "Simulation run properties" })).toContainText("Cancelled");
  await expect(detail.getByRole("button", { name: "Cancel simulation run", exact: true })).toHaveCount(0);
  await detail.getByRole("button", { name: "Close details", exact: true }).click();
  await block(page).getByRole("tab", { name: /^Cancelled / }).click();
  await expect(block(page).getByRole("button", { name: "Rotor hover · baseline", exact: true })).toBeVisible();
});

test("mobile item details fit the viewport and Escape returns focus after animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const item = block(page).getByRole("button", { name: "Rotor hover · baseline", exact: true });
  await item.click();
  const detail = page.getByRole("dialog", { name: "Simulation run details", exact: true });
  await expect(detail).toBeVisible();
  await expect.poll(async () => {
    const bounds = await detail.boundingBox();
    return bounds !== null && bounds.x >= 0 && bounds.x + bounds.width <= 390;
  }).toBe(true);
  expect(await detail.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(detail).toBeHidden();
  await expect(item).toBeFocused();
});

test("rail links support keyboard entry, new tabs, and browser history", async ({ page, context }) => {
  await openExample(page);
  await navigation(page).getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  const code = navigation(page).getByRole("button", { name: "Templates", exact: true });
  await code.focus();
  await code.press("ArrowDown");
  const repositories = page.getByRole("navigation", { name: "Templates pages", exact: true }).getByRole("link", { name: "Overview", exact: true });
  await expect(repositories).toBeFocused();
  await repositories.press("Escape");
  await expect(repositories).toBeHidden();
  await expect(code).toBeFocused();
  await code.press("ArrowDown");
  await expect(repositories).toBeFocused();
  const newPage = context.waitForEvent("page");
  await repositories.click({ modifiers: ["ControlOrMeta"] });
  const tab = await newPage;
  await expect(tab.getByRole("heading", { name: "All templates", exact: true })).toBeVisible();
  await tab.close();
  await expect(block(page).getByRole("heading", { name: "Simulation runs", exact: true })).toBeVisible();
  await code.press("ArrowDown");
  await repositories.press("Enter");
  await expect(block(page).getByRole("heading", { name: "All templates", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/view=All(?:\+|%20)templates/);
  await page.goBack();
  await expect(block(page).getByRole("heading", { name: "Simulation runs", exact: true })).toBeVisible();
});
