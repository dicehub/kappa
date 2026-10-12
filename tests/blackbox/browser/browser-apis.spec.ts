import { test, expect } from "./fixtures";

test("page actions open real Markdown and external-help browser tabs", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await context.route("https://claude.ai/**", route => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>External help boundary</title>" }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/docs/installation/");
  const controls = page.locator(".docs-page-header__desktop-actions");
  await expect(controls).toBeVisible();
  await expect(page.locator(".docs-page-header__mobile-actions")).toBeHidden();
  await controls.getByRole("button", { name: "Copy page", exact: true }).click();
  await expect(controls.getByRole("status")).toHaveText("Page copied");
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("# Installation");
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("pnpm add @dicehub/kappa vue@^3.5.0");
  const options = controls.getByRole("button", { name: "Copy page options" });
  await options.focus(); await page.keyboard.press("ArrowDown");
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem")).toHaveCount(4);
  await expect(menu).toBeFocused();
  await page.keyboard.press("Home"); await page.keyboard.press("Enter");
  await expect(menu).toBeHidden();
  await expect(controls.getByRole("status")).toHaveText("Page link copied");
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
  await options.focus(); await page.keyboard.press("ArrowDown");
  await expect(menu).toBeVisible(); await expect(menu).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden(); await expect(options).toBeFocused();
  await controls.getByRole("button", { name: "Copy page options" }).click();
  const markdownTab = context.waitForEvent("page");
  await page.getByRole("menuitem", { name: "View Page as Markdown", exact: true }).click();
  const markdown = await markdownTab;
  await expect(markdown).toHaveURL(/\/docs\/installation\.md$/);
  await expect(markdown.locator("body")).toContainText("# Installation");
  await markdown.close();
  await controls.getByRole("button", { name: "Copy page options" }).click();
  const helpTab = context.waitForEvent("page");
  await page.getByRole("menuitem", { name: "Open in Claude", exact: true }).click();
  const help = await helpTab;
  await expect(help).toHaveURL(/^https:\/\/claude\.ai\/new\?q=/);
  expect(decodeURIComponent(help.url())).toContain("Kappa documentation");
  await help.close();
});

test("real clipboard permission denial leaves color token values selectable", async ({ page, context, baseURL }) => {
  const protocol = await context.newCDPSession(page);
  const { targetInfo } = await protocol.send("Target.getTargetInfo");
  await protocol.send("Browser.setPermission", {
    permission: { name: "clipboard-write" }, setting: "denied", origin: baseURL, browserContextId: targetInfo.browserContextId,
  });
  await page.goto("/docs/colors/");
  await expect.poll(() => page.evaluate(async () => (await navigator.permissions.query({ name: "clipboard-write" as PermissionName })).state)).toBe("denied");
  const row = page.locator('[data-colors-token-row][data-token-name="--kappa-canvas"]');
  const copy = row.getByRole("button", { name: "Copy var(--kappa-canvas)", exact: true });
  await expect(copy).toBeVisible();
  await copy.click();
  const value = row.locator("code").nth(1);
  const text = await value.textContent();
  await value.click({ clickCount: 3 });
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toContain(text!.trim());
});
