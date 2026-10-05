import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { WORKSPACE_SWITCHER_DEFAULT_POSITIONING } from "./workspace-switcher.ts";

test("workspace menus fit the viewport and use fixed positioning by default", () => {
  assert.deepEqual(WORKSPACE_SWITCHER_DEFAULT_POSITIONING, {
    placement: "bottom-start", strategy: "fixed", gutter: 6, fitViewport: true, overflowPadding: 8,
  });
});

test("WorkspaceSwitcher has a public registry entry and block barrel", () => {
  const registry = JSON.parse(readFileSync(new URL("../../registry/component-registry.json", import.meta.url), "utf8"));
  assert.equal(registry.components.WorkspaceSwitcher.type, "block");
  assert.equal(registry.components.WorkspaceSwitcher.importPath, "@dicehub/kappa/blocks/workspace-switcher");
  const source = readFileSync(new URL("../index.ts", import.meta.url), "utf8");
  assert.match(source, /export \* from "\.\/workspace-switcher"/);
});
