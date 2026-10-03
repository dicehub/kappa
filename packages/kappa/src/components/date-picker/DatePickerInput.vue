<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerInputProps, DatePickerInputSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerInputProps>(), {
  asChild: undefined,
  index: undefined,
});

defineSlots<DatePickerInputSlots>();
</script>

<template>
  <ArkDatePicker.Input
    v-bind="$attrs"
    class="kappa-date-picker__input"
    data-slot="date-picker-input"
    :as-child="asChild"
    :index="index"
  >
    <slot />
  </ArkDatePicker.Input>
</template>
