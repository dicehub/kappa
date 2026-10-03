<script setup lang="ts">
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
  createEChartsTheme,
  observeKappaChartTheme,
  readKappaChartTheme,
} from "../../internal/chart/chart-theme";
import {
  chartErrorMessage,
  prepareChartOptions,
  type ChartEmits,
  type ChartInstance,
  type ChartOptions,
  type ChartProps,
  type ChartSlots,
  type ChartUpdateOptions,
} from "./chart";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ChartProps>(), {
  description: undefined,
  empty: false,
  emptyLabel: "No data available",
  error: undefined,
  events: undefined,
  height: "20rem",
  loading: false,
  loadingLabel: "Loading chart",
  renderer: "canvas",
  revision: 0,
  title: undefined,
  updateOptions: undefined,
});
const emit = defineEmits<ChartEmits>();
defineSlots<ChartSlots>();

const plotElement = ref<HTMLDivElement>();
const instance = shallowRef<ChartInstance>();
const internalError = ref<string>();
const boundEvents = new Map<string, (params: unknown) => void>();
let resizeObserver: ResizeObserver | undefined;
let stopThemeObserver: (() => void) | undefined;
let resizeFrame = 0;
let themeFrame = 0;

const visibleError = computed(() => props.error ?? internalError.value);
const canInitialize = computed(() => !props.loading && !props.empty && !props.error);

const reportError = (error: unknown) => {
  internalError.value = chartErrorMessage(error);
  emit("error", error);
};

const unbindEvents = () => {
  if (!instance.value) return;
  for (const [event, handler] of boundEvents) instance.value.off(event, handler);
  boundEvents.clear();
};

const bindEvents = () => {
  if (!instance.value) return;
  unbindEvents();
  for (const [event, callback] of Object.entries(props.events ?? {})) {
    if (!callback) continue;
    const handler = (params: unknown) => callback(params);
    boundEvents.set(event, handler);
    instance.value.on(event, handler);
  }
};

const dispose = () => {
  unbindEvents();
  instance.value?.dispose();
  instance.value = undefined;
};

const applyOptions = () => {
  if (!instance.value) return;
  try {
    instance.value.setOption(prepareChartOptions(props.options), {
      lazyUpdate: true,
      notMerge: false,
      ...props.updateOptions,
    });
    internalError.value = undefined;
  } catch (error) {
    reportError(error);
  }
};

const initialize = async () => {
  await nextTick();
  const element = plotElement.value;
  if (!element || !canInitialize.value) return;

  dispose();
  internalError.value = undefined;
  try {
    const theme = createEChartsTheme(readKappaChartTheme(element));
    instance.value = props.engine.init(element, theme, { renderer: props.renderer });
    applyOptions();
    bindEvents();
    emit("ready", instance.value);
  } catch (error) {
    dispose();
    reportError(error);
  }
};

const scheduleResize = () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    const element = plotElement.value;
    if (element && element.clientWidth > 0 && element.clientHeight > 0) {
      instance.value?.resize();
    }
  });
};

const scheduleThemeRefresh = () => {
  cancelAnimationFrame(themeFrame);
  themeFrame = requestAnimationFrame(() => void initialize());
};

const getInstance = () => instance.value;
const resize = () => instance.value?.resize();
const dispatchAction: ChartInstance["dispatchAction"] = (payload) =>
  instance.value?.dispatchAction(payload);
const setOption = (options: ChartOptions, settings?: ChartUpdateOptions) =>
  instance.value?.setOption(prepareChartOptions(options), settings);

onMounted(() => {
  void initialize();
  const element = plotElement.value;
  if (!element) return;
  resizeObserver = new ResizeObserver(scheduleResize);
  resizeObserver.observe(element);
  stopThemeObserver = observeKappaChartTheme(element, scheduleThemeRefresh);
});

watch(() => [props.engine, props.renderer], () => void initialize());
watch(() => [props.options, props.revision, props.updateOptions], () => {
  if (instance.value) applyOptions();
  else void initialize();
});
watch(() => props.events, bindEvents);
watch(canInitialize, (ready) => {
  if (ready) void initialize();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(resizeFrame);
  cancelAnimationFrame(themeFrame);
  resizeObserver?.disconnect();
  stopThemeObserver?.();
  dispose();
});

defineExpose({ dispatchAction, getInstance, resize, setOption });
</script>

<template>
  <ChartFrame
    v-bind="$attrs"
    :accessible-description="props.ariaDescription"
    :accessible-label="props.ariaLabel"
    :description="props.description"
    :empty="props.empty"
    :empty-label="props.emptyLabel"
    :error="visibleError"
    :height="props.height"
    :loading="props.loading"
    :loading-label="props.loadingLabel"
    slot-name="chart"
    :title="props.title"
  >
    <template #default="{ descriptionId }">
      <div
        ref="plotElement"
        class="kappa-chart__plot"
        data-slot="chart-plot"
        role="img"
        :aria-label="props.ariaLabel"
        :aria-describedby="descriptionId"
      />
    </template>
    <template v-if="$slots.toolbar" #toolbar><slot name="toolbar" /></template>
    <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    <template v-if="$slots.empty" #empty><slot name="empty" /></template>
    <template v-if="$slots.error" #error="slotProps"><slot name="error" v-bind="slotProps" /></template>
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </ChartFrame>
</template>

<style src="./chart.css"></style>
