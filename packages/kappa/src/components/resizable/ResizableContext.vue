<script setup lang="ts">
import { Splitter as ArkSplitter } from "@ark-ui/vue/splitter";
import type { ResizableContextSlots } from "./resizable";

defineSlots<ResizableContextSlots>();
</script>

<template>
  <ArkSplitter.Context v-slot="context">
    <slot v-bind="context" />
  </ArkSplitter.Context>
</template>
