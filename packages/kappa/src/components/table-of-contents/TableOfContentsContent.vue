<script setup lang="ts">
import { Toc as ArkToc } from "@ark-ui/vue/toc";
import type {
  TableOfContentsContentProps,
  TableOfContentsContentSlots,
} from "./table-of-contents";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableOfContentsContentProps>(), {
  asChild: undefined,
});
defineSlots<TableOfContentsContentSlots>();
</script>

<template>
  <ArkToc.Content
    v-bind="$attrs"
    class="kappa-table-of-contents__content"
    data-kappa-component="TableOfContents.Content"
    data-slot="table-of-contents-content"
    :as-child="props.asChild"
  >
    <slot />
  </ArkToc.Content>
</template>

<style src="./table-of-contents.css"></style>
