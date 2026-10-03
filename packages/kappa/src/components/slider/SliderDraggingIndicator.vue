<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type {
  SliderDraggingIndicatorProps,
  SliderDraggingIndicatorSlots,
} from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderDraggingIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<SliderDraggingIndicatorSlots>();
</script>

<template>
  <ArkSlider.DraggingIndicator
    v-if="$slots.default"
    v-bind="$attrs"
    class="kappa-slider__dragging-indicator"
    data-slot="slider-dragging-indicator"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSlider.DraggingIndicator>
  <ArkSlider.DraggingIndicator
    v-else
    v-bind="$attrs"
    class="kappa-slider__dragging-indicator"
    data-slot="slider-dragging-indicator"
    :as-child="props.asChild"
  />
</template>

<style src="./slider.css"></style>
