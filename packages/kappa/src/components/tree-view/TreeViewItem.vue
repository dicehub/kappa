<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewItemProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewItemProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.Item v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__row kappa-tree-view__item" data-slot="tree-view-item"><slot /></ArkTreeView.Item></template>
