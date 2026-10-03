import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("Presence.vue");
const contracts = source("presence.ts");
const styles = source("presence.css");
const barrel = source("index.ts");

test("composes Ark Presence and forwards its complete public state", () => {
  assert.match(component, /Presence as ArkPresence/);
  assert.match(component, /v-bind="\$attrs"/);
  assert.match(component, /data-slot="presence"/);

  for (const prop of [
    "asChild",
    "immediate",
    "lazyMount",
    "present",
    "skipAnimationOnMount",
    "unmountOnExit",
  ]) {
    assert.match(contracts, new RegExp(`${prop}\\?: boolean`));
  }

  assert.match(component, /@enter-complete="emit\('enterComplete'\)"/);
  assert.match(component, /@exit-complete="emit\('exitComplete'\)"/);
});

test("provides state-driven motion with a reduced-motion fallback", () => {
  assert.match(styles, /\[data-state="open"\]/);
  assert.match(styles, /\[data-state="closed"\]/);
  assert.match(styles, /@keyframes kappa-presence-enter/);
  assert.match(styles, /@keyframes kappa-presence-exit/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|translateX/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}/i);
});

test("exports the component, Ark composables, provider, and contracts", () => {
  for (const name of [
    "Presence",
    "PresenceProvider",
    "usePresence",
    "usePresenceContext",
    "PresenceProps",
    "PresenceEmits",
    "PresenceSlots",
    "UsePresenceProps",
    "UsePresenceReturn",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
