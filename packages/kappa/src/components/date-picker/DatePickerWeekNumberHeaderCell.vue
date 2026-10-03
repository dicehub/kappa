<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerWeekNumberHeaderCellProps, DatePickerWeekNumberHeaderCellSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerWeekNumberHeaderCellProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerWeekNumberHeaderCellSlots>();
</script>

<template>
  <ArkDatePicker.WeekNumberHeaderCell
    v-bind="$attrs"
    class="kappa-date-picker__week-number-header-cell"
    data-slot="date-picker-week-number-header-cell"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.WeekNumberHeaderCell>
</template>
