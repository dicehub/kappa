<script setup lang="ts">
import { ScrollArea as ArkScrollArea } from "@ark-ui/vue/scroll-area";
import type { ScrollAreaContentProps, ScrollAreaContentSlots } from "./scroll-area";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ScrollAreaContentProps>(), {
  asChild: undefined,
});

defineSlots<ScrollAreaContentSlots>();
</script>

<template>
  <ArkScrollArea.Content
    v-bind="$attrs"
    class="kappa-scroll-area__content"
    data-slot="scroll-area-content"
    :as-child="props.asChild"
  >
    <slot />
  </ArkScrollArea.Content>
</template>
