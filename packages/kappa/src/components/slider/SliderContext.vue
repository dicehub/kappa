<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import type { SliderContextSlots } from "./slider";

defineSlots<SliderContextSlots>();
</script>

<template>
  <ArkSlider.Context v-slot="context">
    <slot v-bind="context" />
  </ArkSlider.Context>
</template>
