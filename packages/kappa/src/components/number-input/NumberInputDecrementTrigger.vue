<script setup lang="ts">
import { NumberInput as ArkNumberInput } from "@ark-ui/vue/number-input";
import type {
  NumberInputDecrementTriggerSlots,
  NumberInputPartProps,
} from "./number-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NumberInputPartProps>(), {
  asChild: undefined,
});

defineSlots<NumberInputDecrementTriggerSlots>();
</script>

<template>
  <ArkNumberInput.DecrementTrigger
    v-bind="$attrs"
    class="kappa-number-input__trigger kappa-number-input__trigger--decrement"
    data-slot="number-input-decrement-trigger"
    :as-child="props.asChild"
  >
    <slot>
      <svg
        aria-hidden="true"
        class="kappa-number-input__trigger-icon"
        data-slot="number-input-decrement-icon"
        fill="none"
        focusable="false"
        viewBox="0 0 16 16"
      >
        <path d="M4 8h8" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" />
      </svg>
    </slot>
  </ArkNumberInput.DecrementTrigger>
</template>
