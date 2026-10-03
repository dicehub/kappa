<script setup lang="ts">
import { Toc as ArkToc } from "@ark-ui/vue/toc";
import type {
  TableOfContentsListProps,
  TableOfContentsListSlots,
} from "./table-of-contents";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableOfContentsListProps>(), {
  asChild: undefined,
});
defineSlots<TableOfContentsListSlots>();
</script>

<template>
  <ArkToc.List
    v-bind="$attrs"
    class="kappa-table-of-contents__list"
    data-kappa-component="TableOfContents.List"
    data-slot="table-of-contents-list"
    :as-child="props.asChild"
  >
    <slot />
  </ArkToc.List>
</template>

<style src="./table-of-contents.css"></style>
