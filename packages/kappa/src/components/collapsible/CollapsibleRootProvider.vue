<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import type {
  CollapsibleRootProviderProps,
  CollapsibleRootProviderSlots,
} from "./collapsible";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CollapsibleRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<CollapsibleRootProviderSlots>();
</script>

<template>
  <ArkCollapsible.RootProvider
    v-bind="$attrs"
    class="kappa-collapsible"
    data-slot="collapsible"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkCollapsible.RootProvider>
</template>

<style src="./collapsible.css"></style>
