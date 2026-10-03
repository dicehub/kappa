import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("ClientOnly.vue");
const contracts = source("client-only.ts");
const barrel = source("index.ts");

test("wraps Ark UI ClientOnly and forwards both render slots", () => {
  assert.match(component, /from "@ark-ui\/vue\/client-only"/);
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /defineProps<ClientOnlyProps>\(\)/);
  assert.match(component, /defineSlots<ClientOnlySlots>\(\)/);
  assert.match(component, /<ArkClientOnly>/);
  assert.match(component, /<template #fallback>[\s\S]*<slot name="fallback" \/>/);
  assert.match(component, /<slot \/>/);
  assert.doesNotMatch(component, /<(div|span|section|main)[\s>]/);
});

test("documents a renderless boundary without inventing component props", () => {
  assert.match(contracts, /ClientOnlyProps as ArkClientOnlyProps/);
  assert.match(contracts, /export type ClientOnlyProps = ArkClientOnlyProps/);
  assert.match(contracts, /default\?: \(\) => VNodeChild/);
  assert.match(contracts, /fallback\?: \(\) => VNodeChild/);
  assert.match(contracts, /server-side rendering/);
  assert.match(contracts, /after the component mounts/);
});

test("exports the component and slot contracts", () => {
  for (const name of ["ClientOnly", "ClientOnlyProps", "ClientOnlySlots"]) {
    assert.match(barrel, new RegExp(name));
  }
});
