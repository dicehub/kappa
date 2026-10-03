import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const rootSource = readSource("TableOfContentsRoot.vue");
const providerSource = readSource("TableOfContentsRootProvider.vue");
const contextSource = readSource("TableOfContentsContext.vue");
const itemSource = readSource("TableOfContentsItem.vue");
const linkSource = readSource("TableOfContentsLink.vue");
const styles = readSource("table-of-contents.css");
const typesSource = readSource("table-of-contents.ts");
const barrel = readSource("index.ts");

test("uses Ark UI TOC behavior and preserves controlled root props", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/toc"/);
  assert.match(rootSource, /<ArkToc\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /@active-change="emit\('activeChange', \$event\)"/);
  for (const prop of [
    "activeIds",
    "defaultActiveIds",
    "scrollEl",
    "items",
    "rootMargin",
    "scrollBehavior",
    "threshold",
  ]) {
    assert.match(rootSource, new RegExp(`props\\.${prop}`));
  }
  assert.match(typesSource, /TocActiveChangeDetails/);
  assert.match(typesSource, /TocItemData/);
});

test("exposes every Ark TOC part, context, and root provider", () => {
  assert.match(barrel, /export const TableOfContents = Object\.assign/);
  for (const part of [
    "Root",
    "Content",
    "Nav",
    "Title",
    "List",
    "Indicator",
    "Item",
    "Link",
    "Context",
    "RootProvider",
  ]) {
    assert.match(barrel, new RegExp(`${part}: TableOfContents`));
  }
  for (const source of [rootSource, providerSource, itemSource, linkSource]) {
    assert.match(source, /defineOptions\(\{ inheritAttrs: false \}\)/);
  }
  assert.match(providerSource, /<ArkToc\.RootProvider/);
  assert.match(providerSource, /:value="props\.value"/);
  assert.match(contextSource, /<ArkToc\.Context v-slot="context">/);
  assert.match(itemSource, /:item="props\.item"/);
  assert.match(linkSource, /<ArkToc\.Link/);
});

test("uses semantic rails, depth, active state, focus, and theme-safe tokens", () => {
  for (const token of [
    "--kappa-accent",
    "--kappa-default",
    "--kappa-focus",
    "--kappa-hairline",
    "--kappa-line",
    "--kappa-subtle",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  for (const state of [
    "data-active",
    "data-depth",
    "data-part",
    "focus-visible",
    "forced-colors",
    "prefers-reduced-motion",
  ]) {
    assert.match(styles, new RegExp(state));
  }
  assert.match(styles, /inset-block-start: var\(--top/);
  assert.match(styles, /inset-inline-start: -2px/);
  assert.match(styles, /block-size: var\(--height/);
  assert.match(styles, /border-inline-start: 2px solid/);
  assert.match(styles, /appearance: none/);
  assert.match(styles, /cursor: pointer/);
  assert.match(styles, /max\(\s*0rem,/);
  assert.match(styles, /gap: 0\.5rem/);
  assert.match(styles, /font-weight: 500/);
  // Ark owns depth and indicator geometry; public styles use Kappa names.
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:depth|top|height)\b)[a-z][\w-]*/);
});
