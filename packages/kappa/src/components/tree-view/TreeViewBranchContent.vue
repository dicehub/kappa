<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewBranchContentProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewBranchContentProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.BranchContent v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__branch-content" data-slot="tree-view-branch-content"><slot /></ArkTreeView.BranchContent></template>
