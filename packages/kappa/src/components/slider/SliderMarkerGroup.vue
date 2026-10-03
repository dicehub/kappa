<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type { SliderMarkerGroupProps, SliderMarkerGroupSlots } from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderMarkerGroupProps>(), {
  asChild: undefined,
});

defineSlots<SliderMarkerGroupSlots>();
</script>

<template>
  <ArkSlider.MarkerGroup
    v-bind="$attrs"
    class="kappa-slider__marker-group"
    data-slot="slider-marker-group"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSlider.MarkerGroup>
</template>

<style src="./slider.css"></style>
