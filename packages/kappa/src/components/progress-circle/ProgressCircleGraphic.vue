<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type {
  ProgressCircleGraphicProps,
  ProgressCircleGraphicSlots,
} from "./progress-circle";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressCircleGraphicProps>(), {
  asChild: undefined,
});

defineSlots<ProgressCircleGraphicSlots>();
</script>

<template>
  <ArkProgress.Circle
    v-bind="$attrs"
    class="kappa-progress-circle__circle"
    data-slot="progress-circle-circle"
    :as-child="props.asChild"
  >
    <slot />
  </ArkProgress.Circle>
</template>
