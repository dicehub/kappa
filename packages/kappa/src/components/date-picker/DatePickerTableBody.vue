<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerTableBodyProps, DatePickerTableBodySlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerTableBodyProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerTableBodySlots>();
</script>

<template>
  <ArkDatePicker.TableBody
    v-bind="$attrs"
    class="kappa-date-picker__table-body"
    data-slot="date-picker-table-body"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.TableBody>
</template>
