<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverAnchorProps, PopoverAnchorSlots } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverAnchorProps>(), {
  asChild: undefined,
});

defineSlots<PopoverAnchorSlots>();
</script>

<template>
  <ArkPopover.Anchor
    v-bind="$attrs"
    class="kappa-popover__anchor"
    data-slot="popover-anchor"
    :as-child="props.asChild"
  >
    <slot />
  </ArkPopover.Anchor>
</template>

<style src="./popover.css"></style>
