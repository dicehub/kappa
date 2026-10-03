<script setup lang="ts">
import { Pagination as ArkPagination } from "@ark-ui/vue/pagination";
import PaginationArrow from "./PaginationArrow.vue";
import type {
  PaginationPrevTriggerProps,
  PaginationPrevTriggerSlots,
} from "./pagination";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  asChild?: PaginationPrevTriggerProps["asChild"];
  label?: string;
}>(), {
  asChild: undefined,
  label: undefined,
});

defineSlots<PaginationPrevTriggerSlots>();
</script>

<template>
  <ArkPagination.PrevTrigger
    v-bind="$attrs"
    class="kappa-pagination__prev-trigger"
    data-slot="pagination-prev-trigger"
    :data-icon-only="!props.label && !$slots.default ? '' : undefined"
    :as-child="props.asChild"
  >
    <slot>
      <PaginationArrow />
      <span v-if="props.label">{{ props.label }}</span>
    </slot>
  </ArkPagination.PrevTrigger>
</template>

<style src="./pagination.css"></style>
