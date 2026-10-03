<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type {
  ProgressCircleValueTextProps,
  ProgressCircleValueTextSlots,
} from "./progress-circle";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressCircleValueTextProps>(), {
  asChild: undefined,
});

defineSlots<ProgressCircleValueTextSlots>();
</script>

<template>
  <ArkProgress.ValueText
    v-if="$slots.default"
    v-bind="$attrs"
    class="kappa-progress-circle__value-text"
    data-slot="progress-circle-value-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkProgress.ValueText>
  <ArkProgress.ValueText
    v-else
    v-bind="$attrs"
    class="kappa-progress-circle__value-text"
    data-slot="progress-circle-value-text"
    :as-child="props.asChild"
  />
</template>
