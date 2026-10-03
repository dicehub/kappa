import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("DownloadTrigger.vue");
const contracts = source("download-trigger.ts");
const styles = source("download-trigger.css");
const barrel = source("index.ts");

test("composes Ark DownloadTrigger with the Kappa button contract", () => {
  assert.match(component, /DownloadTrigger as ArkDownloadTrigger/);
  assert.match(component, /class="kappa-button kappa-download-trigger"/);
  assert.match(component, /:data="props\.data"/);
  assert.match(component, /:file-name="props\.fileName"/);
  assert.match(component, /:mime-type="props\.mimeType"/);
  assert.match(component, /type="button"|ArkDownloadTrigger/);
});

test("forwards native attributes and exposes complete visual states", () => {
  assert.match(component, /v-bind="\$attrs"/);
  assert.match(component, /:disabled="props\.disabled \|\| props\.loading"/);
  assert.match(component, /:aria-busy="props\.loading \? 'true' : undefined"/);
  assert.match(component, /data-slot="download-trigger"/);
  assert.match(component, /props\.asChild/);
  assert.match(styles, /cursor: progress/);
  assert.match(styles, /forced-colors: active/);
  for (const prop of ["asChild", "data", "fileName", "mimeType"]) {
    assert.match(contracts, new RegExp(`(?:${prop}\\??:|${prop}:)`));
  }
  assert.doesNotMatch(contracts, /Omit<ArkDownloadTriggerProps/);
});

test("reuses guarded Button variants, sizes, shapes, and icon positions", () => {
  for (const resolver of [
    "resolveButtonVariant",
    "resolveButtonSize",
    "resolveButtonShape",
    "resolveButtonIconPosition",
  ]) {
    assert.match(component, new RegExp(resolver));
  }
  assert.match(contracts, /extends ButtonVisualProps/);
});

test("exports the component, Ark hook, and public contracts", () => {
  for (const name of [
    "DownloadTrigger",
    "useDownload",
    "DownloadableData",
    "DownloadTriggerProps",
    "DownloadTriggerSlots",
    "UseDownloadProps",
    "UseDownloadReturn",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
