<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeViewNodeRenameInputProps } from "./tree-view";
defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewNodeRenameInputProps>();
</script>

<template><ArkTreeView.NodeRenameInput v-bind="{ ...$attrs, ...props }" class="kappa-tree-view__rename-input" data-slot="tree-view-rename-input" /></template>
