<script setup lang="ts">
import { HoverCard as ArkHoverCard } from "@ark-ui/vue/hover-card";
import { onMounted, ref } from "vue";
import HoverCardArrow from "./HoverCardArrow.vue";
import type { HoverCardContentProps, HoverCardContentSlots } from "./hover-card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<HoverCardContentProps>(), {
  asChild: undefined,
  showArrow: true,
  teleport: true,
  teleportTo: "body",
});

defineSlots<HoverCardContentSlots>();

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport :disabled="!props.teleport || !isMounted" :to="props.teleportTo">
    <ArkHoverCard.Positioner
      class="kappa-hover-card__positioner"
      data-slot="hover-card-positioner"
    >
      <slot v-if="props.showArrow" name="arrow"><HoverCardArrow /></slot>
      <ArkHoverCard.Content
        v-bind="$attrs"
        class="kappa-hover-card__content"
        data-slot="hover-card-content"
        :as-child="props.asChild"
      >
        <slot />
      </ArkHoverCard.Content>
    </ArkHoverCard.Positioner>
  </Teleport>
</template>

<style src="./hover-card.css"></style>
