<script setup lang="ts">
import { Splitter as ArkSplitter } from "@ark-ui/vue/splitter";
import type {
  ResizableResizeTriggerProps,
  ResizableResizeTriggerSlots,
} from "./resizable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ResizableResizeTriggerProps>(), {
  asChild: undefined,
  disabled: undefined,
});

defineSlots<ResizableResizeTriggerSlots>();
</script>

<template>
  <ArkSplitter.ResizeTrigger
    v-bind="$attrs"
    class="kappa-resizable__resize-trigger"
    data-slot="resizable-resize-trigger"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :id="props.id"
  >
    <slot />
  </ArkSplitter.ResizeTrigger>
</template>

<style src="./resizable.css"></style>
