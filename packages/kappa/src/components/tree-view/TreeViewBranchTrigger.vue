<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewBranchTriggerProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewBranchTriggerProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.BranchTrigger v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__branch-trigger" data-slot="tree-view-branch-trigger"><slot /></ArkTreeView.BranchTrigger></template>
