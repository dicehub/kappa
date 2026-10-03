<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerWeekNumberCellProps, DatePickerWeekNumberCellSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerWeekNumberCellProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerWeekNumberCellSlots>();
</script>

<template>
  <ArkDatePicker.WeekNumberCell
    v-bind="$attrs"
    class="kappa-date-picker__week-number-cell"
    data-slot="date-picker-week-number-cell"
    :as-child="asChild"
    :week="week"
    :week-index="weekIndex"
  >
    <slot />
  </ArkDatePicker.WeekNumberCell>
</template>
