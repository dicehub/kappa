<script setup lang="ts">
import { NumberInput as ArkNumberInput } from "@ark-ui/vue/number-input";
import type { NumberInputInputSlots, NumberInputPartProps } from "./number-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NumberInputPartProps>(), {
  asChild: undefined,
});

defineSlots<NumberInputInputSlots>();
</script>

<template>
  <ArkNumberInput.Input
    v-bind="$attrs"
    class="kappa-number-input__input"
    data-slot="number-input-input"
    :as-child="props.asChild"
  >
    <slot />
  </ArkNumberInput.Input>
</template>
