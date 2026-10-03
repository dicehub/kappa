import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  BREADCRUMBS_DEFAULT_SIZE,
  BREADCRUMBS_SIZES,
  isBreadcrumbsSize,
  resolveBreadcrumbsSize,
} from "./breadcrumbs.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const rootSource = source("Breadcrumbs.vue");
const listSource = source("BreadcrumbsList.vue");
const itemSource = source("BreadcrumbsItem.vue");
const linkSource = source("BreadcrumbsLink.vue");
const pageSource = source("BreadcrumbsPage.vue");
const separatorSource = source("BreadcrumbsSeparator.vue");
const ellipsisSource = source("BreadcrumbsEllipsis.vue");
const typesSource = source("breadcrumbs.ts");
const styles = source("breadcrumbs.css");
const moduleBarrel = source("index.ts");

test("defines guarded breadcrumb sizes", () => {
  assert.deepEqual(BREADCRUMBS_SIZES, ["sm", "base"]);
  assert.equal(BREADCRUMBS_DEFAULT_SIZE, "base");
  for (const size of BREADCRUMBS_SIZES) assert.equal(isBreadcrumbsSize(size), true);
  for (const value of ["lg", "toString", "constructor", "__proto__", null, 1]) {
    assert.equal(isBreadcrumbsSize(value), false);
  }
  assert.equal(resolveBreadcrumbsSize("sm"), "sm");
  assert.equal(resolveBreadcrumbsSize("missing"), "base");
});

test("renders an overridable labelled navigation landmark", () => {
  assert.match(rootSource, /<nav\s+:aria-label="\$attrs\['aria-labelledby'\]/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="breadcrumbs"/);
  assert.match(rootSource, /:data-size="resolvedSize"/);
  assert.match(rootSource, /\? 'Breadcrumb' : undefined/);
  assert.doesNotMatch(rootSource, /aria-label="breadcrumb"/i);
});

test("uses ordered-list semantics and a noninteractive current page", () => {
  assert.match(listSource, /<ol v-bind="\$attrs"/);
  assert.match(listSource, /role="list"/);
  assert.match(itemSource, /<li v-bind="\$attrs"/);
  assert.match(pageSource, /<span/);
  assert.match(pageSource, /aria-current="page"/);
  assert.doesNotMatch(pageSource, /role="link"|aria-disabled/);
});

test("composes native and router links through the Ark factory", () => {
  assert.match(linkSource, /from "@ark-ui\/vue\/factory"/);
  assert.match(linkSource, /<ark\.a/);
  assert.match(linkSource, /v-bind="\{ \.\.\.\$attrs, \.\.\.props \}"/);
  assert.match(linkSource, /:as-child="props\.asChild"/);
  assert.match(typesSource, /asChild\?: boolean/);
  assert.match(typesSource, /extends \/\* @vue-ignore \*\/ AnchorHTMLAttributes/);
  assert.match(typesSource, /BreadcrumbsListProps = OlHTMLAttributes/);
  assert.match(typesSource, /BreadcrumbsItemProps = LiHTMLAttributes/);
  assert.match(typesSource, /BreadcrumbsSeparatorProps = LiHTMLAttributes/);
});

test("keeps separators and ellipses decorative and replaceable", () => {
  for (const partSource of [separatorSource, ellipsisSource]) {
    assert.match(partSource, /role="presentation"/);
    assert.match(partSource, /aria-hidden="true"/);
    assert.match(partSource, /<slot>/);
  }
  assert.match(separatorSource, /kappa-breadcrumbs__separator-icon/);
  assert.match(ellipsisSource, /kappa-breadcrumbs__ellipsis-icon/);
});

test("exports the named, canonical, compatibility, and compound APIs", () => {
  assert.match(moduleBarrel, /export const Breadcrumbs = Object\.assign/);
  for (const part of ["Root", "List", "Item", "Link", "Page", "Current", "Separator", "Ellipsis"]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Breadcrumbs${part}`));
  }
  assert.match(moduleBarrel, /const BreadcrumbsCurrent = BreadcrumbsPage/);
  for (const name of ["BreadcrumbsRootProps", "BreadcrumbsLinkProps", "BreadcrumbsSize"]) {
    assert.match(moduleBarrel, new RegExp(name));
  }
});

test("uses flat, logical, wrapping, themeable styling", () => {
  assert.match(styles, /flex-wrap: wrap/);
  assert.match(styles, /font-size: 0\.875rem/);
  assert.match(styles, /data-size="sm"/);
  assert.match(styles, /\.kappa-breadcrumbs \.kappa-breadcrumbs__item/);
  assert.match(styles, /\.kappa-breadcrumbs \.kappa-breadcrumbs__separator/);
  assert.match(styles, /font-size: inherit/);
  assert.match(styles, /\.kappa-breadcrumbs \.kappa-breadcrumbs__separator\s*\{[^}]*color: inherit/s);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /\.kappa-breadcrumbs__link:hover\s*\{[^}]*color:/s);
  assert.doesNotMatch(styles, /text-decoration-line:\s*underline/);
  assert.match(styles, /:dir\(rtl\)/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /gradient|box-shadow|filter:/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|\b(?:left|right):/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
