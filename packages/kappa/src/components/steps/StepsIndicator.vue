<script setup lang="ts">
import { Steps as ArkSteps, useStepsItemContext } from "@ark-ui/vue/steps";
import type { StepsIndicatorProps, StepsIndicatorSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<StepsIndicatorSlots>();

const item = useStepsItemContext();
</script>

<template>
  <ArkSteps.Indicator
    v-bind="$attrs"
    class="kappa-steps__indicator"
    data-slot="steps-indicator"
    :as-child="props.asChild"
  >
    <slot v-bind="item" />
  </ArkSteps.Indicator>
</template>
