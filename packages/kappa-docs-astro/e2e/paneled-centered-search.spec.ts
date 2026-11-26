import { expect, test, type Page } from "@playwright/test";

const path = "/examples/appshell/paneled-workspace?view=Dashboard";
const flags = (page: Page) => page.getByRole("button", { name: "Feature flags", exact: true });
const option = (page: Page, name: string) => page.getByRole("menuitemcheckbox", { name, exact: true });
const search = (page: Page) => page.getByRole("button", { name: "Search or go to…", exact: true });
async function toggle(page: Page, name: string) {
  await flags(page).click();
  await option(page, name).click();
}
async function expectCentered(page: Page) {
  await expect.poll(async () => {
    const content = await page.locator(".paneled-workspace-demo__page-content").boundingBox();
    const input = await search(page).boundingBox();
    return content && input ? Math.abs(input.x + input.width / 2 - content.x - content.width / 2) : Infinity;
  }).toBeLessThan(1);
}

test("centered search is an optional inset header setting that persists", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await flags(page).click();
  await expect(option(page, "Centered search")).toHaveCount(0);
  await option(page, "Inset header").click();
  await flags(page).click();
  await expect(option(page, "Centered search")).not.toBeChecked();
  await option(page, "Centered search").click();
  await expect(flags(page)).toBeFocused();
  await expectCentered(page);
  await search(page).click();
  const input = page.getByRole("combobox", { name: "Search pages and simulation runs", exact: true });
  await expect(input).toBeFocused();
  await input.press("Escape");
  await expect(search(page)).toBeFocused();
  await page.reload();
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await expectCentered(page);
  await toggle(page, "Search in sidebar");
  const sidebar = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  await expect(sidebar.getByRole("button", { name: "Search or go to…", exact: true })).toBeVisible();
  await flags(page).click();
  await expect(option(page, "Centered search")).toBeChecked();
  await expect(option(page, "Centered search")).toBeDisabled();
  await option(page, "Search in sidebar").click();
  await expectCentered(page);
  await toggle(page, "Inset header");
  await expect(page.locator(".paneled-workspace-demo__panel-toolbar")).toHaveCount(0);
  await toggle(page, "Inset header");
  await expectCentered(page);
  await toggle(page, "Centered search");
  const island = (await page.locator(".paneled-workspace-demo__search-island").boundingBox())!;
  const actions = (await page.locator(".paneled-workspace-demo__global-actions").boundingBox())!;
  expect(actions.x - island.x - island.width).toBeLessThan(20);
});

test("centered search follows the page content and stays usable on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 2000, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await toggle(page, "Inset header");
  await toggle(page, "Centered search");
  await expectCentered(page);
  const box = (await search(page).boundingBox())!;
  expect(Math.abs(box.x + box.width / 2 - 1000)).toBeLessThan(1);
  const resize = page.getByRole("separator", { name: "Resize sidebar", exact: true });
  await resize.focus();
  await resize.press("End");
  await expectCentered(page);
  await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expectCentered(page);
  await page.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await expectCentered(page);
  await page.getByRole("button", { name: "AI chat", exact: true }).click();
  await expectCentered(page);
  await page.getByRole("button", { name: "AI chat", exact: true }).click();
  await page.setViewportSize({ width: 1199, height: 1000 });
  await expect(page.getByRole("button", { name: "Open sidebar", exact: true })).toBeVisible();
  await expectCentered(page);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(search(page)).toHaveCSS("width", "32px");
    await search(page).click();
    const input = page.getByRole("combobox", { name: "Search pages and simulation runs", exact: true });
    await expect(input).toBeFocused();
    await input.press("Escape");
    await expect(search(page)).toBeFocused();
    const box = (await search(page).boundingBox())!;
    const actions = (await page.locator(".paneled-workspace-demo__global-actions").boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(actions.x);
    expect(actions.x + actions.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
