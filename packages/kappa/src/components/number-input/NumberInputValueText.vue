<script setup lang="ts">
import {
  NumberInput as ArkNumberInput,
  useNumberInputContext,
} from "@ark-ui/vue/number-input";
import { computed } from "vue";
import type { NumberInputPartProps, NumberInputValueTextSlots } from "./number-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NumberInputPartProps>(), {
  asChild: undefined,
});

defineSlots<NumberInputValueTextSlots>();

const numberInput = useNumberInputContext();
const value = computed(() => numberInput.value.value);
const valueAsNumber = computed(() => numberInput.value.valueAsNumber);
</script>

<template>
  <ArkNumberInput.ValueText
    v-bind="$attrs"
    class="kappa-number-input__value-text"
    data-slot="number-input-value-text"
    :as-child="props.asChild"
  >
    <slot :value="value" :value-as-number="valueAsNumber">
      {{ value }}
    </slot>
  </ArkNumberInput.ValueText>
</template>
