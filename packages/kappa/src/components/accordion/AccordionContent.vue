<script setup lang="ts">
import { Accordion as ArkAccordion } from "@ark-ui/vue/accordion";
import type { AccordionContentSlots } from "./accordion";

defineOptions({ inheritAttrs: false });
defineSlots<AccordionContentSlots>();
</script>

<template>
  <ArkAccordion.ItemContent
    v-bind="$attrs"
    class="kappa-accordion__content"
    data-slot="accordion-content"
  >
    <div class="kappa-accordion__content-body" data-slot="accordion-content-body">
      <slot />
    </div>
  </ArkAccordion.ItemContent>
</template>
