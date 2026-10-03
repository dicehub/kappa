<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import { computed, useAttrs } from "vue";
import type { SelectTriggerProps, SelectTriggerSlots } from "./select";
import { useKappaSelectContext } from "./select-context";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectTriggerProps>(), {
  asChild: undefined,
});

defineSlots<SelectTriggerSlots>();

const attrs = useAttrs();
const context = useKappaSelectContext();
const rawAttrs = attrs as Record<string, unknown>;
const forwardedAttrs = computed(() => {
  const next = { ...rawAttrs };
  if (typeof next["aria-describedby"] !== "string") {
    next["aria-describedby"] = context?.describedBy.value;
  }
  if (typeof next["aria-label"] !== "string") {
    next["aria-label"] = context?.ariaLabel.value;
  }
  return next;
});
</script>

<template>
  <ArkSelect.Trigger
    v-bind="forwardedAttrs"
    class="kappa-select__trigger"
    data-slot="select-trigger"
    :as-child="asChild"
  >
    <slot />
  </ArkSelect.Trigger>
</template>

<style src="./select.css"></style>
