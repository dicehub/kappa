<script setup lang="ts">
import { Timer as ArkTimer } from "@ark-ui/vue/timer";
import type { TimerControlProps, TimerControlSlots } from "./timer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimerControlProps>(), {
  asChild: undefined,
});

defineSlots<TimerControlSlots>();
</script>

<template>
  <ArkTimer.Control
    v-bind="$attrs"
    class="kappa-timer__control"
    data-slot="timer-control"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTimer.Control>
</template>
