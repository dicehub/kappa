<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsNextTriggerProps, StepsNextTriggerSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsNextTriggerProps>(), {
  asChild: undefined,
});

defineSlots<StepsNextTriggerSlots>();
</script>

<template>
  <ArkSteps.NextTrigger
    v-bind="$attrs"
    class="kappa-steps__navigation-trigger"
    data-slot="steps-next-trigger"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSteps.NextTrigger>
</template>
