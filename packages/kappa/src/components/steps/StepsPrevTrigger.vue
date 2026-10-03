<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsPrevTriggerProps, StepsPrevTriggerSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsPrevTriggerProps>(), {
  asChild: undefined,
});

defineSlots<StepsPrevTriggerSlots>();
</script>

<template>
  <ArkSteps.PrevTrigger
    v-bind="$attrs"
    class="kappa-steps__navigation-trigger"
    data-slot="steps-prev-trigger"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSteps.PrevTrigger>
</template>
