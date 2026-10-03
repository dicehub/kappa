import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  BUTTON_DEFAULT_ICON_POSITION,
  BUTTON_DEFAULT_SHAPE,
  BUTTON_DEFAULT_SIZE,
  BUTTON_DEFAULT_TYPE,
  BUTTON_DEFAULT_VARIANT,
  BUTTON_ICON_POSITIONS,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  isButtonIconPosition,
  isButtonShape,
  isButtonSize,
  isButtonType,
  isButtonVariant,
  resolveButtonIconPosition,
  resolveButtonShape,
  resolveButtonSize,
  resolveButtonType,
  resolveButtonVariant,
} from "./button.ts";

const buttonSource = readFileSync(new URL("./Button.vue", import.meta.url), "utf8");
const linkSource = readFileSync(new URL("./LinkButton.vue", import.meta.url), "utf8");
const styles = readFileSync(new URL("./button.css", import.meta.url), "utf8");
const barrel = readFileSync(new URL("./index.ts", import.meta.url), "utf8");

test("keeps the public options and quiet defaults deterministic", () => {
  assert.deepEqual(BUTTON_VARIANTS, [
    "primary", "secondary", "outline", "ghost", "destructive",
    "secondary-destructive", "destructive-outline", "success", "warning", "link",
  ]);
  assert.deepEqual(BUTTON_SIZES, ["xs", "sm", "base", "lg"]);
  assert.deepEqual(BUTTON_SHAPES, ["base", "square", "circle"]);
  assert.deepEqual(BUTTON_ICON_POSITIONS, ["inline-start", "inline-end"]);
  assert.deepEqual(BUTTON_TYPES, ["button", "submit", "reset"]);
  assert.equal(BUTTON_DEFAULT_VARIANT, "secondary");
  assert.equal(BUTTON_DEFAULT_SIZE, "base");
  assert.equal(BUTTON_DEFAULT_SHAPE, "base");
  assert.equal(BUTTON_DEFAULT_ICON_POSITION, "inline-start");
  assert.equal(BUTTON_DEFAULT_TYPE, "button");
});

test("rejects invalid and prototype-shaped runtime options", () => {
  for (const value of BUTTON_VARIANTS) assert.equal(isButtonVariant(value), true);
  for (const value of BUTTON_SIZES) assert.equal(isButtonSize(value), true);
  for (const value of BUTTON_SHAPES) assert.equal(isButtonShape(value), true);
  for (const value of BUTTON_ICON_POSITIONS) assert.equal(isButtonIconPosition(value), true);
  for (const value of BUTTON_TYPES) assert.equal(isButtonType(value), true);

  for (const value of ["missing", "toString", "constructor", "__proto__", null, 1]) {
    assert.equal(isButtonVariant(value), false);
    assert.equal(isButtonSize(value), false);
    assert.equal(isButtonShape(value), false);
    assert.equal(isButtonIconPosition(value), false);
    assert.equal(isButtonType(value), false);
  }

  assert.equal(resolveButtonVariant("bad"), BUTTON_DEFAULT_VARIANT);
  assert.equal(resolveButtonSize("bad"), BUTTON_DEFAULT_SIZE);
  assert.equal(resolveButtonShape("bad"), BUTTON_DEFAULT_SHAPE);
  assert.equal(resolveButtonIconPosition("bad"), BUTTON_DEFAULT_ICON_POSITION);
  assert.equal(resolveButtonType("bad"), BUTTON_DEFAULT_TYPE);
});

test("renders a safe native action and blocks loading activation", () => {
  assert.match(buttonSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(buttonSource, /v-bind="\$attrs"/);
  assert.match(buttonSource, /:disabled="props\.disabled \|\| props\.loading"/);
  assert.match(buttonSource, /:aria-busy="props\.loading \? 'true' : undefined"/);
  assert.match(buttonSource, /:type="resolvedType"/);
  assert.match(buttonSource, /data-slot="button-spinner"/);
  assert.match(buttonSource, /aria-hidden="true"/);
  assert.match(buttonSource, /Icon-only buttons require aria-label or aria-labelledby/);
  assert.doesNotMatch(buttonSource, /aria-label.*resolvedTitle/);
});

test("keeps navigation semantic and disabled links non-navigable", () => {
  assert.match(linkSource, /import \{ ark \} from "@ark-ui\/vue\/factory"/);
  assert.match(linkSource, /<Button\s+v-if="props\.disabled"/);
  assert.match(linkSource, /DisabledChildContent/);
  assert.match(linkSource, /node\.type === "a"/);
  assert.match(linkSource, /type="button"/);
  assert.match(linkSource, /<ark\.a/);
  assert.match(linkSource, /:as-child="props\.asChild"/);
  assert.match(linkSource, /:href="props\.asChild \? undefined : props\.href"/);
  assert.match(linkSource, /tokens\.add\("noopener"\)/);
  assert.match(linkSource, /tokens\.add\("noreferrer"\)/);
  assert.match(linkSource, /Icon-only links require aria-label or aria-labelledby/);
  assert.match(linkSource, /asChild owns its content/);
});

test("uses flat, compact, logical, and resilient styling", () => {
  assert.match(styles, /--kappa-button-size: 2rem/);
  assert.match(styles, /--kappa-button-radius: 0\.25rem/);
  assert.match(styles, /border-radius: var\(--kappa-button-radius\)/);
  assert.match(styles, /\[data-size="xs"\][\s\S]*--kappa-button-size: 1\.5rem/);
  assert.match(styles, /\[data-size="sm"\][\s\S]*--kappa-button-size: 1\.75rem/);
  assert.match(styles, /\[data-size="lg"\][\s\S]*--kappa-button-size: 2\.25rem/);
  assert.match(styles, /padding-inline/);
  assert.match(styles, /data-position="inline-start"/);
  assert.match(styles, /data-position="inline-end"/);
  assert.match(styles, /box-shadow: none/);
  assert.doesNotMatch(styles, /linear-gradient|radial-gradient|drop-shadow/);
  assert.doesNotMatch(styles, /margin-left|margin-right|padding-left|padding-right/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /var\(--kappa-accent-solid, #247ab7\)/);
  assert.match(styles, /\.kappa-button\[aria-invalid="true"\][\s\S]*outline: 1px solid/);
});

test("exports both components and the complete public contract", () => {
  assert.match(barrel, /export \{ default as Button \}/);
  assert.match(barrel, /export \{ default as LinkButton \}/);
  for (const name of [
    "BUTTON_VARIANTS", "BUTTON_SIZES", "BUTTON_SHAPES", "BUTTON_ICON_POSITIONS",
    "BUTTON_TYPES", "isButtonVariant", "resolveButtonVariant", "ButtonProps",
    "LinkButtonProps", "ButtonSlots", "LinkButtonSlots",
  ]) assert.match(barrel, new RegExp(name));
});
