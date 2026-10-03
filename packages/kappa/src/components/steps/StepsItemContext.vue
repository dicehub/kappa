<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsItemContextSlots } from "./steps";

defineSlots<StepsItemContextSlots>();
</script>

<template>
  <ArkSteps.ItemContext v-slot="context">
    <slot v-bind="context" />
  </ArkSteps.ItemContext>
</template>
