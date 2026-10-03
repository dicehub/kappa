<script setup lang="ts">
import { RadioGroup as ArkRadioGroup } from "@ark-ui/vue/radio-group";
import type { RadioItemControlProps, RadioItemControlSlots } from "./radio";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RadioItemControlProps>(), {
  asChild: undefined,
});

defineSlots<RadioItemControlSlots>();
</script>

<template>
  <ArkRadioGroup.ItemControl
    v-bind="$attrs"
    class="kappa-radio__item-control"
    data-slot="radio-item-control"
    :as-child="props.asChild"
  >
    <slot><span class="kappa-radio__dot" aria-hidden="true" /></slot>
  </ArkRadioGroup.ItemControl>
</template>

<style src="./radio.css"></style>
