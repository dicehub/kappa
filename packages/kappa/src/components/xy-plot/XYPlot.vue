<script setup lang="ts">
import uPlot from "uplot";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from "vue";
import ChartFrame from "../../internal/chart/ChartFrame.vue";
import {
  observeKappaChartTheme,
  readKappaChartTheme,
  type KappaChartTheme,
} from "../../internal/chart/chart-theme";
import {
  appendXYPlotData,
  countXYPlotPoints,
  formatXYPlotValue,
  resolveXYPlotMaxPoints,
  validateXYPlotData,
  xyPlotErrorMessage,
  type XYPlotAppendOptions,
  type XYPlotData,
  type XYPlotEmits,
  type XYPlotInstance,
  type XYPlotProps,
  type XYPlotSeries,
  type XYPlotSlots,
} from "./xy-plot";
import { createXYPlotPathBuilder } from "./xy-plot-paths";
import { createXYPlotWheelPlugin, zoomXYPlotScale } from "./xy-plot-wheel";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<XYPlotProps>(), {
  description: undefined,
  empty: false,
  emptyLabel: "No data available",
  error: undefined,
  height: "20rem",
  loading: false,
  loadingLabel: "Loading plot",
  nativeOptions: undefined,
  revision: 0,
  showLegend: true,
  showReset: true,
  title: undefined,
  wheelZoom: true,
  xLabel: undefined,
  xScale: "linear",
  yLabel: undefined,
  yScale: "linear",
  zoom: "xy",
});
const emit = defineEmits<XYPlotEmits>();
defineSlots<XYPlotSlots>();

const plotElement = ref<HTMLDivElement>();
const instance = shallowRef<XYPlotInstance>();
const internalError = ref<string>();
const currentPointCount = ref(countXYPlotPoints(props.data));
let currentData: XYPlotData = props.data;
let resizeObserver: ResizeObserver | undefined;
let stopThemeObserver: (() => void) | undefined;
let resizeFrame = 0;
let themeFrame = 0;
let appendFrame = 0;
let appendLimit = 0;
let appendQueue: XYPlotData[] = [];

const dataError = computed(() => validateXYPlotData(props.data, props.series.length));
const visibleError = computed(() => props.error ?? internalError.value ?? dataError.value);
const isEmpty = computed(() => props.empty || currentPointCount.value === 0);
const canInitialize = computed(
  () => !props.loading && !isEmpty.value && !props.error && !dataError.value,
);

const reportError = (error: unknown) => {
  internalError.value = xyPlotErrorMessage(error);
  emit("error", error);
};

const seriesOptions = (series: XYPlotSeries, index: number, theme: KappaChartTheme): uPlot.Series => {
  const color = series.color ?? theme.palette[index % theme.palette.length]!;
  const options: uPlot.Series = {
    label: series.label,
    show: series.show ?? true,
    scale: series.scale ?? "y",
    spanGaps: series.spanGaps ?? false,
    width: series.path === "points" ? 0 : (series.width ?? 1.5),
    stroke: color,
    points: {
      show: series.path === "points" || series.points === true,
      size: series.path === "points" ? 4 : 3,
      fill: color,
      stroke: color,
    },
    value: (_plot, value) =>
      value == null ? "—" : (series.valueFormatter?.(value) ?? formatXYPlotValue(value)),
  };
  const paths = createXYPlotPathBuilder(series.path);
  if (paths) options.paths = paths;
  if (series.fill) options.fill = series.fill;
  else if (series.path === "bars") options.fill = color;
  if (series.dash) options.dash = series.dash;
  return options;
};

const defaultAxes = (theme: KappaChartTheme): uPlot.Axis[] => {
  const font = `11px ${theme.fontFamily}`;
  const labelFont = `600 11px ${theme.fontFamily}`;
  const base = {
    font,
    labelFont,
    stroke: theme.muted,
    grid: { stroke: theme.grid, width: 1 },
    ticks: { stroke: theme.grid, width: 1, size: 4 },
    border: { stroke: theme.grid, width: 1 },
  } satisfies uPlot.Axis;

  const xAxis: uPlot.Axis = {
    ...base,
    label: props.xLabel,
    labelGap: 5,
    labelSize: props.xLabel ? 18 : 0,
  };
  if (props.xScale !== "time") {
    xAxis.values = (_plot, values) => values.map(formatXYPlotValue);
  }

  return [
    xAxis,
    {
      ...base,
      label: props.yLabel,
      labelGap: 5,
      labelSize: props.yLabel ? 18 : 0,
      size: 58,
      values: (_plot, values) => values.map(formatXYPlotValue),
    },
  ];
};

const plotSize = () => {
  const element = plotElement.value;
  const width = Math.max(1, Math.floor(element?.clientWidth ?? 640));
  const legend = instance.value?.root.querySelector<HTMLElement>(".u-legend");
  const legendHeight = props.showLegend ? (legend?.offsetHeight ?? 36) : 0;
  const height = Math.max(120, Math.floor((element?.clientHeight ?? 320) - legendHeight));
  return { width, height };
};

const buildOptions = (theme: KappaChartTheme): uPlot.Options => {
  const native = props.nativeOptions ?? {};
  const plugins = [...(native.plugins ?? [])];
  if (props.wheelZoom && props.zoom !== "none") {
    plugins.push(createXYPlotWheelPlugin(props.zoom));
  }

  return {
    ...native,
    ...plotSize(),
    plugins,
    scales: {
      x: { time: props.xScale === "time" },
      y: props.yScale === "log" ? { distr: 3, log: 10 } : { distr: 1 },
      ...native.scales,
    },
    axes: native.axes ?? defaultAxes(theme),
    cursor: {
      show: true,
      focus: { prox: 24 },
      drag: {
        setScale: props.zoom !== "none",
        x: props.zoom !== "none",
        y: props.zoom === "xy",
        dist: 4,
      },
      ...native.cursor,
    },
    legend: {
      show: props.showLegend,
      live: true,
      isolate: false,
      ...native.legend,
    },
    series: [
      {
        label: props.xLabel ?? (props.xScale === "time" ? "Time" : "X"),
        value:
          props.xScale === "time"
            ? "{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}"
            : (_plot, value) => (value == null ? "—" : formatXYPlotValue(value)),
      },
      ...props.series.map((series, index) => seriesOptions(series, index, theme)),
    ],
  };
};

const dispose = () => {
  instance.value?.destroy();
  instance.value = undefined;
};

const resize = () => {
  if (!instance.value) return;
  const size = plotSize();
  if (size.width > 0 && size.height > 0) instance.value.setSize(size);
};

const scheduleResize = () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(resize);
};

const initialize = async () => {
  await nextTick();
  const element = plotElement.value;
  if (!element || !canInitialize.value) return;
  dispose();
  try {
    const error = validateXYPlotData(currentData, props.series.length);
    if (error) throw new RangeError(error);
    instance.value = new uPlot(buildOptions(readKappaChartTheme(element)), currentData, element);
    internalError.value = undefined;
    nextTick(resize);
    emit("ready", instance.value);
  } catch (error) {
    dispose();
    reportError(error);
  }
};

const scheduleThemeRefresh = () => {
  cancelAnimationFrame(themeFrame);
  themeFrame = requestAnimationFrame(() => void initialize());
};

const setData = (data: XYPlotData, resetScales = false) => {
  const error = validateXYPlotData(data, props.series.length);
  if (error) throw new RangeError(error);
  currentData = data;
  currentPointCount.value = countXYPlotPoints(data);
  instance.value?.setData(data, resetScales);
};

const flushAppend = () => {
  appendFrame = 0;
  if (appendQueue.length === 0) return;
  try {
    const columns = currentData.map((_column, index) =>
      appendQueue.flatMap((chunk) => Array.from(chunk[index] ?? [])),
    ) as XYPlotData;
    appendQueue = [];
    setData(appendXYPlotData(currentData, columns, appendLimit), false);
  } catch (error) {
    appendQueue = [];
    reportError(error);
  }
};

const append = (data: XYPlotData, options: XYPlotAppendOptions = {}) => {
  const error = validateXYPlotData(data, props.series.length);
  if (error) throw new RangeError(error);
  appendLimit = resolveXYPlotMaxPoints(options.maxPoints);
  appendQueue.push(data);
  if (!appendFrame) appendFrame = requestAnimationFrame(flushAppend);
};

const resetZoom = () => instance.value?.setData(currentData, true);
const getInstance = () => instance.value;
const batch = (callback: (plot: XYPlotInstance) => void) => {
  if (instance.value) instance.value.batch(() => callback(instance.value!));
};
const setScale = (key: string, limits: { min: number; max: number }) =>
  instance.value?.setScale(key, limits);

const handleKeydown = (event: KeyboardEvent) => {
  const plot = instance.value;
  if (!plot || props.zoom === "none") return;
  if (event.key === "0" || event.key === "Home") {
    event.preventDefault();
    resetZoom();
    return;
  }
  if (!["+", "=", "-", "_"].includes(event.key)) return;
  const scaleKey = props.zoom === "xy" && event.shiftKey ? "y" : "x";
  const position = scaleKey === "x" ? plot.bbox.width / 2 : plot.bbox.height / 2;
  const factor = event.key === "+" || event.key === "=" ? 0.8 : 1.25;
  if (zoomXYPlotScale(plot, scaleKey, position, factor)) event.preventDefault();
};

onMounted(() => {
  void initialize();
  const element = plotElement.value;
  if (!element) return;
  resizeObserver = new ResizeObserver(scheduleResize);
  resizeObserver.observe(element);
  stopThemeObserver = observeKappaChartTheme(element, scheduleThemeRefresh);
});

watch(() => [props.data, props.revision], () => {
  const wasReady = canInitialize.value;
  appendQueue = [];
  if (appendFrame) cancelAnimationFrame(appendFrame);
  appendFrame = 0;
  try {
    setData(props.data, false);
    internalError.value = undefined;
    if (!instance.value && wasReady) void initialize();
  } catch (error) {
    reportError(error);
  }
});
watch(
  () => [
    props.series,
    props.nativeOptions,
    props.showLegend,
    props.wheelZoom,
    props.xLabel,
    props.xScale,
    props.yLabel,
    props.yScale,
    props.zoom,
  ],
  () => void initialize(),
);
watch(canInitialize, (ready) => {
  if (ready) void initialize();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(appendFrame);
  cancelAnimationFrame(resizeFrame);
  cancelAnimationFrame(themeFrame);
  resizeObserver?.disconnect();
  stopThemeObserver?.();
  dispose();
});

defineExpose({ append, batch, flush: flushAppend, getInstance, resetZoom, resize, setData, setScale });
</script>

<template>
  <ChartFrame
    v-bind="$attrs"
    :accessible-description="props.ariaDescription"
    :accessible-label="props.ariaLabel"
    :description="props.description"
    :empty="isEmpty"
    :empty-label="props.emptyLabel"
    :error="visibleError"
    :height="props.height"
    :loading="props.loading"
    :loading-label="props.loadingLabel"
    slot-name="xy-plot"
    :title="props.title"
  >
    <template #default="{ descriptionId }">
      <div
        ref="plotElement"
        class="kappa-xy-plot__plot"
        data-slot="xy-plot-plot"
        role="img"
        tabindex="0"
        :aria-label="props.ariaLabel"
        :aria-describedby="descriptionId"
        :aria-keyshortcuts="props.zoom === 'none' ? undefined : '+ - 0 Home'"
        @keydown="handleKeydown"
        @dblclick="resetZoom"
      />
    </template>
    <template v-if="(props.showReset && props.zoom !== 'none') || $slots.toolbar" #toolbar>
      <button
        v-if="props.showReset && props.zoom !== 'none'"
        type="button"
        data-chart-action
        aria-label="Reset plot view"
        title="Reset view (0)"
        @click="resetZoom"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3 3v4h4M13 13V9H9" />
          <path d="M12.2 6A5 5 0 0 0 3 7M3.8 10A5 5 0 0 0 13 9" />
        </svg>
        <span>Reset</span>
      </button>
      <slot name="toolbar" />
    </template>
    <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    <template v-if="$slots.empty" #empty><slot name="empty" /></template>
    <template v-if="$slots.error" #error="slotProps"><slot name="error" v-bind="slotProps" /></template>
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </ChartFrame>
</template>

<style src="./xy-plot.css"></style>
