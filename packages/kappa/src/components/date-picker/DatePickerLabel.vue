<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerLabelProps, DatePickerLabelSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerLabelProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerLabelSlots>();
</script>

<template>
  <ArkDatePicker.Label
    v-bind="$attrs"
    class="kappa-date-picker__label"
    data-slot="date-picker-label"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.Label>
</template>
