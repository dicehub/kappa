<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewItemIndicatorProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewItemIndicatorProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.ItemIndicator v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__item-indicator" data-slot="tree-view-item-indicator"><slot /></ArkTreeView.ItemIndicator></template>
