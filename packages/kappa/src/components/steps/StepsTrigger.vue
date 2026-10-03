<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsTriggerProps, StepsTriggerSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsTriggerProps>(), {
  asChild: undefined,
});

defineSlots<StepsTriggerSlots>();
</script>

<template>
  <ArkSteps.Trigger
    v-bind="$attrs"
    class="kappa-steps__trigger"
    data-slot="steps-trigger"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSteps.Trigger>
</template>
