import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  TABLE_DEFAULT_HEADER_VARIANT,
  TABLE_DEFAULT_VARIANTS,
  TABLE_HEADER_VARIANTS,
  TABLE_LAYOUTS,
  TABLE_ROW_VARIANTS,
  TABLE_STICKY_COLUMNS,
  isTableHeaderVariant,
  isTableLayout,
  isTableRowVariant,
  isTableStickyColumn,
  resolveTableHeaderVariant,
  resolveTableLayout,
  resolveTableRowVariant,
  resolveTableStickyColumn,
} from "./table.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const partFiles = [
  "Table.vue",
  "TableCaption.vue",
  "TableHeader.vue",
  "TableBody.vue",
  "TableFooter.vue",
  "TableRow.vue",
  "TableHead.vue",
  "TableCell.vue",
  "TableCheckHead.vue",
  "TableCheckCell.vue",
  "TableResizeHandle.vue",
];

test("defines guarded layout, row, header, and sticky contracts", () => {
  assert.deepEqual(TABLE_LAYOUTS, ["auto", "fixed"]);
  assert.deepEqual(TABLE_ROW_VARIANTS, ["default", "selected"]);
  assert.deepEqual(TABLE_STICKY_COLUMNS, ["left", "right"]);
  assert.deepEqual(TABLE_HEADER_VARIANTS, ["default", "compact"]);
  assert.equal(TABLE_DEFAULT_VARIANTS.layout, "auto");
  assert.equal(TABLE_DEFAULT_VARIANTS.variant, "default");
  assert.equal(TABLE_DEFAULT_HEADER_VARIANT, "default");

  for (const value of TABLE_LAYOUTS) assert.equal(isTableLayout(value), true);
  for (const value of TABLE_ROW_VARIANTS) assert.equal(isTableRowVariant(value), true);
  for (const value of TABLE_STICKY_COLUMNS) assert.equal(isTableStickyColumn(value), true);
  for (const value of TABLE_HEADER_VARIANTS) assert.equal(isTableHeaderVariant(value), true);

  for (const value of ["missing", "constructor", "__proto__", null, 1]) {
    assert.equal(isTableLayout(value), false);
    assert.equal(isTableRowVariant(value), false);
    assert.equal(isTableStickyColumn(value), false);
    assert.equal(isTableHeaderVariant(value), false);
  }

  assert.equal(resolveTableLayout("fixed"), "fixed");
  assert.equal(resolveTableLayout("large"), "auto");
  assert.equal(resolveTableRowVariant("selected"), "selected");
  assert.equal(resolveTableRowVariant("active"), "default");
  assert.equal(resolveTableStickyColumn("left"), "left");
  assert.equal(resolveTableStickyColumn("center"), undefined);
  assert.equal(resolveTableHeaderVariant("compact"), "compact");
  assert.equal(resolveTableHeaderVariant("dense"), "default");
});

test("renders semantic native parts and forwards consumer attributes", () => {
  for (const file of partFiles) {
    const partSource = source(file);
    assert.match(partSource, /defineOptions\(\{ inheritAttrs: false \}\)/, file);
    assert.match(partSource, /v-bind=/, file);
    if (!file.startsWith("TableCheck")) assert.match(partSource, /data-slot="table/, file);
    assert.doesNotMatch(partSource, /@zag-js/, file);
    assert.doesNotMatch(partSource, /class="(?!kappa-)[a-z]|(?<![\w-])--(?!kappa-)[a-z][\w-]*/, file);
  }

  assert.match(source("Table.vue"), /<table/);
  assert.match(source("TableCaption.vue"), /<caption/);
  assert.match(source("TableHeader.vue"), /<thead/);
  assert.match(source("TableBody.vue"), /<tbody/);
  assert.match(source("TableFooter.vue"), /<tfoot/);
  assert.match(source("TableRow.vue"), /<tr/);
  assert.match(source("TableHead.vue"), /<th/);
  assert.match(source("TableCell.vue"), /<td/);
  assert.match(source("TableResizeHandle.vue"), /type="button"/);
});

test("makes whole-table compact density opt-in", () => {
  assert.equal(TABLE_DEFAULT_VARIANTS.compact, false);
  assert.match(source("table.ts"), /compact\?: boolean/);
  assert.match(source("Table.vue"), /compact: TABLE_DEFAULT_VARIANTS.compact/);
  assert.match(source("Table.vue"), /:data-compact="props.compact/);
  assert.match(source("table.css"), /\.kappa-table\[data-compact\]/);
  assert.match(source("table.css"), /--kappa-table-cell-padding-block: 0\.25rem/);
  assert.match(source("table.css"), /--kappa-table-cell-padding-inline: 0\.5rem/);
});

test("keeps state, sticky, selection, and resize styling token-backed", () => {
  const styles = source("table.css");

  for (const token of [
    "--kappa-control",
    "--kappa-elevated",
    "--kappa-default",
    "--kappa-subtle",
    "--kappa-tint",
    "--kappa-line",
    "--kappa-hairline",
    "--kappa-focus",
    "--kappa-focus-soft",
    "--kappa-danger-tint",
    "--kappa-danger-text",
  ]) {
    assert.match(styles, new RegExp(token));
  }

  for (const selector of [
    'data-layout="fixed"',
    'data-variant="compact"',
    'data-variant="selected"',
    "aria-selected=\"true\"",
    "data-invalid",
    "aria-invalid=\"true\"",
    "data-loading",
    "aria-busy=\"true\"",
    "data-disabled",
    "aria-disabled=\"true\"",
    "data-empty",
    "data-hover",
    "data-focus-visible",
    'data-sticky="left"',
    'data-sticky="right"',
    "focus-within",
    "ResizeHandle",
  ]) {
    if (selector === "ResizeHandle") {
      assert.match(styles, /kappa-table__resize-handle/);
    } else {
      assert.match(styles, new RegExp(selector.replace(/[()[\]\\]/g, "\\$&")));
    }
  }

  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the complete compound component surface", () => {
  const barrel = source("index.ts");

  assert.match(barrel, /export const Table = Object\.assign/);
  for (const part of [
    "Root",
    "Caption",
    "Header",
    "Head",
    "Body",
    "Row",
    "Cell",
    "Footer",
    "CheckHead",
    "CheckCell",
    "ResizeHandle",
  ]) {
    assert.match(barrel, new RegExp(`${part}: Table${part === "Root" ? "Root" : part}`));
  }
  assert.match(barrel, /export type \{/);
  assert.match(barrel, /TableCheckboxChangeDetails/);
  assert.match(barrel, /from ".\/table"/);
});
