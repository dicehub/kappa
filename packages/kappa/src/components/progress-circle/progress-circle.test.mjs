import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const root = source("ProgressCircle.vue");
const graphic = source("ProgressCircleGraphic.vue");
const range = source("ProgressCircleRange.vue");
const valueText = source("ProgressCircleValueText.vue");
const styles = source("progress-circle.css");
const barrel = source("index.ts");

test("wraps the Ark progress state machine and circular anatomy", () => {
  assert.match(root, /ArkProgress\.Root/);
  assert.match(root, /v-bind="\$attrs"/);
  assert.match(root, /data-slot="progress-circle"/);
  assert.match(root, /:model-value="props\.modelValue"/);
  assert.match(root, /@update:model-value/);
  assert.match(root, /@value-change/);
  assert.match(graphic, /ArkProgress\.Circle/);
  assert.match(range, /ArkProgress\.CircleRange/);
  assert.match(valueText, /v-if="\$slots\.default"/);
  assert.match(valueText, /v-else/);
});

test("uses Kappa tokens and supports determinate and indeterminate motion", () => {
  assert.match(styles, /var\(--kappa-accent-solid/);
  assert.match(styles, /--size: var\(--kappa-progress-circle-size\)/);
  assert.match(styles, /--thickness: var\(--kappa-progress-circle-thickness\)/);
  assert.match(styles, /data-state="indeterminate"/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(
    styles,
    /\.kappa-progress-circle__circle\[data-state="indeterminate"\],[\s\S]*animation: none/,
  );
  assert.match(styles, /@media \(forced-colors: active\)/);
  // Ark owns the size and thickness variables; public styles use Kappa names.
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:size|thickness)\b)[a-z][\w-]*/);
});

test("exports barrel and granular circular parts", () => {
  for (const name of [
    "ProgressCircle",
    "ProgressCircleRoot",
    "ProgressCircleRootProvider",
    "ProgressCircleLabel",
    "ProgressCircleValueText",
    "ProgressCircleGraphic",
    "ProgressCircleTrack",
    "ProgressCircleRange",
    "ProgressCircleView",
    "ProgressCircleContext",
    "useProgress",
    "ProgressCircleProps",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
