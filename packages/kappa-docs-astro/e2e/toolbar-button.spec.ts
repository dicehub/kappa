import { expect, type Locator, type Page, test } from "@playwright/test";
import { waitForDocsIsland } from "./helpers/docs-island";

const standaloneDemo = (page: Page) => page.locator('[data-button-demo="toolbar"]');
const transparent = "rgba(0, 0, 0, 0)";

const readColors = (button: Locator) =>
  button.evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, border: style.borderColor };
  });

for (const theme of ["light", "dark"] as const) {
  test(`standalone toolbar buttons keep their compact geometry and interaction feedback in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/button");
    const demo = standaloneDemo(page);
    await waitForDocsIsland(demo);
    await page.evaluate((value) => {
      document.documentElement.dataset.kappaTheme = value;
    }, theme);

    const group = demo.getByRole("group", { name: "Result actions" });
    await expect(group.getByRole("button")).toHaveCount(4);
    for (const [name, height] of [
      ["Create item", 24],
      ["Reset view", 32],
      ["View 3 result layers", 32],
      ["Export results", 32],
    ] as const) {
      const button = group.getByRole("button", { name, exact: true });
      await expect(button).toHaveCSS("height", `${height}px`);
      await expect(button).toHaveCSS("border-radius", "8px");
      await expect(button.locator("svg")).toHaveCSS("width", "16px");
      await expect(button.locator("svg")).toHaveCSS("height", "16px");
      await expect(button).toHaveCSS("font-size", "12px");
    }

    const ghost = group.getByRole("button", { name: "Reset view" });
    const outline = group.getByRole("button", { name: "Create item", exact: true });
    for (const [button, width] of [[outline, 24], [ghost, 32]] as const) {
      await expect(button).toHaveCSS("width", `${width}px`);
      const iconOffset = await button.evaluate((element) => {
        const button = element.getBoundingClientRect();
        const icon = element.querySelector("svg")!.getBoundingClientRect();
        return {
          x: icon.x + icon.width / 2 - (button.x + button.width / 2),
          y: icon.y + icon.height / 2 - (button.y + button.height / 2),
        };
      });
      expect(iconOffset.x).toBeCloseTo(0, 1);
      expect(iconOffset.y).toBeCloseTo(0, 1);
    }
    for (const [variant, button] of [["ghost", ghost], ["outline", outline]] as const) {
      const transparentBorder = variant === "ghost" || theme === "dark";
      await button.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      const resting = await readColors(button);
      const restingBox = await button.boundingBox();
      expect(restingBox).not.toBeNull();
      if (variant === "ghost") {
        expect(resting.background).toBe(transparent);
      } else {
        expect(resting.background).not.toBe(transparent);
      }
      if (transparentBorder) {
        expect(resting.border).toBe(transparent);
      } else {
        expect(resting.border).not.toBe(transparent);
      }

      await button.hover();
      await expect(button).not.toHaveCSS("background-color", resting.background);
      await expect(button).not.toHaveCSS("background-color", transparent);
      if (transparentBorder) {
        await expect(button).toHaveCSS("border-color", transparent);
      } else {
        await expect(button).not.toHaveCSS("border-color", resting.border);
      }
      await expect.poll(() => button.boundingBox()).toEqual(restingBox);
      const hovered = await readColors(button);

      await page.mouse.down();
      try {
        await expect(button).not.toHaveCSS("background-color", transparent);
        await expect(button).not.toHaveCSS("background-color", hovered.background);
        await expect.poll(() => button.boundingBox()).toEqual(restingBox);
        if (transparentBorder) {
          await expect(button).toHaveCSS("border-color", transparent);
        } else {
          await expect(button).not.toHaveCSS("border-color", resting.border);
          await expect(button).not.toHaveCSS("border-color", hovered.border);
        }
      } finally {
        await page.mouse.up();
        if (variant === "outline") await page.keyboard.press("Escape");
      }
    }
  });
}

test("standalone toolbar buttons derive icon labels, forward native clicks, and show keyboard focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/button");
  const demo = standaloneDemo(page);
  await waitForDocsIsland(demo);
  const reset = demo.getByRole("button", { name: "Reset view" });
  const layers = demo.getByRole("button", { name: "View 3 result layers" });
  const status = demo.getByRole("status");

  await expect(reset).toHaveJSProperty("tagName", "BUTTON");
  await expect(reset).toHaveAttribute("type", "button");
  await expect(reset).toHaveAttribute("aria-label", "Reset view");
  await expect(reset).toHaveAttribute("data-trace", "reset-view");
  await reset.click();
  await expect(status).toHaveText("View reset");
  const restingShadow = await reset.evaluate((element) => getComputedStyle(element).boxShadow);
  await reset.press("Tab");
  await expect(layers).toBeFocused();
  await layers.press("Shift+Tab");
  await expect(reset).toBeFocused();
  const focus = await reset.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      visible: element.matches(":focus-visible"),
      width: Number.parseFloat(style.outlineWidth),
      style: style.outlineStyle,
      color: style.outlineColor,
      shadow: style.boxShadow,
    };
  });
  expect(focus.visible).toBe(true);
  const visibleOutline = focus.width >= 2 && focus.style !== "none" && focus.color !== transparent;
  const visibleShadow = focus.shadow !== "none" && focus.shadow !== restingShadow;
  expect(visibleOutline || visibleShadow, "Keyboard focus has a visible ring").toBe(true);

  await layers.focus();
  await layers.press("Enter");
  await expect(status).toHaveText("3 result layers shown");
  const exportResults = demo.getByRole("button", { name: "Export results" });
  await exportResults.focus();
  await exportResults.press("Space");
  await expect(status).toHaveText("Results export selected");
});

test("a standalone toolbar button opens and selects a dropdown with the keyboard", async ({ page }) => {
  await page.goto("/docs/components/button");
  const demo = standaloneDemo(page);
  await waitForDocsIsland(demo);
  const trigger = demo.getByRole("button", { name: "Create item", exact: true });
  await expect(trigger).toHaveJSProperty("tagName", "BUTTON");
  await expect(trigger.locator("button")).toHaveCount(0);
  await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await trigger.press("ArrowDown");
  const menu = page.getByRole("menu", { name: "Create item" });
  await expect(menu).toBeVisible();
  await expect(menu).toBeFocused();
  await expect(menu.getByRole("group", { name: "Rotor study" }).getByRole("menuitem"))
    .toHaveText(["New case", "New report"]);
  await expect(menu.getByRole("group", { name: "Workspace" }).getByRole("menuitem"))
    .toHaveText(["New project", "Import geometry"]);
  await expect.poll(async () => {
    const triggerBox = await trigger.boundingBox();
    const menuBox = await menu.boundingBox();
    return !!triggerBox && !!menuBox &&
      menuBox.y >= triggerBox.y + triggerBox.height &&
      menuBox.y - (triggerBox.y + triggerBox.height) <= 16 &&
      menuBox.x < triggerBox.x + triggerBox.width &&
      menuBox.x + menuBox.width > triggerBox.x;
  }, { message: "The menu is below its trigger and aligned with it" }).toBe(true);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const menuId = await menu.getAttribute("id");
  expect(menuId).toBeTruthy();
  await expect(trigger).toHaveAttribute("aria-controls", menuId!);
  const newCase = menu.getByRole("menuitem", { name: "New case", exact: true });
  await expect(menu).toHaveAttribute("aria-activedescendant", (await newCase.getAttribute("id"))!);
  await expect.poll(() => newCase.evaluate((element) => getComputedStyle(element).boxShadow))
    .not.toBe("none");
  const newReport = menu.getByRole("menuitem", { name: "New report", exact: true });
  await newReport.hover();
  await expect(menu).toHaveAttribute("aria-activedescendant", (await newReport.getAttribute("id"))!);
  // Wait for the previous keyboard ring to finish its exit transition.
  await expect.poll(() => newCase.evaluate((element) => getComputedStyle(element).boxShadow))
    .toBe("none");
  await expect.poll(() => newReport.evaluate((element) => getComputedStyle(element).boxShadow))
    .toBe("none");
  await page.keyboard.press("ArrowDown");
  const newProject = menu.getByRole("menuitem", { name: "New project", exact: true });
  await expect(menu).toHaveAttribute("aria-activedescendant", (await newProject.getAttribute("id"))!);
  await expect.poll(() => newProject.evaluate((element) => getComputedStyle(element).boxShadow))
    .not.toBe("none");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(demo.getByRole("status")).toHaveText("Import geometry selected");
  await expect(menu).not.toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("built-in toolbar action tooltips wait for hover and stay closed while the create menu is open", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/button");
  const demo = standaloneDemo(page);
  await waitForDocsIsland(demo);
  const trigger = demo.getByRole("button", { name: "Create item", exact: true });
  await trigger.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const now = new Date();
  await page.clock.install({ time: now });
  await page.clock.pauseAt(new Date(now.getTime() + 1_000));

  const tooltip = page.getByRole("tooltip", { name: "Create new…" });
  await trigger.hover();
  await page.clock.runFor(499);
  await expect(tooltip).not.toBeVisible();
  await page.clock.runFor(1);
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveAttribute("data-side", "bottom");
  const tooltipId = await tooltip.getAttribute("id");
  expect(tooltipId).toBeTruthy();
  await expect(trigger).toHaveAttribute("aria-describedby", tooltipId!);

  await page.mouse.move(0, 0);
  await page.clock.runFor(1);
  await expect(tooltip).not.toBeVisible();
  await trigger.hover();
  await page.clock.runFor(500);
  await expect(tooltip).toBeVisible();
  await trigger.click();
  const menu = page.getByRole("menu", { name: "Create item" });
  await expect(menu).toBeVisible();
  await expect(tooltip).not.toBeVisible();
  await page.mouse.move(0, 0);
  await trigger.hover();
  await page.clock.runFor(500);
  await expect(menu).toBeVisible();
  await expect(tooltip).not.toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
});

test("Toolbar.Button keeps the root density, joined edges, and arrow navigation", async ({ page }) => {
  await page.goto("/docs/components/toolbar");
  const sizes = page.locator('[data-toolbar-demo="sizes"]');
  await waitForDocsIsland(sizes);
  for (const [size, height] of [["xs", 24], ["sm", 28], ["base", 32], ["lg", 36]] as const) {
    const toolbar = sizes.getByRole("toolbar", { name: `${size} toolbar` });
    const button = toolbar.getByRole("button", { name: "Apply" });
    await expect(toolbar).toHaveAttribute("data-size", size);
    await expect(button).toHaveAttribute("data-size", size);
    const buttonHeight = await button.evaluate((element) => element.getBoundingClientRect().height);
    const inputHeight = await toolbar.getByRole("textbox", { name: `${size} search` })
      .evaluate((element) => element.getBoundingClientRect().height);
    expect(buttonHeight).toBeGreaterThanOrEqual(height);
    expect(buttonHeight).toBeCloseTo(inputHeight, 1);
  }

  const actions = page.locator('[data-toolbar-demo="button-actions"]');
  await waitForDocsIsland(actions);
  const toolbar = actions.getByRole("toolbar", { name: "File actions" });
  const upload = toolbar.getByRole("button", { name: "Upload" });
  const download = toolbar.getByRole("button", { name: "Download" });
  await expect(upload).toHaveCSS("border-top-right-radius", "0px");
  await expect(download).toHaveCSS("border-top-left-radius", "0px");
  await expect(upload).not.toHaveCSS("border-top-left-radius", "0px");
  await expect(download).not.toHaveCSS("border-top-right-radius", "0px");
  await upload.scrollIntoViewIfNeeded();
  const first = await upload.boundingBox();
  const last = await download.boundingBox();
  expect(first).not.toBeNull();
  expect(last).not.toBeNull();
  expect(first!.x + first!.width).toBeCloseTo(last!.x, 1);

  await upload.focus();
  await upload.press("ArrowRight");
  await expect(download).toBeFocused();
  await download.press("ArrowRight");
  await expect(upload).toBeFocused();
});
