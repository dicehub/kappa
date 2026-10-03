<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerTableHeadProps, DatePickerTableHeadSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerTableHeadProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerTableHeadSlots>();
</script>

<template>
  <ArkDatePicker.TableHead
    v-bind="$attrs"
    class="kappa-date-picker__table-head"
    data-slot="date-picker-table-head"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.TableHead>
</template>
