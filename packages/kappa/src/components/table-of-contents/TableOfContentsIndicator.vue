<script setup lang="ts">
import { Toc as ArkToc } from "@ark-ui/vue/toc";
import type {
  TableOfContentsIndicatorProps,
  TableOfContentsIndicatorSlots,
} from "./table-of-contents";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableOfContentsIndicatorProps>(), {
  asChild: undefined,
});
defineSlots<TableOfContentsIndicatorSlots>();
</script>

<template>
  <ArkToc.Indicator
    v-bind="$attrs"
    class="kappa-table-of-contents__indicator"
    data-kappa-component="TableOfContents.Indicator"
    data-slot="table-of-contents-indicator"
    :as-child="props.asChild"
  >
    <slot />
  </ArkToc.Indicator>
</template>

<style src="./table-of-contents.css"></style>
