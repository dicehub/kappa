<script setup lang="ts">
import { Pagination as ArkPagination } from "@ark-ui/vue/pagination";
import type { PaginationContextSlots } from "./pagination";

defineSlots<PaginationContextSlots>();
</script>

<template>
  <ArkPagination.Context v-slot="context">
    <slot v-bind="context" />
  </ArkPagination.Context>
</template>
