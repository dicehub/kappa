<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerViewControlProps, DatePickerViewControlSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerViewControlProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerViewControlSlots>();
</script>

<template>
  <ArkDatePicker.ViewControl
    v-bind="$attrs"
    class="kappa-date-picker__view-control"
    data-slot="date-picker-view-control"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.ViewControl>
</template>
