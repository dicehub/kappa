import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (name) => readFileSync(new URL(name, import.meta.url), "utf8");
const rootSource = source("TreeView.vue");
const providerSource = source("TreeViewRootProvider.vue");
const typesSource = source("tree-view.ts");
const styles = source("tree-view.css");
const moduleBarrel = source("index.ts");

test("delegates tree behavior and state to Ark UI", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/tree-view"/);
  assert.match(rootSource, /<ArkTreeView\.Root/);
  assert.match(rootSource, /v-bind="\{ \.\.\.\$attrs, \.\.\.props \}"/);
  assert.match(rootSource, /data-slot="tree-view"/);

  for (const prop of ["asChild", "expandOnClick", "lazyMount", "typeahead", "unmountOnExit"]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }

  for (const event of [
    "beforeRename",
    "checkedChange",
    "expandedChange",
    "focusChange",
    "loadChildrenComplete",
    "loadChildrenError",
    "renameComplete",
    "renameStart",
    "selectionChange",
    "update:checkedValue",
    "update:expandedValue",
    "update:focusedValue",
    "update:selectedValue",
  ]) {
    assert.ok(rootSource.includes(`emit('${event}'`), `Missing ${event} forwarding`);
  }
});

test("keeps controlled root-provider and generic collection types", () => {
  assert.match(providerSource, /<ArkTreeView\.RootProvider/);
  assert.match(providerSource, /:value="props\.value"/);
  assert.match(typesSource, /TreeViewCollection<T extends TreeNode/);
  assert.match(typesSource, /TreeViewApi<T extends TreeNode/);
  assert.match(typesSource, /TreeViewRootProviderProps<T extends TreeNode/);
});

test("exports every compound part and Ark collection helper", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Label",
    "Tree",
    "NodeProvider",
    "Branch",
    "BranchControl",
    "BranchTrigger",
    "BranchIndicator",
    "BranchText",
    "BranchContent",
    "BranchIndentGuide",
    "Item",
    "ItemIndicator",
    "ItemText",
    "NodeCheckbox",
    "NodeCheckboxIndicator",
    "NodeRenameInput",
    "Context",
    "NodeContext",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: TreeView${part}`));
  }

  for (const helper of [
    "createFileTreeCollection",
    "createTreeCollection",
    "treeViewAnatomy",
    "useTreeView",
    "useTreeViewContext",
    "useTreeViewNodeContext",
  ]) {
    assert.match(moduleBarrel, new RegExp(helper));
  }
});

test("uses compact logical styling with complete interaction states", () => {
  assert.match(styles, /--kappa-tree-row-height: 1\.75rem/);
  assert.match(styles, /\.kappa-tree-view__branch-trigger/);
  assert.match(styles, /\.kappa-tree-view__row\[data-selected\]/);
  assert.match(styles, /\.kappa-tree-view__row\[data-focus\]/);
  assert.match(styles, /\.kappa-tree-view__row\[data-disabled\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /display: contents/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
