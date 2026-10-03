<script setup lang="ts">
import { Pagination as ArkPagination } from "@ark-ui/vue/pagination";
import type { PaginationItemProps, PaginationItemSlots } from "./pagination";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PaginationItemProps>(), {
  asChild: undefined,
});

defineSlots<PaginationItemSlots>();
</script>

<template>
  <ArkPagination.Item
    v-bind="$attrs"
    class="kappa-pagination__item"
    data-slot="pagination-item"
    :as-child="props.asChild"
    :type="props.type"
    :value="props.value"
  >
    <slot />
  </ArkPagination.Item>
</template>

<style src="./pagination.css"></style>
