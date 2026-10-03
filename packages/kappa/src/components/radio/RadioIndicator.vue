<script setup lang="ts">
import { RadioGroup as ArkRadioGroup } from "@ark-ui/vue/radio-group";
import type { RadioIndicatorProps, RadioIndicatorSlots } from "./radio";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RadioIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<RadioIndicatorSlots>();
</script>

<template>
  <ArkRadioGroup.Indicator
    v-bind="$attrs"
    class="kappa-radio__indicator"
    data-slot="radio-indicator"
    :as-child="props.asChild"
  >
    <slot />
  </ArkRadioGroup.Indicator>
</template>

<style src="./radio.css"></style>
