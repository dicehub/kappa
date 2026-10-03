<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewNodeCheckboxProps, TreeViewSlots } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewNodeCheckboxProps>();
defineSlots<TreeViewSlots>();
</script>

<template><ArkTreeView.NodeCheckbox v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__checkbox" data-slot="tree-view-checkbox"><slot /></ArkTreeView.NodeCheckbox></template>
