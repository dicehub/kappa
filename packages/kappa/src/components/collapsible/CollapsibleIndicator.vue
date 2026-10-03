<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import type { CollapsibleIndicatorProps, CollapsibleIndicatorSlots } from "./collapsible";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CollapsibleIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<CollapsibleIndicatorSlots>();
</script>

<template>
  <ArkCollapsible.Indicator
    v-bind="$attrs"
    class="kappa-collapsible__indicator"
    data-slot="collapsible-indicator"
    :as-child="props.asChild"
  >
    <slot>
      <svg
        aria-hidden="true"
        class="kappa-collapsible__indicator-icon"
        focusable="false"
        viewBox="0 0 16 16"
      >
        <path d="m5.75 3.75 4.25 4.25-4.25 4.25" />
      </svg>
    </slot>
  </ArkCollapsible.Indicator>
</template>
