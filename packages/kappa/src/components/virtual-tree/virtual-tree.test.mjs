import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { VirtualTreeEngine } from "./virtual-tree-engine.ts";

const source = (name) => readFileSync(new URL(name, import.meta.url), "utf8");
const options = {
  isNodeDisabled: (node) => Boolean(node.disabled),
  nodeToChildren: (node) => node.children,
  nodeToChildrenCount: (node) => node.childrenCount,
  nodeToString: (node) => node.label,
  nodeToValue: (node) => node.value,
};

test("indexes nodes and resolves visible rows without recursive calls", () => {
  const items = [
    {
      value: "case",
      label: "Case",
      children: [
        { value: "geometry", label: "Geometry" },
        {
          value: "mesh",
          label: "Mesh",
          children: [{ value: "cells", label: "Cells" }],
        },
      ],
    },
  ];
  const engine = new VirtualTreeEngine(items, options);

  assert.equal(engine.size, 4);
  assert.deepEqual(engine.getVisible(new Set()).map((node) => node.value), ["case"]);
  assert.deepEqual(engine.getVisible(new Set(["case"])).map((node) => node.value), [
    "case",
    "geometry",
    "mesh",
  ]);
  assert.deepEqual(engine.getVisible(new Set(["case", "mesh"])).map((node) => node.value), [
    "case",
    "geometry",
    "mesh",
    "cells",
  ]);
  assert.deepEqual(engine.getAncestors("cells").map((node) => node.value), ["case", "mesh"]);
  assert.deepEqual(engine.getDescendantValues("case"), ["geometry", "mesh", "cells"]);
  assert.deepEqual(engine.get("mesh"), {
    children: ["cells"],
    depth: 2,
    disabled: false,
    hasChildren: true,
    label: "Mesh",
    node: items[0].children[1],
    parentValue: "case",
    position: 2,
    setSize: 2,
    value: "mesh",
  });
});

test("supports lazy insertion and rejects duplicate values", () => {
  const engine = new VirtualTreeEngine(
    [{ value: "root", label: "Root", childrenCount: 1 }],
    options,
  );
  engine.insertChildren("root", [{ value: "child", label: "Child" }]);
  assert.equal(engine.get("root").hasChildren, true);
  assert.deepEqual(engine.getVisible(new Set(["root"])).map((node) => node.value), [
    "root",
    "child",
  ]);
  assert.throws(
    () => new VirtualTreeEngine([{ value: "same" }, { value: "same" }], options),
    /must be unique/,
  );
});

test("keeps 100,000-node lookup indexed", () => {
  const items = Array.from({ length: 100_000 }, (_, index) => ({
    label: `Node ${index}`,
    value: `node-${index}`,
  }));
  const engine = new VirtualTreeEngine(items, options);
  assert.equal(engine.size, 100_000);
  assert.equal(engine.get("node-99999").label, "Node 99999");
  assert.equal(engine.getVisible(new Set()).length, 100_000);
});

test("renders a bounded window with complete virtual tree semantics", () => {
  const component = source("VirtualTree.vue");
  const windowing = source("use-virtual-tree-window.ts");
  const styles = source("virtual-tree.css");

  assert.match(windowing, /slice\(range\.start, range\.end\)/);
  assert.match(windowing, /pinnedIndex/);
  assert.match(windowing, /scrollTop\.value = \(event\.currentTarget/);
  assert.doesNotMatch(windowing, /requestAnimationFrame/);
  assert.match(component, /expandOnClick: true/);
  assert.match(component, /typeahead: true/);
  assert.match(component, /role="tree"/);
  assert.match(component, /role="treeitem"/);
  for (const attribute of ["aria-level", "aria-posinset", "aria-setsize", "aria-selected"]) {
    assert.match(component, new RegExp(attribute));
  }
  assert.match(component, /aria-activedescendant/);
  assert.match(windowing, /ResizeObserver/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
