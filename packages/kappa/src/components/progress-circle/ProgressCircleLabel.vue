<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type {
  ProgressCircleLabelProps,
  ProgressCircleLabelSlots,
} from "./progress-circle";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressCircleLabelProps>(), {
  asChild: undefined,
});

defineSlots<ProgressCircleLabelSlots>();
</script>

<template>
  <ArkProgress.Label
    v-bind="$attrs"
    class="kappa-progress-circle__label"
    data-slot="progress-circle-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkProgress.Label>
</template>
