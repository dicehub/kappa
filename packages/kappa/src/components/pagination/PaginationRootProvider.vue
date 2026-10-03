<script setup lang="ts">
import { Pagination as ArkPagination } from "@ark-ui/vue/pagination";
import type {
  PaginationRootProviderProps,
  PaginationRootProviderSlots,
} from "./pagination";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PaginationRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<PaginationRootProviderSlots>();
</script>

<template>
  <ArkPagination.RootProvider
    v-bind="$attrs"
    class="kappa-pagination"
    data-slot="pagination"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkPagination.RootProvider>
</template>

<style src="./pagination.css"></style>
