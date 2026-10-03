<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeNode } from "@ark-ui/vue/tree-view";
import type { TreeViewNodeProviderProps, TreeViewSlots } from "./tree-view";
const props = defineProps<TreeViewNodeProviderProps<TreeNode>>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.NodeProvider v-bind="props"><slot /></ArkTreeView.NodeProvider></template>
