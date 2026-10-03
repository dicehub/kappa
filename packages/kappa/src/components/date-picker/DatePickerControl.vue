<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerControlProps, DatePickerControlSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerControlProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerControlSlots>();
</script>

<template>
  <ArkDatePicker.Control
    v-bind="$attrs"
    class="kappa-date-picker__control"
    data-slot="date-picker-control"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.Control>
</template>
