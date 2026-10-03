<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type { SliderMarkerProps, SliderMarkerSlots } from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderMarkerProps>(), {
  asChild: undefined,
});

defineSlots<SliderMarkerSlots>();
</script>

<template>
  <ArkSlider.Marker
    v-bind="$attrs"
    class="kappa-slider__marker"
    data-slot="slider-marker"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkSlider.Marker>
</template>

<style src="./slider.css"></style>
