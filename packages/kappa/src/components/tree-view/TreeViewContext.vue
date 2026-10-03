<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeNode } from "@ark-ui/vue/tree-view";
import type { TreeViewContextSlots } from "./tree-view";
defineSlots<TreeViewContextSlots<TreeNode>>();
</script>

<template><ArkTreeView.Context v-slot="context"><slot v-bind="context" /></ArkTreeView.Context></template>
