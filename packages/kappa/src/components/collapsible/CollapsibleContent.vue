<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import type { CollapsibleContentProps, CollapsibleContentSlots } from "./collapsible";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CollapsibleContentProps>(), {
  asChild: undefined,
});

defineSlots<CollapsibleContentSlots>();
</script>

<template>
  <ArkCollapsible.Content
    v-bind="$attrs"
    class="kappa-collapsible__content"
    data-slot="collapsible-content"
    :as-child="props.asChild"
  >
    <div class="kappa-collapsible__content-body" data-slot="collapsible-content-body">
      <slot />
    </div>
  </ArkCollapsible.Content>
</template>
