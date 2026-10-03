<script setup lang="ts">
import { Timer as ArkTimer } from "@ark-ui/vue/timer";
import type { TimerAreaProps, TimerAreaSlots } from "./timer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimerAreaProps>(), {
  asChild: undefined,
});

defineSlots<TimerAreaSlots>();
</script>

<template>
  <ArkTimer.Area
    v-bind="$attrs"
    class="kappa-timer__area"
    data-slot="timer-area"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTimer.Area>
</template>
