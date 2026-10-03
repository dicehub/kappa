<script setup lang="ts">
import { Steps as ArkSteps } from "@ark-ui/vue/steps";
import type { StepsRootProviderProps, StepsRootProviderSlots } from "./steps";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepsRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<StepsRootProviderSlots>();
</script>

<template>
  <ArkSteps.RootProvider
    v-bind="$attrs"
    class="kappa-steps"
    data-slot="steps"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkSteps.RootProvider>
</template>
