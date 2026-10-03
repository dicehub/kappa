<script setup lang="ts">
import { RadioGroup as ArkRadioGroup } from "@ark-ui/vue/radio-group";
import type { RadioItemContextSlots } from "./radio";

defineSlots<RadioItemContextSlots>();
</script>

<template>
  <ArkRadioGroup.ItemContext v-slot="context">
    <slot v-bind="context" />
  </ArkRadioGroup.ItemContext>
</template>
