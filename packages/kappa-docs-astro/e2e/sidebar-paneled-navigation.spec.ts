import { expect, test, type Locator, type Page } from "@playwright/test";

const path = "/examples/appshell/paneled-workspace?view=Simulation+runs&project=WA-01";
const navigation = (page: Page) => page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
const flyout = (page: Page, category = "Simulation runs") => page.getByRole("navigation", { name: `${category} pages`, exact: true });

async function openExample(page: Page, theme = "light", reports = false) {
  await page.goto(reports ? "/examples/appshell/paneled-workspace?view=Reports&project=WA-01" : path);
  await expect(page.locator('astro-island[ssr]:has([data-sidebar-block="paneled-workspace"])')).toHaveCount(0);
  await expect(page.getByRole("heading", { name: reports ? "Reports" : "Simulation runs", exact: true })).toBeVisible();
  await page.evaluate(value => document.documentElement.setAttribute("data-kappa-theme", value), theme);
}

async function indicator(item: Locator) {
  return item.evaluate(node => {
    const style = getComputedStyle(node, "::before");
    return { content: style.content, left: style.left, top: style.top, width: style.width, height: style.height };
  });
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const theme of ["light", "dark"]) {
  test(`${theme}: selection follows a closed group and its hover submenu`, async ({ page }) => {
    await openExample(page, theme, true);
    const nav = navigation(page);
    const build = nav.getByRole("button", { name: "Analytics", exact: true });
    const pipelines = nav.locator(".paneled-workspace-demo__nav-group").filter({ has: page.getByRole("button", { name: "Analytics", exact: true }) }).getByRole("link", { name: "Reports", exact: true });
    const selected = theme === "light" ? "rgb(220, 220, 222)" : "rgb(58, 56, 63)";
    const foreground = theme === "light" ? "rgb(24, 23, 29)" : "rgb(255, 255, 255)";

    await expect(build).toHaveAttribute("aria-expanded", "true");
    await expect(build).toHaveCSS("font-weight", "425");
    await expect(pipelines).toHaveAttribute("aria-current", "page");
    await expect(pipelines).toHaveCSS("font-size", "14px");
    await expect(pipelines).toHaveCSS("font-weight", "600");
    await build.click();
    await page.mouse.move(600, 100);
    await expect(pipelines).toBeHidden();
    await expect(build).toHaveCSS("font-weight", "600");
    await expect(build).toHaveCSS("background-color", selected);
    await expect(build).toHaveCSS("color", foreground);
    await expect(build).not.toHaveAttribute("aria-current");
    expect(await indicator(build)).toEqual({ content: '""', left: "-8px", top: "4px", width: "2px", height: "20px" });

    await build.hover();
    const popup = flyout(page, "Analytics");
    const popupPipelines = popup.getByRole("link", { name: "Reports", exact: true });
    await expect(popupPipelines).toBeVisible();
    const popupBox = popup.locator("..");
    expect((await popupBox.boundingBox())!.width).toBeGreaterThanOrEqual(200);
    await expect(popupBox).toHaveCSS("height", "34px");
    await expect(popupBox).toHaveCSS("padding", "4px 4px 2px");
    await expect(popupBox).toHaveCSS("border-radius", "8px");
    await expect(popupBox).toHaveCSS("background-color", theme === "light" ? "rgb(255, 255, 255)" : "rgb(40, 39, 45)");
    await expect(popupBox.getByText("Analytics", { exact: true })).toHaveCount(0);
    const shadowColor = theme === "light" ? "rgba(5, 5, 6, 0.16)" : "rgba(5, 5, 6, 0.4)";
    await expect(popupBox).toHaveCSS("filter", `drop-shadow(${shadowColor} 0px 0px 0.5px) drop-shadow(${shadowColor} 0px 0.5px 1px) drop-shadow(${shadowColor} 0px 1px 3px)`);
    const triggerBounds = (await build.boundingBox())!;
    const firstRowBounds = (await popupPipelines.boundingBox())!;
    expect(firstRowBounds.y - triggerBounds.y).toBeCloseTo(4, 1);
    expect(firstRowBounds.x - triggerBounds.x - triggerBounds.width).toBeCloseTo(14, 1);
    await popupPipelines.hover();
    await expect(popupPipelines).toHaveAttribute("aria-current", "page");
    await expect(popupPipelines).toHaveCSS("font-size", "14px");
    await expect(popupPipelines).toHaveCSS("font-weight", "600");
    await expect(popupPipelines).toHaveCSS("background-color", selected);
    expect((await indicator(popupPipelines)).content).toBe("none");
    await expect(build).toHaveCSS("background-color", selected);

    await build.click();
    await page.mouse.move(600, 100);
    await expect(popup).toBeHidden();
    await expect(pipelines).toBeVisible();
    await expect(build).toHaveCSS("font-weight", "425");
    expect((await indicator(build)).content).toBe("none");
    await expect(pipelines).toHaveCSS("background-color", selected);

    await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
    await expect(build).toHaveCSS("font-weight", "600");
    await build.hover();
    await expect(popupBox.getByRole("heading", { name: "Analytics", exact: true })).toBeVisible();
    await expect(popupPipelines).toBeVisible();
    await expect(popupPipelines).toHaveAttribute("aria-current", "page");
    await nav.getByRole("link", { name: "Settings", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
    await build.hover();
    await expect(popupPipelines).not.toHaveAttribute("aria-current");
    await popupPipelines.click();
    await expect(page.getByRole("heading", { name: "Reports", exact: true })).toBeVisible();
    await expect(popup).toBeHidden();
    await build.hover();
    await expect(popupPipelines).toHaveAttribute("aria-current", "page");
    await page.goBack();
    await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
  });

  test(`${theme}: sidebar and submenu share text, hover, focus, and pressed styles`, async ({ page }) => {
    await openExample(page, theme, true);
    const nav = navigation(page);
    const build = nav.getByRole("button", { name: "Analytics", exact: true });
    const hover = theme === "light" ? "rgb(220, 220, 222)" : "rgb(58, 56, 63)";
    const pressed = theme === "light" ? "rgb(191, 191, 195)" : "rgb(24, 23, 29)";
    const normal = theme === "light" ? "rgb(98, 97, 104)" : "rgb(191, 191, 195)";
    await expect(build).toHaveCSS("font-size", "14px");
    await expect(build).toHaveCSS("line-height", "21px");
    await expect(build).toHaveCSS("color", normal);
    await build.hover();
    await expect(build).toHaveCSS("background-color", hover);
    await page.mouse.down();
    await expect(build).toHaveCSS("background-color", pressed);
    await page.mouse.up();
    await expect(build).toHaveAttribute("aria-expanded", "false");
    await page.mouse.move(600, 100);
    await build.hover();
    const pipelines = flyout(page, "Analytics").getByRole("link", { name: "Reports", exact: true });
    await pipelines.hover();
    await expect(pipelines).toHaveCSS("height", "28px");
    await expect(pipelines).toHaveCSS("background-color", hover);
    await page.mouse.down();
    await expect(pipelines).toHaveCSS("background-color", pressed);
    // Release outside the link to inspect the next state without navigating.
    await page.mouse.move(600, 100);
    await page.mouse.up();
    await build.hover();
    await build.focus();
    await build.press("ArrowDown");
    await expect(pipelines).toBeFocused();
    await expect(pipelines).toHaveCSS("outline-style", "solid");
    await expect(pipelines).toHaveCSS("outline-width", "2px");
    await pipelines.press("Escape");
    await expect(pipelines).toBeHidden();
    await expect(build).toBeFocused();
    await build.press("Enter");
    await expect(build).toHaveAttribute("aria-expanded", "true");
    await expect(nav.locator(".paneled-workspace-demo__nav-group").filter({ has: page.getByRole("button", { name: "Analytics", exact: true }) }).getByRole("link", { name: "Reports", exact: true })).toBeVisible();
  });
}

test("focus opens a closed category and its hover style follows the pointer into the submenu", async ({ page }) => {
  await openExample(page);
  const code = navigation(page).getByRole("button", { name: "Analytics", exact: true });
  const pages = page.getByRole("navigation", { name: "Analytics pages", exact: true });
  const repositories = pages.getByRole("link", { name: "Reports", exact: true });
  await code.focus();
  await expect(repositories).toBeVisible();
  await expect(code).toBeFocused();
  await code.press("Escape");
  await expect(pages).toBeHidden();
  await page.keyboard.press("Tab");
  await code.hover();
  await repositories.hover();
  await expect(code).not.toBeFocused();
  await expect(code).not.toHaveAttribute("aria-current");
  await expect(code).toHaveCSS("font-weight", "425");
  await expect(code).toHaveCSS("background-color", "rgb(220, 220, 222)");
  expect((await indicator(code)).content).toBe("none");
  await page.mouse.move(600, 100);
  await expect(pages).toBeHidden();
  await expect(code).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
});

test("collapsed flyouts allow pointer drift before entering a lower submenu item", async ({ page }) => {
  await openExample(page);
  const nav = navigation(page);
  await nav.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  const simulation = nav.getByRole("link", { name: "Simulation runs", exact: true });
  const analytics = nav.getByRole("button", { name: "Analytics", exact: true });
  // An earlier popup must not leave an invisible container over this one.
  await analytics.hover();
  await expect(page.getByRole("navigation", { name: "Analytics pages", exact: true })).toBeVisible();
  await simulation.hover();
  const storage = page.getByRole("navigation", { name: "Simulation runs pages", exact: true })
    .getByRole("link", { name: "Storage", exact: true });
  await expect(storage).toBeVisible();
  const trigger = (await simulation.boundingBox())!;
  const destination = (await storage.boundingBox())!;
  const edge = trigger.x + trigger.width;
  const bottom = trigger.y + trigger.height;

  // A natural diagonal path can start with a short vertical movement.
  await page.mouse.move(edge - 6, bottom - 2);
  await page.mouse.move(edge - 6, bottom + 3);
  await page.mouse.move(edge - 5, bottom + 8);
  await page.mouse.move(edge, bottom + 20);
  await page.mouse.move(destination.x + 10, destination.y + destination.height / 2);
  await expect(storage).toBeVisible();
  await storage.click();
  await expect(page.getByRole("heading", { name: "Storage", exact: true })).toBeFocused();

  // Straight movement down the icon centers still selects the next category.
  await simulation.hover();
  const next = (await analytics.boundingBox())!;
  await page.mouse.move(next.x + next.width / 2, next.y + next.height / 2);
  await expect(page.getByRole("navigation", { name: "Analytics pages", exact: true })).toBeVisible();
  await expect(storage).toBeHidden();
});

test("mobile project links keep selection and retain their submenus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExample(page);
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true });
  const applications = drawer.getByRole("link", { name: "Applications", exact: true });
  await applications.click();
  await expect(drawer).toBeHidden();
  await expect(page).toHaveURL(/view=Applications&project=WA-01$/);
  await expect(page.getByRole("heading", { name: "Applications", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  await expect(applications).toHaveAttribute("aria-current", "page");
  for (const label of ["Activities", "Members", "Simulation runs", "Settings"]) {
    await expect(drawer.getByRole("link", { name: label, exact: true })).toBeVisible();
  }
  await expect(drawer.getByRole("link", { name: "Simulation runs", exact: true })).not.toHaveAttribute("aria-expanded");
  await expect(drawer.getByRole("button", { name: "Create simulation", exact: true })).toBeAttached();
  await expect(drawer.getByRole("link", { name: "Storage", exact: true })).toBeVisible();
  await expect(flyout(page)).toBeHidden();
  await drawer.getByRole("button", { name: "Analytics", exact: true }).click();
  await expect(drawer.getByRole("link", { name: "Reports", exact: true })).toBeVisible();
  await drawer.getByRole("link", { name: "Results", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("heading", { name: "Results", exact: true })).toBeVisible();
});
