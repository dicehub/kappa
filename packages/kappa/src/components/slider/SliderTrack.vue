<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type { SliderTrackProps, SliderTrackSlots } from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderTrackProps>(), {
  asChild: undefined,
});

defineSlots<SliderTrackSlots>();
</script>

<template>
  <ArkSlider.Track
    v-bind="$attrs"
    class="kappa-slider__track"
    data-slot="slider-track"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSlider.Track>
</template>

<style src="./slider.css"></style>
