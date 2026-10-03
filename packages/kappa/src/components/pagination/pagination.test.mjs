import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { resolvePaginationControlLabel } from "./pagination.ts";

test("shortens default visible labels and preserves custom translations", () => {
  for (const [label, expected] of [
    ["first page", "First"], ["previous page", "Previous"],
    ["next page", "Next"], ["last page", "Last"],
    ["Nächste Seite", "Nächste Seite"], ["Next results", "Next results"],
    [undefined, undefined],
  ]) assert.equal(resolvePaginationControlLabel(label), expected);
});

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Pagination.vue");
const providerSource = readSource("./PaginationRootProvider.vue");
const itemSource = readSource("./PaginationItem.vue");
const ellipsisSource = readSource("./PaginationEllipsis.vue");
const firstSource = readSource("./PaginationFirstTrigger.vue");
const prevSource = readSource("./PaginationPrevTrigger.vue");
const nextSource = readSource("./PaginationNextTrigger.vue");
const lastSource = readSource("./PaginationLastTrigger.vue");
const contextSource = readSource("./PaginationContext.vue");
const typesSource = readSource("./pagination.ts");
const styles = readSource("./pagination.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the Ark pagination root contract and events", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/pagination"/);
  assert.match(rootSource, /<ArkPagination\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="pagination"/);

  for (const prop of [
    "asChild",
    "count",
    "defaultPage",
    "defaultPageSize",
    "getPageUrl",
    "id",
    "ids",
    "page",
    "pageSize",
    "siblingCount",
    "translations",
    "type",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }

  for (const binding of [
    "as-child",
    "count",
    "default-page",
    "default-page-size",
    "get-page-url",
    "id",
    "ids",
    "page",
    "page-size",
    "sibling-count",
    "translations",
    "type",
  ]) {
    assert.match(rootSource, new RegExp(`:${binding}=`));
  }

  for (const event of [
    "page-change",
    "page-size-change",
    "update:page",
    "update:page-size",
  ]) {
    assert.match(rootSource, new RegExp(`@${event}=`));
  }
  assert.match(typesSource, /PaginationPageChangeDetails/);
  assert.match(typesSource, /PaginationPageSizeChangeDetails/);
  assert.match(typesSource, /PaginationPageUrlDetails/);
});

test("wraps the provider, page parts, triggers, ellipsis, and context", () => {
  assert.match(providerSource, /<ArkPagination\.RootProvider/);
  assert.match(providerSource, /v-bind="\$attrs"/);
  assert.match(providerSource, /:value="props\.value"/);
  assert.match(contextSource, /<ArkPagination\.Context v-slot="context">/);

  for (const [source, primitive, slot] of [
    [itemSource, "Item", "pagination-item"],
    [ellipsisSource, "Ellipsis", "pagination-ellipsis"],
    [firstSource, "FirstTrigger", "pagination-first-trigger"],
    [prevSource, "PrevTrigger", "pagination-prev-trigger"],
    [nextSource, "NextTrigger", "pagination-next-trigger"],
    [lastSource, "LastTrigger", "pagination-last-trigger"],
  ]) {
    assert.match(source, new RegExp(`<ArkPagination\\.${primitive}`));
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
  }
  assert.match(itemSource, /:type="props\.type"/);
  assert.match(itemSource, /:value="props\.value"/);
  assert.match(ellipsisSource, /:index="props\.index"/);
  assert.match(contextSource, /<slot v-bind="context" \/>/);
});

test("exports the compound API and Ark pagination hooks", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Item",
    "Ellipsis",
    "FirstTrigger",
    "PrevTrigger",
    "NextTrigger",
    "LastTrigger",
    "Context",
    "Controls",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Pagination${part}`));
    assert.match(moduleBarrel, new RegExp(`Pagination${part}`));
  }
  for (const contract of [
    "PaginationProps",
    "PaginationEmits",
    "PaginationRootProviderProps",
    "PaginationItemProps",
    "PaginationEllipsisProps",
    "PaginationPageChangeDetails",
    "PaginationPageSizeChangeDetails",
    "PaginationPageUrlDetails",
  ]) {
    assert.match(moduleBarrel, new RegExp(contract));
  }
  assert.match(moduleBarrel, /paginationAnatomy/);
  assert.match(moduleBarrel, /usePagination/);
  assert.match(moduleBarrel, /usePaginationContext/);
});

test("provides default arrows and optional labels without replacing custom slots", () => {
  for (const source of [firstSource, prevSource, nextSource, lastSource]) {
    assert.match(source, /label: undefined/);
    assert.match(source, /<slot>/);
    assert.match(source, /<PaginationArrow/);
    assert.match(source, /v-if="props.label"/);
    assert.match(source, /:data-icon-only=/);
    assert.match(source, /:as-child="props.asChild"/);
  }
  assert.match(firstSource, /<PaginationArrow double/);
  assert.match(lastSource, /<PaginationArrow double forward/);
  assert.match(nextSource, /<PaginationArrow forward/);
  assert.match(readSource("./PaginationArrow.vue"), /aria-hidden="true"/);
  assert.match(styles, /:dir\(rtl\)/);
  const controls = readSource("./PaginationControls.vue");
  assert.match(controls, /usePaginationContext/);
  assert.match(controls, /pagination.value.setPage\(page\)/);
  assert.match(controls, /Number.isSafeInteger/);
  assert.match(controls, /@keydown.enter.prevent="commit"/);
  assert.match(controls, /@keydown.esc.prevent="restore"/);
});

test("uses semantic tokens, Ark state attributes, and accessible focus states", () => {
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-focus",
    "--kappa-line",
    "--kappa-subtle",
    "--kappa-tint",
    "--kappa-overlay",
    "--kappa-disabled-opacity",
  ]) {
    assert.match(styles, new RegExp(`var\\(${token}`));
  }
  for (const selector of [
    "aria-current",
    "data-selected",
    "data-disabled",
    "focus-visible",
    "forced-colors",
    "prefers-reduced-motion",
  ]) {
    assert.match(styles, new RegExp(selector.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")));
  }
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)/);
});
