<script setup lang="ts">
import { computed } from "vue";
import {
  TABLE_DEFAULT_HEADER_VARIANT,
  isTableHeaderVariant,
  type TableHeaderProps,
  type TableHeaderSlots,
} from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableHeaderProps>(), {
  sticky: false,
  variant: TABLE_DEFAULT_HEADER_VARIANT,
});

defineSlots<TableHeaderSlots>();

const resolvedVariant = computed(() =>
  isTableHeaderVariant(props.variant) ? props.variant : TABLE_DEFAULT_HEADER_VARIANT,
);
</script>

<template>
  <thead
    v-bind="$attrs"
    class="kappa-table__header"
    data-slot="table-header"
    :data-variant="resolvedVariant"
    :data-compact="resolvedVariant === 'compact' ? '' : undefined"
    :data-sticky="props.sticky ? '' : undefined"
  >
    <slot />
  </thead>
</template>
