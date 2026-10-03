<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsCompletedContentProps, StepsCompletedContentSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsCompletedContentProps>(), {
  asChild: undefined,
});

defineSlots<StepsCompletedContentSlots>();
</script>

<template>
  <ArkSteps.CompletedContent
    v-bind="$attrs"
    class="kappa-steps__content kappa-steps__content--completed"
    data-slot="steps-completed-content"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSteps.CompletedContent>
</template>
