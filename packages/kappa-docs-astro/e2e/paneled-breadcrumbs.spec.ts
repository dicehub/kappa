import { expect, test } from "@playwright/test";

for (const inset of [false, true]) {
  test(`breadcrumb switches projects with inset header ${inset}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(value => localStorage.setItem("kappa-paneled-workspace-inset-header", String(value)), inset);
    await page.goto("/examples/appshell/paneled-workspace?view=Applications&project=DR-03");
    await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
    const trail = page.getByRole("navigation", { name: "Workspace breadcrumb", exact: true });
    const trigger = trail.getByRole("button", { name: "Switch project", exact: true });
    const link = trail.getByRole("link", { name: "Drone", exact: true });
    await expect(link).toHaveAttribute("href", /project=DR-03$/);
    await link.focus();
    await link.press("Tab");
    await expect(trigger).toBeFocused();
    await trigger.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Switch project", exact: true });
    const search = dialog.getByRole("combobox", { name: "Search projects", exact: true });
    await expect(search).toBeFocused();
    await expect(dialog.getByRole("option")).toHaveCount(24);
    await expect(dialog.getByText("24 projects", { exact: true })).toBeVisible();
    await search.fill("HC-02");
    await search.press("Enter");
    await expect(page).toHaveURL(/project=HC-02$/);
    await expect(trail.getByRole("link", { name: "Helicopter", exact: true })).toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await search.press("Escape");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog.getByRole("link", { name: "Go to all projects" }).click();
    await expect(page).toHaveURL(/view=All\+projects$/);
    await expect(trail.getByRole("link", { name: "All projects", exact: true })).toBeFocused();
    await expect(trigger).toHaveCount(0);
  });
}

test("mobile breadcrumb opens the existing picker without the sidebar drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/examples/appshell/paneled-workspace?view=Applications&project=HX-04");
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  const trail = page.getByRole("navigation", { name: "Workspace breadcrumb", exact: true });
  await trail.getByRole("button", { name: "Switch project", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Switch project", exact: true });
  await expect(dialog.getByRole("combobox", { name: "Search projects", exact: true })).toBeFocused();
  const box = (await dialog.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  await expect(page.getByRole("dialog", { name: "Paneled workspace navigation", exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
