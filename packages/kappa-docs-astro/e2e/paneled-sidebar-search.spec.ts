import { expect, test } from "@playwright/test";

for (const inset of [false, true]) {
  test(`sidebar search moves independently of inset header ${inset}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(value => localStorage.setItem("kappa-paneled-workspace-inset-header", String(value)), inset);
    await page.goto("/examples/appshell/paneled-workspace?view=All+projects");
    await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
    const profile = page.getByRole("link", { name: "Profile: Alex Morgan", exact: true });
    const option = page.getByRole("menuitemcheckbox", { name: "Search in sidebar", exact: true });
    const search = page.getByRole("button", { name: "Search or go to…", exact: true });
    const sidebar = page.getByRole("navigation", { name: "Paneled workspace navigation", exact: true });
    const sidebarSearch = sidebar.getByRole("button", { name: "Search or go to…", exact: true });
    const input = page.getByRole("combobox", { name: "Search pages and simulation runs", exact: true });

    await profile.click();
    await expect(option).not.toBeChecked();
    await option.click();
    await expect(profile).toBeFocused();
    await expect(search).toHaveCount(1);
    await expect(sidebarSearch).toBeVisible();
    await sidebarSearch.click();
    await expect(input).toBeFocused();
    await input.press("Escape");
    await expect(sidebarSearch).toBeFocused();
    await page.reload();
    await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
    await expect(sidebarSearch).toBeVisible();

    await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
    await expect(sidebarSearch).toBeVisible();
    const iconBox = (await sidebarSearch.boundingBox())!;
    expect(iconBox.width).toBe(iconBox.height);
    await page.keyboard.press("Control+k");
    await expect(input).toBeFocused();
    await input.fill("Helicopter");
    await input.press("Enter");
    await expect(page).toHaveURL(/project=HC-02$/);
    await expect(sidebarSearch).toBeVisible();
    await page.getByRole("button", { name: "Expand sidebar", exact: true }).click();
    await expect(sidebarSearch).toBeVisible();

    await sidebarSearch.click();
    await expect(input).toBeFocused();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(sidebarSearch).toHaveCount(0);
    await expect(search).toHaveCount(1);
    await input.press("Escape");
    await expect(search).toBeFocused();
    await search.click();
    await expect(input).toBeFocused();
    await input.press("Escape");
    await expect(search).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await search.click();
    await expect(input).toBeFocused();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(sidebarSearch).toBeVisible();
    await input.press("Escape");
    await expect(sidebarSearch).toBeFocused();
    await profile.click();
    await expect(option).toBeChecked();
    await expect(page.getByRole("menuitemcheckbox", { name: "Inset header", exact: true })).toHaveAttribute("aria-checked", String(inset));
    await option.click();
    await expect(sidebarSearch).toHaveCount(0);
    await expect(search).toHaveCount(1);
    await expect(search).toBeVisible();
    await page.reload();
    await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
    await expect(sidebarSearch).toHaveCount(0);
    await expect(search).toBeVisible();
  });
}
