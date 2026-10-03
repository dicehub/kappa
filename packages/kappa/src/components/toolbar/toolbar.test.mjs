import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  TOOLBAR_DEFAULT_ORIENTATION,
  TOOLBAR_DEFAULT_SIZE,
  TOOLBAR_ORIENTATIONS,
  TOOLBAR_SIZES,
  isToolbarOrientation,
  isToolbarSize,
  resolveToolbarOrientation,
  resolveToolbarSize,
} from "./toolbar.ts";

const readSource = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const rootSource = readSource("Toolbar.vue");
const buttonSource = readSource("ToolbarButton.vue");
const inputSource = readSource("ToolbarInput.vue");
const inputGroupSource = readSource("ToolbarInputGroup.vue");
const typesSource = readSource("toolbar.ts");
const linkSource = readSource("ToolbarLink.vue");
const separatorSource = readSource("ToolbarSeparator.vue");
const styles = readSource("toolbar.css");
const barrel = readSource("index.ts");

test("exposes a compound toolbar with native and composed control parts", () => {
  assert.match(barrel, /export const Toolbar = Object\.assign/);
  for (const part of ["Root", "Button", "Link", "Input", "InputGroup", "Separator"]) {
    assert.match(barrel, new RegExp(`${part}: Toolbar(?:Root|Button|Link|Input|InputGroup|Separator)`));
  }
  for (const source of [rootSource, buttonSource, inputSource, inputGroupSource, linkSource, separatorSource]) {
    assert.match(source, /defineOptions\(\{ inheritAttrs: false \}\)/);
  }
});

test("owns toolbar role, orientation, and roving keyboard focus", () => {
  assert.match(rootSource, /role="toolbar"/);
  assert.match(rootSource, /aria-orientation/);
  assert.match(rootSource, /data-kappa-toolbar-item/);
  assert.match(rootSource, /MutationObserver/);
  assert.match(rootSource, /props\.disabled/);
  for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]) {
    assert.match(rootSource, new RegExp(key));
  }
  assert.match(rootSource, /shouldKeepTextCursor/);
  assert.match(rootSource, /shouldKeepNativeArrowKey/);
  assert.match(rootSource, /@focusin="handleFocusin"/);
  assert.doesNotMatch(rootSource, /focusableWhenDisabled/);
  assert.match(rootSource, /setAttribute\(\s*"tabindex"/);
  assert.match(rootSource, /event\.preventDefault\(\)/);
});

test("forwards disabled semantics and toolbar sizing to supported controls", () => {
  assert.match(buttonSource, /:disabled="nativeDisabled"/);
  assert.match(buttonSource, /toolbar\?\.disabled\.value/);
  assert.match(buttonSource, /variant="ghost"/);
  assert.match(inputSource, /:disabled="nativeDisabled"/);
  assert.match(inputSource, /toolbar\?\.disabled\.value/);
  assert.match(inputSource, /:model-value="props\.modelValue"/);
  assert.match(inputGroupSource, /<InputGroup/);
  assert.match(inputGroupSource, /toolbar\?\.disabled\.value/);
  assert.match(inputGroupSource, /:size="resolvedSize"/);
  assert.match(inputGroupSource, /data-kappa-toolbar-input-group/);
  assert.match(linkSource, /<LinkButton/);
  assert.match(separatorSource, /<Separator/);
});

test("uses guarded orientation and size metadata", () => {
  assert.deepEqual(TOOLBAR_ORIENTATIONS, ["horizontal", "vertical"]);
  assert.deepEqual(TOOLBAR_SIZES, ["xs", "sm", "base", "lg"]);
  assert.equal(TOOLBAR_DEFAULT_ORIENTATION, "horizontal");
  assert.equal(TOOLBAR_DEFAULT_SIZE, "base");
  for (const orientation of TOOLBAR_ORIENTATIONS) {
    assert.equal(isToolbarOrientation(orientation), true);
    assert.equal(resolveToolbarOrientation(orientation), orientation);
  }
  for (const size of TOOLBAR_SIZES) {
    assert.equal(isToolbarSize(size), true);
    assert.equal(resolveToolbarSize(size), size);
  }
  for (const invalid of ["diagonal", "xl", null, 1, {}, "constructor", "__proto__"]) {
    assert.equal(isToolbarOrientation(invalid), false);
    assert.equal(isToolbarSize(invalid), false);
  }
  assert.equal(resolveToolbarOrientation("diagonal"), "horizontal");
  assert.equal(resolveToolbarSize("xl"), "base");
});

test("uses Kappa semantic tokens and complete toolbar states", () => {
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-disabled-opacity",
    "--kappa-focus",
    "--kappa-line",
    "--kappa-overlay",
    "--kappa-subtle",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  for (const state of [
    "data-disabled",
    "data-orientation",
    "data-size",
    "aria-disabled",
    "focus-visible",
    "forced-colors",
    "prefers-reduced-motion",
  ]) {
    assert.match(styles, new RegExp(state));
  }
  assert.match(styles, /\.kappa-toolbar\[data-disabled\] \*\s*\{[\s\S]*pointer-events: none/);
  assert.match(
    styles,
    /\.kappa-toolbar__button\.kappa-button\s*\{[\s\S]*min-block-size: var\(--kappa-button-size\);[\s\S]*block-size: auto;[\s\S]*align-self: stretch;/,
  );
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("keeps native controls and dynamic states in the roving model", () => {
  assert.match(rootSource, /getComputedStyle\(element\)/);
  assert.match(rootSource, /HTMLSelectElement/);
  assert.match(rootSource, /type\.toLowerCase\(\)/);
  for (const attribute of [
    "aria-hidden",
    "class",
    "inert",
    "style",
    "tabindex",
  ]) {
    assert.match(rootSource, new RegExp(`"${attribute}"`));
  }
  assert.match(typesSource, /export type ToolbarInputProps = Omit<InputProps, "size">/);
  assert.match(typesSource, /export interface ToolbarInputComponentProps/);
});
