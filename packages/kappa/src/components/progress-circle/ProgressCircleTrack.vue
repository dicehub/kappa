<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type {
  ProgressCircleTrackProps,
  ProgressCircleTrackSlots,
} from "./progress-circle";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressCircleTrackProps>(), {
  asChild: undefined,
});

defineSlots<ProgressCircleTrackSlots>();
</script>

<template>
  <ArkProgress.CircleTrack
    v-bind="$attrs"
    class="kappa-progress-circle__track"
    data-slot="progress-circle-track"
    :as-child="props.asChild"
  >
    <slot />
  </ArkProgress.CircleTrack>
</template>
