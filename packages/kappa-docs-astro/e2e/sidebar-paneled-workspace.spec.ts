import { expect, test, type Page } from "@playwright/test";

const examplePath = "/examples/appshell/paneled-workspace";
const blockSelector = '[data-sidebar-block="paneled-workspace"]';

const block = (page: Page) => page.locator(blockSelector).locator(".kappa-app-shell");
const panels = (page: Page) => block(page).locator(".kappa-app-shell__panels");
const navigation = (page: Page) =>
  block(page).getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
const categoryPages = (page: Page, category: string) =>
  page.getByRole("navigation", { name: `${category} pages`, exact: true });

async function openExample(page: Page) {
  await page.goto(examplePath);
  await expect.poll(() => block(page).evaluate(node =>
    node.closest("astro-island")?.hasAttribute("ssr"),
  )).toBe(false);
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth <= window.innerWidth &&
    document.body.scrollWidth <= window.innerWidth,
  )).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("server output and gallery keep the complete Paneled Workspace source", async ({ page, request }) => {
  const response = await request.get(examplePath);
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('data-sidebar-block="paneled-workspace"');
  expect(html).toContain("Search or go to…");
  expect(html).toContain("Work items");

  await page.goto("/docs/blocks/appshell");
  const examples = page.locator("[data-block-example]");
  await expect(examples).toHaveCount(18);
  const ids = await examples.evaluateAll(nodes =>
    nodes.map(node => node.getAttribute("data-block-example")),
  );
  expect(ids.indexOf("paneled-workspace")).toBe(ids.indexOf("minimal-workspace") + 1);

  const example = page.locator('[data-block-example="paneled-workspace"]');
  await expect(example.getByRole("link", { name: /Open full example/ })).toHaveAttribute(
    "href",
    examplePath,
  );
  const source = example.locator("[data-code-full] code");
  await expect(source).toContainText("AppShell.Root");
  await expect(source).toContainText("AppShell.Panels");
  await expect(source).not.toContainText("<style");
  await expect(source).not.toContainText("style src=");

  const markdown = await request.get("/docs/blocks/appshell.md");
  expect(markdown.ok()).toBe(true);
  expect(await markdown.text()).toContain("Paneled Workspace");
});

test("header stays centered and navigation categories work in expanded and collapsed modes", async ({ page }) => {
  await openExample(page);
  const shell = block(page);
  const topbar = shell.locator(".kappa-sidebar-layout__site-header");
  const search = shell.getByRole("button", { name: "Search or go to…", exact: true });
  await expect(topbar).toHaveCSS("height", "48px");
  await expect(search.locator("kbd")).toHaveText(["Ctrl", "K"]);
  await expect(search.locator(".kappa-kbd-group")).toBeVisible();
  const shellBounds = (await shell.boundingBox())!;
  const searchBounds = (await search.boundingBox())!;
  expect(searchBounds.width).toBeCloseTo(344, 0);
  expect(searchBounds.height).toBeCloseTo(32, 0);
  expect(searchBounds.x + searchBounds.width / 2).toBeCloseTo(
    shellBounds.x + shellBounds.width / 2,
    1,
  );
  await page.setViewportSize({ width: 1920, height: 1000 });
  const wideShellBounds = (await shell.boundingBox())!;
  const wideSearchBounds = (await search.boundingBox())!;
  expect(wideSearchBounds.width).toBeCloseTo(440, 0);
  expect(wideSearchBounds.x + wideSearchBounds.width / 2).toBeCloseTo(
    wideShellBounds.x + wideShellBounds.width / 2,
    1,
  );
  await page.setViewportSize({ width: 1440, height: 1000 });

  const nav = navigation(page);
  await expect(nav).toHaveCSS("width", "240px");
  const frameBefore = (await block(page).locator(".kappa-app-shell__panel-frame").boundingBox())!;
  expect(frameBefore.x).toBeCloseTo(240, 0);
  expect(frameBefore.y).toBeCloseTo(48, 0);
  expect(frameBefore.width).toBeCloseTo(1160, 0);
  expect(frameBefore.height).toBeCloseTo(944, 0);

  await expect(nav.getByRole("button", { name: "Pinned", exact: true })).toHaveCount(0);
  await expect(nav.getByRole("link", { name: "Overview", exact: true })).toBeVisible();

  await expect(nav.locator(".paneled-workspace-demo__context-label")).toHaveText("Your work");
  const categories = ["Projects", "Templates", "Engineering tools", "Aircraft", "Simulation", "Flight testing", "Propulsion", "Flight operations", "Reports"];
  for (const category of categories) {
    await expect(nav.getByRole("button", { name: category, exact: true })).toBeVisible();
  }
  const navigationRowHeights = await nav
    .locator(".paneled-workspace-demo__nav-group .kappa-sidebar__menu-button:visible")
    .evaluateAll(rows => rows.map(row => Math.round(row.getBoundingClientRect().height)));
  expect(navigationRowHeights.length).toBeGreaterThan(0);
  expect(navigationRowHeights.every(height => height === 28)).toBe(true);
  expect((await nav.getByRole("link", { name: "Overview", exact: true }).boundingBox())!.height)
    .toBeCloseTo(28, 0);
  expect((await nav.getByRole("button", { name: "Projects", exact: true }).boundingBox())!.height)
    .toBeCloseTo(28, 0);

  const plan = nav.getByRole("button", { name: "Projects", exact: true });
  const planGroup = nav.locator(".paneled-workspace-demo__nav-group").filter({ has: page.getByRole("button", { name: "Projects", exact: true }) });
  const workItems = planGroup.getByRole("link", { name: "Overview", exact: true });
  const milestones = planGroup.getByRole("link", { name: "Applications", exact: true });
  await expect(workItems).toBeVisible();
  await expect(milestones).toBeVisible();
  await plan.click();
  await expect(workItems).toBeHidden();
  await plan.click();
  await expect(workItems).toBeVisible();
  await expect(milestones).toBeVisible();

  const codeExpanded = nav.getByRole("button", { name: "Aircraft", exact: true });
  const codeGroup = nav.locator(".paneled-workspace-demo__nav-group").filter({ has: page.getByRole("button", { name: "Aircraft", exact: true }) });
  const repositoriesExpanded = codeGroup.getByRole("link", { name: "Airframe", exact: true });
  const branchesExpanded = codeGroup.getByRole("link", { name: "Configurations", exact: true });
  await expect(repositoriesExpanded).toBeHidden();
  await codeExpanded.click();
  await expect(repositoriesExpanded).toBeVisible();
  await expect(branchesExpanded).toBeVisible();

  const canvasBefore = (await block(page).locator(".kappa-app-shell__panel-frame").boundingBox())!;
  await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(nav).toHaveCSS("width", "44px");
  const canvasAfter = (await block(page).locator(".kappa-app-shell__panel-frame").boundingBox())!;
  expect(canvasAfter.x).toBeCloseTo(44, 0);
  expect(canvasAfter.y).toBeCloseTo(48, 0);
  expect(canvasAfter.width).toBeGreaterThan(canvasBefore.width);

  await plan.hover();
  const planPages = categoryPages(page, "Projects");
  await expect(planPages).toBeVisible();
  const afterHover = (await block(page).locator(".kappa-app-shell__panel-frame").boundingBox())!;
  expect(afterHover.x).toBeCloseTo(canvasAfter.x, 1);
  expect(afterHover.width).toBeCloseTo(canvasAfter.width, 1);
  await planPages.getByRole("link", { name: "Overview", exact: true }).click();
  await search.hover();
  await search.focus();
  await expect(planPages).toBeHidden();
  await expect(nav).toHaveCSS("width", "44px");

  const code = nav.getByRole("button", { name: "Aircraft", exact: true });
  await code.focus();
  const codePages = categoryPages(page, "Aircraft");
  await expect(codePages).toBeVisible();
  const repositories = codePages.getByRole("link", { name: "Airframe", exact: true });
  await repositories.focus();
  await expect(repositories).toBeFocused();
  await repositories.press("Enter");
  await expect(codePages).toBeHidden();
  await expect(nav).toHaveCSS("width", "44px");
});

test("work item search, status filters, and local creation update the list", async ({ page }) => {
  await openExample(page);
  const list = block(page).getByRole("list", { name: "Work items", exact: true });
  const rows = list.getByRole("listitem");
  await expect(block(page).getByRole("heading", { name: "Work items", exact: true })).toBeVisible();
  const allItems = block(page).getByRole("tab", { name: "All items", exact: true });
  const addView = block(page).getByRole("button", { name: "Add view", exact: true });
  await expect(allItems).toHaveAttribute("aria-selected", "true");
  await expect(addView).toBeVisible();
  await expect(list.getByRole("button", { name: "Refine the rotor mesh", exact: true })).toBeVisible();
  await expect(list.getByRole("button", { name: "Compare inlet boundary conditions", exact: true })).toBeVisible();
  await expect(list.getByRole("button", { name: "Review heat exchanger results", exact: true })).toBeVisible();

  const filter = block(page).getByRole("searchbox", { name: "Filter work items", exact: true });
  await filter.fill("rotor mesh");
  await expect(rows).toHaveCount(1);
  await expect(list.getByRole("button", { name: "Refine the rotor mesh", exact: true })).toBeVisible();
  await filter.fill("");

  const all = block(page).getByRole("radio", { name: "All", exact: true });
  const open = block(page).getByRole("radio", { name: "Open", exact: true });
  const closed = block(page).getByRole("radio", { name: "Closed", exact: true });
  await expect(all).toBeChecked();
  const allCount = await rows.count();
  await open.click();
  await expect(open).toBeChecked();
  const openCount = await rows.count();
  await closed.click();
  await expect(closed).toBeChecked();
  const closedCount = await rows.count();
  expect(openCount).toBeGreaterThan(0);
  expect(closedCount).toBeGreaterThan(0);
  expect(openCount + closedCount).toBe(allCount);

  await all.click();
  await expect(all).toBeChecked();
  await expect(allItems).toHaveAttribute("aria-selected", "true");
  await addView.click();
  await page.getByRole("menuitem", { name: "Open items", exact: true }).click();
  const openItems = block(page).getByRole("tab", { name: "Open items", exact: true });
  await expect(openItems).toHaveAttribute("aria-selected", "true");
  await expect(allItems).toHaveAttribute("aria-selected", "false");
  await expect(open).toBeChecked();
  await allItems.click();
  await expect(allItems).toHaveAttribute("aria-selected", "true");
  await expect(rows).toHaveCount(allCount);
  const beforeCreate = await rows.count();
  await block(page).getByRole("button", { name: "New item", exact: true }).click();
  await expect(rows).toHaveCount(beforeCreate + 1);
  const newItemDialog = page.getByRole("dialog", { name: "Work item details", exact: true });
  await expect(newItemDialog).toBeVisible();
  const newItemTitle = await newItemDialog.getByRole("heading", { level: 2 }).textContent();
  expect(newItemTitle).toMatch(/^Untitled work item \d+$/);
  await expect(list.getByRole("button", { name: newItemTitle!, exact: true })).toBeVisible();
});

test("details use a nonmodal overlay below the threshold and a keyboard-resizable split above it", async ({ page }) => {
  await openExample(page);
  const workspace = panels(page);
  const nav = navigation(page);
  await expect(workspace).toHaveAttribute("data-panel-mode", "overlay");
  expect((await workspace.boundingBox())!.width).toBeLessThan(1200);

  const first = block(page).getByRole("button", { name: "Refine the rotor mesh", exact: true });
  await first.click();
  const dialog = page.getByRole("dialog", { name: "Work item details", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).not.toHaveAttribute("aria-modal", "true");
  await expect(dialog.getByRole("heading", { name: "Refine the rotor mesh", exact: true })).toBeFocused();
  await expect(dialog.getByRole("button", { name: "Close details", exact: true })).toBeVisible();

  // The list remains interactive while its nonmodal detail overlay is open.
  const second = block(page).getByRole("button", {
    name: "Compare inlet boundary conditions",
    exact: true,
  });
  await second.click({ position: { x: 4, y: 8 } });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", {
    name: "Compare inlet boundary conditions",
    exact: true,
  })).toBeVisible();
  await dialog.getByRole("button", { name: "Close details", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(second).toBeFocused();

  const beforeCollapse = (await workspace.boundingBox())!;
  await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(nav).toHaveCSS("width", "44px");
  await expect(workspace).toHaveAttribute("data-panel-mode", "split");
  const afterCollapse = (await workspace.boundingBox())!;
  expect(afterCollapse.width).toBeGreaterThanOrEqual(1200);
  expect(afterCollapse.width).toBeGreaterThan(beforeCollapse.width);

  const splitPanels = workspace.locator('[data-slot="resizable-panel"]');
  await expect(splitPanels).toHaveCount(2);
  await first.click();
  const splitDialog = splitPanels.nth(1).getByRole("dialog", {
    name: "Work item details",
    exact: true,
  });
  await expect(splitDialog).toBeVisible();
  await expect(splitDialog.getByRole("heading", {
    name: "Refine the rotor mesh",
    exact: true,
  })).toBeVisible();
  const separator = workspace.getByRole("separator");
  const initialValue = await separator.getAttribute("aria-valuenow");
  await separator.focus();
  await separator.press("ArrowRight");
  await expect(separator).not.toHaveAttribute("aria-valuenow", initialValue ?? "");

  // Expand the rail again. The selected detail stays in the same workspace.
  await nav.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await expect(workspace).toHaveAttribute("data-panel-mode", "overlay");
  await expect(page.getByRole("dialog", { name: "Work item details", exact: true })).toContainText(
    "Refine the rotor mesh",
  );
});

test("detail overlay uses 80 percent of the workspace width at 600 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 844 });
  await openExample(page);
  const workspace = panels(page);
  await expect(workspace).toHaveAttribute("data-panel-mode", "overlay");
  await block(page).getByRole("button", { name: "Refine the rotor mesh", exact: true }).click();

  const detail = page.getByRole("dialog", { name: "Work item details", exact: true });
  await expect(detail).toBeVisible();
  const detailPositioner = workspace.locator(
    ".kappa-dialog__positioner:has(> .kappa-app-shell__detail)",
  );
  const positionerBounds = (await detailPositioner.boundingBox())!;
  const detailBounds = (await detail.boundingBox())!;
  expect(detailBounds.width).toBeCloseTo(positionerBounds.width * 0.8, 0);
});

test("list and detail panels scroll independently; the activity rail opens a local dialog", async ({ page }) => {
  await openExample(page);
  const nav = navigation(page);
  const workspace = panels(page);
  await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(workspace).toHaveAttribute("data-panel-mode", "split");
  await block(page).getByRole("button", { name: "Refine the rotor mesh", exact: true }).click();

  const splitPanels = workspace.locator('[data-slot="resizable-panel"]');
  const listScroll = workspace.locator(".paneled-workspace-demo__list-scroll");
  const detailScroll = workspace.locator(".paneled-workspace-demo__detail-scroll");
  await expect(splitPanels).toHaveCount(2);
  await expect(listScroll).toHaveCSS("overflow-y", "auto");
  await expect(detailScroll).toHaveCSS("overflow-y", "auto");
  expect(await listScroll.getByRole("listitem").count()).toBeGreaterThanOrEqual(12);
  await expect.poll(() => listScroll.evaluate(node =>
    (node as HTMLElement).scrollHeight > (node as HTMLElement).clientHeight,
  )).toBe(true);

  await page.setViewportSize({ width: 1440, height: 640 });
  await expect.poll(() => detailScroll.evaluate(node =>
    (node as HTMLElement).scrollHeight > (node as HTMLElement).clientHeight,
  )).toBe(true);

  const listBounds = (await listScroll.boundingBox())!;
  await page.mouse.move(listBounds.x + listBounds.width / 2, listBounds.y + listBounds.height / 2);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => listScroll.evaluate(node => (node as HTMLElement).scrollTop)).toBeGreaterThan(0);
  const listScrollTop = await listScroll.evaluate(node => (node as HTMLElement).scrollTop);
  expect(await detailScroll.evaluate(node => (node as HTMLElement).scrollTop)).toBe(0);

  const detailBounds = (await detailScroll.boundingBox())!;
  await page.mouse.move(detailBounds.x + detailBounds.width / 2, detailBounds.y + detailBounds.height / 2);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => detailScroll.evaluate(node => (node as HTMLElement).scrollTop)).toBeGreaterThan(0);
  expect(await listScroll.evaluate(node => (node as HTMLElement).scrollTop)).toBe(listScrollTop);

  const activityButton = block(page).getByRole("button", { name: "Activity", exact: true });
  await expect(block(page).getByRole("navigation", { name: "Workspace tools" })).toHaveCSS("width", "40px");
  await activityButton.click();
  const activity = page.getByRole("dialog", { name: "Workspace activity", exact: true });
  await expect(activity).toBeVisible();
  await expect(activity).not.toHaveAttribute("aria-modal", "true");
  await expect(activity.getByRole("heading", { name: "Activity", exact: true })).toBeFocused();
  await activity.getByRole("button", { name: "Close activity", exact: true }).click();
  await expect(activity).toBeHidden();
  await expect(activityButton).toBeFocused();
});

test("activity panel resizes, maximizes, and restores while bloom motion respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openExample(page);
  const shell = block(page);
  const activityButton = shell.getByRole("button", { name: "Activity", exact: true });
  const activity = page.getByRole("dialog", { name: "Workspace activity", exact: true });

  await expect.poll(() => shell.evaluate(node =>
    getComputedStyle(node, "::before").transitionDuration,
  )).toBe("0.6s");
  await expect.poll(() => shell.evaluate(node =>
    getComputedStyle(node, "::before").backgroundImage,
  )).toMatch(/(?:paneled-side|data:image\/png)/);
  await activityButton.click();
  await expect(activity).toBeVisible();
  await expect.poll(() => activity.evaluate(node => node.getBoundingClientRect().width))
    .toBeCloseTo(400, 0);
  await expect.poll(() => activity.evaluate(node => node.getBoundingClientRect().x))
    .toBeCloseTo(999, 0);
  await expect.poll(() => shell.evaluate(node =>
    getComputedStyle(node, "::before").opacity,
  )).toBe("0");
  await expect.poll(() => shell.evaluate(node =>
    getComputedStyle(node, "::after").opacity,
  )).toBe("1");

  await activity.getByRole("button", { name: "Maximize activity", exact: true }).click();
  await expect.poll(() => activity.evaluate(node => node.getBoundingClientRect().width))
    .toBeCloseTo(1158, 0);
  await expect.poll(() => activity.evaluate(node => node.getBoundingClientRect().x))
    .toBeCloseTo(241, 0);
  await activity.getByRole("button", { name: "Restore activity size", exact: true }).click();
  await expect.poll(() => activity.evaluate(node => node.getBoundingClientRect().width))
    .toBeCloseTo(400, 0);
  await expect.poll(() => activity.evaluate(node => node.getBoundingClientRect().x))
    .toBeCloseTo(999, 0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => shell.evaluate(node =>
    getComputedStyle(node, "::before").transitionProperty,
  )).toBe("none");
  await expect.poll(() => shell.evaluate(node =>
    getComputedStyle(node, "::before").transitionDuration,
  )).toBe("0s");
  await activity.getByRole("button", { name: "Close activity", exact: true }).click();
  await expect(activity).toBeHidden();
  await expect(activityButton).toBeFocused();
});

test("closing Activity after a mobile resize clears its maximized state", async ({ page }) => {
  await openExample(page);
  const shell = block(page);
  const body = shell.locator(".kappa-app-shell__panels-body");
  const activityButton = shell.getByRole("button", { name: "Activity", exact: true });
  const activity = page.getByRole("dialog", { name: "Workspace activity", exact: true });

  await activityButton.click();
  await activity.getByRole("button", { name: "Maximize activity", exact: true }).click();
  await expect(body).toHaveAttribute("data-maximized", "true");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(body).not.toHaveAttribute("data-maximized");
  await activity.getByRole("button", { name: "Close activity", exact: true }).click();
  await expect(activity).toBeHidden();
  await expect(body).not.toHaveAttribute("data-maximized");

  await activityButton.click();
  await expect(activity).toBeVisible();
  await expect(body).not.toHaveAttribute("data-maximized");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect.poll(() => activity.evaluate(node => node.getBoundingClientRect().width))
    .toBeCloseTo(400, 0);
  await expect(activity.getByRole("button", { name: "Maximize activity", exact: true })).toBeVisible();
});

test("mobile navigation closes with Escape, returns focus, and keeps the page within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  const shell = block(page);
  const toggle = shell.getByRole("button", { name: "Open sidebar", exact: true });
  await toggle.click();
  const drawer = page.getByRole("dialog").filter({
    has: page.getByRole("button", { name: "Projects", exact: true }),
  });
  await expect(drawer).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expectNoHorizontalOverflow(page);
});

test("dark theme changes the workspace surface and reduced motion removes sidebar animation", async ({ page }) => {
  await openExample(page);
  const workspace = block(page).locator(".kappa-app-shell__panel-frame");
  const nav = navigation(page);
  const lightSurface = await workspace.evaluate(node => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-mode", "dark");
    document.documentElement.setAttribute("data-kappa-theme", "dark");
  });
  await expect.poll(() => workspace.evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe(
    lightSurface,
  );
  await expect.poll(() => nav.evaluate(node => getComputedStyle(node).animationName)).toBe("none");
  await expect.poll(() => nav.evaluate(node => getComputedStyle(node).transitionProperty)).toBe("none");
});
