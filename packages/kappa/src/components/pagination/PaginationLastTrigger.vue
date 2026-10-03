<script setup lang="ts">
import { Pagination as ArkPagination } from "@ark-ui/vue/pagination";
import PaginationArrow from "./PaginationArrow.vue";
import type {
  PaginationLastTriggerProps,
  PaginationLastTriggerSlots,
} from "./pagination";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  asChild?: PaginationLastTriggerProps["asChild"];
  label?: string;
}>(), {
  asChild: undefined,
  label: undefined,
});

defineSlots<PaginationLastTriggerSlots>();
</script>

<template>
  <ArkPagination.LastTrigger
    v-bind="$attrs"
    class="kappa-pagination__last-trigger"
    data-slot="pagination-last-trigger"
    :data-icon-only="!props.label && !$slots.default ? '' : undefined"
    :as-child="props.asChild"
  >
    <slot>
      <span v-if="props.label">{{ props.label }}</span>
      <PaginationArrow double forward />
    </slot>
  </ArkPagination.LastTrigger>
</template>

<style src="./pagination.css"></style>
