import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const keyComponent = source("Kbd.vue");
const groupComponent = source("KbdGroup.vue");
const styles = source("kbd.css");
const barrel = source("index.ts");

test("renders semantic keyboard input and forwards consumer attributes", () => {
  assert.match(keyComponent, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(keyComponent, /defineProps<KbdProps>/);
  assert.match(keyComponent, /defineSlots<KbdSlots>/);
  assert.match(keyComponent, /<kbd/);
  assert.match(keyComponent, /v-bind="\$attrs"/);
  assert.match(keyComponent, /class="kappa-kbd"/);
  assert.match(keyComponent, /data-slot="kbd"/);
  assert.doesNotMatch(keyComponent, /@ark-ui|@zag-js/);
});

test("groups keys without adding interaction or hidden separators", () => {
  assert.match(groupComponent, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(groupComponent, /defineProps<KbdGroupProps>/);
  assert.match(groupComponent, /defineSlots<KbdGroupSlots>/);
  assert.match(groupComponent, /<span/);
  assert.match(groupComponent, /v-bind="\$attrs"/);
  assert.match(groupComponent, /class="kappa-kbd-group"/);
  assert.match(groupComponent, /data-slot="kbd-group"/);
  assert.doesNotMatch(groupComponent, /role=|aria-hidden|@ark-ui|@zag-js/);
});

test("uses dense keycap geometry, logical sizing, and semantic tokens", () => {
  assert.match(styles, /min-inline-size: 1\.25rem/);
  assert.match(styles, /block-size: 1\.25rem/);
  assert.match(styles, /padding-inline: 0\.3125rem/);
  assert.match(styles, /var\(--kappa-line-strong/);
  assert.match(styles, /var\(--kappa-control/);
  assert.match(styles, /var\(--kappa-default/);
  assert.match(styles, /--kappa-font-mono/);
  assert.match(styles, /box-shadow: inset 0 -1px 0/);
  assert.match(styles, /pointer-events: none/);
  assert.match(styles, /user-select: none/);
  assert.match(styles, /gap: 0\.25rem/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /margin-left|margin-right/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports both components and their public contracts", () => {
  for (const name of [
    "Kbd",
    "KbdGroup",
    "KbdProps",
    "KbdSlots",
    "KbdGroupProps",
    "KbdGroupSlots",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
