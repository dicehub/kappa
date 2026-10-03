<script setup lang="ts">
import { computed } from "vue";
import LoaderGraphic from "./LoaderGraphic.vue";
import {
  LOADER_DEFAULT_DURATION,
  LOADER_DEFAULT_LABEL,
  LOADER_DEFAULT_SIZE,
  LOADER_DEFAULT_VARIANT,
  resolveLoaderDuration,
  resolveLoaderLabel,
  resolveLoaderSize,
  resolveLoaderVariant,
  type LoaderProps,
} from "./loader";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<LoaderProps>(), {
  decorative: false,
  duration: LOADER_DEFAULT_DURATION,
  label: LOADER_DEFAULT_LABEL,
  size: LOADER_DEFAULT_SIZE,
  variant: LOADER_DEFAULT_VARIANT,
});

const resolvedDuration = computed(() => resolveLoaderDuration(props.duration));
const resolvedLabel = computed(() => resolveLoaderLabel(props.label));
const resolvedSize = computed(() => resolveLoaderSize(props.size));
const resolvedVariant = computed(() => resolveLoaderVariant(props.variant));
const sizeStyle = computed(() => ({
  "--kappa-loader-duration": `${resolvedDuration.value}ms`,
  "--kappa-loader-duration-slow": `${resolvedDuration.value * 4}ms`,
  "--kappa-loader-half-duration": `${resolvedDuration.value / -2}ms`,
  "--kappa-loader-size": `${resolvedSize.value}px`,
}));
</script>

<template>
  <span
    v-bind="$attrs"
    class="kappa-loader"
    data-slot="loader"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
    :style="sizeStyle"
    :role="props.decorative ? undefined : 'status'"
    :aria-atomic="props.decorative ? undefined : 'true'"
    :aria-hidden="props.decorative ? 'true' : undefined"
    :aria-live="props.decorative ? undefined : 'polite'"
  >
    <LoaderGraphic :duration="resolvedDuration" :variant="resolvedVariant" />
    <span v-if="!props.decorative" class="kappa-loader__label">{{ resolvedLabel }}</span>
  </span>
</template>

<style src="./loader.css"></style>
