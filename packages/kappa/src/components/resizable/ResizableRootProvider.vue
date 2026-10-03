<script setup lang="ts">
import { Splitter as ArkSplitter } from "@ark-ui/vue/splitter";
import type {
  ResizableRootProviderProps,
  ResizableRootProviderSlots,
} from "./resizable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ResizableRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<ResizableRootProviderSlots>();
</script>

<template>
  <ArkSplitter.RootProvider
    v-bind="$attrs"
    class="kappa-resizable"
    data-slot="resizable"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkSplitter.RootProvider>
</template>

<style src="./resizable.css"></style>
