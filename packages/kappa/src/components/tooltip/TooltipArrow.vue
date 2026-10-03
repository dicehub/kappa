<script setup lang="ts">
import { Tooltip as ArkTooltip } from "@ark-ui/vue/tooltip";
import TooltipArrowTip from "./TooltipArrowTip.vue";
import type { TooltipArrowProps, TooltipArrowSlots } from "./tooltip";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TooltipArrowProps>(), {
  asChild: undefined,
});

defineSlots<TooltipArrowSlots>();
</script>

<template>
  <ArkTooltip.Arrow
    v-bind="$attrs"
    class="kappa-tooltip__arrow"
    data-slot="tooltip-arrow"
    :as-child="props.asChild"
  >
    <slot><TooltipArrowTip /></slot>
  </ArkTooltip.Arrow>
</template>

<style src="./tooltip.css"></style>
