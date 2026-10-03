<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewSlots, TreeViewTreeProps } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewTreeProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.Tree v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__tree" data-slot="tree-view-tree"><slot /></ArkTreeView.Tree></template>
