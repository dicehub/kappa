<script setup lang="ts">
import { Toc as ArkToc } from "@ark-ui/vue/toc";
import type { TableOfContentsContextSlots } from "./table-of-contents";

defineSlots<TableOfContentsContextSlots>();
</script>

<template>
  <ArkToc.Context v-slot="context">
    <slot v-bind="context" />
  </ArkToc.Context>
</template>
