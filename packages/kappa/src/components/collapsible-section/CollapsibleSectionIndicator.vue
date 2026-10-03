<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import type {
  CollapsibleSectionIndicatorProps,
  CollapsibleSectionIndicatorSlots,
} from "./collapsible-section";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CollapsibleSectionIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<CollapsibleSectionIndicatorSlots>();
</script>

<template>
  <ArkCollapsible.Indicator
    v-bind="$attrs"
    class="kappa-collapsible-section__indicator"
    data-slot="collapsible-section-indicator"
    :as-child="props.asChild"
  >
    <slot>
      <svg
        aria-hidden="true"
        class="kappa-collapsible-section__indicator-icon"
        focusable="false"
        viewBox="0 0 16 16"
      >
        <path d="m5.75 3.75 4.25 4.25-4.25 4.25" />
      </svg>
    </slot>
  </ArkCollapsible.Indicator>
</template>
