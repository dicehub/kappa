<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeNode } from "@ark-ui/vue/tree-view";
import type {
  TreeViewRootProviderProps,
  TreeViewRootProviderSlots,
} from "./tree-view";

defineOptions({ inheritAttrs: false });
const props = defineProps<TreeViewRootProviderProps<TreeNode>>();
defineSlots<TreeViewRootProviderSlots>();
</script>

<template>
  <ArkTreeView.RootProvider
    v-bind="$attrs"
    class="kappa-tree-view"
    data-slot="tree-view"
    :value="props.value"
  >
    <slot />
  </ArkTreeView.RootProvider>
</template>

<style src="./tree-view.css"></style>
