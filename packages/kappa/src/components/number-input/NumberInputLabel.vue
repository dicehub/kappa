<script setup lang="ts">
import { NumberInput as ArkNumberInput } from "@ark-ui/vue/number-input";
import type { NumberInputLabelSlots, NumberInputPartProps } from "./number-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NumberInputPartProps>(), {
  asChild: undefined,
});

defineSlots<NumberInputLabelSlots>();
</script>

<template>
  <ArkNumberInput.Label
    v-bind="$attrs"
    class="kappa-number-input__label"
    data-slot="number-input-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkNumberInput.Label>
</template>
