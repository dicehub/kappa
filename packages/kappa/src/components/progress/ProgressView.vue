<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type { ProgressViewProps, ProgressViewSlots } from "./progress";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressViewProps>(), {
  asChild: undefined,
});

defineSlots<ProgressViewSlots>();
</script>

<template>
  <ArkProgress.View
    v-bind="$attrs"
    class="kappa-progress__view"
    data-slot="progress-view"
    :as-child="props.asChild"
    :state="props.state"
  >
    <slot />
  </ArkProgress.View>
</template>
