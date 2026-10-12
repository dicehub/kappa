import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  METER_DEFAULT_LABEL,
  METER_DEFAULT_MAX,
  METER_DEFAULT_MIN,
  METER_DEFAULT_SIZE,
  METER_DEFAULT_TONE,
  METER_SIZES,
  METER_TONES,
  clampMeterValue,
  formatMeterValue,
  getMeterPercentage,
  isMeterSize,
  isMeterTone,
  resolveMeterLabel,
  resolveMeterRange,
  resolveMeterSize,
  resolveMeterTone,
  resolveMeterValueState,
  resolveMeterValueText,
} from "./meter.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("Meter.vue");
const styles = source("meter.css");
const barrel = source("index.ts");





test("renders a labelled WAI-ARIA meter with stable visual parts", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /v-bind="\$attrs"/);
  assert.match(component, /class="kappa-meter"/);
  assert.match(component, /data-slot="meter"/);
  assert.match(component, /role="meter"/);
  assert.match(component, /:aria-labelledby="labelId"/);
  assert.match(component, /:aria-valuemin="range\.min"/);
  assert.match(component, /:aria-valuemax="range\.max"/);
  assert.match(component, /:aria-valuenow="resolvedValue"/);
  assert.match(component, /:aria-valuetext="displayValue"/);
  assert.match(component, /data-slot="meter-label"/);
  assert.match(component, /data-slot="meter-value"/);
  assert.match(component, /data-slot="meter-track"/);
  assert.match(component, /data-slot="meter-indicator"/);
  assert.doesNotMatch(component, /@ark-ui|@zag-js/);
});

test("uses Kappa tokens, logical geometry, and complete media states", () => {
  assert.match(styles, /var\(--kappa-accent/);
  assert.match(styles, /var\(--kappa-success-solid/);
  assert.match(styles, /var\(--kappa-warning-solid/);
  assert.match(styles, /var\(--kappa-danger-solid/);
  assert.match(styles, /inset-inline-start: 0/);
  assert.match(styles, /inline-size: var\(--kappa-meter-value\)/);
  assert.match(styles, /font-variant-numeric: tabular-nums/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
