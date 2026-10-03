<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewBranchIndentGuideProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewBranchIndentGuideProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.BranchIndentGuide v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__indent-guide" data-slot="tree-view-indent-guide"><slot /></ArkTreeView.BranchIndentGuide></template>
