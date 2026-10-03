<script setup lang="ts">
import { computed } from "vue";
import {
  TABLE_DEFAULT_VARIANTS,
  resolveTableLayout,
  type TableRootProps,
  type TableRootSlots,
} from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableRootProps>(), {
  compact: TABLE_DEFAULT_VARIANTS.compact,
  layout: TABLE_DEFAULT_VARIANTS.layout,
});

defineSlots<TableRootSlots>();

const resolvedLayout = computed(() => resolveTableLayout(props.layout));
</script>

<template>
  <table
    v-bind="$attrs"
    class="kappa-table"
    data-slot="table"
    :data-compact="props.compact ? '' : undefined"
    :data-layout="resolvedLayout"
  >
    <slot />
  </table>
</template>

<style src="./table.css"></style>
