import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Dropdown.vue");
const ariaLabelSource = readSource("./dropdown-aria-label.ts");
const triggerSource = readSource("./DropdownTrigger.vue");
const contentSource = readSource("./DropdownContent.vue");
const itemSource = readSource("./DropdownItem.vue");
const linkSource = readSource("./DropdownLinkItem.vue");
const checkboxSource = readSource("./DropdownCheckboxItem.vue");
const radioGroupSource = readSource("./DropdownRadioGroup.vue");
const radioItemSource = readSource("./DropdownRadioItem.vue");
const subSource = readSource("./DropdownSub.vue");
const subTriggerSource = readSource("./DropdownSubTrigger.vue");
const subContentSource = readSource("./DropdownSubContent.vue");
const contextTriggerSource = readSource("./DropdownContextTrigger.vue");
const separatorSource = readSource("./DropdownSeparator.vue");
const typesSource = readSource("./dropdown.ts");
const styles = readSource("./dropdown.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the Ark root contract and uses Kappa positioning defaults", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/menu"/);
  assert.match(rootSource, /v-bind="\{ \.\.\.\$attrs, \.\.\.arkAriaProps \}"/);

  for (const prop of [
    "closeOnSelect",
    "defaultHighlightedValue",
    "defaultOpen",
    "highlightedValue",
    "loopFocus",
    "open",
    "positioning",
    "typeahead",
  ]) {
    assert.match(typesSource, new RegExp(`${prop}\\?:`));
  }

  for (const event of [
    "escapeKeyDown",
    "highlightChange",
    "openChange",
    "select",
    "update:highlightedValue",
    "update:open",
  ]) {
    assert.match(rootSource, new RegExp(`emit\\('${event.replace(":", "\\:")}`));
  }

  assert.match(typesSource, /placement: "bottom-start"/);
  assert.match(typesSource, /placement: "right-start"/);
  assert.match(subSource, /DROPDOWN_SUB_DEFAULT_POSITIONING/);
  assert.match(typesSource, /dir\?: DropdownDirection/);
  assert.match(rootSource, /<LocaleProvider :locale="locale">/);
  assert.match(subSource, /<LocaleProvider :locale="locale">/);
  assert.match(rootSource, /provide\(dropdownAriaLabelKey, resolvedAriaLabel\)/);
  assert.match(subSource, /provide\(dropdownAriaLabelKey, resolvedAriaLabel\)/);
  assert.match(ariaLabelSource, /InjectionKey<ComputedRef<string \| undefined>>/);
});

test("composes trigger, portal, positioner, content, and context trigger", () => {
  assert.match(triggerSource, /<ArkMenu\.Trigger/);
  assert.match(triggerSource, /data-slot="dropdown-trigger"/);
  assert.match(contextTriggerSource, /<ArkMenu\.ContextTrigger/);
  assert.match(contextTriggerSource, /const popupRole = computed/);
  assert.match(contextTriggerSource, /:aria-haspopup="popupRole"/);
  assert.match(contextTriggerSource, /:aria-expanded="menu\.open"/);
  assert.match(contextTriggerSource, /document\.addEventListener\("keydown", trackEscape, true\)/);
  assert.match(contextTriggerSource, /focus\(\{ preventScroll: true \}\)/);
  assert.match(contextTriggerSource, /:type="props\.asChild \? undefined : props\.type"/);
  assert.match(contentSource, /<Teleport/);
  assert.match(contentSource, /inject\(dropdownAriaLabelKey/);
  assert.match(contentSource, /'aria-label': resolvedAriaLabel/);
  assert.match(contentSource, /:disabled="!props\.teleport \|\| !isMounted"/);
  assert.match(contentSource, /<ArkMenu\.Positioner/);
  assert.match(contentSource, /<ArkMenu\.Content/);
  assert.match(subContentSource, /data-slot="dropdown-sub-content"/);
});

test("provides action, link, checkbox, radio, and submenu item semantics", () => {
  assert.match(itemSource, /<ArkMenu\.Item/);
  assert.match(itemSource, /:data-variant="resolvedVariant"/);
  assert.match(linkSource, /<ArkMenu\.Item/);
  assert.match(linkSource, /as-child/);
  assert.match(linkSource, /<a/);
  assert.match(linkSource, /"noopener noreferrer"/);
  assert.match(linkSource, /props\.disabled \? undefined : props\.href/);
  assert.match(checkboxSource, /<ArkMenu\.CheckboxItem/);
  assert.match(radioGroupSource, /<ArkMenu\.RadioItemGroup/);
  assert.match(radioItemSource, /<ArkMenu\.RadioItem/);
  assert.match(subTriggerSource, /<ArkMenu\.TriggerItem/);
  assert.match(subTriggerSource, /class="kappa-dropdown__sub-caret"/);
  assert.match(subTriggerSource, /:data-disabled="props\.disabled \? '' : undefined"/);
  assert.match(subTriggerSource, /@click\.capture="guardDisabledInteraction"/);
  assert.match(subTriggerSource, /@keydown\.capture="guardDisabledKeydown"/);
  assert.match(subTriggerSource, /@pointerdown\.capture="guardDisabledInteraction"/);
  assert.match(separatorSource, /<slot v-if="props\.asChild"/);

  for (const source of [itemSource, checkboxSource, radioItemSource, subTriggerSource]) {
    assert.match(source, /<slot v-if="props\.asChild" \/>/);
    assert.match(source, /<template v-else>/);
  }
});

test("keeps checkbox and radio options stateful when uncontrolled", () => {
  assert.match(typesSource, /defaultChecked\?: boolean/);
  assert.match(checkboxSource, /const internalChecked = ref\(props\.defaultChecked\)/);
  assert.match(checkboxSource, /props\.checked \?\? internalChecked\.value/);
  assert.match(checkboxSource, /if \(props\.checked === undefined\) internalChecked\.value = value/);
  assert.match(checkboxSource, /closeOnSelect: false/);

  assert.match(typesSource, /defaultValue\?: string/);
  assert.match(radioGroupSource, /const internalValue = ref\(props\.defaultValue\)/);
  assert.match(radioGroupSource, /props\.modelValue \?\? internalValue\.value/);
  assert.match(radioItemSource, /closeOnSelect: false/);
});

test("exports the compound API, public contracts, and Ark hooks", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Trigger",
    "Content",
    "Item",
    "LinkItem",
    "CheckboxItem",
    "RadioGroup",
    "RadioItem",
    "Group",
    "Label",
    "Separator",
    "Shortcut",
    "Sub",
    "SubTrigger",
    "SubContent",
    "ContextTrigger",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Dropdown${part}`));
  }

  for (const contract of [
    "DropdownProps",
    "DropdownEmits",
    "DropdownContentProps",
    "DropdownItemProps",
    "DropdownCheckboxItemProps",
    "DropdownRadioGroupProps",
    "DropdownSubProps",
  ]) {
    assert.match(moduleBarrel, new RegExp(contract));
  }

  assert.match(moduleBarrel, /useMenu as useDropdown/);
  assert.match(moduleBarrel, /menuAnatomy as dropdownAnatomy/);
});

test("uses semantic, logical, state-driven Kappa styling", () => {
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-focus",
    "--kappa-line",
    "--kappa-overlay",
    "--kappa-danger-text",
  ]) {
    assert.match(styles, new RegExp(token));
  }

  assert.match(styles, /var\(--available-height/);
  assert.match(styles, /var\(--available-width/);
  assert.match(styles, /var\(--kappa-dropdown-indicator-gap, 0\.375rem\)/);
  assert.match(styles, /--z-index: var\(--kappa-dropdown-z-index, 1000\) !important/);
  assert.match(styles, /--kappa-dropdown-sub-z-index/);
  assert.match(styles, /calc\(var\(--kappa-dropdown-z-index, 1000\) \+ 1\)/);
  assert.match(styles, /var\(--transform-origin\)/);
  assert.match(styles, /\[data-highlighted\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-variant="destructive"\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /:dir\(rtl\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(pointer: coarse\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /color: GrayText/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:z-index|available-width|available-height|transform-origin|arrow-size|arrow-background)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
