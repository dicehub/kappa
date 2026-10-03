import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant = "preview") => page.locator(`[data-message-composer-demo="${variant}"]`);
const file = (name: string, mimeType = "text/plain", size = 20) => ({ name, mimeType, buffer: Buffer.alloc(size, "a") });
const input = (container: Locator) => container.locator('input[type="file"]');

async function dropFile(container: Locator, name: string) {
  await container.locator('[data-slot="file-upload-dropzone"]').evaluate((element, filename) => {
    const file = new File(["Review notes"], filename, { type: "text/plain" });
    const dataTransfer = {
      files: [file], types: ["Files"], dropEffect: "none",
      items: [{ kind: "file", type: file.type, getAsFile: () => file, getAsEntry: () => ({ isDirectory: false, isFile: true }) }],
    };
    for (const type of ["dragover", "drop"]) {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
      element.dispatchEvent(event);
    }
  }, name);
}

test.describe("Message Composer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/blocks/message-composer");
    const islands = page.locator("[data-message-composer-demo]").locator("xpath=ancestor::astro-island");
    await expect(islands).toHaveCount(4);
    for (let i = 0; i < 4; i++) await expect(islands.nth(i)).not.toHaveAttribute("ssr", "");
  });

  test("sends one exact multiline draft and clears controlled values after success", async ({ page }) => {
    const example = demo(page);
    const textbox = example.getByRole("textbox", { name: "Message", exact: true });
    const layout = await example.locator(".kappa-message-composer__surface").evaluate(element => ({
      surface: element.clientWidth,
      toolbar: element.querySelector(".kappa-message-composer__toolbar")!.getBoundingClientRect().width,
    }));
    expect(layout.toolbar).toBeCloseTo(layout.surface, 0);
    await expect(example.getByRole("button", { name: "Send message" })).toBeDisabled();
    await textbox.fill("  Review ready");
    await textbox.press("End");
    await textbox.press("Shift+Enter");
    await textbox.pressSequentially("See the document.  ");
    const draft = await textbox.inputValue();
    expect(draft).toBe("  Review ready\nSee the document.  ");
    await textbox.press("Enter");
    await expect(example.locator("[data-sent-message]")).toHaveCount(1);
    expect(await example.locator("[data-sent-message] p").textContent()).toBe(draft);
    await expect(textbox).toHaveValue("");
    await expect(textbox).toBeFocused();
  });

  test("preserves IME composition and suppresses repeated Enter", async ({ page }) => {
    const example = demo(page);
    const textbox = example.getByRole("textbox");
    await textbox.fill("Review note");
    await textbox.dispatchEvent("compositionstart");
    await textbox.dispatchEvent("keydown", { key: "Enter", keyCode: 229, isComposing: true });
    await expect(example.locator("[data-sent-message]")).toHaveCount(0);
    await textbox.dispatchEvent("compositionend");
    await textbox.dispatchEvent("keydown", { key: "Enter", repeat: true });
    await textbox.dispatchEvent("keydown", { key: "Enter", ctrlKey: true });
    await expect(example.locator("[data-sent-message]")).toHaveCount(0);
    await textbox.press("Enter");
    await expect(example.locator("[data-sent-message]")).toHaveCount(1);
  });

  test("validates files and text, keeps the draft, and removes attachments by keyboard", async ({ page }) => {
    const example = demo(page, "validation");
    const textbox = example.getByRole("textbox");
    await textbox.fill("Draft kept");
    await input(example).setInputFiles([file("notes.txt"), file("image.png", "image/png")]);
    await expect(example.getByRole("list", { name: "Attachments" })).toContainText("notes.txt");
    await expect(example.getByRole("alert")).toContainText("image.png");
    await expect(textbox).toHaveValue("Draft kept");
    await input(example).setInputFiles(file("large.txt", "text/plain", 1025));
    await expect(example.getByRole("alert")).toContainText("large.txt");
    await input(example).setInputFiles([file("extra-a.txt"), file("extra-b.txt")]);
    await expect(example.getByRole("alert")).toContainText("The file count limit was reached.");
    await expect(example.getByRole("list", { name: "Attachments" }).locator("li")).toHaveCount(1);
    await example.getByRole("button", { name: "Dismiss file errors" }).click();
    await textbox.fill("a".repeat(81));
    await expect(example.getByRole("alert")).toHaveText("Use no more than 80 characters.");
    await expect(example.getByRole("button", { name: "Send message" })).toBeDisabled();
    await textbox.fill("Ready");
    const remove = example.getByRole("button", { name: "Remove notes.txt" });
    await remove.focus(); await remove.press("Enter");
    await expect(example.getByRole("list", { name: "Attachments" })).toHaveCount(0);
    await expect(textbox).toBeFocused();
    await expect(example.getByRole("button", { name: "Send message" })).toBeEnabled();
  });

  test("accepts pasted and dropped files without consuming text paste", async ({ page }) => {
    const example = demo(page);
    const textbox = example.getByRole("textbox");
    const pasted = await textbox.evaluate(element => {
      const data = new DataTransfer();
      data.items.add(new File(["Notes"], "clipboard.txt", { type: "text/plain" }));
      const event = new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: data });
      element.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(pasted).toBe(true);
    await expect(example.getByRole("list", { name: "Attachments" })).toContainText("clipboard.txt");
    const textPaste = await textbox.evaluate(element => {
      const data = new DataTransfer(); data.setData("text/plain", "Text remains native");
      data.items.add(new File(["Mixed"], "mixed.txt", { type: "text/plain" }));
      const event = new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: data });
      element.dispatchEvent(event); return event.defaultPrevented;
    });
    expect(textPaste).toBe(false);
    await expect(example.getByRole("list", { name: "Attachments" })).toContainText("mixed.txt");
    await dropFile(example, "dropped.txt");
    await expect(example.getByRole("list", { name: "Attachments" }).locator("li")).toHaveCount(3);
    await example.getByRole("button", { name: "Send message" }).click();
    await expect(example.locator("[data-sent-message]")).toContainText("dropped.txt");
    await expect(example.getByRole("list", { name: "Attachments" })).toHaveCount(0);
  });

  test("retains pending drafts, allows cancel, and does not steal focus after an external completion", async ({ page }) => {
    const example = demo(page, "pending");
    const textbox = example.getByRole("textbox");
    await textbox.fill("Please review the document.");
    await input(example).setInputFiles(file("document.txt"));
    await textbox.press("Enter");
    await expect(textbox).toHaveAttribute("readonly", "");
    await expect(example.getByRole("button", { name: "Attach files" })).toBeDisabled();
    await expect(example.getByRole("button", { name: "Remove document.txt" })).toBeDisabled();
    await dropFile(example, "blocked.txt");
    await expect(example.getByRole("list", { name: "Attachments" }).locator("li")).toHaveCount(1);
    await textbox.focus(); await textbox.press("Tab");
    await expect(example.getByRole("button", { name: "Cancel send" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(textbox).toHaveValue("Please review the document.");
    await expect(textbox).toBeFocused();
    await textbox.press("Enter");
    await example.getByRole("button", { name: "Simulate send error" }).click();
    await expect(example.getByRole("alert")).toContainText("Your draft is kept");
    await expect(textbox).toHaveValue("Please review the document.");
    await textbox.press("Enter");
    const external = example.getByRole("button", { name: "Disable composer" });
    await external.focus();
    await example.getByRole("button", { name: "Complete send" }).evaluate(element => (element as HTMLButtonElement).click());
    await expect(external).toBeFocused();
    await expect(textbox).toHaveValue("");
    await expect(example.locator("[data-sent-message]")).toHaveCount(1);
    await external.click();
    await expect(textbox).toBeDisabled();
    await expect(example.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  test("supports text-only comments with native newlines", async ({ page }) => {
    const example = demo(page, "comment");
    const textbox = example.getByRole("textbox", { name: "Comment", exact: true });
    await expect(example.getByRole("button", { name: "Attach files" })).toHaveCount(0);
    await textbox.fill("First line"); await textbox.press("End"); await textbox.press("Enter");
    await textbox.pressSequentially("Second line");
    await expect(textbox).toHaveValue("First line\nSecond line");
    await expect(example.locator("[data-sent-message]")).toHaveCount(0);
    await example.getByRole("button", { name: "Add comment" }).click();
    await expect(example.locator("[data-sent-message]")).toHaveCount(1);
  });

  test("grows within its height limit and fits a narrow dark reduced-motion viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.evaluate(() => document.documentElement.setAttribute("data-kappa-theme", "dark"));
    const example = demo(page);
    const textbox = example.getByRole("textbox");
    const before = await textbox.evaluate(element => element.getBoundingClientRect().height);
    await textbox.fill(Array.from({ length: 30 }, (_, index) => `Review line ${index + 1}`).join("\n"));
    await expect.poll(() => textbox.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThan(before);
    const size = await textbox.evaluate(element => ({ height: element.clientHeight, scroll: element.scrollHeight }));
    expect(size.height).toBeLessThanOrEqual(240); expect(size.scroll).toBeGreaterThan(size.height);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    const markdown = await page.request.get("/docs/blocks/message-composer.md");
    expect(markdown.ok()).toBe(true); expect(await markdown.text()).toContain("MessageComposer");
  });
});
