<script setup lang="ts">
import { RadioGroup as ArkRadioGroup } from "@ark-ui/vue/radio-group";
import type { RadioContextSlots } from "./radio";

defineSlots<RadioContextSlots>();
</script>

<template>
  <ArkRadioGroup.Context v-slot="context">
    <slot v-bind="context" />
  </ArkRadioGroup.Context>
</template>
