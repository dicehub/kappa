import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { sidebarBlocks } from "../src/data/sidebar-blocks";

for (const { id } of sidebarBlocks) {
  test(`${id} starter mounts with public block styles and no application CSS`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/examples/appshell/starter/${id}`);
    await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
    const shell = page.locator(".kappa-app-shell");
    await expect(shell).toHaveCSS("height", "900px");
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Rotor study", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("gallery copies the exact runnable starters and old bookmarks retain the section", async ({ page }) => {
  await page.goto("/docs/blocks/sidebar#paneled-workspace");
  await expect(page).toHaveURL(/\/docs\/blocks\/appshell#paneled-workspace$/);
  for (const { id } of sidebarBlocks) {
    const sample = page.locator(`[data-block-example="${id}"]`);
    const source = readFileSync(new URL(`../src/snippets/app-shell/${id}.vue`, import.meta.url), "utf8");
    expect((await sample.locator("[data-code-full] code").textContent())?.trimEnd()).toBe(source.trimEnd());
    expect(source).not.toContain("<style");
    expect(source.split("\n").length).toBeLessThan(100);
    await expect(sample.getByRole("link", { name: "Open this code" })).toHaveAttribute("href", `/examples/appshell/starter/${id}`);
  }
});

test("paneled starter owns splitting, shadow, focus return, maximize, and mobile panels", async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/examples/appshell/starter/paneled-workspace");
  await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
  const opener = page.getByRole("button", { name: "Open details", exact: true });
  await opener.click();
  const detail = page.getByRole("dialog", { name: "Details", exact: true });
  await expect(detail).toBeVisible();
  const separator = page.getByRole("separator", { name: "Resize panels" });
  await expect(separator).toBeVisible();
  const before = await detail.boundingBox();
  await separator.focus();
  await page.keyboard.press("ArrowLeft");
  await expect.poll(async () => (await detail.boundingBox())!.width).toBeGreaterThan(before!.width);
  await detail.getByRole("button", { name: "Close details" }).click();
  await expect(detail).toBeHidden();
  await expect(opener).toBeFocused();
  const frame = page.locator(".kappa-app-shell__panel-frame");
  await expect(frame).toHaveCSS("border-radius", "12px");
  await expect(frame).toHaveCSS("box-shadow", "rgba(5, 5, 6, 0.16) 0px 0px 2px 0px, rgba(5, 5, 6, 0.16) 0px 1px 4px 0px");
  const activityButton = page.getByRole("button", { name: "Activity", exact: true });
  await activityButton.click();
  const activity = page.getByRole("dialog", { name: "Activity", exact: true });
  await activity.getByRole("button", { name: "Maximize", exact: true }).click();
  await expect(opener).toBeHidden();
  await activity.getByRole("button", { name: "Restore", exact: true }).click();
  await expect(opener).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(activity).toBeHidden();
  await expect(activityButton).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await opener.click();
  await expect(detail).toBeVisible();
  await expect(separator).toHaveCount(0);
  await expect.poll(async () => (await detail.boundingBox())!.width).toBeGreaterThan(380);
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("compact and paneled starter search accepts mouse input and returns focus", async ({ page }) => {
  for (const id of ["minimal-workspace", "paneled-workspace"]) {
    await page.goto(`/examples/appshell/starter/${id}`);
    await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
    const trigger = page.getByRole("button", { name: "Search or go to…" });
    await trigger.click();
    const search = page.getByRole("dialog", { name: "Search projects" });
    const input = search.getByRole("combobox");
    await input.click();
    await input.fill("Channel");
    await page.keyboard.press("Enter");
    await expect(search).toBeHidden();
    await expect(page.getByRole("heading", { name: "Channel flow", exact: true })).toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test("paneled starter project item opens the overview and closes mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/examples/appshell/starter/paneled-workspace");
  await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
  await page.getByRole("button", { name: "Open details", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Details", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  const navigation = page.getByRole("dialog", { name: "Project navigation", exact: true });
  await navigation.getByRole("button", { name: "Engineering", exact: true }).click();
  await expect(navigation).toBeHidden();
  await expect(page.getByRole("dialog", { name: "Details", exact: true })).toBeHidden();
  await expect(page.getByRole("heading", { name: "Engineering", exact: true })).toBeVisible();
  await expect(page.getByRole("menu")).toHaveCount(0);
});
