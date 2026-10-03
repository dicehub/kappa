<script setup lang="ts">
import { HoverCard as ArkHoverCard } from "@ark-ui/vue/hover-card";
import type { HoverCardTriggerProps, HoverCardTriggerSlots } from "./hover-card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<HoverCardTriggerProps>(), {
  asChild: undefined,
  disabled: undefined,
  value: undefined,
});

defineSlots<HoverCardTriggerSlots>();
</script>

<template>
  <ArkHoverCard.Trigger
    v-bind="$attrs"
    :class="props.asChild ? undefined : 'kappa-hover-card__trigger'"
    data-slot="hover-card-trigger"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :value="props.value"
  >
    <slot />
  </ArkHoverCard.Trigger>
</template>

<style src="./hover-card.css"></style>
