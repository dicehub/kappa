<script setup lang="ts">
import { computed } from "vue";
import {
  MATRIX_LOADER_DEFAULT_DURATION,
  MATRIX_LOADER_DEFAULT_LABEL,
  MATRIX_LOADER_DEFAULT_MOTION,
  MATRIX_LOADER_DEFAULT_SHAPE,
  MATRIX_LOADER_DEFAULT_SIZE,
  createMatrixLoaderDots,
  resolveMatrixLoaderDuration,
  resolveMatrixLoaderLabel,
  resolveMatrixLoaderMotion,
  resolveMatrixLoaderShape,
  resolveMatrixLoaderSize,
  type MatrixLoaderProps,
} from "./matrix-loader";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MatrixLoaderProps>(), {
  decorative: false,
  duration: MATRIX_LOADER_DEFAULT_DURATION,
  label: MATRIX_LOADER_DEFAULT_LABEL,
  motion: MATRIX_LOADER_DEFAULT_MOTION,
  shape: MATRIX_LOADER_DEFAULT_SHAPE,
  size: MATRIX_LOADER_DEFAULT_SIZE,
});

const resolvedDuration = computed(() => resolveMatrixLoaderDuration(props.duration));
const resolvedLabel = computed(() => resolveMatrixLoaderLabel(props.label));
const resolvedMotion = computed(() => resolveMatrixLoaderMotion(props.motion));
const resolvedShape = computed(() => resolveMatrixLoaderShape(props.shape));
const resolvedSize = computed(() => resolveMatrixLoaderSize(props.size));
const dots = computed(() => createMatrixLoaderDots(resolvedShape.value, resolvedMotion.value));

const rootStyle = computed<Record<string, string>>(() => ({
  "--kappa-matrix-loader-duration": `${resolvedDuration.value}ms`,
  "--kappa-matrix-loader-size": `${resolvedSize.value}px`,
}));

const dotStyle = (phase: number): Record<string, string> => ({
  "--kappa-matrix-loader-delay": `${Math.round(-phase * resolvedDuration.value)}ms`,
});
</script>

<template>
  <span
    v-bind="$attrs"
    class="kappa-matrix-loader"
    :data-motion="resolvedMotion"
    :data-shape="resolvedShape"
    :data-size="resolvedSize"
    data-slot="matrix-loader"
    :style="rootStyle"
    :role="props.decorative ? undefined : 'status'"
    :aria-atomic="props.decorative ? undefined : 'true'"
    :aria-hidden="props.decorative ? 'true' : undefined"
    :aria-live="props.decorative ? undefined : 'polite'"
  >
    <span
      v-for="dot in dots"
      :key="dot.index"
      aria-hidden="true"
      class="kappa-matrix-loader__dot"
      :data-column="dot.column"
      :data-hidden="dot.visible ? undefined : ''"
      :data-row="dot.row"
      data-slot="matrix-loader-dot"
      :style="dotStyle(dot.phase)"
    />
    <span v-if="!props.decorative" class="kappa-matrix-loader__label">{{ resolvedLabel }}</span>
  </span>
</template>

<style src="./matrix-loader.css"></style>
