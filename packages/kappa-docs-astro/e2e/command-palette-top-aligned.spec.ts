import { expect, test } from "@playwright/test";
import { expectSearchPanelMotion } from "./search-panel-motion";
import { expectRoundedSearchField } from "./search-field-shape";

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/command-palette#top-aligned-search");
});

test("top-aligned search expands and fades, filters, and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.evaluate(() => {
    document.addEventListener("animationstart", event => {
      if (event.animationName === "command-palette-top-search-out") document.documentElement.dataset.testTopSearchExit = event.animationName;
    });
  });
  const demo = page.locator('[data-command-palette-demo="top-aligned"]');
  const trigger = demo.getByRole("button", { name: "Search or go to…", exact: true });
  await expect(trigger).toHaveAttribute("aria-keyshortcuts", "/");
  await expectSearchPanelMotion(page, "command-palette-top-search-in", () => trigger.press("/"));
  const dialog = page.locator(".command-palette-top-search-dialog");
  const input = dialog.getByRole("combobox");
  await expect(input).toBeFocused();
  await expectRoundedSearchField(dialog);
  await expect(dialog).toHaveCSS("animation-name", "command-palette-top-search-in");
  await expect(dialog).toHaveCSS("animation-duration", "0.2s");
  await expect(dialog).toHaveCSS("transform", "none");
  expect((await dialog.boundingBox())!.y).toBeCloseTo(4, 0);
  await expect(dialog).toHaveCSS("width", "768px");
  await input.fill("Settings");
  await expect(dialog.getByRole("option")).toHaveCount(1);
  await expectSearchPanelMotion(page, "command-palette-top-search-out", () => input.press("Enter"), true);
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-test-top-search-exit", "command-palette-top-search-out");
  await expect(trigger).toBeFocused();
  await expect(demo.getByRole("status")).toHaveText("Opened Settings.");
  await trigger.click();
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
  await page.mouse.click(10, 600);
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test("reduced motion removes animation and the panel fits 320px in both themes", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const demo = page.locator('[data-command-palette-demo="top-aligned"]');
  const trigger = demo.getByRole("button", { name: "Search or go to…", exact: true });
  let lightBackground = "";
  for (const theme of ["light", "dark"]) {
    await page.evaluate(theme => { document.documentElement.dataset.kappaTheme = theme; }, theme);
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Top-aligned search", exact: true });
    await expect(dialog.getByRole("combobox")).toBeFocused();
    await expectRoundedSearchField(dialog, 16);
    await expect(dialog).toHaveCSS("animation-name", "none");
    const bounds = (await dialog.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(8);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(312);
    expect(bounds.y).toBeCloseTo(4, 0);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(692);
    const background = await dialog.evaluate(node => getComputedStyle(node).backgroundColor);
    if (theme === "light") lightBackground = background;
    else expect(background).not.toBe(lightBackground);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
});
