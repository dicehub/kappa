<script setup lang="ts">
import { Toc as ArkToc } from "@ark-ui/vue/toc";
import type {
  TableOfContentsTitleProps,
  TableOfContentsTitleSlots,
} from "./table-of-contents";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableOfContentsTitleProps>(), {
  asChild: undefined,
});
defineSlots<TableOfContentsTitleSlots>();
</script>

<template>
  <ArkToc.Title
    v-bind="$attrs"
    class="kappa-table-of-contents__title"
    data-kappa-component="TableOfContents.Title"
    data-slot="table-of-contents-title"
    :as-child="props.asChild"
  >
    <slot />
  </ArkToc.Title>
</template>

<style src="./table-of-contents.css"></style>
