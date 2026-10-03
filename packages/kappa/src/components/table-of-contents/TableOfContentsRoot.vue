<script setup lang="ts">
import { Toc as ArkToc } from "@ark-ui/vue/toc";
import type {
  TableOfContentsEmits,
  TableOfContentsRootProps,
  TableOfContentsRootSlots,
} from "./table-of-contents";

defineOptions({ inheritAttrs: false });

const props = defineProps<TableOfContentsRootProps>();
const emit = defineEmits<TableOfContentsEmits>();
defineSlots<TableOfContentsRootSlots>();
</script>

<template>
  <ArkToc.Root
    v-bind="$attrs"
    class="kappa-table-of-contents"
    data-kappa-component="TableOfContents"
    data-slot="table-of-contents"
    :active-ids="props.activeIds"
    :as-child="props.asChild"
    :auto-scroll="props.autoScroll"
    :default-active-ids="props.defaultActiveIds"
    :dir="props.dir"
    :id="props.id"
    :ids="props.ids"
    :items="props.items"
    :root-margin="props.rootMargin"
    :scroll-behavior="props.scrollBehavior"
    :scroll-el="props.scrollEl"
    :threshold="props.threshold"
    @active-change="emit('activeChange', $event)"
  >
    <slot />
  </ArkToc.Root>
</template>

<style src="./table-of-contents.css"></style>
