<script setup lang="ts">
import { Chart, type ChartOptions } from "@dicehub/kappa/components/chart";
import { XYPlot, type XYPlotData } from "@dicehub/kappa/components/xy-plot";
import { BarChart, HeatmapChart, LineChart, SankeyChart, ScatterChart } from "echarts/charts";
import {
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { computed, onBeforeUnmount, ref } from "vue";
import {
  createInitialStreamData,
  denseData,
  denseSeries,
  heatmapOptions,
  sankeyOptions,
  scatterOptions,
  streamSeries,
  usageOptions,
} from "./charts-demo-data";

echarts.use([
  AriaComponent,
  BarChart,
  CanvasRenderer,
  GridComponent,
  HeatmapChart,
  LegendComponent,
  LineChart,
  SankeyChart,
  ScatterChart,
  TooltipComponent,
  VisualMapComponent,
]);

type DemoVariant = "preview" | "scatter" | "heatmap" | "sankey" | "dense" | "streaming" | "states";
type XYPlotExposed = {
  append: (data: XYPlotData, options?: { maxPoints?: number }) => void;
  flush: () => void;
};

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });
const streamPlot = ref<XYPlotExposed>();
const streamData = createInitialStreamData();
const streaming = ref(false);
const nextIteration = ref(streamData[0].length);
let streamTimer: ReturnType<typeof setInterval> | undefined;

const echartsOptions = computed<ChartOptions>(() => {
  if (props.variant === "scatter") return scatterOptions;
  if (props.variant === "heatmap") return heatmapOptions;
  if (props.variant === "sankey") return sankeyOptions;
  return usageOptions;
});

const chartTitle = computed(() => {
  if (props.variant === "scatter") return "Pressure field samples";
  if (props.variant === "heatmap") return "Compute load by hour";
  if (props.variant === "sankey") return "Case processing flow";
  return "Workspace usage";
});

const chartDescription = computed(() => {
  if (props.variant === "scatter") return "480 sampled cells";
  if (props.variant === "heatmap") return "Seven-day utilization";
  if (props.variant === "sankey") return "Relative job volume";
  return "Last seven days";
});

const chartSummary = computed(() => {
  if (props.variant === "scatter") return "A scatter plot of 480 pressure samples across velocity from 1 to 6 metres per second.";
  if (props.variant === "heatmap") return "A heatmap with the highest compute load on weekday afternoons.";
  if (props.variant === "sankey") return "A flow chart from geometry through meshing and solving to results or archive.";
  return "CPU usage peaks at 63 percent on Thursday. Memory usage rises from 51 to 66 percent before it falls to 62 percent.";
});

const appendStream = () => {
  const start = nextIteration.value;
  const count = 10;
  const x = Array.from({ length: count }, (_, offset) => start + offset);
  const decay = (value: number, speed: number, floor: number) =>
    Math.exp(-value / speed) * 0.08 + floor + Math.sin(value * 0.3) * floor * 0.08;
  streamPlot.value?.append(
    [
      x,
      x.map((value) => decay(value, 34, 0.00012)),
      x.map((value) => decay(value, 26, 0.00008)),
      x.map((value) => decay(value, 42, 0.0001)),
    ],
    { maxPoints: 2_000 },
  );
  nextIteration.value += count;
};

const stopStream = () => {
  if (streamTimer) clearInterval(streamTimer);
  streamTimer = undefined;
  streaming.value = false;
};

const toggleStream = () => {
  if (streaming.value) {
    stopStream();
    return;
  }
  streaming.value = true;
  streamTimer = setInterval(appendStream, 180);
};

onBeforeUnmount(stopStream);
</script>

<template>
  <div class="charts-demo" :data-charts-demo="props.variant">
    <template v-if="['preview', 'scatter', 'heatmap', 'sankey'].includes(props.variant)">
      <Chart
        :engine="echarts"
        :options="echartsOptions"
        :title="chartTitle"
        :description="chartDescription"
        :aria-label="chartTitle"
        :aria-description="chartSummary"
        height="19rem"
      >
        <template #footer>
          ECharts · Canvas renderer
        </template>
      </Chart>
    </template>

    <XYPlot
      v-else-if="props.variant === 'dense'"
      :data="denseData"
      :series="denseSeries"
      title="Transient solver signals"
      description="100,000 aligned samples per series"
      aria-label="Dense transient solver signal plot"
      aria-description="Two dense series across 500 seconds. Pressure oscillates near 1.2 and temperature near 0.82."
      x-label="Time (s)"
      y-label="Normalized value"
      height="20rem"
    >
      <template #footer>
        200,000 values · drag to zoom · wheel for X · Shift + wheel for Y
      </template>
    </XYPlot>

    <XYPlot
      v-else-if="props.variant === 'streaming'"
      ref="streamPlot"
      :data="streamData"
      :series="streamSeries"
      title="Residual monitor"
      description="Bounded live window"
      aria-label="Live solver residual plot"
      aria-description="Three residual series decrease over solver iterations. New samples are grouped into one animation-frame update."
      x-label="Iteration"
      y-label="Residual"
      y-scale="log"
      height="20rem"
    >
      <template #toolbar>
        <button type="button" data-chart-action @click="toggleStream">
          <span class="charts-demo__stream-dot" :data-active="streaming ? '' : undefined" />
          {{ streaming ? "Pause" : "Start stream" }}
        </button>
      </template>
      <template #footer>
        {{ nextIteration.toLocaleString() }} samples received · 2,000-point limit
      </template>
    </XYPlot>

    <div v-else class="charts-demo__states">
      <Chart
        :engine="echarts"
        :options="usageOptions"
        title="Loading"
        aria-label="Loading chart example"
        aria-description="The chart data is loading."
        loading
        height="11rem"
      />
      <Chart
        :engine="echarts"
        :options="usageOptions"
        title="Empty"
        aria-label="Empty chart example"
        aria-description="No chart data is available."
        empty
        height="11rem"
      />
      <Chart
        :engine="echarts"
        :options="usageOptions"
        title="Error"
        aria-label="Chart error example"
        aria-description="The chart query failed."
        error="The data query failed."
        height="11rem"
      />
    </div>
  </div>
</template>

<style src="./charts-docs-demo.css"></style>
