<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type { ProgressLabelProps, ProgressLabelSlots } from "./progress";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressLabelProps>(), {
  asChild: undefined,
});

defineSlots<ProgressLabelSlots>();
</script>

<template>
  <ArkProgress.Label
    v-bind="$attrs"
    class="kappa-progress__label"
    data-slot="progress-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkProgress.Label>
</template>
