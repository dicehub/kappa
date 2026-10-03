import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  computeDiagramRect,
  computeEdges,
  computePositions,
  createRoundedPath,
  createSplinePath,
  FLOW_DEFAULT_ALIGN,
  FLOW_DEFAULT_CONNECTOR,
  FLOW_DEFAULT_ORIENTATION,
  FLOW_DEFAULT_PADDING,
} from "./flow.ts";

const source = (name) =>
  readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const rootSource = source("Flow.vue");
const nodeSource = source("FlowNode.vue");
const anchorSource = source("FlowAnchor.vue");
const parallelSource = source("FlowParallel.vue");
const listSource = source("FlowList.vue");
const styles = source("flow.css");
const barrel = source("index.ts");

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

test("defines stable Flow defaults", () => {
  assert.equal(FLOW_DEFAULT_ALIGN, "start");
  assert.equal(FLOW_DEFAULT_CONNECTOR, "orthogonal");
  assert.equal(FLOW_DEFAULT_ORIENTATION, "horizontal");
  assert.deepEqual(FLOW_DEFAULT_PADDING, { x: 16, y: 64 });
});

test("creates rounded horizontal and vertical connector paths", () => {
  assert.equal(
    createRoundedPath(
      { x1: 0, y1: 0, x2: 56, y2: 71 },
      { orientation: "vertical", single: true },
    ),
    "M 0 0 L 0 31 Q 0 39 8 39 L 48 39 Q 56 39 56 47 L 56 63",
  );
  assert.equal(
    createRoundedPath({ x1: 0, y1: 10, x2: 72, y2: 10 }),
    "M 0 10 L 64 10",
  );
});

test("creates horizontal and vertical spline connector paths", () => {
  assert.equal(
    createSplinePath({ x1: 0, y1: 10, x2: 72, y2: 50 }),
    "M 0 10 C 32 10 32 50 64 50",
  );
  assert.equal(
    createSplinePath(
      { x1: 0, y1: 0, x2: 56, y2: 72 },
      { orientation: "vertical" },
    ),
    "M 0 0 C 0 32 56 32 56 64",
  );
});

test("computes edges through nested lists and adjacent parallel groups", () => {
  const flowState = state(
    list([
      node("A"),
      parallel([list([node("B1"), node("B2")]), node("C1")]),
      parallel([node("C2")]),
      node("D"),
    ]),
  );

  assert.deepEqual(computeEdges(flowState), [
    ["B1", "B2"],
    ["A", "B1"],
    ["A", "C1"],
    ["C2", "D"],
  ]);
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

test("renders an attribute-transparent measured and pannable root", () => {
  assert.match(rootSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(rootSource, /defineSlots<FlowRootSlots>/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="flow"/);
  assert.match(rootSource, /ResizeObserver/);
  assert.match(rootSource, /MutationObserver/);
  assert.match(rootSource, /"data-flow-disabled"/);
  assert.match(rootSource, /const scrollX = computed/);
  assert.match(rootSource, /const scrollY = computed/);
  assert.match(rootSource, /props\.onOverflowChange\?\./);
  assert.match(rootSource, /event\.preventDefault\(\)/);
  assert.match(rootSource, /@keydown="onKeydown"/);
  assert.match(rootSource, /const resolvedTabindex = computed/);
});

test("renders semantic and attribute-transparent compound parts", () => {
  for (const partSource of [
    nodeSource,
    anchorSource,
    parallelSource,
    listSource,
  ]) {
    assert.match(partSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
    assert.match(partSource, /v-bind="\$attrs"/);
    assert.match(partSource, /data-slot="flow-/);
  }
  assert.match(nodeSource, /<li/);
  assert.match(nodeSource, /:aria-disabled=/);
  assert.match(anchorSource, /props\.type \?\? "start end"/);
  assert.match(parallelSource, /data-flow-parallel-list/);
  assert.match(listSource, /data-flow-list/);
});

test("uses Kappa tokens and preserves accessibility preferences", () => {
  assert.match(styles, /\.kappa-flow/);
  assert.match(styles, /var\(--kappa-control,/);
  assert.match(styles, /var\(--kappa-line,/);
  assert.match(styles, /var\(--kappa-default,/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports named, compound, and public contract surfaces", () => {
  assert.match(barrel, /export const Flow = Object\.assign/);
  for (const name of [
    "Root: FlowRoot",
    "Node: FlowNode",
    "Anchor: FlowAnchor",
    "Parallel: FlowParallel",
    "List: FlowList",
    "FlowRootProps",
    "FlowNodeProps",
    "FlowAnchorProps",
    "FlowParallelProps",
    "FlowListProps",
    "FlowOrientation",
    "FlowConnectorType",
    "FlowOverflow",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
