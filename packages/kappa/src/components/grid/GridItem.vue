<script setup lang="ts">
import { computed, inject } from "vue";
import {
  GRID_CONTEXT,
  GRID_ITEM_DEFAULT_ELEMENT,
  resolveGridItemElement,
  type GridItemProps,
  type GridItemSlots,
} from "./grid";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<GridItemProps>(), {
  as: GRID_ITEM_DEFAULT_ELEMENT,
});

defineSlots<GridItemSlots>();

const grid = inject(GRID_CONTEXT, undefined);
const resolvedElement = computed(() => resolveGridItemElement(props.as));
const hasMobileDivider = computed(
  () => grid?.mobileDivider.value === true && grid.variant.value === "4up",
);
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-grid__item"
    :class="hasMobileDivider && 'kappa-grid__item--mobile-divider'"
    data-slot="grid-item"
    :data-mobile-divider="hasMobileDivider ? '' : undefined"
  >
    <slot />
  </component>
</template>

<style src="./grid.css"></style>
