<script setup lang="ts">
import { Pagination as ArkPagination } from "@ark-ui/vue/pagination";
import PaginationArrow from "./PaginationArrow.vue";
import type {
  PaginationFirstTriggerProps,
  PaginationFirstTriggerSlots,
} from "./pagination";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  asChild?: PaginationFirstTriggerProps["asChild"];
  label?: string;
}>(), {
  asChild: undefined,
  label: undefined,
});

defineSlots<PaginationFirstTriggerSlots>();
</script>

<template>
  <ArkPagination.FirstTrigger
    v-bind="$attrs"
    class="kappa-pagination__first-trigger"
    data-slot="pagination-first-trigger"
    :data-icon-only="!props.label && !$slots.default ? '' : undefined"
    :as-child="props.asChild"
  >
    <slot>
      <PaginationArrow double />
      <span v-if="props.label">{{ props.label }}</span>
    </slot>
  </ArkPagination.FirstTrigger>
</template>

<style src="./pagination.css"></style>
