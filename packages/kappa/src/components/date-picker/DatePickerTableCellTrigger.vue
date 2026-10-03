<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerTableCellTriggerProps, DatePickerTableCellTriggerSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerTableCellTriggerProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerTableCellTriggerSlots>();
</script>

<template>
  <ArkDatePicker.TableCellTrigger
    v-bind="$attrs"
    class="kappa-date-picker__cell-trigger"
    data-slot="date-picker-cell-trigger"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.TableCellTrigger>
</template>
