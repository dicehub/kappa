<script setup lang="ts">
import { ScrollArea as ArkScrollArea } from "@ark-ui/vue/scroll-area";
import type {
  ScrollAreaRootProviderProps,
  ScrollAreaRootProviderSlots,
} from "./scroll-area";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ScrollAreaRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<ScrollAreaRootProviderSlots>();
</script>

<template>
  <ArkScrollArea.RootProvider
    v-bind="$attrs"
    class="kappa-scroll-area"
    data-slot="scroll-area"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkScrollArea.RootProvider>
</template>

<style src="./scroll-area.css"></style>
