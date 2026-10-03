<script setup lang="ts">
import { Tooltip as ArkTooltip } from "@ark-ui/vue/tooltip";
import type { TooltipTriggerProps, TooltipTriggerSlots } from "./tooltip";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TooltipTriggerProps>(), {
  asChild: undefined,
  value: undefined,
});

defineSlots<TooltipTriggerSlots>();
</script>

<template>
  <ArkTooltip.Trigger
    v-bind="$attrs"
    :class="props.asChild ? undefined : 'kappa-tooltip__trigger'"
    data-slot="tooltip-trigger"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkTooltip.Trigger>
</template>

<style src="./tooltip.css"></style>
