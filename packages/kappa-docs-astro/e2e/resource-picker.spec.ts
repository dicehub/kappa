import { expect, test, type Page } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-resource-picker-demo="${variant}"]`);

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/blocks/resource-picker");
  await expect.poll(() => demo(page, "single").evaluate(element => element.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
});

test("commits only on confirmation and discards a cancelled draft", async ({ page }) => {
  const example = demo(page, "single");
  const trigger = example.getByRole("button", { name: "Choose item", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Choose an item", exact: true });
  await expect(dialog.getByRole("searchbox")).toBeFocused();
  await dialog.getByRole("option", { name: /Brand guidelines/ }).click();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(example.getByRole("status")).toHaveText("Team handbook");

  await trigger.click();
  await expect(dialog.getByRole("option", { name: /Team handbook/ })).toHaveAttribute("aria-selected", "true");
  await dialog.getByRole("option", { name: /Brand guidelines/ }).click();
  await dialog.getByRole("button", { name: "Select item", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(example.getByRole("status")).toHaveText("Brand guidelines");
});

test("retains multiple selections across searches and keeps indicator space stable", async ({ page }) => {
  const example = demo(page, "multiple");
  await example.getByRole("button", { name: "Choose files", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Attach files", exact: true });
  const search = dialog.getByRole("searchbox");
  await search.fill("notes");
  const option = dialog.getByRole("option", { name: /notes.txt/ });
  const content = option.locator('[data-slot="selection-list-item-content"]');
  const before = await content.boundingBox();
  await option.click();
  await expect(option).toHaveAttribute("aria-selected", "true");
  const after = await content.boundingBox();
  expect(after?.width).toBe(before?.width);
  await search.fill("archive");
  await dialog.getByRole("option", { name: /archive.zip/ }).click();
  await expect(dialog.getByRole("status")).toHaveText("3 selected");
  await search.fill("");
  await expect(dialog.getByRole("option", { selected: true })).toHaveCount(3);
  await dialog.getByRole("button", { name: "Attach files", exact: true }).click();
  await expect(example.getByRole("status")).toHaveText("report.pdf, notes.txt, archive.zip");
});

test("supports search keyboard selection and Escape without committing", async ({ page }) => {
  const example = demo(page, "single");
  const trigger = example.getByRole("button", { name: "Choose item", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Choose an item", exact: true });
  const search = dialog.getByRole("searchbox");
  await search.fill("Research");
  await search.press("ArrowDown");
  await search.press("Enter");
  await expect(dialog.getByRole("option", { name: /Research notes/ })).toHaveAttribute("aria-selected", "true");
  await expect(dialog).toBeVisible();
  await search.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(example.getByRole("status")).toHaveText("Team handbook");
});

test("disabled items stay unavailable and an empty search keeps the draft", async ({ page }) => {
  await demo(page, "single").getByRole("button", { name: "Choose item", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Choose an item", exact: true });
  const disabled = dialog.getByRole("option", { name: /Archived draft/ });
  await expect(disabled).toHaveAttribute("aria-disabled", "true");
  await disabled.click({ force: true });
  await expect(disabled).toHaveAttribute("aria-selected", "false");
  await dialog.getByRole("searchbox").fill("not-a-resource");
  await expect(dialog.getByText("No resources found", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Select item", exact: true })).toBeEnabled();
});

test("loading, empty, and retry states remain usable on small screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const example = demo(page, "states");
  await example.getByRole("button", { name: "Loading", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Available items", exact: true });
  await expect(dialog.getByText("Loading resources…", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Select", exact: true })).toBeDisabled();
  const bounds = await dialog.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await example.getByRole("button", { name: "Empty", exact: true }).click();
  await expect(dialog.getByText("No resources found", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await example.getByRole("button", { name: "Error and retry", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Items could not be loaded");
  await dialog.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(dialog.getByRole("option")).toHaveCount(4);
});
