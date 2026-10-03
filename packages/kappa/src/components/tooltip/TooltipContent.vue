<script setup lang="ts">
import { Tooltip as ArkTooltip } from "@ark-ui/vue/tooltip";
import { onMounted, ref } from "vue";
import TooltipArrow from "./TooltipArrow.vue";
import type { TooltipContentProps, TooltipContentSlots } from "./tooltip";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TooltipContentProps>(), {
  asChild: undefined,
  showArrow: true,
  teleport: true,
  teleportTo: "body",
});

defineSlots<TooltipContentSlots>();

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport :disabled="!props.teleport || !isMounted" :to="props.teleportTo">
    <ArkTooltip.Positioner
      class="kappa-tooltip__positioner"
      data-slot="tooltip-positioner"
    >
      <slot v-if="props.showArrow" name="arrow"><TooltipArrow /></slot>
      <ArkTooltip.Content
        v-bind="$attrs"
        class="kappa-tooltip__content"
        data-slot="tooltip-content"
        :as-child="props.asChild"
      >
        <slot />
      </ArkTooltip.Content>
    </ArkTooltip.Positioner>
  </Teleport>
</template>

<style src="./tooltip.css"></style>
