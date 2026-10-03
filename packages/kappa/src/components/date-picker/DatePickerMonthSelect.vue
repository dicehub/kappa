<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerMonthSelectProps, DatePickerMonthSelectSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerMonthSelectProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerMonthSelectSlots>();
</script>

<template>
  <ArkDatePicker.MonthSelect
    v-bind="$attrs"
    class="kappa-date-picker__select"
    data-slot="date-picker-month-select"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.MonthSelect>
</template>
