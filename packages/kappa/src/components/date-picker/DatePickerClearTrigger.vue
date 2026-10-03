<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerClearTriggerProps, DatePickerClearTriggerSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerClearTriggerProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerClearTriggerSlots>();
</script>

<template>
  <ArkDatePicker.ClearTrigger
    v-bind="$attrs"
    class="kappa-date-picker__clear-trigger"
    data-slot="date-picker-clear-trigger"
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
        <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </slot>
  </ArkDatePicker.ClearTrigger>
</template>

<style src="./date-picker.css"></style>
