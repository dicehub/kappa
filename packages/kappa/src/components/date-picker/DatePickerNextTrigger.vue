<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerNextTriggerProps, DatePickerNextTriggerSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerNextTriggerProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerNextTriggerSlots>();
</script>

<template>
  <ArkDatePicker.NextTrigger
    v-bind="$attrs"
    class="kappa-date-picker__nav-trigger"
    data-slot="date-picker-next-trigger"
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
        <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </slot>
  </ArkDatePicker.NextTrigger>
</template>

<style src="./date-picker.css"></style>
