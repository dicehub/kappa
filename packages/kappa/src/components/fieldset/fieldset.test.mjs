import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  FIELDSET_DEFAULT_ORIENTATION,
  FIELDSET_ORIENTATIONS,
  isFieldsetOrientation,
  resolveFieldsetOrientation,
} from "./fieldset.ts";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Fieldset.vue");
const providerSource = readSource("./FieldsetRootProvider.vue");
const legendSource = readSource("./FieldsetLegend.vue");
const helperSource = readSource("./FieldsetHelperText.vue");
const errorSource = readSource("./FieldsetErrorText.vue");
const contextSource = readSource("./FieldsetContext.vue");
const typesSource = readSource("./fieldset.ts");
const styles = readSource("./fieldset.css");
const moduleBarrel = readSource("./index.ts");

test("guards the Kappa fieldset orientation", () => {
  assert.deepEqual(FIELDSET_ORIENTATIONS, ["vertical", "horizontal"]);
  assert.equal(FIELDSET_DEFAULT_ORIENTATION, "vertical");
  assert.equal(isFieldsetOrientation("horizontal"), true);
  assert.equal(isFieldsetOrientation("constructor"), false);
  assert.equal(resolveFieldsetOrientation("horizontal"), "horizontal");
  assert.equal(resolveFieldsetOrientation("diagonal"), "vertical");
  assert.match(typesSource, /FieldsetOrientation/);
});

test("preserves native Ark fieldset semantics and adds Kappa layout", () => {
  assert.match(rootSource, /<ArkFieldset\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /class="kappa-fieldset"/);
  assert.match(rootSource, /data-slot="fieldset"/);
  assert.match(rootSource, /:data-orientation="resolvedOrientation"/);

  for (const prop of ["asChild", "disabled", "id", "invalid"]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }
  assert.match(rootSource, /orientation: FIELDSET_DEFAULT_ORIENTATION/);

  assert.match(providerSource, /<ArkFieldset\.RootProvider/);
  assert.match(providerSource, /:value="props\.value"/);
  assert.match(providerSource, /:data-orientation="resolvedOrientation"/);
  assert.match(providerSource, /v-bind="\$attrs"/);
});

test("wraps every semantic Ark part and forwards attributes", () => {
  for (const [source, part, slot] of [
    [legendSource, "Legend", "fieldset-legend"],
    [helperSource, "HelperText", "fieldset-helper-text"],
    [errorSource, "ErrorText", "fieldset-error-text"],
  ]) {
    assert.match(source, new RegExp(`<ArkFieldset\\.${part}`));
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
    assert.match(source, /:as-child="props\.asChild"/);
  }

  assert.match(contextSource, /<ArkFieldset\.Context v-slot="context">/);
  assert.match(contextSource, /<slot v-bind="context"/);
});

test("exports the compound API, named parts, types, and Ark hooks", () => {
  for (const part of ["Root", "RootProvider", "Legend", "HelperText", "ErrorText", "Context"]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Fieldset${part}`));
    assert.match(moduleBarrel, new RegExp(`Fieldset${part}`));
  }
  assert.match(moduleBarrel, /fieldsetAnatomy/);
  assert.match(moduleBarrel, /useFieldset/);
  assert.match(moduleBarrel, /useFieldsetContext/);
});

test("uses semantic, state-driven, logical Kappa styling", () => {
  assert.match(styles, /\.kappa-fieldset__/);
  assert.match(styles, /\[data-orientation="horizontal"\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /:focus-within/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
