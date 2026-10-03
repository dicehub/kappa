<script setup lang="ts">
import { computed } from "vue";
import {
  TABLE_DEFAULT_VARIANTS,
  resolveTableRowVariant,
  type TableRowProps,
  type TableRowSlots,
} from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableRowProps>(), {
  variant: TABLE_DEFAULT_VARIANTS.variant,
});

defineSlots<TableRowSlots>();

const resolvedVariant = computed(() => resolveTableRowVariant(props.variant));
</script>

<template>
  <tr
    v-bind="$attrs"
    class="kappa-table__row"
    data-slot="table-row"
    :data-variant="resolvedVariant"
  >
    <slot />
  </tr>
</template>
