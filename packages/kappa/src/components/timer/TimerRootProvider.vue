<script setup lang="ts">
import { Timer as ArkTimer } from "@ark-ui/vue/timer";
import { TIMER_DEFAULT_SIZE, type TimerRootProviderProps, type TimerRootProviderSlots } from "./timer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimerRootProviderProps>(), {
  asChild: undefined,
  size: TIMER_DEFAULT_SIZE,
});

defineSlots<TimerRootProviderSlots>();
</script>

<template>
  <ArkTimer.RootProvider
    v-bind="$attrs"
    class="kappa-timer"
    data-slot="timer"
    :data-size="props.size"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkTimer.RootProvider>
</template>

<style src="./timer.css"></style>
