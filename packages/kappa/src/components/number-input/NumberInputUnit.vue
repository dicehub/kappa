<script setup lang="ts">
import type { NumberInputUnitSlots } from "./number-input";

defineOptions({ inheritAttrs: false });
defineSlots<NumberInputUnitSlots>();
</script>

<template>
  <span v-bind="$attrs" class="kappa-number-input__unit" data-slot="number-input-unit">
    <slot />
  </span>
</template>
