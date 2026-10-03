import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  CARD_DEFAULT_SIZE,
  CARD_ROOT_ELEMENTS,
  CARD_SIZES,
  CARD_TITLE_DEFAULT_ELEMENT,
  isCardRootElement,
  resolveCardPrimaryElement,
  resolveCardRootElement,
  resolveCardSize,
  resolveCardTitleElement,
} from "./card.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const partFiles = [
  "Card.vue",
  "CardAction.vue",
  "CardContent.vue",
  "CardDescription.vue",
  "CardFooter.vue",
  "CardHeader.vue",
  "CardPrimary.vue",
  "CardSecondary.vue",
  "CardTitle.vue",
];
const partSources = partFiles.map(source);
const styles = source("card.css");
const barrel = source("index.ts");

test("defines safe semantic defaults and sizes", () => {
  assert.deepEqual(CARD_SIZES, ["sm", "base"]);
  assert.deepEqual(CARD_ROOT_ELEMENTS, ["div", "article", "section", "aside", "a", "form"]);
  assert.equal(CARD_DEFAULT_SIZE, "base");
  assert.equal(CARD_TITLE_DEFAULT_ELEMENT, "h3");
  assert.equal(resolveCardSize("sm"), "sm");
  assert.equal(resolveCardSize("large"), "base");
});

test("rejects unsupported runtime elements", () => {
  for (const element of CARD_ROOT_ELEMENTS) assert.equal(isCardRootElement(element), true);
  for (const value of ["script", "toString", "constructor", "__proto__", null, 1]) {
    assert.equal(isCardRootElement(value), false);
  }
  assert.equal(resolveCardRootElement("article"), "article");
  assert.equal(resolveCardRootElement("script"), "div");
  assert.equal(resolveCardTitleElement("h2"), "h2");
  assert.equal(resolveCardTitleElement("span"), "h3");
  assert.equal(resolveCardPrimaryElement("a"), "a");
  assert.equal(resolveCardPrimaryElement("button"), "div");
});

test("renders native, attribute-transparent compound parts", () => {
  for (const partSource of partSources) {
    assert.match(partSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
    assert.match(partSource, /v-bind="\$attrs"/);
    assert.match(partSource, /data-slot="card/);
    assert.doesNotMatch(partSource, /@ark-ui|@zag-js/);
  }
});

test("styles standard and layered compositions with Kappa tokens", () => {
  assert.match(styles, /\.kappa-card__header:has\(> \.kappa-card__action\)/);
  assert.match(styles, /\.kappa-card__header > \.kappa-card__title/);
  assert.match(styles, /\.kappa-card__footer/);
  assert.match(styles, /:has\(> \.kappa-card__primary\)/);
  assert.match(styles, /\.kappa-card__secondary \+ \.kappa-card__primary[\s\S]*border-start-start-radius: 0/);
  assert.match(styles, /border-start-end-radius: 0/);
  assert.match(styles, /--kappa-card-spacing/);
  assert.match(styles, /> :is\(img, picture, video\):first-child/);
  assert.match(styles, /data-size="sm"/);
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-focus",
    "--kappa-hairline",
    "--kappa-line",
    "--kappa-shadow",
    "--kappa-subtle",
    "--kappa-tint",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /animation|transition/);
});

test("exports the complete compound surface", () => {
  assert.match(barrel, /export const Card = Object\.assign/);
  for (const name of [
    "Root",
    "Header",
    "Title",
    "Description",
    "Action",
    "Content",
    "Footer",
    "Primary",
    "Secondary",
  ]) {
    assert.match(barrel, new RegExp(`${name}: Card${name === "Root" ? "Root" : name}`));
  }
  assert.match(barrel, /export \* from "\.\/card"/);
});
