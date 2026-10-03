<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverArrowTipProps, PopoverArrowTipSlots } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverArrowTipProps>(), {
  asChild: undefined,
});

defineSlots<PopoverArrowTipSlots>();
</script>

<template>
  <ArkPopover.ArrowTip
    v-bind="$attrs"
    class="kappa-popover__arrow-tip"
    data-slot="popover-arrow-tip"
    :as-child="props.asChild"
  >
    <slot />
  </ArkPopover.ArrowTip>
</template>

<style src="./popover.css"></style>
