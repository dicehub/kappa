<script setup lang="ts">
import { Checkbox as ArkCheckbox } from "@ark-ui/vue/checkbox";
import type { CheckboxContextSlots } from "./checkbox";

defineSlots<CheckboxContextSlots>();
</script>

<template>
  <ArkCheckbox.Context v-slot="context">
    <slot v-bind="context" />
  </ArkCheckbox.Context>
</template>
