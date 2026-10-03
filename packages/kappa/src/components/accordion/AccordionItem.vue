<script setup lang="ts">
import { Accordion as ArkAccordion } from "@ark-ui/vue/accordion";
import type { AccordionItemProps, AccordionItemSlots } from "./accordion";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<AccordionItemProps>(), {
  asChild: undefined,
  disabled: undefined,
});

defineSlots<AccordionItemSlots>();
</script>

<template>
  <ArkAccordion.Item
    v-bind="$attrs"
    class="kappa-accordion__item"
    data-slot="accordion-item"
    :as-child="asChild"
    :disabled="disabled"
    :value="value"
  >
    <slot />
  </ArkAccordion.Item>
</template>
