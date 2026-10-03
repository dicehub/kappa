<script setup lang="ts">
import { Timer as ArkTimer } from "@ark-ui/vue/timer";
import type { TimerContextSlots } from "./timer";

defineSlots<TimerContextSlots>();
</script>

<template>
  <ArkTimer.Context v-slot="context">
    <slot v-bind="context" />
  </ArkTimer.Context>
</template>
