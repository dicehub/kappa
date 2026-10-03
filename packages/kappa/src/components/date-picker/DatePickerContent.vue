<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import { onMounted, ref, Teleport } from "vue";
import type { DatePickerContentProps, DatePickerContentSlots } from "./date-picker";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<DatePickerContentProps>(), {
  asChild: undefined,
  teleport: true,
  teleportTo: "body",
});

defineSlots<DatePickerContentSlots>();

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport :disabled="!teleport || !isMounted" :to="teleportTo">
    <ArkDatePicker.Positioner class="kappa-date-picker__positioner">
      <ArkDatePicker.Content
        v-bind="$attrs"
        class="kappa-date-picker__content"
        data-slot="date-picker-content"
        :as-child="asChild"
      >
        <slot />
      </ArkDatePicker.Content>
    </ArkDatePicker.Positioner>
  </Teleport>
</template>

<style src="./date-picker.css"></style>
