import { test, expect, visitConsumer } from "./fixtures";

test("split diffs pair replacement rows and leave missing sides empty without false emphasis", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/diff");
  const replacements = page.locator('[data-slot="diff-viewer"][aria-label="Unpaired replacements"]');
  const replacementRows = replacements.locator("tbody tr:not(.kappa-diff-viewer__hunk)");
  await expect(replacementRows).toHaveCount(2);
  const cells = (row: typeof replacementRows) => row.getByRole("cell").evaluateAll(elements => elements.map(cell => cell.querySelector("code")?.textContent ?? cell.textContent));
  expect(await cells(replacementRows.nth(0))).toEqual(["1", "one", "1", "three"]);
  expect(await cells(replacementRows.nth(1))).toEqual(["2", "two", "", ""]);
  await expect(replacements.locator("mark")).toHaveCount(0);
  const context = page.locator('[data-slot="diff-viewer"][aria-label="Addition and context"]');
  const contextRows = context.locator("tbody tr:not(.kappa-diff-viewer__hunk)");
  await expect(contextRows).toHaveCount(2);
  expect(await cells(contextRows.nth(0))).toEqual(["", "", "1", "new"]);
  expect(await cells(contextRows.nth(1))).toEqual(["1", "kept", "2", "kept"]);
});
