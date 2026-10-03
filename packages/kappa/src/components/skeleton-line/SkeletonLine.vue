<script setup lang="ts">
import { computed } from "vue";
import {
  SKELETON_LINE_DEFAULT_HEIGHT,
  SKELETON_LINE_DEFAULT_WIDTH,
  resolveSkeletonLineLength,
  type SkeletonLineProps,
} from "./skeleton-line";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SkeletonLineProps>(), {
  animated: true,
  blockHeight: undefined,
  height: undefined,
  width: undefined,
});

const resolvedBlockHeight = computed(() =>
  props.blockHeight === undefined
    ? undefined
    : resolveSkeletonLineLength(props.blockHeight, ""),
);

const lineStyle = computed<Record<string, string>>(() => ({
  ...(props.width === undefined
    ? {}
    : {
        "--kappa-skeleton-line-width": resolveSkeletonLineLength(
          props.width,
          SKELETON_LINE_DEFAULT_WIDTH,
        ),
      }),
  ...(props.height === undefined
    ? {}
    : {
        "--kappa-skeleton-line-height": resolveSkeletonLineLength(
          props.height,
          SKELETON_LINE_DEFAULT_HEIGHT,
        ),
      }),
}));

const blockStyle = computed(() => ({ blockSize: resolvedBlockHeight.value }));
</script>

<template>
  <span
    v-if="resolvedBlockHeight"
    class="kappa-skeleton-line__block"
    data-slot="skeleton-line-block"
    :style="blockStyle"
  >
    <span
      v-bind="$attrs"
      aria-hidden="true"
      class="kappa-skeleton-line"
      :data-animated="props.animated"
      data-slot="skeleton-line"
      :style="lineStyle"
    />
  </span>
  <span
    v-else
    v-bind="$attrs"
    aria-hidden="true"
    class="kappa-skeleton-line"
    :data-animated="props.animated"
    data-slot="skeleton-line"
    :style="lineStyle"
  />
</template>

<style src="./skeleton-line.css"></style>
