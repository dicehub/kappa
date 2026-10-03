<script setup lang="ts">
import { Toc as ArkToc } from "@ark-ui/vue/toc";
import type {
  TableOfContentsNavProps,
  TableOfContentsNavSlots,
} from "./table-of-contents";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableOfContentsNavProps>(), {
  asChild: undefined,
  placement: undefined,
});
defineSlots<TableOfContentsNavSlots>();
</script>

<template>
  <ArkToc.Nav
    v-bind="$attrs"
    class="kappa-table-of-contents__nav"
    data-kappa-component="TableOfContents.Nav"
    data-slot="table-of-contents-nav"
    :as-child="props.asChild"
    :placement="props.placement"
  >
    <slot />
  </ArkToc.Nav>
</template>

<style src="./table-of-contents.css"></style>
