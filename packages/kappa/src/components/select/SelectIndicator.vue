<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectIndicatorProps, SelectIndicatorSlots } from "./select";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<SelectIndicatorSlots>();
</script>

<template>
  <ArkSelect.Indicator
    v-bind="$attrs"
    class="kappa-select__indicator"
    data-slot="select-indicator"
    :as-child="asChild"
  >
    <slot>
      <svg class="kappa-select__caret" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="m4.5 6.5 3.5-3 3.5 3" />
        <path d="m4.5 9.5 3.5 3 3.5-3" />
      </svg>
    </slot>
  </ArkSelect.Indicator>
</template>

<style src="./select.css"></style>
