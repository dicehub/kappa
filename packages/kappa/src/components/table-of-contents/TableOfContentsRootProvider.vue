<script setup lang="ts">
import { Toc as ArkToc } from "@ark-ui/vue/toc";
import type {
  TableOfContentsRootProviderProps,
  TableOfContentsRootProviderSlots,
} from "./table-of-contents";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableOfContentsRootProviderProps>(), {
  asChild: undefined,
});
defineSlots<TableOfContentsRootProviderSlots>();
</script>

<template>
  <ArkToc.RootProvider
    v-bind="$attrs"
    class="kappa-table-of-contents"
    data-kappa-component="TableOfContents.RootProvider"
    data-slot="table-of-contents"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkToc.RootProvider>
</template>

<style src="./table-of-contents.css"></style>
