import { test, expect, visitConsumer } from "./fixtures";

test("Dialog retains its custom close slot when DialogLayout is used in the same consumer", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/dialog");
  await page.getByRole("button", { name: "Open dialog", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Original dialog" })).toBeVisible();
  await page.getByRole("button", { name: "Custom close", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("button", { name: "Open dialog", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Open layout", exact: true }).click();
  await expect(page.getByLabel("Layout open")).toHaveText("true");
  await expect(page.getByRole("dialog", { name: "Layout dialog" })).toContainText("Layout content");
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByLabel("Layout open")).toHaveText("false");
});
