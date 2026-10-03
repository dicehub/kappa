<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverIndicatorProps, PopoverIndicatorSlots } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<PopoverIndicatorSlots>();
</script>

<template>
  <ArkPopover.Indicator
    v-bind="$attrs"
    class="kappa-popover__indicator"
    data-slot="popover-indicator"
    :as-child="props.asChild"
  >
    <slot />
  </ArkPopover.Indicator>
</template>

<style src="./popover.css"></style>
