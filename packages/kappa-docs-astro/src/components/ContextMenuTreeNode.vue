<script setup lang="ts">
import { ContextMenu, type ContextMenuSelectionDetails } from "@dicehub/kappa/components/context-menu";
import { TreeView } from "@dicehub/kappa/components/tree-view";
import { Copy, Download, FolderOpen, Pencil, Trash2 } from "@lucide/vue";

export type ContextTreeNode = {
  children?: ContextTreeNode[];
  kind: "file" | "folder";
  label: string;
  meta?: string;
  value: string;
};

defineOptions({ name: "ContextMenuTreeNode" });

const props = defineProps<{ indexPath: number[]; node: ContextTreeNode }>();
const emit = defineEmits<{ action: [action: string, node: ContextTreeNode] }>();

const selectAction = (details: ContextMenuSelectionDetails) => {
  emit("action", details.value, props.node);
};
const forwardAction = (action: string, node: ContextTreeNode) => emit("action", action, node);
</script>

<template>
  <TreeView.NodeProvider :node="node" :index-path="indexPath">
    <ContextMenu.Root :aria-label="`${node.label} actions`" @select="selectAction">
      <TreeView.Branch v-if="node.children?.length">
        <ContextMenu.Trigger as-child>
          <TreeView.BranchControl>
            <TreeView.BranchTrigger><TreeView.BranchIndicator /></TreeView.BranchTrigger>
            <span class="context-menu-tree-node__icon" data-kind="folder" aria-hidden="true">
              <svg viewBox="0 0 16 16"><path d="M2.5 4.5h4l1.2 1.5h5.8v6.5h-11z" /></svg>
            </span>
            <TreeView.BranchText>{{ node.label }}</TreeView.BranchText>
            <span v-if="node.meta" class="context-menu-tree-node__meta">{{ node.meta }}</span>
          </TreeView.BranchControl>
        </ContextMenu.Trigger>
        <TreeView.BranchContent>
          <TreeView.BranchIndentGuide />
          <ContextMenuTreeNode
            v-for="(child, index) in node.children"
            :key="child.value"
            :index-path="[...indexPath, index]"
            :node="child"
            @action="forwardAction"
          />
        </TreeView.BranchContent>
      </TreeView.Branch>

      <ContextMenu.Trigger v-else as-child>
        <TreeView.Item>
          <span class="context-menu-tree-node__leaf-space" aria-hidden="true" />
          <span class="context-menu-tree-node__icon" data-kind="file" aria-hidden="true">
            <svg viewBox="0 0 16 16"><path d="M4 2.5h5l3 3v8H4zM9 2.5v3h3" /></svg>
          </span>
          <TreeView.ItemText>{{ node.label }}</TreeView.ItemText>
          <span v-if="node.meta" class="context-menu-tree-node__meta">{{ node.meta }}</span>
        </TreeView.Item>
      </ContextMenu.Trigger>

      <ContextMenu.Content data-context-menu-surface="tree-view" :data-context-tree-node="node.value">
        <ContextMenu.Group>
          <ContextMenu.Label>{{ node.label }}</ContextMenu.Label>
          <ContextMenu.Item value="open" :icon="FolderOpen">Open</ContextMenu.Item>
          <ContextMenu.Item value="rename" :icon="Pencil">Rename</ContextMenu.Item>
          <ContextMenu.Item value="copy-path" :icon="Copy">Copy path</ContextMenu.Item>
          <ContextMenu.Item v-if="node.kind === 'file'" value="download" :icon="Download">Download</ContextMenu.Item>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Item value="delete" variant="destructive" :icon="Trash2">Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  </TreeView.NodeProvider>
</template>

<style scoped>
.context-menu-tree-node__icon { display: inline-flex; inline-size: 1rem; block-size: 1rem; flex: none; color: var(--kappa-subtle, #6c7480); }
.context-menu-tree-node__icon svg { inline-size: 100%; block-size: 100%; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.35; }
.context-menu-tree-node__icon[data-kind="folder"] svg { fill: var(--kappa-tint-strong, #e8ebf0); }
.context-menu-tree-node__leaf-space { inline-size: 1rem; block-size: 1rem; flex: none; }
.context-menu-tree-node__meta { min-inline-size: 0; margin-inline-start: auto; overflow: hidden; color: var(--kappa-subtle, #6c7480); font-size: 0.6875rem; text-overflow: ellipsis; white-space: nowrap; }
</style>
