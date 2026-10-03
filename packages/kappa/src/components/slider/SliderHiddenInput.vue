<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type { SliderHiddenInputProps, SliderHiddenInputSlots } from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderHiddenInputProps>(), {
  asChild: undefined,
});

defineSlots<SliderHiddenInputSlots>();
</script>

<template>
  <ArkSlider.HiddenInput
    v-bind="$attrs"
    class="kappa-slider__hidden-input"
    data-slot="slider-hidden-input"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSlider.HiddenInput>
</template>

<style src="./slider.css"></style>
