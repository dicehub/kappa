<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerRootProviderProps, DatePickerRootProviderSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerRootProviderSlots>();
</script>

<template>
  <ArkDatePicker.RootProvider
    v-bind="$attrs"
    class="kappa-date-picker"
    data-slot="date-picker"
    :as-child="asChild"
    :value="value"
  >
    <slot />
  </ArkDatePicker.RootProvider>
</template>

<style src="./date-picker.css"></style>
