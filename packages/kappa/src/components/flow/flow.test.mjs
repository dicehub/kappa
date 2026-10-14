import assert from "node:assert/strict";

import { test } from "node:test";
import { computeDiagramRect, computePositions } from "./flow.ts";

const node = (id) => ({ kind: "node", id });
const list = (children) => ({ kind: "list", children });
const parallel = (children, align) => ({ kind: "parallel", children, align });
const state = (tree, overrides = {}) => ({
  align: "start",
  orientation: "horizontal",
  nodes: {
    A: { width: 40, height: 20 },
    B1: { width: 50, height: 20 },
    B2: { width: 60, height: 20 },
    C1: { width: 70, height: 20 },
    C2: { width: 80, height: 20 },
    D: { width: 40, height: 20 },
  },
  tree,
  ...overrides,
});

test("lays out horizontal lists and parallel branches", () => {
  const flowState = state(
    list([node("A"), parallel([node("B1"), node("B2")]), node("D")]),
  );
  const positions = computePositions(flowState);

  assert.deepEqual(positions.A, { x: 0, y: 0 });
  assert.deepEqual(positions.B1, { x: 104, y: 0 });
  assert.deepEqual(positions.B2, { x: 104, y: 36 });
  assert.deepEqual(positions.D, { x: 228, y: 0 });
  assert.deepEqual(computeDiagramRect(positions, flowState), {
    width: 268,
    height: 56,
  });
});

test("lays out centered vertical lists and parallel branches", () => {
  const flowState = state(
    list([node("A"), parallel([node("B1"), node("B2")]), node("D")]),
    {
      align: "center",
      orientation: "vertical",
    },
  );
  const positions = computePositions(flowState);

  assert.deepEqual(positions.A, { x: 43, y: 0 });
  assert.deepEqual(positions.B1, { x: 0, y: 84 });
  assert.deepEqual(positions.B2, { x: 66, y: 84 });
  assert.deepEqual(positions.D, { x: 43, y: 168 });
  assert.deepEqual(computeDiagramRect(positions, flowState), {
    width: 126,
    height: 188,
  });
});
