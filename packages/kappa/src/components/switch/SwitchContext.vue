<script setup lang="ts">
import { Switch as ArkSwitch } from "@ark-ui/vue/switch";
import type { SwitchContextSlots } from "./switch";

defineSlots<SwitchContextSlots>();
</script>

<template>
  <ArkSwitch.Context v-slot="context">
    <slot v-bind="context" />
  </ArkSwitch.Context>
</template>
