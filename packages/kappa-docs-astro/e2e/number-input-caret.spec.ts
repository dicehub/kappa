import { expect, test, type Page } from "@playwright/test";
import { waitForDocsIsland } from "./helpers/docs-island";

const field = (page: Page, variant: string) =>
  page.locator(`[data-caret-case="${variant}"]`).getByRole("spinbutton");

async function holdAnimationFrames(page: Page) {
  await page.evaluate(() => {
    const browserWindow = window as Window & { releaseCaretFrames?: () => void };
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    const callbacks = new Map<number, FrameRequestCallback>();
    window.requestAnimationFrame = (callback) => {
      const id = request(() => {});
      callbacks.set(id, callback);
      return id;
    };
    window.cancelAnimationFrame = (id) => { callbacks.delete(id); cancel(id); };
    browserWindow.releaseCaretFrames = () => {
      window.requestAnimationFrame = request;
      window.cancelAnimationFrame = cancel;
      for (const [id, callback] of callbacks) {
        cancel(id);
        callback(performance.now());
      }
      callbacks.clear();
    };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/examples/components/number-input/caret");
  await waitForDocsIsland(page.locator("main"));
});

for (const variant of ["uncontrolled", "controlled", "provider"]) {
  test(`${variant} keeps select-all after a value update with queued frames`, async ({ page }) => {
    const input = field(page, variant);
    await input.click();
    await expect(input).toBeFocused();
    await holdAnimationFrames(page);
    try {
      await input.press("End");
      await expect(input).toHaveValue("64");
      await input.press("ControlOrMeta+A");
      await expect(input).toHaveJSProperty("selectionStart", 0);
      await expect(input).toHaveJSProperty("selectionEnd", 2);
      await page.evaluate(() => (window as Window & { releaseCaretFrames?: () => void }).releaseCaretFrames?.());
      await expect(input).toHaveJSProperty("selectionStart", 0);
      await expect(input).toHaveJSProperty("selectionEnd", 2);
      await page.keyboard.insertText("16");
      await expect(input).toHaveValue("16");
      await input.press("Enter");
      await expect(input).toHaveValue("16");
      if (variant !== "uncontrolled") {
        await expect(page.locator(`[data-caret-case="${variant}"] [data-model-value]`)).toHaveText("16");
      }
    } finally {
      await page.evaluate(() => (window as Window & { releaseCaretFrames?: () => void }).releaseCaretFrames?.());
    }
  });
}

test("preserves partial decimals and middle-caret edits across rendering and commit", async ({ page }) => {
  const partial = field(page, "partial");
  await partial.fill("1.");
  await expect(partial).toHaveValue("1.");
  await expect(page.locator('[data-caret-case="partial"] [data-model-value]')).toHaveText("1.");
  await page.keyboard.insertText("25");
  await expect(partial).toHaveValue("1.25");
  await partial.press("Enter");
  await expect(partial).toHaveValue("1.25");

  for (const variant of ["formatted", "controlled-formatted"]) {
    const formatted = field(page, variant);
    await expect(formatted).toHaveValue("1,234");
    await formatted.click();
    await formatted.evaluate((element) => (element as HTMLInputElement).setSelectionRange(2, 2));
    await page.keyboard.insertText("9");
    await expect(formatted).toHaveValue("1,9234");
    await expect(formatted).toHaveJSProperty("selectionStart", 3);
    await formatted.press("Enter");
    await expect(formatted).toHaveValue("19,234");
    await expect(formatted).toHaveJSProperty("selectionStart", 3);
    if (variant === "controlled-formatted") {
      await expect(page.locator('[data-caret-case="controlled-formatted"] [data-model-value]')).toHaveText("19,234");
    }
  }
});

test("keeps locale, Field defaults, controlled rejection, and the exported hook contract", async ({ page }) => {
  const german = field(page, "locale");
  await expect(german).toHaveValue("1.234,5");
  await german.fill("12,5");
  await german.press("Enter");
  await expect(german).toHaveValue("12,5");

  const inherited = page.getByRole("spinbutton", { name: "Field amount" });
  await expect(inherited).toHaveAttribute("required", "");
  await expect(inherited).toHaveAttribute("aria-invalid", "true");

  const rejected = field(page, "rejected");
  await rejected.fill("99");
  await rejected.press("Enter");
  await expect(rejected).toHaveValue("12");
  await expect(page.locator('[data-caret-case="rejected"] [data-change-count]')).toHaveText("1");

  const provider = field(page, "provider");
  await expect(provider).toHaveAttribute("id", "caret-provider-input");
  await provider.click();
  await provider.press("End");
  await expect(provider).toHaveValue("64");
  const events = page.locator("[data-provider-events]");
  await expect.poll(async () => JSON.parse(await events.innerText()).filter((event: string) => event !== "focusChange"))
    .toEqual(["valueChange", "update:modelValue", "onValueChange"]);
  await page.getByRole("button", { name: "Set provider value" }).click();
  await expect(provider).toHaveValue("24");
});
