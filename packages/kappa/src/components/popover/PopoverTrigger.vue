<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverTriggerProps, PopoverTriggerSlots } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverTriggerProps>(), {
  asChild: undefined,
  disabled: undefined,
  value: undefined,
});

defineSlots<PopoverTriggerSlots>();
</script>

<template>
  <ArkPopover.Trigger
    v-bind="$attrs"
    :class="props.asChild ? undefined : 'kappa-popover__trigger'"
    data-slot="popover-trigger"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :value="props.value"
  >
    <slot />
  </ArkPopover.Trigger>
</template>

<style src="./popover.css"></style>
