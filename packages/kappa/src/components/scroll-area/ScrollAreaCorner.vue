<script setup lang="ts">
import { ScrollArea as ArkScrollArea } from "@ark-ui/vue/scroll-area";
import type { ScrollAreaCornerProps, ScrollAreaCornerSlots } from "./scroll-area";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ScrollAreaCornerProps>(), {
  asChild: undefined,
});

defineSlots<ScrollAreaCornerSlots>();
</script>

<template>
  <ArkScrollArea.Corner
    v-bind="$attrs"
    class="kappa-scroll-area__corner"
    data-slot="scroll-area-corner"
    :as-child="props.asChild"
  >
    <slot />
  </ArkScrollArea.Corner>
</template>
