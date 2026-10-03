<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectClearTriggerProps, SelectClearTriggerSlots } from "./select";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectClearTriggerProps>(), {
  asChild: undefined,
});

defineSlots<SelectClearTriggerSlots>();
</script>

<template>
  <ArkSelect.ClearTrigger
    v-bind="$attrs"
    class="kappa-select__clear-trigger"
    data-slot="select-clear-trigger"
    :as-child="asChild"
  >
    <slot>
      <svg class="kappa-select__clear-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="m4 4 8 8M12 4l-8 8" />
      </svg>
    </slot>
  </ArkSelect.ClearTrigger>
</template>

<style src="./select.css"></style>
