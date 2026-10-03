<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsProgressProps, StepsProgressSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsProgressProps>(), {
  asChild: undefined,
});

defineSlots<StepsProgressSlots>();
</script>

<template>
  <ArkSteps.Progress
    v-bind="$attrs"
    class="kappa-steps__progress"
    data-slot="steps-progress"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSteps.Progress>
</template>
