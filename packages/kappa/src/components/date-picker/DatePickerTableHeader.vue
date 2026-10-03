<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import type { DatePickerTableHeaderProps, DatePickerTableHeaderSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerTableHeaderProps>(), {
  asChild: undefined,
});

defineSlots<DatePickerTableHeaderSlots>();
</script>

<template>
  <ArkDatePicker.TableHeader
    v-bind="$attrs"
    class="kappa-date-picker__table-header"
    data-slot="date-picker-table-header"
    :as-child="asChild"
  >
    <slot />
  </ArkDatePicker.TableHeader>
</template>
