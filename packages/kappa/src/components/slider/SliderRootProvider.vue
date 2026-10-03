<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import { computed } from "vue";
import {
  SLIDER_DEFAULT_SIZE,
  resolveSliderSize,
  type SliderRootProviderProps,
  type SliderRootProviderSlots,
} from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderRootProviderProps>(), {
  asChild: undefined,
  size: SLIDER_DEFAULT_SIZE,
});

defineSlots<SliderRootProviderSlots>();

const resolvedSize = computed(() => resolveSliderSize(props.size));
</script>

<template>
  <ArkSlider.RootProvider
    v-bind="$attrs"
    class="kappa-slider"
    data-slot="slider"
    :data-size="resolvedSize"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkSlider.RootProvider>
</template>

<style src="./slider.css"></style>
