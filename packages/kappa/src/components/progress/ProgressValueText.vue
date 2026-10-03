<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type { ProgressValueTextProps, ProgressValueTextSlots } from "./progress";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressValueTextProps>(), {
  asChild: undefined,
});

defineSlots<ProgressValueTextSlots>();
</script>

<template>
  <ArkProgress.ValueText
    v-if="$slots.default"
    v-bind="$attrs"
    class="kappa-progress__value-text"
    data-slot="progress-value-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkProgress.ValueText>
  <ArkProgress.ValueText
    v-else
    v-bind="$attrs"
    class="kappa-progress__value-text"
    data-slot="progress-value-text"
    :as-child="props.asChild"
  />
</template>
