export const barrelCode = `import {
  TreeView,
  VirtualTree,
  createTreeCollection,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  TreeView,
  createTreeCollection,
} from "@dicehub/kappa/components/tree-view";
import { VirtualTree } from "@dicehub/kappa/components/virtual-tree";`;

export const standardCode = `<script setup lang="ts">
import { TreeView, createTreeCollection } from "@dicehub/kappa/components/tree-view";

const caseNode = {
  value: "case",
  label: "drivaerTest",
  children: [
    { value: "constant", label: "constant" },
    { value: "system", label: "system" },
  ],
};
const collection = createTreeCollection({
  rootNode: { value: "ROOT", label: "", children: [caseNode] },
});
</script>

<template>
  <TreeView.Root :collection="collection" :default-expanded-value="['case']">
    <TreeView.Label>Case files</TreeView.Label>
    <TreeView.Tree>
      <TreeView.NodeProvider :node="caseNode" :index-path="[0]">
        <TreeView.Branch>
          <TreeView.BranchControl>
            <TreeView.BranchTrigger>
              <TreeView.BranchIndicator />
            </TreeView.BranchTrigger>
            <TreeView.BranchText>{{ caseNode.label }}</TreeView.BranchText>
          </TreeView.BranchControl>
          <TreeView.BranchContent>
            <TreeView.NodeProvider
              v-for="(node, index) in caseNode.children"
              :key="node.value"
              :node="node"
              :index-path="[0, index]"
            >
              <TreeView.Item><TreeView.ItemText>{{ node.label }}</TreeView.ItemText></TreeView.Item>
            </TreeView.NodeProvider>
          </TreeView.BranchContent>
        </TreeView.Branch>
      </TreeView.NodeProvider>
    </TreeView.Tree>
  </TreeView.Root>
</template>`;

export const virtualCode = `<script setup lang="ts">
import { VirtualTree } from "@dicehub/kappa/components/virtual-tree";

const regions = Array.from({ length: 100 }, (_, region) => ({
  value: \`region-\${region}\`,
  label: \`Region \${region + 1}\`,
  children: Array.from({ length: 1_000 }, (_, cell) => ({
    value: \`region-\${region}-cell-\${cell}\`,
    label: \`Cell \${region * 1_000 + cell + 1}\`,
  })),
}));
</script>

<template>
  <VirtualTree
    :items="regions"
    aria-label="Mesh regions"
    :default-expanded-value="['region-0']"
    height="22rem"
  />
</template>`;

export const multipleCode = `<TreeView.Root
  v-model:selected-value="selectedValues"
  :collection="collection"
  selection-mode="multiple"
>
  <!-- Render branches and items with stable values and index paths. -->
</TreeView.Root>`;

export const customDataCode = `<script setup lang="ts">
import { VirtualTree } from "@dicehub/kappa/components/virtual-tree";

const entries = [{
  key: "boundaries",
  name: "Boundary groups",
  entries: [
    { key: "inlet", name: "inlet" },
    { key: "outlet", name: "outlet" },
  ],
}];
</script>

<template>
  <VirtualTree
    :items="entries"
    :node-to-value="(node) => node.key"
    :node-to-string="(node) => node.name"
    :node-to-children="(node) => node.entries"
    aria-label="Mesh boundaries"
  >
    <template #default="{ node }">
      <span>{{ node.name }}</span>
      <button data-kappa-tree-interactive>Inspect</button>
    </template>
  </VirtualTree>
</template>`;

export const lazyCode = `<script setup lang="ts">
import { VirtualTree } from "@dicehub/kappa/components/virtual-tree";

const items = [{
  value: "results",
  label: "Result snapshots",
  childrenCount: 3,
}];
const loadChildren = async ({ value }: { value: string }) => {
  const response = await fetch(\`/api/tree/\${value}\`);
  return response.json();
};
</script>

<template>
  <VirtualTree
    :items="items"
    :load-children="loadChildren"
    aria-label="Result snapshots"
  />
</template>`;

export const correspondence = [
  { reference: "Kumo", component: "None", role: "No corresponding component." },
  {
    reference: "Ark UI",
    component: "Tree View",
    role: "Behavior and accessibility base for TreeView.",
  },
  { reference: "shadcn", component: "None", role: "No official Tree View component." },
] as const;

export const treeViewProps = [
  { name: "collection", type: "TreeCollection<T>", defaultValue: "—", description: "Indexed Ark UI tree collection." },
  { name: "expandedValue", type: "string[]", defaultValue: "—", description: "Controlled expanded branch values." },
  { name: "selectedValue", type: "string[]", defaultValue: "—", description: "Controlled selected node values." },
  { name: "selectionMode", type: '"single" | "multiple"', defaultValue: '"single"', description: "Selection behavior." },
  { name: "loadChildren", type: "(details) => Promise<T[]>", defaultValue: "—", description: "Loads branch children before expansion." },
  { name: "typeahead", type: "boolean", defaultValue: "true", description: "Enables label typeahead." },
] as const;

export const virtualTreeProps = [
  { name: "ariaLabel", type: "string", defaultValue: '"Tree"', description: "Accessible tree name." },
  { name: "defaultExpandedValue", type: "string[]", defaultValue: "[]", description: "Initial uncontrolled expanded values." },
  { name: "defaultFocusedValue", type: "string", defaultValue: "—", description: "Initial uncontrolled focused value." },
  { name: "defaultSelectedValue", type: "string[]", defaultValue: "[]", description: "Initial uncontrolled selected values." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables tree interaction." },
  { name: "expandOnClick", type: "boolean", defaultValue: "true", description: "Expands or collapses a branch when its row is clicked." },
  { name: "expandedValue", type: "string[]", defaultValue: "—", description: "Controlled expanded branch values." },
  { name: "focusedValue", type: "string | null", defaultValue: "—", description: "Controlled focused value." },
  { name: "height", type: "CSS height", defaultValue: '"20rem"', description: "Scroll viewport height." },
  { name: "id", type: "string", defaultValue: "generated", description: "Stable root and row ID prefix." },
  { name: "indent", type: "number", defaultValue: "16", description: "Indent for each tree level in pixels." },
  { name: "isNodeDisabled", type: "(node) => boolean", defaultValue: "node.disabled", description: "Returns the disabled state." },
  { name: "items", type: "readonly T[]", defaultValue: "—", description: "Source tree nodes." },
  { name: "loadChildren", type: "(details) => Promise<T[]>", defaultValue: "—", description: "Loads one unloaded branch." },
  { name: "nodeToChildren", type: "(node) => T[]", defaultValue: "node.children", description: "Returns loaded child nodes." },
  { name: "nodeToChildrenCount", type: "(node) => number", defaultValue: "node.childrenCount", description: "Reports unloaded children." },
  { name: "nodeToString", type: "(node) => string", defaultValue: "node.label", description: "Returns the visible and typeahead label." },
  { name: "nodeToValue", type: "(node) => string", defaultValue: "node.value", description: "Returns the stable unique node value." },
  { name: "overscan", type: "number", defaultValue: "8", description: "Extra rows rendered around the viewport." },
  { name: "rowHeight", type: "number", defaultValue: "28", description: "Fixed row height in pixels." },
  { name: "selectedValue", type: "string[]", defaultValue: "—", description: "Controlled selected node values." },
  { name: "selectionMode", type: '"single" | "multiple"', defaultValue: '"single"', description: "Single or range-capable multiple selection." },
  { name: "typeahead", type: "boolean", defaultValue: "true", description: "Moves focus by typed label prefix." },
] as const;

export const virtualTreeMethods = [
  { name: "scrollToValue(value, align?)", description: "Expands loaded ancestors and scrolls the node. Controlled expansion must be applied by the parent." },
  { name: "focus(value)", description: "Scrolls to and focuses a node." },
  { name: "expand(value, recursive?)", description: "Expands one branch or all loaded descendants." },
  { name: "collapse(value, recursive?)", description: "Collapses one branch or all loaded descendants." },
  { name: "getNode(value)", description: "Returns the source node from the constant-time index." },
] as const;

export const events = [
  { name: "expandedChange", description: "Runs after a branch expansion request." },
  { name: "selectionChange", description: "Runs after node selection changes." },
  { name: "focusChange", description: "Runs after the focused value changes." },
  { name: "loadChildrenComplete", description: "Runs after lazy children enter the index." },
  { name: "loadChildrenError", description: "Runs when lazy loading fails." },
] as const;
