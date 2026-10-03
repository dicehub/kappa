import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { EDITABLE_SIZES, isEditableSize, resolveEditableSize } from "./editable.ts";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const root = readSource("./Editable.vue");
const provider = readSource("./EditableRootProvider.vue");
const context = readSource("./EditableContext.vue");
const styles = readSource("./editable.css");
const types = readSource("./editable.ts");
const barrel = readSource("./index.ts");

const parts = [
  ["Area", "editable-area"],
  ["Label", "editable-label"],
  ["Preview", "editable-preview"],
  ["Input", "editable-input"],
  ["Control", "editable-control"],
  ["EditTrigger", "editable-edit-trigger"],
  ["SubmitTrigger", "editable-submit-trigger"],
  ["CancelTrigger", "editable-cancel-trigger"],
];

test("accepts the compact size and preserves the default for invalid values", () => {
  assert.deepEqual(EDITABLE_SIZES, ["xs", "sm", "default", "lg"]);
  for (const size of EDITABLE_SIZES) {
    assert.equal(isEditableSize(size), true);
    assert.equal(resolveEditableSize(size), size);
  }
  for (const value of [undefined, null, "compact", 20]) {
    assert.equal(isEditableSize(value), false);
    assert.equal(resolveEditableSize(value), "default");
  }
});

test("forwards the complete Ark root state and event contract", () => {
  assert.match(root, /from "@ark-ui\/vue\/editable"/);
  assert.match(root, /v-bind="\$attrs"/);
  assert.match(root, /data-slot="editable"/);

  for (const prop of [
    "activationMode",
    "autoResize",
    "defaultEdit",
    "defaultValue",
    "disabled",
    "edit",
    "finalFocusEl",
    "form",
    "id",
    "ids",
    "invalid",
    "maxLength",
    "modelValue",
    "name",
    "placeholder",
    "readOnly",
    "required",
    "selectOnFocus",
    "submitMode",
    "translations",
  ]) {
    assert.match(root, new RegExp(`${prop}: undefined`));
  }

  for (const event of [
    "editChange",
    "focusOutside",
    "interactOutside",
    "pointerDownOutside",
    "valueChange",
    "valueCommit",
    "valueRevert",
    "update:edit",
    "update:modelValue",
  ]) {
    assert.match(types, new RegExp(`(?:\\"|)${event.replace(":", "\\:")}`));
  }
});

test("wraps every Ark part and keeps attributes on its semantic element", () => {
  for (const [part, slot] of parts) {
    const source = readSource(`./Editable${part}.vue`);
    assert.match(source, new RegExp(`<ArkEditable\\.${part}`));
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
    assert.match(source, /:as-child="props\.asChild"/);
  }
});

test("supports external machines, context access, and both import styles", () => {
  assert.match(provider, /<ArkEditable\.RootProvider/);
  assert.match(provider, /:value="props\.value"/);
  assert.match(context, /<ArkEditable\.Context v-slot="context">/);
  assert.match(context, /<slot v-bind="context" \/>/);
  assert.match(types, /EditableApi = UnwrapRef<UseEditableReturn>/);
  assert.match(barrel, /useEditable/);
  assert.match(barrel, /useEditableContext/);
  assert.match(barrel, /editableAnatomy/);

  for (const part of ["Root", "RootProvider", ...parts.map(([name]) => name), "Context"]) {
    assert.match(barrel, new RegExp(`${part}: Editable${part}`));
  }
});

test("uses stable, state-driven Kappa styling", () => {
  assert.match(styles, /--kappa-editable-height/);
  assert.match(styles, /\[data-size="sm"\]/);
  assert.match(styles, /\[data-size="lg"\]/);
  assert.match(styles, /\[data-placeholder-shown\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /\.kappa-editable__trigger\[hidden\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
