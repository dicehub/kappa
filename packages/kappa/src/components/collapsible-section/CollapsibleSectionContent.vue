<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import type {
  CollapsibleSectionContentProps,
  CollapsibleSectionContentSlots,
} from "./collapsible-section";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CollapsibleSectionContentProps>(), {
  asChild: undefined,
});

defineSlots<CollapsibleSectionContentSlots>();
</script>

<template>
  <ArkCollapsible.Content
    v-bind="$attrs"
    class="kappa-collapsible-section__content"
    data-slot="collapsible-section-content"
    :as-child="props.asChild"
  >
    <div
      v-if="!props.asChild"
      class="kappa-collapsible-section__content-body"
      data-slot="collapsible-section-content-body"
    >
      <slot />
    </div>
    <slot v-else />
  </ArkCollapsible.Content>
</template>
