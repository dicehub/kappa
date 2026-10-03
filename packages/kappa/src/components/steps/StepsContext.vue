<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsContextSlots } from "./steps";

defineSlots<StepsContextSlots>();
</script>

<template>
  <ArkSteps.Context v-slot="context">
    <slot v-bind="context" />
  </ArkSteps.Context>
</template>
