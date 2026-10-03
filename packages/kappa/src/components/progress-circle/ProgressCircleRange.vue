<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type {
  ProgressCircleRangeProps,
  ProgressCircleRangeSlots,
} from "./progress-circle";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressCircleRangeProps>(), {
  asChild: undefined,
});

defineSlots<ProgressCircleRangeSlots>();
</script>

<template>
  <ArkProgress.CircleRange
    v-bind="$attrs"
    class="kappa-progress-circle__range"
    data-slot="progress-circle-range"
    :as-child="props.asChild"
  >
    <slot />
  </ArkProgress.CircleRange>
</template>
