import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { SCROLL_AREA_DEFAULT_ORIENTATION } from "./scroll-area.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const root = source("ScrollArea.vue");
const viewport = source("ScrollAreaViewport.vue");
const scrollbar = source("ScrollAreaScrollbar.vue");
const context = source("ScrollAreaContext.vue");
const styles = source("scroll-area.css");
const barrel = source("index.ts");

test("keeps the vertical scrollbar as the compact convenience default", () => {
  assert.equal(SCROLL_AREA_DEFAULT_ORIENTATION, "vertical");
  assert.match(scrollbar, /orientation: SCROLL_AREA_DEFAULT_ORIENTATION/);
  assert.match(scrollbar, /:orientation="props\.orientation"/);
});

test("wraps the complete Ark Scroll Area anatomy without hiding attributes", () => {
  for (const part of [
    "ScrollArea.vue",
    "ScrollAreaRootProvider.vue",
    "ScrollAreaViewport.vue",
    "ScrollAreaContent.vue",
    "ScrollAreaScrollbar.vue",
    "ScrollAreaThumb.vue",
    "ScrollAreaCorner.vue",
  ]) {
    const component = source(part);
    assert.match(component, /@ark-ui\/vue\/scroll-area/);
    assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
    assert.match(component, /v-bind="\$attrs"/);
    assert.match(component, /data-slot="scroll-area/);
  }
  assert.match(root, /<ArkScrollArea\.Root/);
  assert.match(root, /DEFAULT_LOCALE, LocaleProvider, useLocaleContext/);
  assert.match(root, /<LocaleProvider :locale="locale">/);
  assert.match(root, /props\.dir === "rtl" \? "ar" : "en-US"/);
  assert.match(viewport, /<ArkScrollArea\.Viewport/);
  assert.match(context, /<ArkScrollArea\.Context v-slot="context">/);
  assert.doesNotMatch(root, /@zag-js/);
});

test("ships Ark-required scrollbar hiding and complete platform states", () => {
  assert.match(styles, /scrollbar-width: none/);
  assert.match(styles, /::-webkit-scrollbar/);
  assert.match(styles, /data-orientation="vertical"/);
  assert.match(styles, /data-orientation="horizontal"/);
  assert.match(styles, /data-orientation="vertical"[\s\S]*flex-direction: column/);
  assert.match(styles, /data-orientation="horizontal"[\s\S]*flex-direction: row/);
  assert.match(styles, /__thumb[\s\S]*flex: none/);
  assert.match(styles, /\[data-dragging\]/);
  assert.match(styles, /:not\(\[data-overflow-y\]\)/);
  assert.match(styles, /:not\(\[data-overflow-x\]\)/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
  assert.match(styles, /inset-inline/);
  assert.doesNotMatch(styles, /(?:left|right):/);
  // Ark owns the corner dimensions; public styles use Kappa names.
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|corner-(?:height|width)\b)[a-z][\w-]*/);
});

test("exports named parts, compound parts, hooks, and public contracts", () => {
  assert.match(barrel, /export const ScrollArea = Object\.assign/);
  for (const part of [
    "Root",
    "RootProvider",
    "Viewport",
    "Content",
    "Scrollbar",
    "Thumb",
    "Corner",
    "Context",
  ]) {
    assert.match(barrel, new RegExp(`${part}: ScrollArea${part === "Root" ? "Root" : part}`));
  }
  for (const name of [
    "ScrollAreaProps",
    "ScrollAreaDirection",
    "ScrollAreaApi",
    "useScrollArea",
    "useScrollAreaContext",
    "scrollAreaAnatomy",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
