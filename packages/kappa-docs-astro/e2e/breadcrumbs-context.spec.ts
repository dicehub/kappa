import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/breadcrumbs#context");
  await expect(page.locator('astro-island[ssr]:has([data-breadcrumbs-demo="context"])')).toHaveCount(0);
});

test("context links and the switcher remain separate keyboard actions", async ({ page }) => {
  const trail = page.getByRole("navigation", { name: "Project context", exact: true });
  const resource = trail.getByRole("link", { name: "Wind Aero Study", exact: true });
  const trigger = trail.getByRole("button", { name: "Switch project", exact: true });
  const dialog = page.getByRole("dialog", { name: "Switch project", exact: true });
  await expect(resource).toHaveAttribute("href", /project=WA-01$/);
  await expect(resource).toHaveAttribute("aria-current", "page");
  await expect(resource.getByRole("button")).toHaveCount(0);
  await resource.focus();
  await resource.press("Tab");
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const search = dialog.getByRole("combobox", { name: "Search projects", exact: true });
  await expect(search).toBeFocused();
  await search.fill("HC-02");
  await expect(dialog.getByRole("option")).toHaveText([/Helicopter.*HC-02/]);
  await search.press("Enter");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trail.getByRole("link", { name: "Helicopter", exact: true })).toHaveAttribute("href", /project=HC-02$/);
  await trigger.press("Space");
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");
  await expect(dialog.getByRole("option", { name: /Helicopter/ })).toHaveAttribute("aria-current", "true");
  await search.fill("no-such-project");
  await expect(dialog.getByRole("option")).toHaveCount(0);
  await expect(dialog.getByText("No projects found.")).toBeVisible();
  await search.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("context switcher supports pointer selection, outside dismissal, and a delayed tooltip", async ({ page }) => {
  const trail = page.getByRole("navigation", { name: "Project context", exact: true });
  const trigger = trail.getByRole("button", { name: "Switch project", exact: true });
  await trigger.hover();
  await expect(page.getByRole("tooltip", { name: "Switch project", exact: true })).toBeVisible();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Switch project", exact: true });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("tooltip")).toBeHidden();
  await dialog.getByRole("option", { name: /Drone/ }).click();
  await expect(trail.getByRole("link", { name: "Drone", exact: true })).toHaveAttribute("href", /project=DR-03$/);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator("#context").click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("context trail and popup fit narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const trail = page.getByRole("navigation", { name: "Project context", exact: true });
  await trail.getByRole("button", { name: "Switch project", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Switch project", exact: true });
  await dialog.getByRole("option", { name: /Heat Exchanger Analysis/ }).click();
  for (const element of [trail, trail.getByRole("link", { name: "Heat Exchanger Analysis", exact: true })]) {
    const box = (await element.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
  }
  await trail.getByRole("button", { name: "Switch project", exact: true }).click();
  const popup = (await dialog.boundingBox())!;
  expect(popup.x).toBeGreaterThanOrEqual(0);
  expect(popup.x + popup.width).toBeLessThanOrEqual(390);
});

test("context separates quiet dividers from links and preserves dark keyboard focus", async ({ page }) => {
  const trail = page.getByRole("navigation", { name: "Project context", exact: true });
  const link = trail.getByRole("link", { name: "Ros.Space", exact: true });
  const separator = trail.locator('[data-slot="breadcrumbs-separator"]');
  const size = await separator.evaluate(el => Number.parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeLessThan(await link.evaluate(el => Number.parseFloat(getComputedStyle(el).fontSize)));
  await expect(separator).toHaveAttribute("aria-hidden", "true");
  await expect(separator).toHaveText("/");
  const light = await link.evaluate(el => getComputedStyle(el).color);
  await page.getByRole("button", { name: "Toggle theme", exact: true }).filter({ visible: true }).click();
  await expect.poll(() => link.evaluate(el => getComputedStyle(el).color)).not.toBe(light);
  const trigger = trail.getByRole("button", { name: "Switch project", exact: true });
  await trigger.focus();
  await expect(trigger).toHaveCSS("outline-style", "solid");
  await trigger.press("Enter");
  await page.getByRole("combobox", { name: "Search projects", exact: true }).press("Escape");
  await expect(trigger).toBeFocused();
});
