<script setup lang="ts">
import { computed, provide } from "vue";
import {
  GRID_CONTEXT,
  GRID_DEFAULT_GAP,
  GRID_ROOT_DEFAULT_ELEMENT,
  resolveGridGap,
  resolveGridRootElement,
  resolveGridVariant,
  type GridRootProps,
  type GridRootSlots,
} from "./grid";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<GridRootProps>(), {
  as: GRID_ROOT_DEFAULT_ELEMENT,
  gap: GRID_DEFAULT_GAP,
  mobileDivider: false,
});

defineSlots<GridRootSlots>();

const resolvedElement = computed(() => resolveGridRootElement(props.as));
const resolvedGap = computed(() => resolveGridGap(props.gap));
const resolvedVariant = computed(() => resolveGridVariant(props.variant));
const resolvedMobileDivider = computed(() => Boolean(props.mobileDivider));

provide(GRID_CONTEXT, {
  mobileDivider: resolvedMobileDivider,
  variant: resolvedVariant,
});

const classes = computed(() => [
  "kappa-grid",
  `kappa-grid--gap-${resolvedGap.value}`,
  resolvedVariant.value ? `kappa-grid--${resolvedVariant.value}` : undefined,
]);
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    :class="classes"
    data-slot="grid"
    :data-gap="resolvedGap"
    :data-variant="resolvedVariant"
    :data-mobile-divider="resolvedMobileDivider ? '' : undefined"
  >
    <slot />
  </component>
</template>

<style src="./grid.css"></style>
