import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  INPUT_OTP_DEFAULT_SIZE,
  INPUT_OTP_SIZES,
  isInputOtpSize,
  resolveInputOtpSize,
} from "./input-otp.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const root = source("InputOtp.vue");
const control = source("InputOtpControl.vue");
const input = source("InputOtpInput.vue");
const hiddenInput = source("InputOtpHiddenInput.vue");
const label = source("InputOtpLabel.vue");
const context = source("InputOtpContext.vue");
const provider = source("InputOtpRootProvider.vue");
const styles = source("input-otp.css");
const types = source("input-otp.ts");
const barrel = source("index.ts");

test("guards and resolves OTP densities", () => {
  assert.deepEqual(INPUT_OTP_SIZES, ["sm", "base", "lg"]);
  assert.equal(INPUT_OTP_DEFAULT_SIZE, "base");
  for (const size of INPUT_OTP_SIZES) {
    assert.equal(isInputOtpSize(size), true);
    assert.equal(resolveInputOtpSize(size), size);
  }
  for (const invalid of ["xs", "xl", "__proto__", null, 3]) {
    assert.equal(isInputOtpSize(invalid), false);
    assert.equal(resolveInputOtpSize(invalid), "base");
  }
});

test("wraps Ark pin-input root and preserves controlled events", () => {
  assert.match(root, /from "@ark-ui\/vue\/pin-input"/);
  assert.match(root, /<ArkPinInput\.Root/);
  assert.match(root, /v-bind="\$attrs"/);
  assert.match(root, /data-slot="input-otp"/);
  for (const binding of [
    "auto-focus",
    "auto-submit",
    "blur-on-complete",
    "count",
    "default-value",
    "disabled",
    "invalid",
    "mask",
    "model-value",
    "otp",
    "pattern",
    "placeholder",
    "read-only",
    "required",
    "select-on-focus",
    "sanitize-value",
    "translations",
    "type",
  ]) {
    assert.match(root, new RegExp(`:${binding}=`));
  }
  for (const event of ["value-change", "value-complete", "value-invalid", "update:model-value"]) {
    assert.match(root, new RegExp(`@${event}=`));
  }
  assert.match(types, /valueChange:/);
  assert.match(types, /valueComplete:/);
  assert.match(types, /valueInvalid:/);
  assert.match(types, /"update:modelValue"/);
});

test("exports named compound parts and Ark provider hooks", () => {
  for (const part of ["Root", "RootProvider", "Control", "Input", "HiddenInput", "Label", "Context"]) {
    assert.match(barrel, new RegExp(`${part}: InputOtp${part}`));
    assert.match(barrel, new RegExp(`InputOtp${part}`));
  }
  assert.match(barrel, /Object\.assign\(InputOtpRoot/);
  assert.match(barrel, /pinInputAnatomy/);
  assert.match(barrel, /usePinInput/);
  assert.match(barrel, /usePinInputContext/);
});

test("forwards Ark part props and context", () => {
  assert.match(control, /<ArkPinInput\.Control/);
  assert.match(control, /data-slot="input-otp-control"/);
  assert.match(input, /<ArkPinInput\.Input/);
  assert.match(input, /:index="props\.index"/);
  assert.match(input, /data-slot="input-otp-input"/);
  assert.match(hiddenInput, /<ArkPinInput\.HiddenInput/);
  assert.match(label, /<ArkPinInput\.Label/);
  assert.match(context, /<ArkPinInput\.Context v-slot="context">/);
  assert.match(provider, /<ArkPinInput\.RootProvider/);
  assert.match(provider, /:value="props\.value"/);
});

test("styles default, filled, focus, invalid, disabled, and complete states", () => {
  assert.match(styles, /\.kappa-input-otp__input\s*\{/);
  for (const selector of [
    "data-filled",
    ":focus-visible",
    "data-invalid",
    "aria-invalid",
    ":disabled",
    "data-disabled",
    "data-complete",
  ]) {
    assert.match(styles, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const token of ["--kappa-line", "--kappa-focus", "--kappa-danger", "--kappa-disabled-surface"]) {
    assert.match(styles, new RegExp(`var\\(${token}`));
  }
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("keeps invalid and disabled borders ahead of complete styling", () => {
  const complete = styles.indexOf(".kappa-input-otp[data-complete]");
  const invalid = styles.indexOf(".kappa-input-otp[data-invalid]");
  const disabled = styles.indexOf(".kappa-input-otp[data-disabled]");

  assert.ok(complete >= 0);
  assert.ok(invalid > complete);
  assert.ok(disabled > complete);
  assert.match(styles, /\.kappa-input-otp \.kappa-input-otp__input\[data-invalid\]/);
  assert.match(styles, /\.kappa-input-otp \.kappa-input-otp__input\[data-disabled\]/);
});
