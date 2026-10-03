<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import PopoverArrowTip from "./PopoverArrowTip.vue";
import type { PopoverArrowProps, PopoverArrowSlots } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverArrowProps>(), {
  asChild: undefined,
});

defineSlots<PopoverArrowSlots>();
</script>

<template>
  <ArkPopover.Arrow
    v-bind="$attrs"
    class="kappa-popover__arrow"
    data-slot="popover-arrow"
    :as-child="props.asChild"
  >
    <slot><PopoverArrowTip /></slot>
  </ArkPopover.Arrow>
</template>

<style src="./popover.css"></style>
