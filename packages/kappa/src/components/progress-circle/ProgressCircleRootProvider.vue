<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type {
  ProgressCircleRootProviderProps,
  ProgressCircleRootProviderSlots,
} from "./progress-circle";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressCircleRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<ProgressCircleRootProviderSlots>();
</script>

<template>
  <ArkProgress.RootProvider
    v-bind="$attrs"
    class="kappa-progress-circle"
    data-slot="progress-circle"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkProgress.RootProvider>
</template>

<style src="./progress-circle.css"></style>
