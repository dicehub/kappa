import { expect, test, type Locator, type Page } from "@playwright/test";

async function openSearch(page: Page, shortcut = "Control+k") {
  await page.goto("/docs/components/button");
  const trigger = page.locator(".docs-header [data-docs-search-open]");
  await expect(trigger).toHaveAttribute("data-docs-search-ready", "true");
  await trigger.focus();
  await page.keyboard.press(shortcut);
  const dialog = page.getByRole("dialog", { name: "Search documentation", exact: true });
  const input = dialog.getByRole("combobox");
  await expect(input).toBeFocused();
  return { trigger, dialog, input };
}

async function clickAfter(input: Locator, prefix: string) {
  const position = await input.evaluate((node, prefix) => {
    const style = getComputedStyle(node);
    const canvas = document.createElement("canvas").getContext("2d")!;
    canvas.font = style.font;
    return { x: parseFloat(style.paddingLeft) + canvas.measureText(prefix).width, y: node.clientHeight / 2 };
  }, prefix);
  await input.click({ position });
}

test("Ctrl+K search opens a filtered result with a mouse click", async ({ page }) => {
  const { dialog, input } = await openSearch(page);
  await input.fill("toggle group");
  const list = dialog.getByRole("listbox");
  await expect(list).toHaveCount(1);
  await expect(input).toHaveAttribute("aria-controls", (await list.getAttribute("id"))!);
  await expect(list.getByRole("option")).toHaveCount(1);
  await list.getByRole("option").click();
  await expect(page).toHaveURL(/\/docs\/components\/toggle-group\/?$/);
});

for (const shortcut of ["Control+k", "Meta+k"]) {
  test(`${shortcut} search keeps mouse-selected text replacement in place`, async ({ page }) => {
    const { dialog, input } = await openSearch(page, shortcut);
    await input.fill("button group");
    await input.dblclick({ position: { x: 20, y: 12 } });
    expect(await input.evaluate((node: HTMLInputElement) => node.value.slice(node.selectionStart!, node.selectionEnd!))).toBe("button");
    await input.pressSequentially("toggle");
    await expect(input).toHaveValue("toggle group");
    await expect(input).toBeFocused();
    await expect(dialog.getByRole("option")).toHaveCount(1);
    await dialog.getByRole("option").click();
    await expect(page).toHaveURL(/\/docs\/components\/toggle-group\/?$/);
  });
}

test("caret editing preserves focus, keyboard selection, dismissal, and reopening", async ({ page }) => {
  const { trigger, dialog, input } = await openSearch(page);
  await input.fill("buon group");
  await clickAfter(input, "bu");
  await input.pressSequentially("tt");
  await expect(input).toHaveValue("button group");
  expect(await input.evaluate((node: HTMLInputElement) => node.selectionStart)).toBe(4);
  await input.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close command palette" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(input).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(input).toHaveValue("");
  await input.fill("button group");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/docs\/components\/button-group\/?$/);
});

test("uncontrolled input editing and disabled result clicks keep their contracts", async ({ page }) => {
  await page.goto("/docs/components/command-palette");
  const simple = page.locator('[data-command-palette-demo="simple"]');
  await simple.getByRole("button", { name: "Open Simple Palette" }).click();
  const dialog = page.getByRole("dialog", { name: "Command palette", exact: true });
  const input = dialog.getByRole("combobox");
  await input.fill("cpy");
  await clickAfter(input, "c");
  await input.pressSequentially("o");
  await expect(input).toHaveValue("copy");
  expect(await input.evaluate((node: HTMLInputElement) => node.selectionStart)).toBe(2);
  await dialog.getByRole("option").click();
  await expect(dialog).toHaveCount(0);

  const grouped = page.locator('[data-command-palette-demo="preview"]');
  await grouped.getByRole("button", { name: "Open Command Palette", exact: true }).click();
  const disabled = dialog.getByRole("option").filter({ hasText: "Restart active worker" });
  await expect(disabled).toHaveAttribute("aria-disabled", "true");
  const bounds = (await disabled.boundingBox())!;
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(dialog).toBeVisible();
  await expect(grouped.locator(".command-palette-demo__selected")).toHaveCount(0);
  await dialog.getByRole("option").filter({ hasText: "Open settings" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(grouped.locator(".command-palette-demo__selected")).toHaveText("Last selected: Open settings");
});

test("modified mouse activation opens one new tab", async ({ page, context }) => {
  const { dialog, input } = await openSearch(page);
  await input.fill("toggle group");
  const popupPromise = page.waitForEvent("popup");
  await dialog.getByRole("option").click({ modifiers: ["Control"] });
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/\/docs\/components\/toggle-group\/?$/);
  await expect(dialog).toHaveCount(0);
  expect(context.pages()).toHaveLength(2);
  await popup.close();
});

test("a palette kept open emits one activation per click or Enter press", async ({ page }) => {
  await page.goto("/examples/components/command-palette/activation");
  await page.getByRole("button", { name: "Open commands" }).click();
  const dialog = page.getByRole("dialog", { name: "Command palette", exact: true });
  const input = dialog.getByRole("combobox");
  const count = dialog.getByLabel("Activation count");
  const newTab = dialog.getByLabel("Open in new tab");
  await dialog.getByRole("button", { name: "Set query to Copy" }).click();
  await expect(input).toHaveValue("Copy");
  await expect(count).toHaveText("0");
  await input.click();
  await dialog.getByRole("option", { name: "Copy", exact: true }).click();
  await expect(count).toHaveText("1");
  await expect(input).toBeFocused();
  await input.press("Enter");
  await expect(count).toHaveText("2");
  await expect(newTab).toHaveText("false");
  await input.press("Control+Enter");
  await expect(count).toHaveText("3");
  await expect(newTab).toHaveText("true");
  await input.press("Meta+Enter");
  await expect(count).toHaveText("4");
  await expect(newTab).toHaveText("true");
  await dialog.getByRole("option", { name: "Copy", exact: true }).click();
  await expect(count).toHaveText("5");
  await expect(newTab).toHaveText("false");
});

test.describe("touch search", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
  test("tapping a result opens its page on mobile", async ({ page }) => {
    await page.goto("/docs/components/button");
    const trigger = page.locator(".docs-mobile-header [data-docs-search-open]");
    await expect(trigger).toHaveAttribute("data-docs-search-ready", "true");
    await trigger.tap();
    const dialog = page.getByRole("dialog", { name: "Search documentation", exact: true });
    await dialog.getByRole("combobox").fill("toggle group");
    await dialog.getByRole("option").tap();
    await expect(page).toHaveURL(/\/docs\/components\/toggle-group\/?$/);
  });
});
