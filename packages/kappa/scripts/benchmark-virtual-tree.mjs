import { performance } from "node:perf_hooks";
import { VirtualTreeEngine } from "../src/components/virtual-tree/virtual-tree-engine.ts";

const options = {
  isNodeDisabled: (node) => Boolean(node.disabled),
  nodeToChildren: (node) => node.children,
  nodeToChildrenCount: (node) => node.childrenCount,
  nodeToString: (node) => node.label,
  nodeToValue: (node) => node.value,
};

const result = {};
const measure = (name, operation) => {
  const start = performance.now();
  const value = operation();
  result[name] = Number((performance.now() - start).toFixed(2));
  return value;
};

const flatNodes = Array.from({ length: 100_000 }, (_, index) => ({
  label: `Node ${index}`,
  value: `node-${index}`,
}));
const flatEngine = measure("flatIndexMs", () => new VirtualTreeEngine(flatNodes, options));
const flatVisible = measure("flatVisibleMs", () => flatEngine.getVisible(new Set()));
measure("flatLastLookupMs", () => flatEngine.get("node-99999"));
measure("flatWindowSliceMs", () => flatVisible.slice(50_000, 50_040));

const expandedValues = [];
const createLevel = (depth, prefix = "node") =>
  Array.from({ length: 10 }, (_, index) => {
    const value = `${prefix}-${index}`;
    const children = depth > 1 ? createLevel(depth - 1, value) : undefined;
    if (children) expandedValues.push(value);
    return { children, label: value, value };
  });

const balancedNodes = createLevel(5);
const balancedEngine = measure(
  "balancedIndexMs",
  () => new VirtualTreeEngine(balancedNodes, options),
);
const expanded = new Set(expandedValues);
const balancedVisible = measure(
  "balancedVisibleMs",
  () => balancedEngine.getVisible(expanded),
);
measure("balancedDeepLookupMs", () => balancedEngine.get("node-9-9-9-9-9"));
measure("balancedBranchExpandMs", () =>
  balancedEngine.getVisibleDescendants("node-0", expanded),
);
measure("balancedCollapsedMs", () => balancedEngine.getVisible(new Set()));
measure("balancedWindowSliceMs", () => balancedVisible.slice(50_000, 50_040));

process.stdout.write(`${JSON.stringify({
  nodeVersion: process.version,
  sourceNodes: { balanced: balancedEngine.size, flat: flatEngine.size },
  timingsMs: result,
}, null, 2)}\n`);
