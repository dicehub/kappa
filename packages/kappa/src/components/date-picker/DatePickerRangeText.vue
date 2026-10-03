<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerRangeTextProps, DatePickerRangeTextSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerRangeTextProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerRangeTextSlots>();
</script>

<template>
  <ArkDatePicker.RangeText
    v-bind="$attrs"
    class="kappa-date-picker__range-text"
    data-slot="date-picker-range-text"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.RangeText>
</template>
