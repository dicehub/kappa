<script setup lang="ts">
import { Toc as ArkToc } from "@ark-ui/vue/toc";
import type {
  TableOfContentsItemProps,
  TableOfContentsItemSlots,
} from "./table-of-contents";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableOfContentsItemProps>(), {
  asChild: undefined,
});
defineSlots<TableOfContentsItemSlots>();
</script>

<template>
  <ArkToc.Item
    v-bind="$attrs"
    class="kappa-table-of-contents__item"
    data-kappa-component="TableOfContents.Item"
    data-slot="table-of-contents-item"
    :as-child="props.asChild"
    :item="props.item"
  >
    <slot />
  </ArkToc.Item>
</template>

<style src="./table-of-contents.css"></style>
