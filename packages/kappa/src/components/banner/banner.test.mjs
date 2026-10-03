import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  BANNER_ACTION_DEFAULT_SIZE,
  BANNER_ACTION_DEFAULT_TYPE,
  BANNER_ACTION_DEFAULT_VARIANT,
  BANNER_ACTION_SIZE_BY_BANNER,
  BANNER_ACTION_TYPES,
  BANNER_ACTION_VARIANTS,
  BANNER_DEFAULT_SIZE,
  BANNER_DEFAULT_VARIANT,
  BANNER_SIZES,
  BANNER_VARIANTS,
  isBannerActionType,
  isBannerActionVariant,
  isBannerSize,
  isBannerVariant,
  resolveBannerActionType,
  resolveBannerActionVariant,
  resolveBannerSize,
  resolveBannerVariant,
} from "./banner.ts";

const rootSource = readFileSync(new URL("./Banner.vue", import.meta.url), "utf8");
const actionSource = readFileSync(new URL("./BannerAction.vue", import.meta.url), "utf8");
const bannerStyles = readFileSync(new URL("./banner.css", import.meta.url), "utf8");
const actionStyles = readFileSync(new URL("./banner-action.css", import.meta.url), "utf8");
const moduleBarrel = readFileSync(new URL("./index.ts", import.meta.url), "utf8");

test("keeps the Banner metadata synchronized", () => {
  assert.deepEqual(Object.keys(BANNER_VARIANTS), ["default", "alert", "error", "secondary"]);
  assert.deepEqual(Object.keys(BANNER_SIZES), ["base", "sm"]);
  assert.deepEqual(BANNER_ACTION_VARIANTS, ["primary", "secondary", "ghost"]);
  assert.deepEqual(BANNER_ACTION_SIZE_BY_BANNER, { base: "sm", sm: "xs" });
  assert.deepEqual(BANNER_ACTION_TYPES, ["button", "submit", "reset"]);
  assert.equal(BANNER_DEFAULT_VARIANT, "default");
  assert.equal(BANNER_DEFAULT_SIZE, "base");
  assert.equal(BANNER_ACTION_DEFAULT_VARIANT, "primary");
  assert.equal(BANNER_ACTION_DEFAULT_SIZE, "sm");
  assert.equal(BANNER_ACTION_DEFAULT_TYPE, "button");
});

test("rejects inherited and unsupported runtime values", () => {
  for (const variant of Object.keys(BANNER_VARIANTS)) assert.equal(isBannerVariant(variant), true);
  for (const size of Object.keys(BANNER_SIZES)) assert.equal(isBannerSize(size), true);
  for (const variant of BANNER_ACTION_VARIANTS) assert.equal(isBannerActionVariant(variant), true);
  for (const type of BANNER_ACTION_TYPES) assert.equal(isBannerActionType(type), true);

  for (const value of ["missing", "toString", "constructor", "__proto__", null, 1]) {
    assert.equal(isBannerVariant(value), false);
    assert.equal(isBannerSize(value), false);
    assert.equal(isBannerActionVariant(value), false);
    assert.equal(isBannerActionType(value), false);
  }
});

test("falls back safely for invalid JavaScript callers", () => {
  assert.equal(resolveBannerVariant("secondary"), "secondary");
  assert.equal(resolveBannerVariant("constructor"), "default");
  assert.equal(resolveBannerSize("sm"), "sm");
  assert.equal(resolveBannerSize("lg"), "base");
  assert.equal(resolveBannerActionVariant("ghost"), "ghost");
  assert.equal(resolveBannerActionVariant("outline"), "primary");
  assert.equal(resolveBannerActionType("submit"), "submit");
  assert.equal(resolveBannerActionType("menu"), "button");
});

test("renders a neutral native container and forwards accessibility attributes", () => {
  assert.match(rootSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(rootSource, /<div\s+v-bind="\$attrs"\s+class="kappa-banner"/);
  assert.doesNotMatch(rootSource, /role="(?:alert|status|banner)"/);
  assert.match(rootSource, /data-slot="banner"/);
  assert.match(rootSource, /:data-size="resolvedSize"/);
  assert.match(rootSource, /:data-variant="resolvedVariant"/);
  assert.match(rootSource, /aria-hidden="true"/);
  assert.match(rootSource, /v-bind="iconProps"/);
});

test("preserves structured, compact, and slotted content contracts", () => {
  assert.match(rootSource, /provideBannerContext/);
  assert.match(rootSource, /v-if="\$slots\.action && isCompact"/);
  assert.match(rootSource, /kappa-banner__action--compact/);
  assert.match(rootSource, /v-if="\$slots\.action && !isCompact"/);
  assert.match(rootSource, /<slot name="description">\{\{ description \}\}<\/slot>/);
  assert.match(rootSource, /<slot>\{\{ text \}\}<\/slot>/);
  assert.match(rootSource, /Boolean\(hasStructuredCopy\.value \|\| slots\.action\)/);
  assert.match(rootSource, /v-if="!hasStructuredCopy"/);
});

test("implements Banner.Action as a guarded native button", () => {
  assert.match(actionSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(actionSource, /<button\s+v-bind="\$attrs"/);
  assert.match(actionSource, /:disabled="disabled"/);
  assert.match(actionSource, /:type="resolvedType"/);
  assert.match(actionSource, /resolveBannerActionType\(props\.type\)/);
  assert.match(actionSource, /useBannerContext/);
  assert.match(actionSource, /data-slot="banner-action"/);
  assert.doesNotMatch(actionSource, /\.\.\/button/);
  assert.doesNotMatch(actionSource, /loading|iconProps|shape/);
});

test("exports the Banner.Action compound and its public contracts", () => {
  assert.match(moduleBarrel, /export const Banner = Object\.assign/);
  assert.match(moduleBarrel, /Action: BannerAction/);
  assert.match(moduleBarrel, /export \{ BannerAction, BannerRoot \}/);
  for (const name of [
    "BannerProps",
    "BannerActionProps",
    "BannerSize",
    "BannerVariant",
    "BannerActionType",
    "BannerActionVariant",
  ]) {
    assert.match(moduleBarrel, new RegExp(name));
  }
});

test("uses Kappa semantic tokens, Alert-style grid layout, responsive actions, and reduced motion", () => {
  assert.match(bannerStyles, /var\(--kappa-control/);
  assert.match(bannerStyles, /var\(--kappa-warning-tint/);
  assert.match(bannerStyles, /var\(--kappa-danger-tint/);
  assert.match(bannerStyles, /var\(--kappa-tint/);
  assert.match(bannerStyles, /--kappa-banner-action-accent: var\(--kappa-info-solid/);
  assert.match(bannerStyles, /--kappa-banner-action-accent: var\(--kappa-warning-solid/);
  assert.match(bannerStyles, /--kappa-banner-action-accent: var\(--kappa-danger-solid/);
  assert.match(bannerStyles, /--kappa-banner-action-accent: var\(--kappa-emphasis, #17191f\)/);
  assert.doesNotMatch(bannerStyles, /--kappa-banner-action-accent: var\(--kappa-\w+-text/);
  assert.match(bannerStyles, /grid-template-columns: auto minmax\(0, 1fr\)/);
  assert.match(bannerStyles, /grid-template-columns: minmax\(0, 1fr\) auto/);
  assert.match(bannerStyles, /border: 1px solid var\(--kappa-banner-border\)/);
  assert.match(actionStyles, /var\(--kappa-banner-action-contrast, #ffffff\)/);
  assert.match(actionStyles, /var\(--kappa-black, #000000\)/);
  assert.match(actionStyles, /var\(--kappa-banner-focus/);
  assert.match(bannerStyles, /@media \(max-width: 32\.5rem\)/);
  assert.match(actionStyles, /\.kappa-banner-action:focus-visible/);
  assert.match(actionStyles, /\.kappa-banner-action:disabled/);
  assert.match(actionStyles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(`${bannerStyles}\n${actionStyles}`, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
