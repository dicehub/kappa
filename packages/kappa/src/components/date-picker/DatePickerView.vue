<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerViewProps, DatePickerViewSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerViewProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerViewSlots>();
</script>

<template>
  <ArkDatePicker.View
    v-bind="$attrs"
    class="kappa-date-picker__view"
    data-slot="date-picker-view"
    :as-child="asChild"
    :view="view"
  >
    <slot />
  </ArkDatePicker.View>
</template>
