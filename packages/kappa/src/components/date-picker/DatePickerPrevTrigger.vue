<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerPrevTriggerProps, DatePickerPrevTriggerSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerPrevTriggerProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerPrevTriggerSlots>();
</script>

<template>
  <ArkDatePicker.PrevTrigger
    v-bind="$attrs"
    class="kappa-date-picker__nav-trigger"
    data-slot="date-picker-prev-trigger"
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
        <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </slot>
  </ArkDatePicker.PrevTrigger>
</template>

<style src="./date-picker.css"></style>
