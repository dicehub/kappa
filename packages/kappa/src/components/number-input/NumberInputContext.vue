<script setup lang="ts">
import { NumberInput as ArkNumberInput } from "@ark-ui/vue/number-input";
import type { NumberInputContextSlots } from "./number-input";

defineSlots<NumberInputContextSlots>();
</script>

<template>
  <ArkNumberInput.Context v-slot="context">
    <slot v-bind="context" />
  </ArkNumberInput.Context>
</template>
