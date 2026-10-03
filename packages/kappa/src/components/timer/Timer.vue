<script setup lang="ts">
import { Timer as ArkTimer } from "@ark-ui/vue/timer";
import { TIMER_DEFAULT_SIZE, type TimerEmits, type TimerProps, type TimerSlots } from "./timer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimerProps>(), {
  asChild: undefined,
  autoStart: undefined,
  countdown: undefined,
  id: undefined,
  ids: undefined,
  interval: undefined,
  size: TIMER_DEFAULT_SIZE,
  startMs: undefined,
  targetMs: undefined,
  translations: undefined,
});

const emit = defineEmits<TimerEmits>();
defineSlots<TimerSlots>();
</script>

<template>
  <ArkTimer.Root
    v-bind="$attrs"
    class="kappa-timer"
    data-slot="timer"
    :data-size="props.size"
    :as-child="props.asChild"
    :auto-start="props.autoStart"
    :countdown="props.countdown"
    :id="props.id"
    :ids="props.ids"
    :interval="props.interval"
    :start-ms="props.startMs"
    :target-ms="props.targetMs"
    :translations="props.translations"
    @complete="emit('complete')"
    @tick="emit('tick', $event)"
  >
    <slot />
  </ArkTimer.Root>
</template>

<style src="./timer.css"></style>
