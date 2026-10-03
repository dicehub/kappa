<script setup lang="ts">
import { Toc as ArkToc } from "@ark-ui/vue/toc";
import type {
  TableOfContentsLinkProps,
  TableOfContentsLinkSlots,
} from "./table-of-contents";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableOfContentsLinkProps>(), {
  asChild: undefined,
});
defineSlots<TableOfContentsLinkSlots>();
</script>

<template>
  <ArkToc.Link
    v-bind="$attrs"
    class="kappa-table-of-contents__link"
    data-kappa-component="TableOfContents.Link"
    data-slot="table-of-contents-link"
    :as-child="props.asChild"
  >
    <slot />
  </ArkToc.Link>
</template>

<style src="./table-of-contents.css"></style>
