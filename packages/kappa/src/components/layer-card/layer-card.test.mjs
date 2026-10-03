import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  LAYER_CARD_PRIMARY_DEFAULT_ELEMENT,
  LAYER_CARD_PRIMARY_ELEMENTS,
  LAYER_CARD_ROOT_DEFAULT_ELEMENT,
  LAYER_CARD_ROOT_ELEMENTS,
  LAYER_CARD_SECONDARY_DEFAULT_ELEMENT,
  LAYER_CARD_SECONDARY_ELEMENTS,
  isLayerCardPrimaryElement,
  isLayerCardRootElement,
  isLayerCardSecondaryElement,
  resolveLayerCardPrimaryElement,
  resolveLayerCardRootElement,
  resolveLayerCardSecondaryElement,
} from "./layer-card.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const partFiles = ["LayerCard.vue", "LayerCardPrimary.vue", "LayerCardSecondary.vue"];
const partSources = partFiles.map(source);
const styles = source("layer-card.css");
const barrel = source("index.ts");

const ruleBody = (selector) => {
  const start = styles.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `missing ${selector} rule`);
  return styles.slice(start, styles.indexOf("}", start));
};

test("defines safe semantic defaults", () => {
  assert.deepEqual(LAYER_CARD_ROOT_ELEMENTS, ["div", "article", "section", "aside", "a", "form"]);
  assert.deepEqual(LAYER_CARD_PRIMARY_ELEMENTS, ["div", "article", "section", "a"]);
  assert.deepEqual(LAYER_CARD_SECONDARY_ELEMENTS, ["div", "header", "p"]);
  assert.equal(LAYER_CARD_ROOT_DEFAULT_ELEMENT, "div");
  assert.equal(LAYER_CARD_PRIMARY_DEFAULT_ELEMENT, "div");
  assert.equal(LAYER_CARD_SECONDARY_DEFAULT_ELEMENT, "div");
});

test("rejects unsupported runtime elements", () => {
  for (const element of LAYER_CARD_ROOT_ELEMENTS) assert.equal(isLayerCardRootElement(element), true);
  for (const element of LAYER_CARD_PRIMARY_ELEMENTS) {
    assert.equal(isLayerCardPrimaryElement(element), true);
  }
  for (const element of LAYER_CARD_SECONDARY_ELEMENTS) {
    assert.equal(isLayerCardSecondaryElement(element), true);
  }
  for (const value of ["script", "toString", "constructor", "__proto__", null, 1]) {
    assert.equal(isLayerCardRootElement(value), false);
    assert.equal(isLayerCardPrimaryElement(value), false);
    assert.equal(isLayerCardSecondaryElement(value), false);
  }
  assert.equal(resolveLayerCardRootElement("article"), "article");
  assert.equal(resolveLayerCardRootElement("script"), "div");
  assert.equal(resolveLayerCardPrimaryElement("a"), "a");
  assert.equal(resolveLayerCardPrimaryElement("button"), "div");
  assert.equal(resolveLayerCardSecondaryElement("header"), "header");
  assert.equal(resolveLayerCardSecondaryElement("span"), "div");
});

test("renders native, attribute-transparent compound parts", () => {
  for (const partSource of partSources) {
    assert.match(partSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
    assert.match(partSource, /v-bind="\$attrs"/);
    assert.match(partSource, /class="kappa-layer-card/);
    assert.match(partSource, /data-slot="layer-card/);
    assert.doesNotMatch(partSource, /@ark-ui|@zag-js/);
  }
});

test("clips the outer radius and squares the primary surface", () => {
  const rootRule = ruleBody(".kappa-layer-card");
  assert.match(rootRule, /overflow: hidden/);
  assert.match(rootRule, /border-radius: var\(--kappa-layer-card-radius\)/);
  assert.match(styles, /--kappa-layer-card-radius: [\d.]+rem/);

  const primaryRule = ruleBody(".kappa-layer-card__primary");
  assert.deepEqual(primaryRule.match(/border-radius: [^;]+;/g), ["border-radius: 0;"]);
  assert.equal(primaryRule.match(/radius/g).length, 1);
  assert.doesNotMatch(styles, /border-(start|end)-(start|end)-radius/);
  assert.match(primaryRule, /box-shadow:[\s\S]*0 0 0 1px var\(--kappa-layer-card-border\)/);
  assert.doesNotMatch(primaryRule, /^\s*border(?!-radius|-box)/m);
  assert.doesNotMatch(styles, /border-block-start/);
});

test("styles layered surfaces with Kappa tokens and forced colors", () => {
  assert.match(styles, /:has\(> \.kappa-layer-card__primary\)/);
  assert.match(styles, /:has\(> \.kappa-layer-card__secondary\)/);
  assert.match(ruleBody(".kappa-layer-card__secondary"), /min-block-size: 2\.25rem/);
  assert.match(ruleBody(".kappa-layer-card__secondary"), /padding-block: 0\.5rem;/);
  assert.match(ruleBody(".kappa-layer-card__secondary"), /line-height: 1\.25rem/);
  assert.match(styles, /\.kappa-layer-card:is\(a\):focus-visible/);
  assert.match(styles, /\.kappa-layer-card__primary:is\(a\):focus-visible/);
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-focus",
    "--kappa-focus-soft",
    "--kappa-hairline",
    "--kappa-line",
    "--kappa-shadow",
    "--kappa-subtle",
    "--kappa-tint",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /CanvasText/);
  assert.doesNotMatch(styles, /data-kappa-theme|data-mode/);
  assert.doesNotMatch(styles, /animation|transition/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the complete compound surface", () => {
  assert.match(barrel, /export const LayerCard = Object\.assign/);
  for (const name of ["Root", "Primary", "Secondary"]) {
    assert.match(barrel, new RegExp(`${name}: LayerCard${name}`));
  }
  assert.match(barrel, /export \{ LayerCardPrimary, LayerCardRoot, LayerCardSecondary \}/);
  assert.match(barrel, /export \* from "\.\/layer-card"/);
});
