<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewLabelProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewLabelProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.Label v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__label" data-slot="tree-view-label"><slot /></ArkTreeView.Label></template>
