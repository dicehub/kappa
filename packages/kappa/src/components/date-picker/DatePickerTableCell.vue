<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerTableCellProps, DatePickerTableCellSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerTableCellProps>(), {
  asChild: undefined,
  disabled: undefined,
  visibleRange: undefined,
});

defineSlots<DatePickerTableCellSlots>();
</script>

<template>
  <ArkDatePicker.TableCell
    v-bind="$attrs"
    class="kappa-date-picker__table-cell"
    data-slot="date-picker-table-cell"
    :as-child="asChild"
    :disabled="disabled"
    :value="value"
    :visible-range="visibleRange"
  >
    <slot />
  </ArkDatePicker.TableCell>
</template>
