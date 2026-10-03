<script setup lang="ts">
import { TreeView as ArkTreeView } from "@ark-ui/vue/tree-view";
import type { TreeNode } from "@ark-ui/vue/tree-view";
import type { TreeViewEmits, TreeViewRootProps, TreeViewRootSlots } from "./tree-view";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TreeViewRootProps<TreeNode>>(), {
  asChild: undefined,
  expandOnClick: undefined,
  lazyMount: undefined,
  typeahead: undefined,
  unmountOnExit: undefined,
});
const emit = defineEmits<TreeViewEmits<TreeNode>>();
defineSlots<TreeViewRootSlots>();
</script>

<template>
  <ArkTreeView.Root
    v-bind="{ ...$attrs, ...props }"
    class="kappa-tree-view"
    data-slot="tree-view"
    @before-rename="emit('beforeRename', $event)"
    @checked-change="emit('checkedChange', $event)"
    @expanded-change="emit('expandedChange', $event)"
    @focus-change="emit('focusChange', $event)"
    @load-children-complete="emit('loadChildrenComplete', $event)"
    @load-children-error="emit('loadChildrenError', $event)"
    @rename-complete="emit('renameComplete', $event)"
    @rename-start="emit('renameStart', $event)"
    @selection-change="emit('selectionChange', $event)"
    @update:checked-value="emit('update:checkedValue', $event)"
    @update:expanded-value="emit('update:expandedValue', $event)"
    @update:focused-value="emit('update:focusedValue', $event)"
    @update:selected-value="emit('update:selectedValue', $event)"
  >
    <slot />
  </ArkTreeView.Root>
</template>

<style src="./tree-view.css"></style>
