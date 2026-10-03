<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type { ProgressTrackProps, ProgressTrackSlots } from "./progress";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressTrackProps>(), {
  asChild: undefined,
});

defineSlots<ProgressTrackSlots>();
</script>

<template>
  <ArkProgress.Track
    v-bind="$attrs"
    class="kappa-progress__track"
    data-slot="progress-track"
    :as-child="props.asChild"
  >
    <slot />
  </ArkProgress.Track>
</template>
