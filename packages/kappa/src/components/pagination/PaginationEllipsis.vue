<script setup lang="ts">
import { Pagination as ArkPagination } from "@ark-ui/vue/pagination";
import type { PaginationEllipsisProps, PaginationEllipsisSlots } from "./pagination";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PaginationEllipsisProps>(), {
  asChild: undefined,
});

defineSlots<PaginationEllipsisSlots>();
</script>

<template>
  <ArkPagination.Ellipsis
    v-bind="$attrs"
    class="kappa-pagination__ellipsis"
    data-slot="pagination-ellipsis"
    :as-child="props.asChild"
    :index="props.index"
  >
    <slot>…</slot>
  </ArkPagination.Ellipsis>
</template>

<style src="./pagination.css"></style>
