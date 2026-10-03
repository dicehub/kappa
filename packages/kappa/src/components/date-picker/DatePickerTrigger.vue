<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerTriggerProps, DatePickerTriggerSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerTriggerProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerTriggerSlots>();
</script>

<template>
  <ArkDatePicker.Trigger
    v-bind="$attrs"
    class="kappa-date-picker__trigger"
    data-slot="date-picker-trigger"
    :as-child="asChild"
  >
    <slot>
      <svg
        class="kappa-date-picker__icon"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5" />
        <path d="M2 6.5h12" stroke="currentColor" stroke-width="1.5" />
        <path d="M5.25 1.5v2.5M10.75 1.5v2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </slot>
  </ArkDatePicker.Trigger>
</template>

<style src="./date-picker.css"></style>
