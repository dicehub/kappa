<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverPositionerProps, PopoverPositionerSlots } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverPositionerProps>(), {
  asChild: undefined,
});

defineSlots<PopoverPositionerSlots>();
</script>

<template>
  <ArkPopover.Positioner
    v-bind="$attrs"
    class="kappa-popover__positioner"
    data-slot="popover-positioner"
    :as-child="props.asChild"
  >
    <slot />
  </ArkPopover.Positioner>
</template>

<style src="./popover.css"></style>
