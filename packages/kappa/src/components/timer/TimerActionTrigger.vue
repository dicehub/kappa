<script setup lang="ts">
import { Timer as ArkTimer } from "@ark-ui/vue/timer";
import type { TimerActionTriggerProps, TimerActionTriggerSlots } from "./timer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimerActionTriggerProps>(), {
  asChild: undefined,
});

defineSlots<TimerActionTriggerSlots>();
</script>

<template>
  <ArkTimer.ActionTrigger
    v-bind="$attrs"
    class="kappa-timer__action"
    data-slot="timer-action-trigger"
    :action="props.action"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTimer.ActionTrigger>
</template>
