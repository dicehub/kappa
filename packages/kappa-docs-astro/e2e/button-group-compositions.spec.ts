import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-button-group-composition-demo="${variant}"]`);

const namedGroup = (scope: Locator, name: string) =>
  scope.getByRole("group", { name, exact: true });

const expectPositionerOutsideGroup = async (
  scope: Locator,
  primitive: "menu" | "popover" | "select",
  groupName: string,
) => {
  const joinedGroup = namedGroup(scope, groupName);
  const positioner = scope.locator(
    `[data-scope="${primitive}"][data-part="positioner"]`,
  );

  await expect(positioner).toHaveCount(1);
  await expect(
    joinedGroup.locator(`[data-scope="${primitive}"][data-part="positioner"]`),
  ).toHaveCount(0);
};

test.describe("Button Group composition examples", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/button-group");
  });

  test("labels the nested composer and keeps its native tab sequence", async ({ page }) => {
    const composer = demo(page, "nested-composer");
    const outer = namedGroup(composer, "Message composer");
    const clusters = outer.locator(':scope > [data-slot="button-group"]');
    const attachment = namedGroup(outer, "Attachment actions");
    const messageInput = namedGroup(outer, "Message input");
    const inputSurface = namedGroup(messageInput, "Message and voice controls");
    const addAttachment = attachment.getByRole("button", { name: "Add attachment" });
    const message = inputSurface.getByRole("textbox", { name: "Message" });
    const voice = inputSurface.getByRole("img", { name: "Voice Mode" });

    await expect(outer).toHaveAttribute("data-slot", "button-group");
    await expect(clusters).toHaveCount(2);
    await expect(attachment).toHaveAccessibleName("Attachment actions");
    await expect(messageInput).toHaveAccessibleName("Message input");
    await expect(messageInput.locator(":scope > [data-slot]")).toHaveCount(1);
    await expect(inputSurface).toHaveAttribute("data-slot", "input-group");
    await expect(message).toHaveAttribute("data-slot", "input-group-control");
    await expect(message).toHaveAttribute("placeholder", "Send a message...");
    await expect(addAttachment).toHaveAttribute("type", "button");
    await expect(voice).toHaveAttribute("data-slot", "input-group-addon");
    await expect(voice).toHaveAttribute("data-align", "inline-end");
    await expect(voice).not.toHaveAttribute("tabindex");

    await addAttachment.focus();
    await page.keyboard.press("Tab");
    await expect(message).toBeFocused();

    const [plusBox, surfaceBox, fieldBox, voiceBox] = await Promise.all([
      addAttachment.boundingBox(),
      inputSurface.boundingBox(),
      message.boundingBox(),
      voice.boundingBox(),
    ]);
    expect(plusBox).not.toBeNull();
    expect(surfaceBox).not.toBeNull();
    expect(fieldBox).not.toBeNull();
    expect(voiceBox).not.toBeNull();
    expect(Math.abs(plusBox!.height - surfaceBox!.height)).toBeLessThanOrEqual(1);
    expect(fieldBox!.x).toBeGreaterThanOrEqual(surfaceBox!.x);
    expect(voiceBox!.x + voiceBox!.width).toBeLessThanOrEqual(
      surfaceBox!.x + surfaceBox!.width + 1,
    );
    await expect(message).toHaveCSS("border-left-width", "0px");
    await expect(inputSurface.locator(":scope > [data-slot]")).toHaveCount(2);
  });

  test("joins a labelled search input and action", async ({ page }) => {
    const inputDemo = demo(page, "input");
    const searchGroup = namedGroup(inputDemo, "Case search");
    const search = searchGroup.getByRole("searchbox", { name: "Search cases" });
    const submit = searchGroup.getByRole("button", { name: "Search", exact: true });

    await expect(search).toHaveAttribute("data-slot", "input");
    await expect(search).toHaveAttribute("type", "search");
    await expect(submit).toHaveAttribute("type", "submit");

    await search.fill("turbine inlet");
    await expect(search).toHaveValue("turbine inlet");
    await page.keyboard.press("Tab");
    await expect(submit).toBeFocused();

    const [inputBox, buttonBox] = await Promise.all([
      search.boundingBox(),
      submit.boundingBox(),
    ]);
    expect(inputBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();
    expect(Math.abs(inputBox!.height - buttonBox!.height)).toBeLessThanOrEqual(1);
    expect(Math.abs(inputBox!.x + inputBox!.width - buttonBox!.x)).toBeLessThanOrEqual(1);
  });

  test("exposes the input-group voice toggle state", async ({ page }) => {
    const inputGroupDemo = demo(page, "input-group");
    const outer = namedGroup(inputGroupDemo, "Message composer");
    const attachment = namedGroup(outer, "Attachment actions");
    const controls = namedGroup(outer, "Message controls");
    const inlineControls = namedGroup(controls, "Message and voice controls");
    const message = inlineControls.getByRole("textbox", { name: "Message" });
    const addAttachment = attachment.getByRole("button", { name: "Add attachment" });
    const startVoice = inlineControls.getByRole("button", { name: "Start voice input" });

    await expect(addAttachment).toBeVisible();
    await expect(message).toBeEnabled();
    await expect(message).toHaveAttribute("placeholder", "Send a message...");
    await expect(startVoice).toHaveAttribute("aria-pressed", "false");

    await startVoice.click();
    const stopVoice = inlineControls.getByRole("button", { name: "Stop voice input" });
    await expect(stopVoice).toHaveAttribute("aria-pressed", "true");
    await expect(message).toBeDisabled();
    await expect(message).toHaveAttribute("placeholder", "Record and send audio...");

    await stopVoice.click();
    await expect(startVoice).toHaveAttribute("aria-pressed", "false");
    await expect(message).toBeEnabled();
  });

  test("operates the menu with selection, Escape, and outside interaction", async ({ page }) => {
    const menuDemo = demo(page, "dropdown-menu");
    const joinedGroup = namedGroup(menuDemo, "Follow actions");
    const trigger = joinedGroup.getByRole("button", { name: "More follow options" });
    const menu = menuDemo.getByRole("menu", { name: "More follow options" });

    await expectPositionerOutsideGroup(menuDemo, "menu", "Follow actions");
    await expect(
      joinedGroup.getByRole("button", { name: "Follow", exact: true }),
    ).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem")).toHaveCount(7);
    await menu.getByRole("menuitem", { name: "Mark as read" }).click();
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(menu).toBeVisible();
    await expect(menu).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(menu).toBeVisible();
    await page.locator("#dropdown-menu").click();
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("selects the Euro currency without placing select internals in the group", async ({
    page,
  }) => {
    const selectDemo = demo(page, "select");
    const outer = namedGroup(selectDemo, "Transfer amount");
    const amountGroup = namedGroup(outer, "Amount and currency");
    const transferActions = namedGroup(outer, "Transfer actions");
    const trigger = amountGroup.getByRole("combobox", { name: "Currency" });
    const amount = amountGroup.getByRole("textbox", { name: "Amount" });
    const send = transferActions.getByRole("button", { name: "Send amount" });
    const listbox = selectDemo.getByRole("listbox", { name: "Currencies" });

    await expectPositionerOutsideGroup(selectDemo, "select", "Transfer amount");
    await expect(outer.locator('select[data-part="hidden-select"]')).toHaveCount(0);
    await expect(amount).toHaveAttribute("inputmode", "decimal");
    await expect(amount).toHaveValue("10.00");
    await expect(send).toHaveAttribute("type", "button");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(listbox).toBeVisible();
    await expect(listbox.getByRole("option")).toHaveCount(3);
    await listbox.getByRole("option", { name: /Euro/ }).click();
    await expect(listbox).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toContainText("€");
  });

  test("operates the Copilot popover with Escape and outside interaction", async ({ page }) => {
    const popoverDemo = demo(page, "popover");
    const joinedGroup = namedGroup(popoverDemo, "Copilot actions");
    const trigger = joinedGroup.getByRole("button", { name: "Open Copilot task" });
    const dialog = popoverDemo.getByRole("dialog", {
      name: "Start a new task with Copilot",
    });

    await expectPositionerOutsideGroup(popoverDemo, "popover", "Copilot actions");
    await expect(
      joinedGroup.getByRole("button", { name: "Copilot", exact: true }),
    ).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(dialog).toBeVisible();
    const task = dialog.getByRole("textbox", { name: "Task description" });
    await expect(task).toBeVisible();
    await task.fill("Check the pressure boundary conditions.");
    await expect(task).toHaveValue("Check the pressure boundary conditions.");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.locator("#popover").click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("keeps all compositions inside a 390 pixel viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    const variants = [
      "nested-composer",
      "input",
      "input-group",
      "dropdown-menu",
      "select",
      "popover",
    ];
    for (const variant of variants) {
      const scope = demo(page, variant);
      await scope.scrollIntoViewIfNeeded();
      const metrics = await scope.evaluate((element) => {
        const preview = element.closest(".docs-component-preview");
        if (!preview) throw new Error("Composition demo has no preview container");
        const demoBox = element.getBoundingClientRect();
        const previewBox = preview.getBoundingClientRect();
        return {
          demoLeft: demoBox.left,
          demoRight: demoBox.right,
          previewLeft: previewBox.left,
          previewRight: previewBox.right,
        };
      });
      expect(metrics.demoLeft).toBeGreaterThanOrEqual(metrics.previewLeft - 1);
      expect(metrics.demoRight).toBeLessThanOrEqual(metrics.previewRight + 1);
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
});
