import { expect, test } from "@playwright/test";

const compoundPages = [
  ["accordion", "accordion", "Accordion.Root"],
  ["attachment", "attachment", "Attachment.Group"],
  ["autocomplete", "autocomplete", "Autocomplete.Root"],
  ["avatar", "avatar", "Avatar.Root"],
  ["banner", "banner", "Banner"],
  ["breadcrumbs", "breadcrumbs", "Breadcrumbs.Root"],
  ["button-group", "buttonGroup", "ButtonGroup.Root"],
  ["card", "card", "Card.Root"],
  ["checkbox", "checkbox", "Checkbox.Group"],
  ["clipboard-text", "clipboardText", "ClipboardText.Root"],
  ["code-highlighted", "codeHighlighted", "CodeHighlighted.Provider"],
  ["collapsible", "collapsible", "Collapsible.Root"],
  ["combobox", "combobox", "Combobox.Root"],
  ["command-palette", "commandPalette", "CommandPalette.Root"],
  ["date-picker", "datePicker", "DatePicker.Root"],
  ["dialog", "dialog", "Dialog.Root"],
  ["dialog-layout", "dialogLayout", "DialogLayout.Root"],
  ["drawer", "drawer", "Drawer.Root"],
  ["dropdown", "dropdown", "Dropdown.Root"],
  ["editable", "editable", "Editable.Root"],
  ["empty", "empty", "Empty.Root"],
  ["field", "field", "Field.Root"],
  ["flow", "flow", "Flow.Root"],
  ["grid", "grid", "Grid.Root"],
  ["highlight", "highlight", "Highlight <span"],
  ["hover-card", "hoverCard", "HoverCard.Root"],
  ["input", "input", "Input <input"],
  ["input-area", "inputArea", "InputArea <textarea"],
  ["input-group", "inputGroup", "InputGroup.Root"],
  ["input-otp", "inputOtp", "InputOtp.Root"],
  ["layer-card", "layerCard", "LayerCard.Root"],
  ["meter", "meter", "Meter <div"],
  ["native-select", "nativeSelect", "NativeSelect.Root"],
  ["number-input", "numberInput", "NumberInput.Root"],
  ["presence", "presence", "Presence <div"],
  ["progress", "progress", "Progress.Root"],
  ["progress-circle", "progressCircle", "ProgressCircle.Root"],
  ["qr-code", "qrCode", "QrCode.Root"],
  ["radio", "radio", "Radio.Root"],
  ["resizable", "resizable", "Resizable.Root"],
  ["scroll-area", "scrollArea", "ScrollArea.Root"],
  ["select", "select", "Select.Root"],
  ["sensitive-input", "sensitiveInput", "SensitiveInput <div>"],
  ["separator", "separator", "Separator <hr>"],
  ["slider", "slider", "Slider.Root"],
  ["switch", "switch", "Switch.Root"],
  ["table-of-contents", "tableOfContents", "TableOfContents.Root"],
  ["text", "text", "Text <p"],
  ["toggle-group", "toggleGroup", "ToggleGroup.Root"],
  ["toolbar", "toolbar", "Toolbar.Root"],
  ["tooltip", "tooltip", "Tooltip.Root"],
] as const;

test.describe("component composition trees", () => {
  for (const [slug, treeName, rootPart] of compoundPages) {
    test(`${slug} shows its part hierarchy`, async ({ page }) => {
      await page.goto(`/docs/components/${slug}`);

      const composition = page.locator(`#composition [data-composition-tree="${treeName}"]`);
      await expect(composition).toBeVisible();
      await expect(composition.locator("figcaption")).toHaveText("Typical part hierarchy");
      await expect(composition.locator('pre[data-language="plaintext"]')).toContainText(rootPart);
      await expect(composition.locator("code")).toContainText(/├──|└──/);
    });
  }
});
