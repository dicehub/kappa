<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type { SliderRangeProps, SliderRangeSlots } from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderRangeProps>(), {
  asChild: undefined,
});

defineSlots<SliderRangeSlots>();
</script>

<template>
  <ArkSlider.Range
    v-bind="$attrs"
    class="kappa-slider__range"
    data-slot="slider-range"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSlider.Range>
</template>

<style src="./slider.css"></style>
