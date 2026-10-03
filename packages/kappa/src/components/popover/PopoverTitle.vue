<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverTitleProps, PopoverTitleSlots } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverTitleProps>(), {
  asChild: undefined,
});

defineSlots<PopoverTitleSlots>();
</script>

<template>
  <ArkPopover.Title
    v-bind="$attrs"
    class="kappa-popover__title"
    data-slot="popover-title"
    :as-child="props.asChild"
  >
    <slot />
  </ArkPopover.Title>
</template>

<style src="./popover.css"></style>
