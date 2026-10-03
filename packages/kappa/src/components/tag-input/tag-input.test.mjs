import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  TAG_INPUT_SIZES,
  isTagInputSize,
  resolveTagInputSize,
} from "./tag-input.ts";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const root = readSource("./TagInput.vue");
const provider = readSource("./TagInputRootProvider.vue");
const context = readSource("./TagInputContext.vue");
const itemContext = readSource("./TagInputItemContext.vue");
const styles = readSource("./tag-input.css");
const types = readSource("./tag-input.ts");
const barrel = readSource("./index.ts");

const parts = [
  ["Label", "tag-input-label"],
  ["Control", "tag-input-control"],
  ["Item", "tag-input-item"],
  ["ItemPreview", "tag-input-item-preview"],
  ["ItemText", "tag-input-item-text"],
  ["ItemDeleteTrigger", "tag-input-item-delete-trigger"],
  ["ItemInput", "tag-input-item-input"],
  ["Input", "tag-input-input"],
  ["ClearTrigger", "tag-input-clear-trigger"],
  ["HiddenInput", "tag-input-hidden-input"],
];

test("supports all Kappa input sizes and a stable fallback", () => {
  assert.deepEqual(TAG_INPUT_SIZES, ["xs", "sm", "base", "lg"]);
  for (const size of TAG_INPUT_SIZES) {
    assert.equal(isTagInputSize(size), true);
    assert.equal(resolveTagInputSize(size), size);
  }
  for (const value of [undefined, null, "compact", 20]) {
    assert.equal(isTagInputSize(value), false);
    assert.equal(resolveTagInputSize(value), "base");
  }
});

test("forwards the complete Ark root contract", () => {
  assert.match(root, /from "@ark-ui\/vue\/tags-input"/);
  assert.match(root, /v-bind="\$attrs"/);
  assert.match(root, /data-slot="tag-input"/);

  for (const prop of [
    "addOnPaste",
    "allowDuplicates",
    "allowOverflow",
    "autoFocus",
    "blurBehavior",
    "defaultInputValue",
    "defaultValue",
    "delimiter",
    "disabled",
    "editable",
    "form",
    "id",
    "ids",
    "inputValue",
    "invalid",
    "max",
    "maxLength",
    "modelValue",
    "name",
    "placeholder",
    "readOnly",
    "required",
    "sanitizeValue",
    "translations",
    "validate",
  ]) {
    assert.match(root, new RegExp(`${prop}: undefined`));
  }

  for (const event of [
    "focusOutside",
    "highlightChange",
    "inputValueChange",
    "interactOutside",
    "pointerDownOutside",
    "valueChange",
    "valueInvalid",
    "update:inputValue",
    "update:modelValue",
  ]) {
    assert.match(types, new RegExp(`(?:\\"|)${event.replace(":", "\\:")}`));
  }
});

test("wraps every Ark part and keeps attributes on its semantic element", () => {
  for (const [part, slot] of parts) {
    const source = readSource(`./TagInput${part}.vue`);
    assert.match(source, new RegExp(`<ArkTagsInput\\.${part}`));
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
    assert.match(source, /:as-child="props\.asChild"/);
  }
});

test("supports external machines, both contexts, and both import styles", () => {
  assert.match(provider, /<ArkTagsInput\.RootProvider/);
  assert.match(provider, /:value="props\.value"/);
  assert.match(context, /<ArkTagsInput\.Context v-slot="context">/);
  assert.match(itemContext, /<ArkTagsInput\.ItemContext v-slot="context">/);
  assert.match(types, /TagInputApi = UnwrapRef<UseTagsInputReturn>/);
  assert.match(barrel, /useTagsInput/);
  assert.match(barrel, /useTagsInputContext/);
  assert.match(barrel, /useTagsInputItemContext/);
  assert.match(barrel, /tagsInputAnatomy/);

  for (const part of [
    "Root",
    "RootProvider",
    ...parts.map(([name]) => name),
    "Context",
    "ItemContext",
  ]) {
    assert.match(barrel, new RegExp(`${part}: TagInput${part}`));
  }
});

test("uses stable, state-driven Kappa styling", () => {
  assert.match(styles, /--kappa-tag-input-min-height/);
  assert.match(styles, /\[data-size="xs"\]/);
  assert.match(styles, /\[data-size="sm"\]/);
  assert.match(styles, /\[data-size="lg"\]/);
  assert.match(styles, /\[data-highlighted\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
