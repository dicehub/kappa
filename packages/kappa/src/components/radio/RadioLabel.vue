<script setup lang="ts">
import { RadioGroup as ArkRadioGroup } from "@ark-ui/vue/radio-group";
import type { RadioLabelProps, RadioLabelSlots } from "./radio";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RadioLabelProps>(), {
  asChild: undefined,
});

defineSlots<RadioLabelSlots>();
</script>

<template>
  <ArkRadioGroup.Label
    v-bind="$attrs"
    class="kappa-radio__label"
    data-slot="radio-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkRadioGroup.Label>
</template>

<style src="./radio.css"></style>
