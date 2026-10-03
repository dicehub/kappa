<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewBranchTextProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewBranchTextProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.BranchText v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__text" data-slot="tree-view-branch-text"><slot /></ArkTreeView.BranchText></template>
