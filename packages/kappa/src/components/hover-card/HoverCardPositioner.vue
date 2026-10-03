<script setup lang="ts">
import { HoverCard as ArkHoverCard } from "@ark-ui/vue/hover-card";
import type { HoverCardPositionerProps, HoverCardPositionerSlots } from "./hover-card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<HoverCardPositionerProps>(), {
  asChild: undefined,
});

defineSlots<HoverCardPositionerSlots>();
</script>

<template>
  <ArkHoverCard.Positioner
    v-bind="$attrs"
    class="kappa-hover-card__positioner"
    data-slot="hover-card-positioner"
    :as-child="props.asChild"
  >
    <slot />
  </ArkHoverCard.Positioner>
</template>

<style src="./hover-card.css"></style>
