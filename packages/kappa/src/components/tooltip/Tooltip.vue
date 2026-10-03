<script setup lang="ts">
import { Tooltip as ArkTooltip } from "@ark-ui/vue/tooltip";
import { computed } from "vue";
import {
  TOOLTIP_DEFAULT_CLOSE_DELAY,
  TOOLTIP_DEFAULT_OPEN_DELAY,
  TOOLTIP_DEFAULT_POSITIONING,
  type TooltipEmits,
  type TooltipPositioningOptions,
  type TooltipProps,
  type TooltipSlots,
} from "./tooltip";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TooltipProps>(), {
  ariaLabel: undefined,
  closeDelay: TOOLTIP_DEFAULT_CLOSE_DELAY,
  closeOnClick: undefined,
  closeOnEscape: undefined,
  closeOnPointerDown: undefined,
  closeOnScroll: undefined,
  defaultOpen: undefined,
  defaultTriggerValue: undefined,
  disabled: undefined,
  id: undefined,
  ids: undefined,
  interactive: undefined,
  lazyMount: undefined,
  open: undefined,
  openDelay: TOOLTIP_DEFAULT_OPEN_DELAY,
  positioning: undefined,
  triggerValue: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<TooltipEmits>();
defineSlots<TooltipSlots>();

const resolvedPositioning = computed<TooltipPositioningOptions>(() => ({
  ...TOOLTIP_DEFAULT_POSITIONING,
  ...props.positioning,
}));
</script>

<template>
  <ArkTooltip.Root
    :aria-label="props.ariaLabel"
    :close-delay="props.closeDelay"
    :close-on-click="props.closeOnClick"
    :close-on-escape="props.closeOnEscape"
    :close-on-pointer-down="props.closeOnPointerDown"
    :close-on-scroll="props.closeOnScroll"
    :default-open="props.defaultOpen"
    :default-trigger-value="props.defaultTriggerValue"
    :disabled="props.disabled"
    :id="props.id"
    :ids="props.ids"
    :interactive="props.interactive"
    :lazy-mount="props.lazyMount"
    :open="props.open"
    :open-delay="props.openDelay"
    :positioning="resolvedPositioning"
    :trigger-value="props.triggerValue"
    :unmount-on-exit="props.unmountOnExit"
    @exit-complete="emit('exitComplete')"
    @open-change="emit('openChange', $event)"
    @trigger-value-change="emit('triggerValueChange', $event)"
    @update:open="emit('update:open', $event)"
    @update:trigger-value="emit('update:triggerValue', $event)"
  >
    <slot />
  </ArkTooltip.Root>
</template>

<style src="./tooltip.css"></style>
