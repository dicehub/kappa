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

test("normalizes ranges, values, and percentage text", () => {
  assert.equal(METER_DEFAULT_MIN, 0);
  assert.equal(METER_DEFAULT_MAX, 100);
  assert.deepEqual(resolveMeterRange(), { min: 0, max: 100 });
  assert.deepEqual(resolveMeterRange(-20, 50), { min: -20, max: 50 });
  assert.deepEqual(resolveMeterRange(10, 10), { min: 10, max: 110 });
  assert.deepEqual(resolveMeterRange(Number.NaN, Number.POSITIVE_INFINITY), {
    min: 0,
    max: 100,
  });

  assert.equal(clampMeterValue(-5), 0);
  assert.equal(clampMeterValue(55), 55);
  assert.equal(clampMeterValue(120), 100);
  assert.equal(clampMeterValue(Number.NaN), 0);
  assert.equal(getMeterPercentage(15, 10, 30), 25);
  assert.equal(formatMeterValue(15, 10, 30), "25%");
  assert.equal(resolveMeterValueText("15 GB of 20 GB", 15, 0, 20), "15 GB of 20 GB");
  assert.equal(resolveMeterValueText(" ", 15, 0, 20), "75%");
  assert.equal(resolveMeterValueState(0), "empty");
  assert.equal(resolveMeterValueState(45), "partial");
  assert.equal(resolveMeterValueState(100), "full");
});

test("resolves sizes, tones, and a safe label", () => {
  assert.deepEqual(METER_SIZES, ["sm", "base", "lg"]);
  assert.deepEqual(METER_TONES, ["accent", "neutral", "success", "warning", "danger"]);
  assert.equal(METER_DEFAULT_SIZE, "base");
  assert.equal(METER_DEFAULT_TONE, "accent");
  assert.equal(METER_DEFAULT_LABEL, "Meter");

  for (const size of METER_SIZES) assert.equal(isMeterSize(size), true);
  for (const tone of METER_TONES) assert.equal(isMeterTone(tone), true);
  for (const invalid of ["", "constructor", "xl", null, 1]) {
    assert.equal(isMeterSize(invalid), false);
    assert.equal(isMeterTone(invalid), false);
  }

  assert.equal(resolveMeterSize("invalid"), "base");
  assert.equal(resolveMeterTone("invalid"), "accent");
  assert.equal(resolveMeterLabel(" Storage used "), "Storage used");
  assert.equal(resolveMeterLabel(" "), "Meter");
});

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

test("exports the component and complete public contract", () => {
  for (const name of [
    "Meter",
    "MeterProps",
    "MeterRange",
    "MeterSize",
    "MeterTone",
    "METER_SIZES",
    "METER_TONES",
    "clampMeterValue",
    "formatMeterValue",
    "getMeterPercentage",
    "resolveMeterRange",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
