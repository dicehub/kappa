<script setup lang="ts">
import { TreeView } from "@dicehub/kappa/components/tree-view";
import type { TreeDemoNode } from "./tree-view-demo";

defineOptions({ name: "TreeViewDocsNode" });

defineProps<{
  indexPath: number[];
  node: TreeDemoNode;
}>();
</script>

<template>
  <TreeView.NodeProvider :node="node" :index-path="indexPath">
    <TreeView.Branch v-if="node.children?.length">
      <TreeView.BranchControl>
        <TreeView.BranchTrigger>
          <TreeView.BranchIndicator />
        </TreeView.BranchTrigger>
        <span class="tree-view-demo__node-icon" :data-kind="node.kind" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M2.5 4.5h4l1.2 1.5h5.8v6.5h-11z" /></svg>
        </span>
        <TreeView.BranchText>{{ node.label }}</TreeView.BranchText>
        <span v-if="node.meta" class="tree-view-demo__meta">{{ node.meta }}</span>
      </TreeView.BranchControl>
      <TreeView.BranchContent>
        <TreeView.BranchIndentGuide />
        <TreeViewDocsNode
          v-for="(child, index) in node.children"
          :key="child.value"
          :index-path="[...indexPath, index]"
          :node="child"
        />
      </TreeView.BranchContent>
    </TreeView.Branch>

    <TreeView.Item v-else>
      <span class="tree-view-demo__leaf-space" aria-hidden="true" />
      <span class="tree-view-demo__node-icon" :data-kind="node.kind" aria-hidden="true">
        <svg viewBox="0 0 16 16"><path d="M4 2.5h5l3 3v8H4zM9 2.5v3h3" /></svg>
      </span>
      <TreeView.ItemText>{{ node.label }}</TreeView.ItemText>
      <span v-if="node.meta" class="tree-view-demo__meta">{{ node.meta }}</span>
    </TreeView.Item>
  </TreeView.NodeProvider>
</template>
