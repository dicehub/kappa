<script setup lang="ts">
import { Pagination as ArkPagination } from "@ark-ui/vue/pagination";
import type { PaginationEmits, PaginationProps, PaginationRootSlots } from "./pagination";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PaginationProps>(), {
  asChild: undefined,
  count: undefined,
  defaultPage: undefined,
  defaultPageSize: undefined,
  getPageUrl: undefined,
  id: undefined,
  ids: undefined,
  page: undefined,
  pageSize: undefined,
  siblingCount: undefined,
  translations: undefined,
  type: undefined,
});

const emit = defineEmits<PaginationEmits>();
defineSlots<PaginationRootSlots>();
</script>

<template>
  <ArkPagination.Root
    v-bind="$attrs"
    class="kappa-pagination"
    data-slot="pagination"
    :as-child="props.asChild"
    :count="props.count"
    :default-page="props.defaultPage"
    :default-page-size="props.defaultPageSize"
    :get-page-url="props.getPageUrl"
    :id="props.id"
    :ids="props.ids"
    :page="props.page"
    :page-size="props.pageSize"
    :sibling-count="props.siblingCount"
    :translations="props.translations"
    :type="props.type"
    @page-change="emit('pageChange', $event)"
    @page-size-change="emit('pageSizeChange', $event)"
    @update:page="emit('update:page', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  >
    <slot />
  </ArkPagination.Root>
</template>

<style src="./pagination.css"></style>
