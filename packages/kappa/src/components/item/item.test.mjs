import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  ITEM_DEFAULT_SIZE,
  ITEM_DEFAULT_VARIANT,
  ITEM_MEDIA_DEFAULT_VARIANT,
  ITEM_MEDIA_VARIANTS,
  ITEM_ROOT_DEFAULT_ELEMENT,
  ITEM_ROOT_ELEMENTS,
  ITEM_SIZES,
  ITEM_TITLE_DEFAULT_ELEMENT,
  ITEM_TITLE_ELEMENTS,
  ITEM_VARIANTS,
  isItemRootElement,
  resolveItemMediaVariant,
  resolveItemRootElement,
  resolveItemSize,
  resolveItemTitleElement,
  resolveItemVariant,
} from "./item.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const rootSource = source("Item.vue");
const mediaSource = source("ItemMedia.vue");
const titleSource = source("ItemTitle.vue");
const separatorSource = source("ItemSeparator.vue");
const partSources = [
  rootSource,
  source("ItemGroup.vue"),
  separatorSource,
  mediaSource,
  source("ItemContent.vue"),
  titleSource,
  source("ItemDescription.vue"),
  source("ItemActions.vue"),
  source("ItemHeader.vue"),
  source("ItemFooter.vue"),
];
const styles = source("item.css");
const barrel = source("index.ts");

test("defines the Item variants, sizes, and media treatments", () => {
  assert.deepEqual(ITEM_VARIANTS, ["default", "outline", "muted"]);
  assert.deepEqual(ITEM_SIZES, ["default", "sm", "xs"]);
  assert.deepEqual(ITEM_MEDIA_VARIANTS, ["default", "icon", "image"]);
  assert.equal(ITEM_DEFAULT_VARIANT, "default");
  assert.equal(ITEM_DEFAULT_SIZE, "default");
  assert.equal(ITEM_MEDIA_DEFAULT_VARIANT, "default");
  assert.equal(ITEM_ROOT_DEFAULT_ELEMENT, "div");
  assert.equal(ITEM_TITLE_DEFAULT_ELEMENT, "div");
  assert.deepEqual(ITEM_ROOT_ELEMENTS, ["div", "article", "section", "li", "a"]);
  assert.deepEqual(ITEM_TITLE_ELEMENTS, ["h2", "h3", "h4", "h5", "h6", "p", "div"]);
});



test("keeps every compound part native and attribute-transparent", () => {
  for (const partSource of partSources) {
    assert.match(partSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
    assert.match(partSource, /v-bind="\$attrs"/);
    assert.match(partSource, /data-slot="item/);
    assert.doesNotMatch(partSource, /@ark-ui|@zag-js/);
  }

  assert.match(rootSource, /:is="resolvedElement"/);
  assert.match(rootSource, /resolveItemRootElement\(props\.as\)/);
  assert.match(rootSource, /:data-size="resolvedSize"/);
  assert.match(rootSource, /:data-variant="resolvedVariant"/);
  assert.match(mediaSource, /resolveItemMediaVariant\(props\.variant\)/);
  assert.match(titleSource, /resolveItemTitleElement\(props\.as\)/);
  assert.match(separatorSource, /<hr/);
  assert.doesNotMatch(separatorSource, /role="separator"/);
  assert.doesNotMatch(separatorSource, /aria-orientation="horizontal"/);
  assert.match(source("ItemGroup.vue"), /role="list"[\s\S]*v-bind="\$attrs"/);
});

test("uses Kappa semantic tokens for dense and accessible item states", () => {
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-item-divider",
    "--kappa-focus",
    "--kappa-line",
    "--kappa-shadow",
    "--kappa-subtle",
    "--kappa-tint",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  assert.match(styles, /data-variant="outline"/);
  assert.match(styles, /data-variant="muted"/);
  assert.match(styles, /data-size="sm"/);
  assert.match(styles, /data-size="xs"/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
