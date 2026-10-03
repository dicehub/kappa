<script setup lang="ts">
import { HoverCard as ArkHoverCard } from "@ark-ui/vue/hover-card";
import { computed } from "vue";
import {
  HOVER_CARD_DEFAULT_CLOSE_DELAY,
  HOVER_CARD_DEFAULT_OPEN_DELAY,
  resolveHoverCardPositioning,
  type HoverCardEmits,
  type HoverCardProps,
  type HoverCardSlots,
} from "./hover-card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<HoverCardProps>(), {
  closeDelay: HOVER_CARD_DEFAULT_CLOSE_DELAY,
  defaultOpen: undefined,
  defaultTriggerValue: undefined,
  disabled: undefined,
  id: undefined,
  ids: undefined,
  lazyMount: undefined,
  open: undefined,
  openDelay: HOVER_CARD_DEFAULT_OPEN_DELAY,
  positioning: undefined,
  triggerValue: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<HoverCardEmits>();
defineSlots<HoverCardSlots>();

const resolvedPositioning = computed(() => resolveHoverCardPositioning(props.positioning));
</script>

<template>
  <ArkHoverCard.Root
    v-bind="$attrs"
    :close-delay="props.closeDelay"
    :default-open="props.defaultOpen"
    :default-trigger-value="props.defaultTriggerValue"
    :disabled="props.disabled"
    :id="props.id"
    :ids="props.ids"
    :lazy-mount="props.lazyMount"
    :open="props.open"
    :open-delay="props.openDelay"
    :positioning="resolvedPositioning"
    :trigger-value="props.triggerValue"
    :unmount-on-exit="props.unmountOnExit"
    @exit-complete="emit('exitComplete')"
    @focus-outside="emit('focusOutside', $event)"
    @interact-outside="emit('interactOutside', $event)"
    @open-change="emit('openChange', $event)"
    @pointer-down-outside="emit('pointerDownOutside', $event)"
    @trigger-value-change="emit('triggerValueChange', $event)"
    @update:open="emit('update:open', $event)"
    @update:trigger-value="emit('update:triggerValue', $event)"
  >
    <slot />
  </ArkHoverCard.Root>
</template>

<style src="./hover-card.css"></style>
