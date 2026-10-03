<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerPresetTriggerProps, DatePickerPresetTriggerSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerPresetTriggerProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerPresetTriggerSlots>();
</script>

<template>
  <ArkDatePicker.PresetTrigger
    v-bind="$attrs"
    class="kappa-date-picker__preset-trigger"
    data-slot="date-picker-preset-trigger"
    :as-child="asChild"
    :value="value"
  >
    <slot />
  </ArkDatePicker.PresetTrigger>
</template>
