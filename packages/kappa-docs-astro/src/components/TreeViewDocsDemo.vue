<script setup lang="ts">
import { computed, onMounted, shallowRef } from "vue";
import {
  TreeView,
  createTreeCollection,
} from "@dicehub/kappa/components/tree-view";
import { VirtualTree } from "@dicehub/kappa/components/virtual-tree";
import TreeViewDocsNode from "./TreeViewDocsNode.vue";
import type { TreeDemoNode } from "./tree-view-demo";

type DemoVariant = "preview" | "multiple" | "virtual" | "lazy" | "custom-data";
const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });

const items: TreeDemoNode[] = [
  {
    value: "case",
    label: "drivaerTest",
    kind: "case",
    children: [
      {
        value: "constant",
        label: "constant",
        kind: "folder",
        children: [
          { value: "transport", label: "physicalProperties", kind: "file", meta: "1.8 KB" },
          { value: "mesh", label: "polyMesh", kind: "folder", meta: "6 items" },
        ],
      },
      {
        value: "system",
        label: "system",
        kind: "folder",
        children: [
          { value: "control", label: "controlDict", kind: "file", meta: "2.4 KB" },
          { value: "fv-schemes", label: "fvSchemes", kind: "file", meta: "1.2 KB" },
          { value: "fv-solution", label: "fvSolution", kind: "file", meta: "1.6 KB" },
        ],
      },
      { value: "log", label: "log.incompressibleFluid", kind: "result", meta: "Running" },
    ],
  },
];

const collection = createTreeCollection<TreeDemoNode>({
  nodeToString: (node) => node.label,
  nodeToValue: (node) => node.value,
  rootNode: { value: "ROOT", label: "", children: items },
});

const selectedValues = shallowRef<string[]>([]);
const virtualItems = shallowRef<TreeDemoNode[]>([]);
const createLargeTree = () =>
  Array.from({ length: 100 }, (_, group) => ({
    value: `region-${group}`,
    label: `Region ${String(group + 1).padStart(3, "0")}`,
    kind: "folder" as const,
    meta: "1,000 cells",
    children: Array.from({ length: 1_000 }, (_, cell) => ({
      value: `region-${group}-cell-${cell}`,
      label: `Cell ${String(group * 1_000 + cell + 1).padStart(6, "0")}`,
      kind: "result" as const,
      meta: `${(cell % 14) + 3} faces`,
    })),
  }));

onMounted(() => {
  if (props.variant === "virtual") virtualItems.value = createLargeTree();
});

const lazyItems: TreeDemoNode[] = [
  {
    childrenCount: 3,
    kind: "folder",
    label: "Result snapshots",
    meta: "Load on demand",
    value: "results",
  },
];
const loadLazyChildren = async () => {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 800));
  return ["0.10", "0.20", "0.30"].map((time) => ({
    kind: "result" as const,
    label: `time = ${time}`,
    meta: "Available",
    value: `result-${time}`,
  }));
};

type MeshEntry = {
  entries?: MeshEntry[];
  key: string;
  name: string;
  type: "boundary" | "group";
};
const meshEntries: MeshEntry[] = [
  {
    key: "boundaries",
    name: "Boundary groups",
    type: "group",
    entries: [
      { key: "inlet", name: "inlet", type: "boundary" },
      { key: "outlet", name: "outlet", type: "boundary" },
      { key: "walls", name: "walls", type: "boundary" },
    ],
  },
];

const activeCount = computed(() => selectedValues.value.length);
</script>

<template>
  <div class="tree-view-demo" :data-tree-view-demo="props.variant">
    <TreeView.Root
      v-if="props.variant === 'preview' || props.variant === 'multiple'"
      v-model:selected-value="selectedValues"
      :collection="collection"
      :default-expanded-value="['case', 'constant', 'system']"
      :selection-mode="props.variant === 'multiple' ? 'multiple' : 'single'"
    >
      <div class="tree-view-demo__header">
        <TreeView.Label>Case files</TreeView.Label>
        <output v-if="props.variant === 'multiple'" aria-live="polite">
          {{ activeCount }} selected
        </output>
      </div>
      <TreeView.Tree>
        <TreeViewDocsNode
          v-for="(node, index) in items"
          :key="node.value"
          :index-path="[index]"
          :node="node"
        />
      </TreeView.Tree>
    </TreeView.Root>

    <VirtualTree
      v-else-if="props.variant === 'virtual'"
      :items="virtualItems"
      aria-label="Mesh regions"
      :default-expanded-value="['region-0']"
      height="22rem"
      selection-mode="multiple"
    >
      <template #default="{ node }">
        <span class="tree-view-demo__node-icon" :data-kind="node.kind" aria-hidden="true">
          <svg v-if="node.kind === 'folder'" viewBox="0 0 16 16"><path d="M2.5 4.5h4l1.2 1.5h5.8v6.5h-11z" /></svg>
          <svg v-else viewBox="0 0 16 16"><circle cx="8" cy="8" r="3.25" /></svg>
        </span>
        <span class="tree-view-demo__virtual-label">{{ node.label }}</span>
        <span class="tree-view-demo__meta">{{ node.meta }}</span>
      </template>
    </VirtualTree>

    <VirtualTree
      v-else-if="props.variant === 'lazy'"
      :items="lazyItems"
      :load-children="loadLazyChildren"
      aria-label="Result snapshots"
      height="10rem"
    >
      <template #default="{ node }">
        <span class="tree-view-demo__node-icon" :data-kind="node.kind" aria-hidden="true">
          <svg v-if="node.kind === 'folder'" viewBox="0 0 16 16"><path d="M2.5 4.5h4l1.2 1.5h5.8v6.5h-11z" /></svg>
          <svg v-else viewBox="0 0 16 16"><circle cx="8" cy="8" r="3.25" /></svg>
        </span>
        <span class="tree-view-demo__virtual-label">{{ node.label }}</span>
        <span class="tree-view-demo__meta">{{ node.meta }}</span>
      </template>
    </VirtualTree>

    <VirtualTree
      v-else
      :items="meshEntries"
      :node-to-value="(node) => node.key"
      :node-to-string="(node) => node.name"
      :node-to-children="(node) => node.entries"
      aria-label="Mesh boundaries"
      :default-expanded-value="['boundaries']"
      height="10rem"
    >
      <template #default="{ node }">
        <span class="tree-view-demo__status" :data-type="node.type" aria-hidden="true" />
        <span class="tree-view-demo__virtual-label">{{ node.name }}</span>
        <button
          v-if="node.type === 'boundary'"
          type="button"
          class="tree-view-demo__action"
          data-kappa-tree-interactive
          :aria-label="`Inspect ${node.name}`"
        >
          Inspect
        </button>
      </template>
    </VirtualTree>
  </div>
</template>

<style src="./TreeViewDocsDemo.css"></style>
