<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewBranchControlProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewBranchControlProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.BranchControl v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__row kappa-tree-view__branch-control" data-slot="tree-view-branch-control"><slot /></ArkTreeView.BranchControl></template>
