<script setup lang="ts">
import { Splitter as ArkSplitter } from "@ark-ui/vue/splitter";
import type { ResizablePanelProps, ResizablePanelSlots } from "./resizable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ResizablePanelProps>(), {
  asChild: undefined,
});

defineSlots<ResizablePanelSlots>();
</script>

<template>
  <ArkSplitter.Panel
    v-bind="$attrs"
    class="kappa-resizable__panel"
    data-slot="resizable-panel"
    :as-child="props.asChild"
    :id="props.id"
  >
    <slot />
  </ArkSplitter.Panel>
</template>

<style src="./resizable.css"></style>
