<script setup lang="ts">
import { ToggleGroup as ArkToggleGroup } from "@ark-ui/vue/toggle-group";
import type { ToggleGroupContextSlots } from "./toggle-group";

defineSlots<ToggleGroupContextSlots>();
</script>

<template>
  <ArkToggleGroup.Context v-slot="context">
    <slot v-bind="context" />
  </ArkToggleGroup.Context>
</template>
