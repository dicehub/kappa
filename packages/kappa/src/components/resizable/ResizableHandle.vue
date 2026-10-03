<script setup lang="ts">
import { Splitter as ArkSplitter } from "@ark-ui/vue/splitter";
import { useSlots } from "vue";
import ResizableResizeTriggerIndicator from "./ResizableResizeTriggerIndicator.vue";
import type { ResizableHandleProps, ResizableHandleSlots } from "./resizable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ResizableHandleProps>(), {
  asChild: undefined,
  disabled: undefined,
});

defineSlots<ResizableHandleSlots>();
const slots = useSlots();
</script>

<template>
  <ArkSplitter.ResizeTrigger
    v-bind="$attrs"
    class="kappa-resizable__handle"
    data-slot="resizable-handle"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :id="props.id"
  >
    <slot v-if="slots.default" />
    <ResizableResizeTriggerIndicator v-else-if="!props.asChild" />
  </ArkSplitter.ResizeTrigger>
</template>

<style src="./resizable.css"></style>
