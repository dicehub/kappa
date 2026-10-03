<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerValueTextProps, DatePickerValueTextSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerValueTextProps>(), {
  asChild: undefined,
  placeholder: undefined,
});

defineSlots<DatePickerValueTextSlots>();
</script>

<template>
  <ArkDatePicker.ValueText
    v-bind="$attrs"
    class="kappa-date-picker__value-text"
    data-slot="date-picker-value-text"
    :as-child="asChild"
    :placeholder="placeholder"
  >
    <template #default="props">
      <slot v-bind="props" />
    </template>
  </ArkDatePicker.ValueText>
</template>
