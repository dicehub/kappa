import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

test("composes Kappa Dropdown and keeps top-level menus mutually exclusive", () => {
  const root = source("./MenuBar.vue");
  const menu = source("./MenuBarMenu.vue");
  const trigger = source("./MenuBarTrigger.vue");
  const content = source("./MenuBarContent.vue");
  const subTrigger = source("./MenuBarSubTrigger.vue");

  assert.match(root, /role="menubar"/);
  assert.match(root, /\[data-menu-bar-trigger\]/);
  assert.match(root, /:not\(:disabled\):not\(\[aria-disabled=/);
  assert.match(menu, /<Dropdown\.Root/);
  assert.match(menu, /:open="open"/);
  assert.match(menu, /else if \(open\.value\) bar\.setActive\(null\)/);
  assert.match(trigger, /<Dropdown\.Trigger/);
  assert.match(trigger, /data-menu-bar-trigger=""/);
  assert.match(content, /<Dropdown\.Content/);
  assert.match(content, /dropdown-sub-trigger/);
  assert.match(subTrigger, /useMenuContext/);
  assert.match(subTrigger, /event\.pointerType === "mouse"/);
  assert.match(subTrigger, /@pointerleave\.capture="keepOpenAcrossPortal"/);
  assert.match(subTrigger, /if \(menu\.value\.open\) event\.stopImmediatePropagation\(\)/);
});

test("exports a compound API based on the existing Dropdown parts", () => {
  const barrel = source("./index.ts");
  for (const part of ["Root", "Menu", "Trigger", "Content", "Item", "CheckboxItem", "RadioGroup", "RadioItem", "Sub", "SubTrigger", "SubContent"]) {
    assert.match(barrel, new RegExp(`${part}:`));
  }
  assert.match(barrel, /Item: Dropdown\.Item/);
  assert.match(barrel, /SubContent: Dropdown\.SubContent/);
  assert.match(barrel, /SubTrigger: MenuBarSubTrigger/);
});
