<script setup lang="ts">
import { usePaginationContext } from "@ark-ui/vue/pagination";
import { ref, watch } from "vue";
import PaginationFirstTrigger from "./PaginationFirstTrigger.vue";
import PaginationPrevTrigger from "./PaginationPrevTrigger.vue";
import PaginationNextTrigger from "./PaginationNextTrigger.vue";
import PaginationLastTrigger from "./PaginationLastTrigger.vue";
import { resolvePaginationControlLabel } from "./pagination";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{
  controls?: "full" | "simple";
  showLabels?: boolean;
  pageLabel?: string;
}>(), {
  controls: "full",
  showLabels: false,
  pageLabel: "Page number",
});
const pagination = usePaginationContext();
const draft = ref(String(pagination.value.page));
watch(() => pagination.value.page, (page) => { draft.value = String(page); });

const restore = () => { draft.value = String(pagination.value.page); };
const commit = () => {
  const value = Number(draft.value);
  if (draft.value.trim() && Number.isSafeInteger(value)) {
    const page = Math.max(1, Math.min(value, Math.max(1, pagination.value.totalPages)));
    if (page !== pagination.value.page) pagination.value.setPage(page);
  }
  restore();
};
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-pagination__controls"
    data-slot="pagination-controls"
    :data-controls="props.controls"
  >
    <PaginationFirstTrigger
      v-if="props.controls === 'full'"
      :label="props.showLabels ? resolvePaginationControlLabel(pagination.getFirstTriggerProps()['aria-label']) : undefined"
    />
    <PaginationPrevTrigger :label="props.showLabels ? resolvePaginationControlLabel(pagination.getPrevTriggerProps()['aria-label']) : undefined" />
    <input
      v-if="props.controls === 'full'"
      v-model="draft"
      class="kappa-pagination__page-input"
      data-slot="pagination-page-input"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      :aria-label="props.pageLabel"
      :disabled="pagination.totalPages === 0"
      @blur="commit"
      @keydown.enter.prevent="commit"
      @keydown.esc.prevent="restore"
    />
    <PaginationNextTrigger :label="props.showLabels ? resolvePaginationControlLabel(pagination.getNextTriggerProps()['aria-label']) : undefined" />
    <PaginationLastTrigger
      v-if="props.controls === 'full'"
      :label="props.showLabels ? resolvePaginationControlLabel(pagination.getLastTriggerProps()['aria-label']) : undefined"
    />
  </div>
</template>

<style src="./pagination-controls.css"></style>
