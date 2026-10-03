<script setup lang="ts">
import {
  NumberInput as ArkNumberInput,
  useNumberInputContext,
} from "@ark-ui/vue/number-input";
import { computed } from "vue";
import type { NumberInputPartProps, NumberInputScrubberSlots } from "./number-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NumberInputPartProps>(), {
  asChild: undefined,
});

defineSlots<NumberInputScrubberSlots>();

const numberInput = useNumberInputContext();
const isReadOnly = computed(() => Boolean(numberInput.value.getInputProps().readonly));

const guardReadOnlyScrub = (event: MouseEvent) => {
  if (!isReadOnly.value) return;
  event.preventDefault();
  event.stopImmediatePropagation();
};
</script>

<template>
  <ArkNumberInput.Scrubber
    v-bind="$attrs"
    class="kappa-number-input__scrubber"
    data-slot="number-input-scrubber"
    :as-child="props.asChild"
    :data-readonly="isReadOnly ? '' : undefined"
    :style="isReadOnly ? { cursor: 'default' } : undefined"
    @mousedown.capture="guardReadOnlyScrub"
  >
    <slot>
      <svg
        aria-hidden="true"
        class="kappa-number-input__scrubber-icon"
        data-slot="number-input-scrubber-icon"
        fill="none"
        focusable="false"
        viewBox="0 0 16 16"
      >
        <path d="M5 4 1.75 8 5 12M11 4l3.25 4L11 12M8 3.25v9.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" />
      </svg>
    </slot>
  </ArkNumberInput.Scrubber>
</template>
