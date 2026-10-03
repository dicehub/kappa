<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewNodeCheckboxIndicatorProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewNodeCheckboxIndicatorProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.NodeCheckboxIndicator v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__checkbox-indicator" data-slot="tree-view-checkbox-indicator"><slot /></ArkTreeView.NodeCheckboxIndicator></template>
