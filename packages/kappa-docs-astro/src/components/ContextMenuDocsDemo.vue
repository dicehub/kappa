<script setup lang="ts">
import { ContextMenu, type ContextMenuSelectionDetails } from "@dicehub/kappa/components/context-menu";
import { TreeView, createTreeCollection } from "@dicehub/kappa/components/tree-view";
import { Copy, Download, Eye, FileText, Folder, FolderOpen, Move, Pencil, Settings, Trash2 } from "@lucide/vue";
import { ref } from "vue";
import ContextMenuTreeNode, { type ContextTreeNode } from "./ContextMenuTreeNode.vue";

type DemoVariant = "preview" | "resource-list" | "submenu" | "tree-view" | "options";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });
const lastAction = ref("No action selected");
const showHidden = ref(false);
const density = ref("compact");
const resources = [
  { id: "geometry", name: "geometry.stl", kind: "Surface mesh", size: "14.8 MB" },
  { id: "case", name: "motorBike", kind: "OpenFOAM case", size: "2.3 GB" },
  { id: "report", name: "forces.csv", kind: "Result table", size: "640 KB" },
] as const;
const treeItems: ContextTreeNode[] = [
  {
    value: "case",
    label: "motorBike",
    kind: "folder",
    meta: "case",
    children: [
      {
        value: "system",
        label: "system",
        kind: "folder",
        meta: "3 files",
        children: [
          { value: "control-dict", label: "controlDict", kind: "file", meta: "2.4 KB" },
          { value: "fv-schemes", label: "fvSchemes", kind: "file", meta: "1.2 KB" },
          { value: "fv-solution", label: "fvSolution", kind: "file", meta: "1.6 KB" },
        ],
      },
      { value: "log", label: "log.incompressibleFluid", kind: "file", meta: "18.7 MB" },
    ],
  },
];
const treeCollection = createTreeCollection<ContextTreeNode>({
  nodeToString: (node) => node.label,
  nodeToValue: (node) => node.value,
  rootNode: { value: "ROOT", label: "", kind: "folder", children: treeItems },
});

const setAction = (details: ContextMenuSelectionDetails, target = "Run 4189") => {
  lastAction.value = `${details.value}: ${target}`;
};
const setTreeAction = (action: string, node: ContextTreeNode) => {
  lastAction.value = `${action}: ${node.label}`;
};
</script>

<template>
  <div class="context-menu-demo" :data-context-menu-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="context-menu-demo__stack">
      <ContextMenu.Root aria-label="Run actions" @select="setAction($event)">
        <ContextMenu.Trigger class="context-menu-demo__run">
          <span class="context-menu-demo__run-icon"><FileText aria-hidden="true" /></span>
          <span class="context-menu-demo__run-copy">
            <strong>Run 4189</strong>
            <span>Completed · 8 minutes ago</span>
          </span>
          <span class="context-menu-demo__hint">Right-click</span>
        </ContextMenu.Trigger>
        <ContextMenu.Content data-context-menu-surface="preview">
          <ContextMenu.Group>
            <ContextMenu.Label>Run 4189</ContextMenu.Label>
            <ContextMenu.Item value="open" :icon="FolderOpen">Open results</ContextMenu.Item>
            <ContextMenu.Item value="copy" :icon="Copy">
              Copy run ID
              <template #end><ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut></template>
            </ContextMenu.Item>
            <ContextMenu.Item value="download" :icon="Download">Download archive</ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Item value="delete" variant="destructive" :icon="Trash2">Delete run</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <output aria-live="polite">{{ lastAction }}</output>
    </div>

    <div v-else-if="props.variant === 'resource-list'" class="context-menu-demo__resources">
      <ContextMenu.Root
        v-for="resource in resources"
        :key="resource.id"
        :aria-label="`${resource.name} actions`"
        @select="setAction($event, resource.name)"
      >
        <ContextMenu.Trigger as-child>
          <button type="button" class="context-menu-demo__resource">
            <Folder aria-hidden="true" />
            <span><strong>{{ resource.name }}</strong><small>{{ resource.kind }}</small></span>
            <small>{{ resource.size }}</small>
          </button>
        </ContextMenu.Trigger>
        <ContextMenu.Content :data-context-menu-resource="resource.id" data-context-menu-surface="resource-list">
          <ContextMenu.Item value="open" :icon="FolderOpen">Open</ContextMenu.Item>
          <ContextMenu.Item value="rename" :icon="Pencil">Rename</ContextMenu.Item>
          <ContextMenu.Item value="copy-path" :icon="Copy">Copy path</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item value="delete" variant="destructive" :icon="Trash2">Delete</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <output aria-live="polite">{{ lastAction }}</output>
    </div>

    <div v-else-if="props.variant === 'submenu'" class="context-menu-demo__stack">
      <ContextMenu.Root aria-label="Mesh file actions" @select="setAction($event, 'mesh.foam')">
        <ContextMenu.Trigger class="context-menu-demo__file">
          <FileText aria-hidden="true" /><span><strong>mesh.foam</strong><small>OpenFOAM mesh</small></span>
        </ContextMenu.Trigger>
        <ContextMenu.Content data-context-menu-surface="submenu">
          <ContextMenu.Item value="open" :icon="FolderOpen">Open</ContextMenu.Item>
          <ContextMenu.Item value="inspect" :icon="Eye">Inspect</ContextMenu.Item>
          <ContextMenu.Sub aria-label="Move destination">
            <ContextMenu.SubTrigger :icon="Move">Move to</ContextMenu.SubTrigger>
            <ContextMenu.SubContent data-context-menu-surface="submenu-child">
              <ContextMenu.Item value="geometry">Geometry</ContextMenu.Item>
              <ContextMenu.Item value="results">Results</ContextMenu.Item>
              <ContextMenu.Item value="archive">Archive</ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <output aria-live="polite">{{ lastAction }}</output>
    </div>

    <div v-else-if="props.variant === 'tree-view'" class="context-menu-demo__stack">
      <TreeView.Root :collection="treeCollection" :default-expanded-value="['case', 'system']">
        <TreeView.Label>Case files</TreeView.Label>
        <TreeView.Tree>
          <ContextMenuTreeNode
            v-for="(node, index) in treeItems"
            :key="node.value"
            :index-path="[index]"
            :node="node"
            @action="setTreeAction"
          />
        </TreeView.Tree>
      </TreeView.Root>
      <output aria-live="polite">{{ lastAction }}</output>
    </div>

    <div v-else class="context-menu-demo__stack">
      <ContextMenu.Root aria-label="Tree view options">
        <ContextMenu.Trigger class="context-menu-demo__tree">
          <Settings aria-hidden="true" /><span><strong>Project files</strong><small>Right-click for view options</small></span>
        </ContextMenu.Trigger>
        <ContextMenu.Content data-context-menu-surface="options">
          <ContextMenu.Group>
            <ContextMenu.Label>View</ContextMenu.Label>
            <ContextMenu.CheckboxItem v-model:checked="showHidden" value="hidden">Show hidden files</ContextMenu.CheckboxItem>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.RadioGroup v-model="density">
            <ContextMenu.Label>Density</ContextMenu.Label>
            <ContextMenu.RadioItem value="compact">Compact</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="comfortable">Comfortable</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <output aria-live="polite">Hidden {{ showHidden ? "shown" : "hidden" }} · {{ density }}</output>
    </div>
  </div>
</template>

<style scoped src="./context-menu-docs-demo.css"></style>
