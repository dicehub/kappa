<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type { ProgressCircleContextSlots } from "./progress-circle";

defineSlots<ProgressCircleContextSlots>();
</script>

<template>
  <ArkProgress.Context v-slot="context">
    <slot v-bind="context" />
  </ArkProgress.Context>
</template>
