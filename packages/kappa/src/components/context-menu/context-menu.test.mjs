import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const barrel = readSource("./index.ts");
const root = readSource("./ContextMenu.vue");
const types = readSource("./context-menu.ts");

test("exposes a context-specific compound API over the shared menu behavior", () => {
  assert.match(barrel, /import ContextMenuRoot from "\.\/ContextMenu\.vue"/);
  assert.match(barrel, /import ContextMenuTrigger from "\.\.\/dropdown\/DropdownContextTrigger\.vue"/);
  assert.match(root, /from "@ark-ui\/vue\/menu"/);
  assert.match(root, /provide\(dropdownAriaLabelKey, resolvedAriaLabel\)/);
  assert.match(root, /@select="emit\('select', \$event\)"/);

  for (const part of [
    "Root",
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
  ]) {
    assert.match(barrel, new RegExp(`${part}: ContextMenu${part}`));
  }
});

test("keeps Context Menu contracts aligned with Dropdown and Ark UI", () => {
  for (const contract of [
    "ContextMenuProps",
    "ContextMenuEmits",
    "ContextMenuTriggerProps",
    "ContextMenuContentProps",
    "ContextMenuItemProps",
    "ContextMenuSelectionDetails",
  ]) {
    assert.match(types, new RegExp(contract));
  }

  assert.match(types, /DROPDOWN_ITEM_VARIANTS/);
  assert.match(types, /CONTEXT_MENU_DEFAULT_POSITIONING/);
  assert.match(types, /strategy: "fixed"/);
  assert.match(types, /resolveDropdownItemVariant/);
  assert.match(barrel, /useMenu as useContextMenu/);
  assert.match(barrel, /menuAnatomy as contextMenuAnatomy/);
});
