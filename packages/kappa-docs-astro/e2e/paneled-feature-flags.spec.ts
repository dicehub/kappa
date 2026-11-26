import { expect, test } from "@playwright/test";

test("Compact Show more saves its setting and keeps the project count and load action", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/examples/appshell/paneled-workspace?view=Dashboard");
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  const flags = page.getByRole("button", { name: "Feature flags", exact: true });
  const option = page.getByRole("menuitemcheckbox", { name: "Compact Show more", exact: true });
  const navigation = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
  const more = navigation.getByRole("button", { name: "Show more (18)", exact: true });
  const originalSize = await more.evaluate(node => getComputedStyle(node).fontSize);
  await flags.click();
  await expect(option).not.toBeChecked();
  await option.click();
  await expect(flags).toBeFocused();
  await expect(more.locator("svg")).toHaveCount(0);
  expect(await more.evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeLessThan(parseFloat(originalSize));
  await page.reload();
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await flags.click();
  await expect(option).toBeChecked();
  await page.keyboard.press("Escape");
  await more.focus();
  await more.press("Enter");
  await expect(navigation.getByRole("link", { name: "Aster VTOL", exact: true })).toBeFocused();
  await expect(more).toHaveCount(0);
  await expect(navigation.getByRole("link", { name: "Avionics Bay Cooling", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/view=Dashboard$/);
  await flags.click();
  await option.click();
  await page.reload();
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await expect(more).toHaveCSS("font-size", originalSize);
  await expect(more.locator("svg")).toHaveCount(1);
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`feature flags open from the tools rail at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/examples/appshell/paneled-workspace?view=Dashboard");
    await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
    await page.getByRole("link", { name: "Profile: Alex Morgan", exact: true }).click();
    await expect(page.getByRole("menuitem", { name: "Edit profile", exact: true })).toBeVisible();
    await expect(page.getByRole("menuitemcheckbox")).toHaveCount(0);
    await page.keyboard.press("Escape");

    const rail = page.getByRole("navigation", { name: "Workspace tools", exact: true });
    const flags = rail.getByRole("button", { name: "Feature flags", exact: true });
    const activities = (await rail.getByRole("button", { name: "Activities", exact: true }).boundingBox())!;
    const flagBox = (await flags.boundingBox())!;
    if (viewport.width > 992) expect(flagBox.y).toBeGreaterThan(activities.y);
    else expect(flagBox.x).toBeGreaterThan(activities.x);
    await flags.focus();
    await flags.press("Enter");
    const menu = page.getByRole("menu", { name: "Feature flags", exact: true });
    await expect(menu).toBeInViewport({ ratio: 1 });
    const menuBox = (await menu.boundingBox())!;
    if (viewport.width > 992) expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(flagBox.x);
    else expect(menuBox.y + menuBox.height).toBeLessThanOrEqual(flagBox.y);
    const inset = menu.getByRole("menuitemcheckbox", { name: "Inset header", exact: true });
    await inset.press("Space");
    await expect(menu).toBeHidden();
    await expect(flags).toBeFocused();
    await flags.press("Enter");
    await expect(inset).toBeChecked();
    await expect(menu).toBeInViewport({ ratio: 1 });
    await page.keyboard.press("Escape");
    await expect(flags).toBeFocused();
    await page.reload();
    await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
    await flags.click();
    await expect(inset).toBeChecked();
  });
}
