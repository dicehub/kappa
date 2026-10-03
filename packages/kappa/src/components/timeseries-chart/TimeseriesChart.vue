<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import Chart from "../chart/Chart.vue";
import type {
  ChartInstance,
  ChartOptions,
  ChartUpdateOptions,
} from "../chart";
import {
  createTimeseriesChartOptions,
  resolveTimeseriesUpdateOptions,
  type TimeseriesChartApi,
  type TimeseriesChartEmits,
  type TimeseriesChartProps,
  type TimeseriesChartSlots,
} from "./timeseries-chart";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimeseriesChartProps>(), {
  animation: true,
  curve: "linear",
  description: undefined,
  empty: false,
  emptyLabel: "No data available",
  error: undefined,
  events: undefined,
  height: "20rem",
  loading: false,
  loadingLabel: "Loading timeseries",
  locale: undefined,
  renderer: "canvas",
  revision: 0,
  showGrid: true,
  showLegend: true,
  timeZone: "local",
  title: undefined,
  tooltip: true,
  type: "line",
  updateOptions: undefined,
  xLabel: undefined,
  yLabel: undefined,
  yMax: undefined,
  yMin: undefined,
  yMinInterval: undefined,
});
const emit = defineEmits<TimeseriesChartEmits>();
defineSlots<TimeseriesChartSlots>();

type ChartHandle = {
  dispatchAction: ChartInstance["dispatchAction"];
  getInstance: () => ChartInstance | undefined;
  resize: () => void;
  setOption: (options: ChartOptions, settings?: ChartUpdateOptions) => void;
};

const chart = useTemplateRef<ChartHandle>("chart");
const reducedMotion = ref(false);
let motionQuery: MediaQueryList | undefined;

const updateMotionPreference = () => {
  reducedMotion.value = motionQuery?.matches ?? false;
};

onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  updateMotionPreference();
  motionQuery.addEventListener("change", updateMotionPreference);
});

onBeforeUnmount(() => motionQuery?.removeEventListener("change", updateMotionPreference));

const options = computed(() => {
  void props.revision;
  return createTimeseriesChartOptions({
    animation: props.animation,
    curve: props.curve,
    locale: props.locale,
    reducedMotion: reducedMotion.value,
    series: props.series,
    showGrid: props.showGrid,
    showLegend: props.showLegend,
    timeZone: props.timeZone,
    tooltip: props.tooltip,
    type: props.type,
    xLabel: props.xLabel,
    yLabel: props.yLabel,
    yMax: props.yMax,
    yMin: props.yMin,
    yMinInterval: props.yMinInterval,
  });
});

const updateOptions = computed<ChartUpdateOptions>(() => {
  return resolveTimeseriesUpdateOptions(props.updateOptions);
});

const dispatchAction: TimeseriesChartApi["dispatchAction"] = (payload) =>
  chart.value?.dispatchAction(payload);
const getInstance = () => chart.value?.getInstance();
const resize = () => chart.value?.resize();
const setOption = (nextOptions: ChartOptions, settings?: ChartUpdateOptions) =>
  chart.value?.setOption(nextOptions, settings);

defineExpose<TimeseriesChartApi>({ dispatchAction, getInstance, resize, setOption });
</script>

<template>
  <Chart
    ref="chart"
    v-bind="$attrs"
    class="kappa-timeseries-chart"
    data-timeseries-chart=""
    :ariaLabel="props.ariaLabel"
    :ariaDescription="props.ariaDescription"
    :description="props.description"
    :empty="props.empty"
    :empty-label="props.emptyLabel"
    :engine="props.engine"
    :error="props.error"
    :events="props.events"
    :height="props.height"
    :loading="props.loading"
    :loading-label="props.loadingLabel"
    :options="options"
    :renderer="props.renderer"
    :revision="props.revision"
    :title="props.title"
    :update-options="updateOptions"
    @error="emit('error', $event)"
    @ready="emit('ready', $event)"
  >
    <template v-if="$slots.toolbar" #toolbar><slot name="toolbar" /></template>
    <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    <template v-if="$slots.empty" #empty><slot name="empty" /></template>
    <template v-if="$slots.error" #error="slotProps"><slot name="error" v-bind="slotProps" /></template>
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </Chart>
</template>

<style src="./timeseries-chart.css"></style>
