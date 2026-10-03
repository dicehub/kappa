import { expect, type Page, test } from "@playwright/test";

async function openDemo(page: Page, variant: string) {
  const demo = page.locator(`[data-delete-resource-demo="${variant}"]`);
  await expect.poll(() => demo.evaluate(element =>
    !element.closest("astro-island")?.hasAttribute("ssr"),
  )).toBe(true);
  const trigger = demo.getByRole("button", { name: "Delete", exact: true });
  await trigger.click();
  const dialog = page.locator(`[data-delete-resource-surface="${variant}"]`);
  await expect(dialog).toBeVisible();
  return { demo, dialog, trigger };
}

test.describe("Delete Resource", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/blocks/delete-resource");
  });

  test("starts on Cancel, blocks outside dismissal, and restores trigger focus", async ({ page }) => {
    const { dialog, trigger } = await openDemo(page, "simple");
    await expect(page.getByRole("alertdialog", { name: "Delete measurement?" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();
    await page.mouse.click(2, 2);
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog.getByRole("button", { name: "Delete measurement" }).click();
    await expect(dialog).toHaveCount(0);
  });

  test("requires an exact name, supports Enter, and resets after reopening", async ({ page }) => {
    const { dialog, trigger, demo } = await openDemo(page, "name-confirmation");
    const input = dialog.getByRole("textbox", { name: "Type the resource name to confirm" });
    const confirm = dialog.getByRole("button", { name: "Delete project" });
    await expect(input).toBeFocused();
    await expect(confirm).toBeDisabled();
    await input.fill("turbine cooling study");
    await expect(confirm).toBeDisabled();
    await input.fill("Turbine cooling study ");
    await expect(confirm).toBeDisabled();
    await input.fill("Turbine cooling study");
    await expect(confirm).toBeEnabled();
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await trigger.click();
    await expect(input).toHaveValue("");
    await expect(confirm).toBeDisabled();
    await input.fill("Turbine cooling study");
    await input.press("Enter");
    await expect(dialog).toHaveCount(0);
    await expect(demo.getByRole("status")).toContainText("Deletion confirmed");
  });

  test("protects pending requests and allows retry after failure", async ({ page }) => {
    const { dialog, demo } = await openDemo(page, "async");
    const input = dialog.getByRole("textbox");
    await input.fill("Turbine cooling study");
    await dialog.getByRole("button", { name: "Delete project" }).click();
    await expect(dialog).toHaveAttribute("aria-busy", "true");
    await expect(input).toHaveAttribute("readonly", "");
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await expect(dialog.getByRole("button", { name: "Deleting…" })).toBeDisabled();
    await page.keyboard.press("Escape");
    await page.mouse.click(2, 2);
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("alert")).toContainText("The request failed");
    await expect(input).toHaveValue("Turbine cooling study");
    await expect(input).not.toHaveAttribute("readonly", "");
    await dialog.getByRole("button", { name: "Delete project" }).click();
    await expect(dialog.getByRole("alert")).toHaveCount(0);
    await expect(dialog).toHaveCount(0);
    await expect(demo.getByRole("status")).toContainText("Deletion confirmed");
  });

  test("fits a narrow viewport and inherits the dark theme", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.evaluate(() => document.documentElement.setAttribute("data-kappa-theme", "dark"));
    const { dialog } = await openDemo(page, "name-confirmation");
    const bounds = await dialog.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect(dialog.getByRole("textbox")).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeVisible();
    expect(await dialog.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe("rgb(255, 255, 255)");
  });
});
