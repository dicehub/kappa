<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import { computed } from "vue";
import {
  STEPS_DEFAULT_SIZE,
  resolveStepsSize,
  type StepsListProps,
  type StepsListSlots,
} from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsListProps>(), {
  asChild: undefined,
  size: STEPS_DEFAULT_SIZE,
});

defineSlots<StepsListSlots>();

const resolvedSize = computed(() => resolveStepsSize(props.size));
</script>

<template>
  <ArkSteps.List
    v-bind="$attrs"
    class="kappa-steps__list"
    data-slot="steps-list"
    :as-child="props.asChild"
    :data-size="resolvedSize"
  >
    <slot />
  </ArkSteps.List>
</template>
