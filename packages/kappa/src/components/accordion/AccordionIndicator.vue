<script setup lang="ts">
import { Accordion as ArkAccordion } from "@ark-ui/vue/accordion";
import type { AccordionIndicatorSlots } from "./accordion";

defineOptions({ inheritAttrs: false });
defineSlots<AccordionIndicatorSlots>();
</script>

<template>
  <ArkAccordion.ItemIndicator
    v-bind="$attrs"
    class="kappa-accordion__indicator"
    data-slot="accordion-indicator"
  >
    <slot>
      <svg
        aria-hidden="true"
        class="kappa-accordion__indicator-icon"
        focusable="false"
        viewBox="0 0 16 16"
      >
        <path d="m3.75 5.75 4.25 4.25 4.25-4.25" />
      </svg>
    </slot>
  </ArkAccordion.ItemIndicator>
</template>
