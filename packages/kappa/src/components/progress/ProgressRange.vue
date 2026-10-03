<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type { ProgressRangeProps, ProgressRangeSlots } from "./progress";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressRangeProps>(), {
  asChild: undefined,
});

defineSlots<ProgressRangeSlots>();
</script>

<template>
  <ArkProgress.Range
    v-bind="$attrs"
    class="kappa-progress__range"
    data-slot="progress-range"
    :as-child="props.asChild"
  >
    <slot />
  </ArkProgress.Range>
</template>
