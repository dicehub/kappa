<script setup lang="ts">
import { Progress as ArkProgress } from "@ark-ui/vue/progress";
import type { ProgressRootProviderProps, ProgressRootProviderSlots } from "./progress";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<ProgressRootProviderSlots>();
</script>

<template>
  <ArkProgress.RootProvider
    v-bind="$attrs"
    class="kappa-progress"
    data-slot="progress"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkProgress.RootProvider>
</template>

<style src="./progress.css"></style>
