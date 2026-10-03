<script setup lang="ts">
import { computed, useId } from "vue";
import type { ChartFrameProps, ChartFrameSlots } from "./chart-frame";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ChartFrameProps>(), {
  description: undefined,
  empty: false,
  emptyLabel: "No data available",
  error: undefined,
  height: "20rem",
  loading: false,
  loadingLabel: "Loading chart",
  title: undefined,
});
defineSlots<ChartFrameSlots>();

const generatedId = useId();
const titleId = computed(() => `${props.slotName}-${generatedId}-title`);
const descriptionId = computed(() => `${props.slotName}-${generatedId}-description`);
const state = computed(() =>
  props.error ? "error" : props.loading ? "loading" : props.empty ? "empty" : "ready",
);
const bodyHeight = computed(() =>
  typeof props.height === "number" ? `${props.height}px` : props.height,
);
const bodyStyle = computed(() => ({ "--kappa-chart-height": bodyHeight.value }));
</script>

<template>
  <figure
    v-bind="$attrs"
    class="kappa-chart-frame"
    :data-slot="props.slotName"
    :data-state="state"
    :aria-labelledby="props.title ? titleId : undefined"
    :aria-label="props.title ? undefined : props.accessibleLabel"
    :aria-describedby="descriptionId"
  >
    <header v-if="props.title || props.description || $slots.toolbar" class="kappa-chart-frame__header">
      <div class="kappa-chart-frame__heading">
        <h3 v-if="props.title" :id="titleId" class="kappa-chart-frame__title">{{ props.title }}</h3>
        <p v-if="props.description" class="kappa-chart-frame__description">{{ props.description }}</p>
      </div>
      <div v-if="$slots.toolbar" class="kappa-chart-frame__toolbar" data-slot="chart-toolbar">
        <slot name="toolbar" />
      </div>
    </header>

    <div class="kappa-chart-frame__body" :style="bodyStyle" :aria-busy="state === 'loading'">
      <div class="kappa-chart-frame__viewport" :aria-hidden="state === 'ready' ? undefined : 'true'">
        <slot :description-id="descriptionId" />
      </div>

      <div v-if="state !== 'ready'" class="kappa-chart-frame__state" :data-state="state">
        <template v-if="state === 'loading'">
          <slot name="loading">
            <span class="kappa-chart-frame__loader" aria-hidden="true" />
            <span role="status">{{ props.loadingLabel }}</span>
          </slot>
        </template>
        <template v-else-if="state === 'error'">
          <slot name="error" :error="props.error">
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M10 2.25 18 16H2L10 2.25Z" />
              <path d="M10 7v4.25M10 14v.1" />
            </svg>
            <span role="alert">{{ props.error }}</span>
          </slot>
        </template>
        <template v-else>
          <slot name="empty">
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M3 16.5h14M4.5 14V9.5h3V14h-3Zm4-7h3v7h-3V7Zm4-3h3V14h-3V4.5Z" />
            </svg>
            <span role="status">{{ props.emptyLabel }}</span>
          </slot>
        </template>
      </div>
    </div>

    <p :id="descriptionId" class="kappa-chart-frame__accessible-description">
      {{ props.accessibleDescription }}
    </p>
    <figcaption v-if="$slots.footer" class="kappa-chart-frame__footer">
      <slot name="footer" />
    </figcaption>
  </figure>
</template>

<style src="./chart-frame.css"></style>
