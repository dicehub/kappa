<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type { ProgressContextSlots } from "./progress";

defineSlots<ProgressContextSlots>();
</script>

<template>
  <ArkProgress.Context v-slot="context">
    <slot v-bind="context" />
  </ArkProgress.Context>
</template>
