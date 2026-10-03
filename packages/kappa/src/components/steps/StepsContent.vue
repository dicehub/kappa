<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsContentProps, StepsContentSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsContentProps>(), {
  asChild: undefined,
});

defineSlots<StepsContentSlots>();
</script>

<template>
  <ArkSteps.Content
    v-bind="$attrs"
    class="kappa-steps__content"
    data-slot="steps-content"
    :as-child="props.asChild"
    :index="props.index"
  >
    <slot />
  </ArkSteps.Content>
</template>
