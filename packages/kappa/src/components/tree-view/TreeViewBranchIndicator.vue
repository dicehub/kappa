<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewBranchIndicatorProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewBranchIndicatorProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.BranchIndicator v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__branch-indicator" data-slot="tree-view-branch-indicator"><slot><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg></slot></ArkTreeView.BranchIndicator></template>
