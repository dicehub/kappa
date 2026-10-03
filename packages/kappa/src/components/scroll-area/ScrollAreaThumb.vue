<script setup lang="ts">
import { ScrollArea as ArkScrollArea } from "@ark-ui/vue/scroll-area";
import type { ScrollAreaThumbProps, ScrollAreaThumbSlots } from "./scroll-area";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ScrollAreaThumbProps>(), {
  asChild: undefined,
});

defineSlots<ScrollAreaThumbSlots>();
</script>

<template>
  <ArkScrollArea.Thumb
    v-bind="$attrs"
    class="kappa-scroll-area__thumb"
    data-slot="scroll-area-thumb"
    :as-child="props.asChild"
  >
    <slot />
  </ArkScrollArea.Thumb>
</template>
