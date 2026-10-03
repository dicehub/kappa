<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type { SliderValueTextProps, SliderValueTextSlots } from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderValueTextProps>(), {
  asChild: undefined,
});

defineSlots<SliderValueTextSlots>();
</script>

<template>
  <ArkSlider.ValueText
    v-if="$slots.default"
    v-bind="$attrs"
    class="kappa-slider__value-text"
    data-slot="slider-value-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSlider.ValueText>
  <ArkSlider.ValueText
    v-else
    v-bind="$attrs"
    class="kappa-slider__value-text"
    data-slot="slider-value-text"
    :as-child="props.asChild"
  />
</template>

<style src="./slider.css"></style>
