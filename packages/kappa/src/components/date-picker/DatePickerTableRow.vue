<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerTableRowProps, DatePickerTableRowSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerTableRowProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerTableRowSlots>();
</script>

<template>
  <ArkDatePicker.TableRow
    v-bind="$attrs"
    class="kappa-date-picker__table-row"
    data-slot="date-picker-table-row"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.TableRow>
</template>
