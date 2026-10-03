<script setup lang="ts">
import { Tooltip as ArkTooltip } from "@ark-ui/vue/tooltip";
import type { TooltipArrowTipProps, TooltipArrowTipSlots } from "./tooltip";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TooltipArrowTipProps>(), {
  asChild: undefined,
});

defineSlots<TooltipArrowTipSlots>();
</script>

<template>
  <ArkTooltip.ArrowTip
    v-bind="$attrs"
    class="kappa-tooltip__arrow-tip"
    data-slot="tooltip-arrow-tip"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTooltip.ArrowTip>
</template>

<style src="./tooltip.css"></style>
