import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  LINK_DEFAULT_VARIANT,
  LINK_VARIANTS,
  isLinkVariant,
  resolveLinkRel,
  resolveLinkTarget,
  resolveLinkVariant,
} from "./link.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("Link.vue");
const icon = source("LinkExternalIcon.vue");
const styles = source("link.css");
const barrel = source("index.ts");





test("uses the Ark anchor factory and composes router links", () => {
  assert.match(component, /ark } from "@ark-ui\/vue\/factory"/);
  assert.match(component, /<ark\.a/);
  assert.match(component, /v-bind="\$attrs"/);
  assert.match(component, /class="kappa-link"/);
  assert.match(component, /data-slot="link"/);
  assert.match(component, /:data-variant="resolvedVariant"/);
  assert.match(component, /:as-child="props\.asChild"/);
  assert.match(component, /props\.asChild \? undefined : props\.href/);
  assert.match(component, /:rel="resolvedRel"/);
  assert.match(component, /:target="resolvedTarget"/);
});

test("provides a decorative external-link indicator", () => {
  assert.match(icon, /data-slot="link-external-icon"/);
  assert.match(icon, /aria-hidden="true"/);
  assert.match(icon, /focusable="false"/);
  assert.match(icon, /stroke="currentColor"/);
});

test("covers complete visual states and platform preferences", () => {
  assert.match(styles, /\.kappa-link \{/);
  assert.match(styles, /font: inherit/);
  assert.match(styles, /var\(--kappa-info-text/);
  for (const state of [":visited", ":hover", ":active", ":focus-visible"]) {
    assert.match(styles, new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(styles, /\[aria-current="page"\]/);
  assert.match(styles, /:not\(\[href\]\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
