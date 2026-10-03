<script setup lang="ts">
import { NumberInput as ArkNumberInput } from "@ark-ui/vue/number-input";
import type {
  NumberInputIncrementTriggerSlots,
  NumberInputPartProps,
} from "./number-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NumberInputPartProps>(), {
  asChild: undefined,
});

defineSlots<NumberInputIncrementTriggerSlots>();
</script>

<template>
  <ArkNumberInput.IncrementTrigger
    v-bind="$attrs"
    class="kappa-number-input__trigger kappa-number-input__trigger--increment"
    data-slot="number-input-increment-trigger"
    :as-child="props.asChild"
  >
    <slot>
      <svg
        aria-hidden="true"
        class="kappa-number-input__trigger-icon"
        data-slot="number-input-increment-icon"
        fill="none"
        focusable="false"
        viewBox="0 0 16 16"
      >
        <path d="M8 4v8M4 8h8" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" />
      </svg>
    </slot>
  </ArkNumberInput.IncrementTrigger>
</template>
