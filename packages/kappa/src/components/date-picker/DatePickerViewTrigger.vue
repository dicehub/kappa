<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerViewTriggerProps, DatePickerViewTriggerSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerViewTriggerProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerViewTriggerSlots>();
</script>

<template>
  <ArkDatePicker.ViewTrigger
    v-bind="$attrs"
    class="kappa-date-picker__view-trigger"
    data-slot="date-picker-view-trigger"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.ViewTrigger>
</template>
