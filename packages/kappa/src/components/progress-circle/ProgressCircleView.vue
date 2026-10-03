<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type {
  ProgressCircleViewProps,
  ProgressCircleViewSlots,
} from "./progress-circle";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressCircleViewProps>(), {
  asChild: undefined,
});

defineSlots<ProgressCircleViewSlots>();
</script>

<template>
  <ArkProgress.View
    v-bind="$attrs"
    class="kappa-progress-circle__view"
    data-slot="progress-circle-view"
    :as-child="props.asChild"
    :state="props.state"
  >
    <slot />
  </ArkProgress.View>
</template>
