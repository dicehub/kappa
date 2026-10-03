<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsSeparatorProps, StepsSeparatorSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsSeparatorProps>(), {
  asChild: undefined,
});

defineSlots<StepsSeparatorSlots>();
</script>

<template>
  <ArkSteps.Separator
    v-bind="$attrs"
    class="kappa-steps__separator"
    data-slot="steps-separator"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSteps.Separator>
</template>
