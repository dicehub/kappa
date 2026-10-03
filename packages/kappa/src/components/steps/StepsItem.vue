<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsItemProps, StepsItemSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsItemProps>(), {
  asChild: undefined,
});

defineSlots<StepsItemSlots>();
</script>

<template>
  <ArkSteps.Item
    v-bind="$attrs"
    class="kappa-steps__item"
    data-slot="steps-item"
    :as-child="props.asChild"
    :index="props.index"
  >
    <slot />
  </ArkSteps.Item>
</template>
