<script setup lang="ts">
import { Timer as ArkTimer } from "@ark-ui/vue/timer";
import type { TimerSeparatorProps, TimerSeparatorSlots } from "./timer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimerSeparatorProps>(), {
  asChild: undefined,
});

defineSlots<TimerSeparatorSlots>();
</script>

<template>
  <ArkTimer.Separator
    v-bind="$attrs"
    class="kappa-timer__separator"
    data-slot="timer-separator"
    :as-child="props.asChild"
  >
    <slot>:</slot>
  </ArkTimer.Separator>
</template>
