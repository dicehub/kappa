<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import { computed, useAttrs, useId, useSlots } from "vue";
import type {
  PopoverCloseTriggerProps,
  PopoverCloseTriggerSlots,
} from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverCloseTriggerProps>(), {
  asChild: false,
});

defineSlots<PopoverCloseTriggerSlots>();

const attrs = useAttrs();
const slots = useSlots();
const generatedId = useId();
const hasDefaultSlot = computed(() => Boolean(slots.default));
const closeId = computed(() => {
  const id = attrs.id;
  return typeof id === "string" && id ? id : `kappa-popover-close-${generatedId}`;
});
const closeAttrs = computed(() => ({
  ...attrs,
  id: closeId.value,
  ...(props.label !== undefined ? { "aria-label": props.label } : {}),
}));
</script>

<template>
  <ArkPopover.CloseTrigger
    v-if="hasDefaultSlot"
    v-bind="closeAttrs"
    :class="props.asChild ? undefined : 'kappa-popover__close-trigger'"
    data-slot="popover-close-trigger"
    :as-child="props.asChild"
  >
    <slot />
  </ArkPopover.CloseTrigger>
  <ArkPopover.CloseTrigger
    v-else
    v-bind="closeAttrs"
    class="kappa-popover__close"
    data-slot="popover-close-trigger"
    type="button"
  >
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </ArkPopover.CloseTrigger>
</template>

<style src="./popover.css"></style>
