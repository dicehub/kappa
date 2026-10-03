<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerYearSelectProps, DatePickerYearSelectSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerYearSelectProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerYearSelectSlots>();
</script>

<template>
  <ArkDatePicker.YearSelect
    v-bind="$attrs"
    class="kappa-date-picker__select"
    data-slot="date-picker-year-select"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.YearSelect>
</template>
