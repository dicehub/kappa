<script setup lang="ts">
import { ScrollArea as ArkScrollArea } from "@ark-ui/vue/scroll-area";
import type { ScrollAreaViewportProps, ScrollAreaViewportSlots } from "./scroll-area";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ScrollAreaViewportProps>(), {
  asChild: undefined,
});

defineSlots<ScrollAreaViewportSlots>();
</script>

<template>
  <ArkScrollArea.Viewport
    v-bind="$attrs"
    class="kappa-scroll-area__viewport"
    data-slot="scroll-area-viewport"
    :as-child="props.asChild"
  >
    <slot />
  </ArkScrollArea.Viewport>
</template>
