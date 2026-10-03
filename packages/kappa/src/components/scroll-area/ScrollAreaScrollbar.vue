<script setup lang="ts">
import { ScrollArea as ArkScrollArea } from "@ark-ui/vue/scroll-area";
import {
  SCROLL_AREA_DEFAULT_ORIENTATION,
  type ScrollAreaScrollbarProps,
  type ScrollAreaScrollbarSlots,
} from "./scroll-area";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ScrollAreaScrollbarProps>(), {
  asChild: undefined,
  orientation: SCROLL_AREA_DEFAULT_ORIENTATION,
});

defineSlots<ScrollAreaScrollbarSlots>();
</script>

<template>
  <ArkScrollArea.Scrollbar
    v-bind="$attrs"
    class="kappa-scroll-area__scrollbar"
    data-slot="scroll-area-scrollbar"
    :as-child="props.asChild"
    :orientation="props.orientation"
  >
    <slot />
  </ArkScrollArea.Scrollbar>
</template>
