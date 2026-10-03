<script setup lang="ts">
import { Timer as ArkTimer, useTimerContext } from "@ark-ui/vue/timer";
import { computed } from "vue";
import type { TimerItemProps } from "./timer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimerItemProps>(), {
  animate: true,
  asChild: undefined,
});

const timer = useTimerContext();
const formattedValue = computed(() => timer.value.formattedTime[props.type]);
const renderKey = computed(() =>
  props.animate ? `${props.type}-${formattedValue.value}` : props.type,
);
</script>

<template>
  <ArkTimer.Item
    :key="renderKey"
    v-bind="$attrs"
    class="kappa-timer__item"
    data-slot="timer-item"
    :data-animate="props.animate ? '' : undefined"
    :as-child="props.asChild"
    :type="props.type"
  />
</template>
