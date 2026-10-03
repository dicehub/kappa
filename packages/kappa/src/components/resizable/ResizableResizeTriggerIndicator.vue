<script setup lang="ts">
import { Splitter as ArkSplitter } from "@ark-ui/vue/splitter";
import type {
  ResizableResizeTriggerIndicatorProps,
  ResizableResizeTriggerIndicatorSlots,
} from "./resizable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<ResizableResizeTriggerIndicatorProps>(),
  { asChild: undefined },
);

defineSlots<ResizableResizeTriggerIndicatorSlots>();
</script>

<template>
  <ArkSplitter.ResizeTriggerIndicator
    v-bind="$attrs"
    class="kappa-resizable__resize-trigger-indicator"
    data-slot="resizable-resize-trigger-indicator"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSplitter.ResizeTriggerIndicator>
</template>

<style src="./resizable.css"></style>
