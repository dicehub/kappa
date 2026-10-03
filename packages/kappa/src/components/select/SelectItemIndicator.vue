<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectItemIndicatorProps, SelectItemIndicatorSlots } from "./select";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectItemIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<SelectItemIndicatorSlots>();
</script>

<template>
  <ArkSelect.ItemIndicator
    v-bind="$attrs"
    class="kappa-select__item-indicator"
    data-slot="select-item-indicator"
    :as-child="asChild"
  >
    <slot>
      <svg class="kappa-select__check" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="m3 8.3 3.1 3.1L13 4.8" />
      </svg>
    </slot>
  </ArkSelect.ItemIndicator>
</template>

<style src="./select.css"></style>
