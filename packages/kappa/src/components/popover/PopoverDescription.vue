<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverDescriptionProps, PopoverDescriptionSlots } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverDescriptionProps>(), {
  asChild: undefined,
});

defineSlots<PopoverDescriptionSlots>();
</script>

<template>
  <ArkPopover.Description
    v-bind="$attrs"
    class="kappa-popover__description"
    data-slot="popover-description"
    :as-child="props.asChild"
  >
    <slot />
  </ArkPopover.Description>
</template>

<style src="./popover.css"></style>
