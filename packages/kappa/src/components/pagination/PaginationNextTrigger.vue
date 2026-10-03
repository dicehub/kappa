<script setup lang="ts">
import { Pagination as ArkPagination } from "@ark-ui/vue/pagination";
import PaginationArrow from "./PaginationArrow.vue";
import type {
  PaginationNextTriggerProps,
  PaginationNextTriggerSlots,
} from "./pagination";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  asChild?: PaginationNextTriggerProps["asChild"];
  label?: string;
}>(), {
  asChild: undefined,
  label: undefined,
});

defineSlots<PaginationNextTriggerSlots>();
</script>

<template>
  <ArkPagination.NextTrigger
    v-bind="$attrs"
    class="kappa-pagination__next-trigger"
    data-slot="pagination-next-trigger"
    :data-icon-only="!props.label && !$slots.default ? '' : undefined"
    :as-child="props.asChild"
  >
    <slot>
      <span v-if="props.label">{{ props.label }}</span>
      <PaginationArrow forward />
    </slot>
  </ArkPagination.NextTrigger>
</template>

<style src="./pagination.css"></style>
