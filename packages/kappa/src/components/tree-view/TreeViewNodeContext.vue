<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeNode } from "@ark-ui/vue/tree-view";
import type { TreeViewNodeContextSlots } from "./tree-view";
defineSlots<TreeViewNodeContextSlots<TreeNode>>();
</script>

<template><ArkTreeView.NodeContext v-slot="context"><slot v-bind="context" /></ArkTreeView.NodeContext></template>
