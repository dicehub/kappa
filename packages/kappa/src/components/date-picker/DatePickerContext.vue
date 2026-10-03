<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerContextSlots } from "./date-picker";

defineSlots<DatePickerContextSlots>();
</script>

<template>
  <ArkDatePicker.Context v-slot="context">
    <slot v-bind="context" />
  </ArkDatePicker.Context>
</template>
