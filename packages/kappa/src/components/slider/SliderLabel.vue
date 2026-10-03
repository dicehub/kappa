<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type { SliderLabelProps, SliderLabelSlots } from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderLabelProps>(), {
  asChild: undefined,
});

defineSlots<SliderLabelSlots>();
</script>

<template>
  <ArkSlider.Label
    v-bind="$attrs"
    class="kappa-slider__label"
    data-slot="slider-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSlider.Label>
</template>

<style src="./slider.css"></style>
