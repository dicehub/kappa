<script setup lang="ts">
import { Accordion as ArkAccordion } from "@ark-ui/vue/accordion";
import AccordionIndicator from "./AccordionIndicator.vue";
import type { AccordionTriggerSlots } from "./accordion";

defineOptions({ inheritAttrs: false });
defineSlots<AccordionTriggerSlots>();

const triggerSelector = '[data-slot="accordion-trigger"]:not(:disabled)';

const handleDirectionalKeydown = (event: KeyboardEvent) => {
  const trigger = event.currentTarget as HTMLElement | null;
  const root = trigger?.closest<HTMLElement>('[data-slot="accordion"]');
  if (!trigger || !root) return;

  const orientation = root.dataset.orientation ?? "vertical";
  const direction = getComputedStyle(root).direction;
  const isNext =
    (orientation === "vertical" && event.key === "ArrowDown") ||
    (orientation === "horizontal" &&
      ((direction === "rtl" && event.key === "ArrowLeft") ||
        (direction !== "rtl" && event.key === "ArrowRight")));
  const isPrevious =
    (orientation === "vertical" && event.key === "ArrowUp") ||
    (orientation === "horizontal" &&
      ((direction === "rtl" && event.key === "ArrowRight") ||
        (direction !== "rtl" && event.key === "ArrowLeft")));

  if (!isNext && !isPrevious && event.key !== "Home" && event.key !== "End") return;

  const triggers = Array.from(root.querySelectorAll<HTMLElement>(triggerSelector)).filter(
    (candidate) => candidate.closest('[data-slot="accordion"]') === root,
  );
  if (triggers.length === 0) return;

  const currentIndex = triggers.indexOf(trigger);
  let nextIndex = currentIndex;
  if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = triggers.length - 1;
  else if (isNext) nextIndex = (currentIndex + 1 + triggers.length) % triggers.length;
  else if (isPrevious) nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;

  event.preventDefault();
  triggers[nextIndex]?.focus();
};
</script>

<template>
  <ArkAccordion.ItemTrigger
    v-bind="$attrs"
    class="kappa-accordion__trigger"
    data-slot="accordion-trigger"
    @keydown.capture="handleDirectionalKeydown"
  >
    <slot />
    <slot name="indicator">
      <AccordionIndicator />
    </slot>
  </ArkAccordion.ItemTrigger>
</template>
