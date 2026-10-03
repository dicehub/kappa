<script setup lang="ts">
import { computed, useAttrs } from "vue";
import type {
  TableResizeHandleProps,
  TableResizeHandleSlots,
} from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableResizeHandleProps>(), {
  label: undefined,
});

defineSlots<TableResizeHandleSlots>();

const attrs = useAttrs();
const resolvedLabel = computed(() => {
  if (props.label) return props.label;
  return typeof attrs["aria-label"] === "string" ? attrs["aria-label"] : "Resize column";
});
const forwardedAttrs = computed(() => {
  const { "aria-label": _ariaLabel, ...rest } = attrs;
  return rest;
});
</script>

<template>
  <button
    v-bind="forwardedAttrs"
    type="button"
    class="kappa-table__resize-handle"
    data-slot="table-resize-handle"
    :aria-label="resolvedLabel"
  >
    <span class="kappa-table__resize-bar" aria-hidden="true" />
    <slot />
  </button>
</template>
