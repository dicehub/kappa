<script setup lang="ts">
import { NumberInput as ArkNumberInput } from "@ark-ui/vue/number-input";
import type { NumberInputControlSlots, NumberInputPartProps } from "./number-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NumberInputPartProps>(), {
  asChild: undefined,
});

defineSlots<NumberInputControlSlots>();
</script>

<template>
  <ArkNumberInput.Control
    v-bind="$attrs"
    class="kappa-number-input__control"
    data-slot="number-input-control"
    :as-child="props.asChild"
  >
    <slot />
  </ArkNumberInput.Control>
</template>
