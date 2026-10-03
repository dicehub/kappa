<script setup lang="ts">
import { HoverCard as ArkHoverCard } from "@ark-ui/vue/hover-card";
import type { HoverCardArrowTipProps, HoverCardArrowTipSlots } from "./hover-card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<HoverCardArrowTipProps>(), {
  asChild: undefined,
});

defineSlots<HoverCardArrowTipSlots>();
</script>

<template>
  <ArkHoverCard.ArrowTip
    v-bind="$attrs"
    class="kappa-hover-card__arrow-tip"
    data-slot="hover-card-arrow-tip"
    :as-child="props.asChild"
  >
    <slot />
  </ArkHoverCard.ArrowTip>
</template>

<style src="./hover-card.css"></style>
