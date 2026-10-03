import assert from "node:assert/strict";
import { test } from "node:test";
import { selectionRectangle, intersectsSelection, mergeDragSelection, resolveDragSelectionColumns, filterDisabledSelection } from "./drag-selection.ts";

test("rectangle selection works in each drag direction", () => {
  assert.deepEqual(selectionRectangle({ x: 30, y: 40 }, { x: 10, y: 5 }), { x: 10, y: 5, width: 20, height: 35 });
  assert.deepEqual(selectionRectangle({ x: 10, y: 5 }, { x: 30, y: 40 }), { x: 10, y: 5, width: 20, height: 35 });
});

test("hit tests require overlap rather than a shared boundary", () => {
  const item = { x: 10, y: 10, width: 30, height: 20 };
  assert.ok(intersectsSelection(item, { x: 20, y: 15, width: 1, height: 1 }));
  assert.ok(!intersectsSelection(item, { x: 40, y: 10, width: 4, height: 4 }));
  assert.ok(!intersectsSelection(item, { x: 0, y: 0, width: 5, height: 5 }));
});

test("additive selection uses a stable initial set and removes earlier hits", () => {
  assert.deepEqual(mergeDragSelection(["a"], ["b", "c"], true), ["a", "b", "c"]);
  assert.deepEqual(mergeDragSelection(["a"], ["c"], true), ["a", "c"]);
  assert.deepEqual(mergeDragSelection(["a"], ["a", "b"], true), ["a", "b"]);
  assert.deepEqual(mergeDragSelection(["a"], [], false), []);
  assert.deepEqual(mergeDragSelection(["a"], ["b"], false), ["b"]);
});

test("column count keeps visual and keyboard grids valid", () => {
  assert.equal(resolveDragSelectionColumns(0), 1);
  assert.equal(resolveDragSelectionColumns(2.9), 2);
  assert.equal(resolveDragSelectionColumns(NaN), 3);
  assert.equal(resolveDragSelectionColumns(undefined), 3);
});

test("select-all does not newly select disabled items", () => {
  const items = [{ value: "a", label: "A" }, { value: "b", label: "B", disabled: true }];
  assert.deepEqual(filterDisabledSelection(["a", "b"], items, []), ["a"]);
  assert.deepEqual(filterDisabledSelection(["a", "b"], items, ["b"]), ["a", "b"]);
});
