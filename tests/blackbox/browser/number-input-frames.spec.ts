import { test, expect, visitConsumer } from "./fixtures";

for (const variant of ["uncontrolled", "controlled", "provider"]) {
  test(`${variant} retains select-all when pending browser frames complete`, async ({ page }) => {
    await visitConsumer(page, "/examples/components/number-input/caret");
    const field = page.locator(`[data-caret-case="${variant}"]`).getByRole("spinbutton");
    await field.click();
    const now = new Date();
    await page.clock.install({ time: now });
    await page.clock.pauseAt(new Date(now.getTime() + 60_000));
    await field.press("End");
    await expect(field).toHaveValue("64");
    await field.press("ControlOrMeta+A");
    await page.clock.runFor(32);
    await expect(field).toHaveJSProperty("selectionStart", 0);
    await expect(field).toHaveJSProperty("selectionEnd", 2);
    await page.keyboard.insertText("16"); await field.press("Enter");
    await expect(field).toHaveValue("16");
    if (variant !== "uncontrolled") await expect(page.locator(`[data-caret-case="${variant}"] [data-model-value]`)).toHaveText("16");
  });
}
