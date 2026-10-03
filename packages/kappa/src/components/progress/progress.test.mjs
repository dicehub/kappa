import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const root = source("Progress.vue");
const provider = source("ProgressRootProvider.vue");
const range = source("ProgressRange.vue");
const valueText = source("ProgressValueText.vue");
const styles = source("progress.css");
const barrel = source("index.ts");

test("wraps the Ark progress state machine and forwards its public state", () => {
  assert.match(root, /ArkProgress\.Root/);
  assert.match(root, /v-bind="\$attrs"/);
  assert.match(root, /data-slot="progress"/);
  assert.match(root, /:default-value="props\.defaultValue"/);
  assert.match(root, /:model-value="props\.modelValue"/);
  assert.match(root, /@update:model-value/);
  assert.match(root, /@value-change/);
  assert.match(provider, /ArkProgress\.RootProvider/);
  assert.match(range, /ArkProgress\.Range/);
  assert.match(valueText, /v-if="\$slots\.default"/);
  assert.match(valueText, /v-else/);
});

test("uses Kappa tokens and supports orientation and motion preferences", () => {
  assert.match(styles, /var\(--kappa-accent-solid/);
  assert.match(styles, /data-orientation="vertical"/);
  assert.match(styles, /data-state="indeterminate"/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports barrel and granular Ark-backed parts", () => {
  for (const name of [
    "Progress",
    "ProgressRoot",
    "ProgressRootProvider",
    "ProgressLabel",
    "ProgressValueText",
    "ProgressTrack",
    "ProgressRange",
    "ProgressView",
    "ProgressContext",
    "useProgress",
    "ProgressProps",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
