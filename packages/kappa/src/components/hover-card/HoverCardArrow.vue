<script setup lang="ts">
import { HoverCard as ArkHoverCard } from "@ark-ui/vue/hover-card";
import HoverCardArrowTip from "./HoverCardArrowTip.vue";
import type { HoverCardArrowProps, HoverCardArrowSlots } from "./hover-card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<HoverCardArrowProps>(), {
  asChild: undefined,
});

defineSlots<HoverCardArrowSlots>();
</script>

<template>
  <ArkHoverCard.Arrow
    v-bind="$attrs"
    class="kappa-hover-card__arrow"
    data-slot="hover-card-arrow"
    :as-child="props.asChild"
  >
    <slot><HoverCardArrowTip /></slot>
  </ArkHoverCard.Arrow>
</template>

<style src="./hover-card.css"></style>
