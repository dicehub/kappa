<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type { SliderThumbProps, SliderThumbSlots } from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderThumbProps>(), {
  asChild: undefined,
  index: undefined,
  name: undefined,
});

defineSlots<SliderThumbSlots>();
</script>

<template>
  <ArkSlider.Thumb
    v-bind="$attrs"
    class="kappa-slider__thumb"
    data-slot="slider-thumb"
    :as-child="props.asChild"
    :index="props.index"
    :name="props.name"
  >
    <slot />
  </ArkSlider.Thumb>
</template>

<style src="./slider.css"></style>
