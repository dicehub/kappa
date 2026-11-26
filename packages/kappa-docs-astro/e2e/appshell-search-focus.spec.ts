import { expect, test } from "@playwright/test";

for (const placement of ["header", "inset", "centered", "sidebar"]) {
  test(`search keeps focus without a pointer focus ring in the ${placement}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/examples/appshell/paneled-workspace?view=Dashboard");
    await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
    const options = placement === "centered" ? ["Inset header", "Centered search"]
      : placement === "inset" ? ["Inset header"] : placement === "sidebar" ? ["Search in sidebar"] : [];
    for (const name of options) {
      await page.getByRole("button", { name: "Feature flags", exact: true }).click();
      await page.getByRole("menuitemcheckbox", { name, exact: true }).click();
    }
    const trigger = page.getByRole("button", { name: "Search or go to…", exact: true });
    const dialog = page.getByRole("dialog", { name: "Search paneled workspace", exact: true });
    const input = page.getByRole("combobox", { name: "Search pages and simulation runs", exact: true });
    await trigger.click();
    await expect(input).toBeFocused();
    await input.fill("Helicopter");
    await page.mouse.click(700, 800);
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveCSS("outline-style", "none");

    // Switching back to the keyboard must restore a visible focus indicator.
    await trigger.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveCSS("outline-style", "solid");
    await trigger.press("Enter");
    await expect(input).toBeFocused();
    await input.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveCSS("outline-style", "solid");

    await trigger.click();
    await expect(input).toBeFocused();
    await page.mouse.click(700, 800);
    await expect(dialog).toBeHidden();
    await expect(trigger).toHaveCSS("outline-style", "none");
  });
}
