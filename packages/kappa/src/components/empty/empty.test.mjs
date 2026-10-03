import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  EMPTY_DEFAULT_SIZE,
  EMPTY_MEDIA_DEFAULT_VARIANT,
  EMPTY_MEDIA_VARIANTS,
  EMPTY_SIZES,
  EMPTY_TITLE_DEFAULT_ELEMENT,
  EMPTY_TITLE_ELEMENTS,
  isEmptyMediaVariant,
  isEmptySize,
  isEmptyTitleElement,
  resolveEmptyMediaVariant,
  resolveEmptySize,
  resolveEmptyTitleElement,
} from "./empty.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const rootSource = source("Empty.vue");
const headerSource = source("EmptyHeader.vue");
const mediaSource = source("EmptyMedia.vue");
const titleSource = source("EmptyTitle.vue");
const descriptionSource = source("EmptyDescription.vue");
const contentSource = source("EmptyContent.vue");
const styles = source("empty.css");
const moduleBarrel = source("index.ts");

test("defines the empty size, media, and title contracts", () => {
  assert.deepEqual(EMPTY_SIZES, ["sm", "base", "lg"]);
  assert.deepEqual(EMPTY_MEDIA_VARIANTS, ["default", "icon"]);
  assert.deepEqual(EMPTY_TITLE_ELEMENTS, ["h2", "h3", "h4", "p", "div"]);
  assert.equal(EMPTY_DEFAULT_SIZE, "base");
  assert.equal(EMPTY_MEDIA_DEFAULT_VARIANT, "default");
  assert.equal(EMPTY_TITLE_DEFAULT_ELEMENT, "h3");
});

test("rejects unsupported runtime values and resolves safe defaults", () => {
  for (const size of EMPTY_SIZES) assert.equal(isEmptySize(size), true);
  for (const variant of EMPTY_MEDIA_VARIANTS) assert.equal(isEmptyMediaVariant(variant), true);
  for (const element of EMPTY_TITLE_ELEMENTS) assert.equal(isEmptyTitleElement(element), true);

  for (const value of ["missing", "toString", "constructor", "__proto__", null, 1]) {
    assert.equal(isEmptySize(value), false);
    assert.equal(isEmptyMediaVariant(value), false);
    assert.equal(isEmptyTitleElement(value), false);
  }

  assert.equal(resolveEmptySize("lg"), "lg");
  assert.equal(resolveEmptySize("xs"), "base");
  assert.equal(resolveEmptyMediaVariant("icon"), "icon");
  assert.equal(resolveEmptyMediaVariant("image"), "default");
  assert.equal(resolveEmptyTitleElement("h2"), "h2");
  assert.equal(resolveEmptyTitleElement("span"), "h3");
});

test("renders a guarded native root and forwards consumer attributes", () => {
  assert.match(rootSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(rootSource, /<div\s+v-bind="\$attrs"\s+class="kappa-empty"/);
  assert.match(rootSource, /resolveEmptySize\(props\.size\)/);
  assert.match(rootSource, /:data-size="resolvedSize"/);
  assert.doesNotMatch(rootSource, /@ark-ui|@zag-js/);
});

test("keeps all presentational parts native and attribute-transparent", () => {
  for (const partSource of [headerSource, contentSource]) {
    assert.match(partSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
    assert.match(partSource, /v-bind="\$attrs"/);
    assert.match(partSource, /<div/);
  }

  assert.match(mediaSource, /resolveEmptyMediaVariant\(props\.variant\)/);
  assert.match(mediaSource, /data-slot="empty-media"/);
  assert.match(titleSource, /resolveEmptyTitleElement\(props\.as\)/);
  assert.match(titleSource, /<component/);
  assert.match(titleSource, /v-bind="\$attrs"/);
  assert.match(descriptionSource, /<p\s+v-bind="\$attrs"/);
  assert.match(descriptionSource, /data-slot="empty-description"/);

  for (const partSource of [headerSource, mediaSource, titleSource, descriptionSource, contentSource]) {
    assert.doesNotMatch(partSource, /@ark-ui|@zag-js/);
  }
});

test("exports the complete named and compound component surface", () => {
  assert.match(moduleBarrel, /export const Empty = Object\.assign/);
  for (const part of ["Root", "Header", "Media", "Title", "Description", "Content"]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Empty${part}`));
  }
  for (const name of [
    "EmptyRootProps",
    "EmptyMediaProps",
    "EmptyTitleProps",
    "EmptySize",
    "EmptyMediaVariant",
    "EmptyTitleElement",
  ]) {
    assert.match(moduleBarrel, new RegExp(name));
  }
});

test("styles sizes, media, composition, accessibility, and logical layout", () => {
  assert.match(styles, /var\(--kappa-default/);
  assert.match(styles, /var\(--kappa-subtle/);
  assert.match(styles, /var\(--kappa-tint/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /\.kappa-empty--sm/);
  assert.match(styles, /\.kappa-empty--lg/);
  assert.match(styles, /\.kappa-empty__media--icon/);
  assert.match(styles, /\.kappa-empty__media--default/);
  assert.match(styles, /\.kappa-empty__content/);
  assert.match(styles, /padding-block/);
  assert.match(styles, /padding-inline/);
  assert.match(styles, /inline-size/);
  assert.match(styles, /text-wrap: balance/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /animation|transition/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
