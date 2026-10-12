import { test, expect, visitConsumer } from "./fixtures";

test("disabled initial IDs are excluded and eligibility loss survives later search results", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/resource-picker?external");
  await page.getByRole("button", { name: "Choose resource", exact: true }).click();
  await expect(page.getByLabel("Draft selection")).toHaveText('["alpha"]');
  await page.getByRole("button", { name: "Disable selected resource" }).click();
  await expect(page.getByLabel("Draft selection")).toHaveText("[]");
  await page.getByRole("button", { name: "Show other results" }).click();
  await page.getByRole("button", { name: "Restore results" }).click();
  await expect(page.getByLabel("Draft selection")).toHaveText("[]");
  await expect(page.getByRole("button", { name: "Select", exact: true })).toBeDisabled();
});

test("an initial unknown selection survives loading and appears when its results arrive", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/resource-picker?external&loading");
  await page.getByRole("button", { name: "Choose resource", exact: true }).click();
  await expect(page.getByLabel("Draft selection")).toHaveText('["alpha","disabled"]');
  await expect(page.getByRole("button", { name: "Select", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Restore results" }).click();
  await expect(page.getByLabel("Draft selection")).toHaveText('["alpha","disabled"]');
  await expect(page.getByRole("button", { name: "Select", exact: true })).toBeEnabled();
});

test("local loading preserves an initial ID until its option arrives, then removes a disabled selection", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/resource-picker?loading");
  await page.getByRole("button", { name: "Choose resource", exact: true }).click();
  await expect(page.getByLabel("Draft selection")).toHaveText("[]");
  await expect(page.getByRole("button", { name: "Select", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Restore results", exact: true }).click();
  await expect(page.getByLabel("Draft selection")).toHaveText('["alpha"]');
  await expect(page.getByRole("option", { name: "Alpha", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Disable selected resource", exact: true }).click();
  await expect(page.getByLabel("Draft selection")).toHaveText("[]");
  await expect(page.getByRole("button", { name: "Select", exact: true })).toBeDisabled();
});

test("external filtering preserves hidden selections when another visible item is selected", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/resource-picker?external");
  await page.getByRole("button", { name: "Choose resource", exact: true }).click();
  await page.getByRole("button", { name: "Show other results" }).click();
  await expect(page.getByRole("option", { name: "Alpha", exact: true })).toHaveCount(0);
  await expect(page.getByRole("option", { name: "Beta", exact: true })).toHaveAttribute("aria-selected", "false");
  await page.getByRole("option", { name: "Beta", exact: true }).click();
  await expect(page.getByLabel("Draft selection")).toHaveText('["alpha","beta"]');
  await page.getByRole("button", { name: "Select", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByLabel("Public events")).toContainText('confirm:["alpha","beta"]');
  await expect(page.getByLabel("Public events")).not.toContainText("cancel:");
  expect((await page.getByLabel("Public events").textContent())!.match(/confirm:/g)).toHaveLength(1);
});

test("a controlled parent can reject confirmation close; a later dismissal emits cancellation once", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/resource-picker?reject-close");
  await page.getByRole("button", { name: "Choose resource", exact: true }).click();
  await page.getByRole("button", { name: "Select", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("Public events")).toContainText('confirm:["alpha"]');
  await page.getByRole("button", { name: "Accept next close" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByLabel("Public events")).toContainText("cancel:");
  expect((await page.getByLabel("Public events").textContent())!.match(/cancel:/g)).toHaveLength(1);
});
