import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  filterDataGridRows,
  getDataGridColumnValue,
  resolveDataGridOverscan,
  resolveDataGridPositiveInteger,
} from "./data-grid.ts";
import { handleDataGridResizeKeydown } from "./data-grid-resize.ts";
import { createDataGridColumnDefs, DATA_GRID_SELECTION_COLUMN_ID } from "./data-grid-engine.ts";

const source = (name) => readFileSync(new URL(name, import.meta.url), "utf8");
const rows = [
  { id: "a", name: "Atlas", status: "Running", duration: 42 },
  { id: "b", name: "Beacon", status: "Ready", duration: 18 },
  { id: "c", name: "Cinder", status: "Ready", duration: 65 },
];
const columns = [
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "status", header: "Status", accessorKey: "status" },
  {
    id: "duration",
    header: "Duration",
    accessor: (row) => row.duration,
    filter: (value, _row, filter) => Number(value) <= Number(filter),
  },
];

test("resolves accessors and filters rows with query and column predicates", () => {
  assert.equal(getDataGridColumnValue(columns[0], rows[0]), "Atlas");
  assert.equal(getDataGridColumnValue(columns[2], rows[0]), 42);
  assert.deepEqual(filterDataGridRows(rows, columns, "bea", {}), [rows[1]]);
  assert.deepEqual(filterDataGridRows(rows, columns, "", { status: "ready" }), [rows[1], rows[2]]);
  assert.deepEqual(filterDataGridRows(rows, columns, "", { duration: 50 }), [rows[0], rows[1]]);
  assert.deepEqual(filterDataGridRows(rows, columns, "atlas", { status: "ready" }), []);
});

test("normalizes virtual window values", () => {
  assert.equal(resolveDataGridPositiveInteger(42.8, 10), 42);
  assert.equal(resolveDataGridPositiveInteger(0.5, 10), 1);
  assert.equal(resolveDataGridPositiveInteger(0, 10), 10);
  assert.equal(resolveDataGridOverscan(-2), 0);
  assert.equal(resolveDataGridOverscan(200), 100);
});

test("keeps the public contract Kappa-owned and the virtual DOM bounded", () => {
  const component = source("DataGrid.vue");
  const focus = source("use-data-grid-focus.ts");
  const engine = source("data-grid-engine.ts");
  const styles = source("data-grid.css");

  assert.match(component, /useTable/);
  assert.match(component, /useVirtualizer/);
  assert.match(component, /getVirtualItems/);
  assert.match(component, /role="grid"/);
  assert.match(component, /aria-rowcount/);
  assert.match(component, /data-grid-row-index/);
  assert.match(component, /showSelectionColumn/);
  assert.match(component, /getStartVisibleLeafColumns/);
  assert.match(component, /getCenterVisibleLeafColumns/);
  assert.match(component, /getEndVisibleLeafColumns/);
  assert.match(focus, /ArrowDown/);
  assert.match(focus, /PageDown/);
  assert.match(engine, /columnResizingFeature/);
  assert.match(engine, /rowSelectionFeature/);
  assert.match(engine, /sortFns: \{ alphanumeric: sortFn_alphanumeric, text: sortFn_text \}/);
  assert.match(source("DataGridColumnVisibility.vue"), /<Dropdown\.Group>/);
  assert.doesNotMatch(source("DataGridColumnVisibility.vue"), /<Dropdown\.Label>/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
  assert.doesNotMatch(source("data-grid.ts"), /@tanstack/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});

test("returns the same row array when client filters are inactive", () => {
  assert.equal(filterDataGridRows(rows, columns, "", {}), rows);
});

test("adds the selection column only when requested", () => {
  assert.notEqual(createDataGridColumnDefs(columns, true)[0].id, columns[0].id);
  assert.equal(createDataGridColumnDefs(columns, true)[0].id, DATA_GRID_SELECTION_COLUMN_ID);
  assert.equal(createDataGridColumnDefs(columns, false)[0].id, columns[0].id);
});

test("resizes columns from the keyboard in logical LTR and RTL directions", () => {
  const sizes = [];
  let resets = 0;
  const key = (key, direction = "ltr") => handleDataGridResizeKeydown({
    currentSize: 120,
    direction,
    event: { key, preventDefault() {}, shiftKey: false },
    maximum: 160,
    minimum: 80,
    reset: () => { resets += 1; },
    setSize: (size) => sizes.push(size),
  });
  key("ArrowRight");
  key("ArrowRight", "rtl");
  key("Home");
  key("End");
  key("Enter");
  assert.deepEqual(sizes, [128, 112, 80, 160]);
  assert.equal(resets, 1);
});

test("filters 100,000 rows without changing the input", () => {
  const largeRows = Array.from({ length: 100_000 }, (_, index) => ({
    id: String(index),
    name: `Record ${index}`,
    status: index % 2 === 0 ? "Ready" : "Running",
    duration: index,
  }));
  const result = filterDataGridRows(largeRows, columns, "record 9999", { status: "ready" });
  assert.equal(largeRows.length, 100_000);
  assert.ok(result.length > 0);
  assert.ok(result.every((row) => row.status === "Ready" && row.name.toLowerCase().includes("record 9999")));
});
