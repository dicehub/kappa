<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type { SliderControlProps, SliderControlSlots } from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderControlProps>(), {
  asChild: undefined,
});

defineSlots<SliderControlSlots>();
</script>

<template>
  <ArkSlider.Control
    v-bind="$attrs"
    class="kappa-slider__control"
    data-slot="slider-control"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSlider.Control>
</template>

<style src="./slider.css"></style>
