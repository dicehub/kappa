<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewBranchProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewBranchProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.Branch v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__branch" data-slot="tree-view-branch"><slot /></ArkTreeView.Branch></template>
