<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewItemTextProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewItemTextProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.ItemText v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__text" data-slot="tree-view-item-text"><slot /></ArkTreeView.ItemText></template>
