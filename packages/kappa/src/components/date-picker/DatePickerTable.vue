<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerTableProps, DatePickerTableSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerTableProps>(), {
  asChild: undefined,
  columns: undefined,
  view: undefined,
});

defineSlots<DatePickerTableSlots>();
</script>

<template>
  <ArkDatePicker.Table
    v-bind="$attrs"
    class="kappa-date-picker__table"
    data-slot="date-picker-table"
    :as-child="asChild"
    :columns="columns"
    :view="view"
  >
    <slot />
  </ArkDatePicker.Table>
</template>
