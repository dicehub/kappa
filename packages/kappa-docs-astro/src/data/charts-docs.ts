export const installCode = `pnpm add echarts uplot`;

export const chartCode = `<script setup lang="ts">
import { Chart } from "@dicehub/kappa/components/chart";
import { LineChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const options = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  yAxis: { type: "value" },
  series: [{ name: "CPU", type: "line", data: [42, 48, 46, 63, 58] }],
};
</script>

<template>
  <Chart
    :engine="echarts"
    :options="options"
    title="Workspace usage"
    aria-label="Workspace CPU usage"
    aria-description="CPU usage peaks at 63 percent on Thursday."
  />
</template>`;

export const xyPlotCode = `<script setup lang="ts">
import { shallowRef } from "vue";
import {
  XYPlot,
  type XYPlotData,
  type XYPlotSeries,
} from "@dicehub/kappa/components/xy-plot";

const data = shallowRef<XYPlotData>([
  new Float64Array([0, 1, 2, 3]),
  new Float64Array([0.08, 0.021, 0.006, 0.0014]),
]);
const series: XYPlotSeries[] = [{ label: "p", width: 1.5 }];
</script>

<template>
  <XYPlot
    :data="data"
    :series="series"
    title="Residual monitor"
    aria-label="Pressure residual plot"
    aria-description="Pressure residual decreases across four iterations."
    x-label="Iteration"
    y-label="Residual"
    y-scale="log"
  />
</template>`;

export const scatterCode = `<Chart
  :engine="echarts"
  :options="{
    animation: false,
    xAxis: { type: 'value', name: 'Velocity (m/s)' },
    yAxis: { type: 'value', name: 'Pressure (kPa)' },
    series: [{ type: 'scatter', data: samples, large: true }],
  }"
  aria-label="Pressure field samples"
  aria-description="Pressure samples plotted against velocity."
/>`;

export const heatmapCode = `<Chart
  :engine="echarts"
  :options="{
    xAxis: { type: 'category', data: hours },
    yAxis: { type: 'category', data: days },
    visualMap: { min: 0, max: 100 },
    series: [{ type: 'heatmap', data: load }],
  }"
  aria-label="Compute load by hour"
  aria-description="Compute load is highest on weekday afternoons."
/>`;

export const sankeyCode = `<Chart
  :engine="echarts"
  :options="{
    series: [{
      type: 'sankey',
      data: nodes,
      links,
      emphasis: { focus: 'adjacency' },
    }],
  }"
  aria-label="Case processing flow"
  aria-description="Jobs move from geometry through meshing and solving."
/>`;

export const denseCode = `<script setup lang="ts">
import { XYPlot, type XYPlotData } from "@dicehub/kappa/components/xy-plot";

const pointCount = 100_000;
const x = new Float64Array(pointCount);
const pressure = new Float64Array(pointCount);
for (let index = 0; index < pointCount; index += 1) {
  x[index] = index * 0.005;
  pressure[index] = 1.2 + Math.sin(index * 0.007) * 0.18;
}
const data: XYPlotData = [x, pressure];
</script>

<template>
  <XYPlot
    :data="data"
    :series="[{ label: 'Pressure', width: 1 }]"
    aria-label="Dense pressure signal"
    aria-description="100,000 pressure samples across 500 seconds."
    x-label="Time (s)"
    y-label="Pressure"
  />
</template>`;

export const streamingCode = `const plot = useTemplateRef("plot");

function receiveSamples(chunk: XYPlotData) {
  // Calls within one frame become one uPlot update.
  // The oldest samples are removed at the limit.
  plot.value?.append(chunk, { maxPoints: 2_000 });
}

<XYPlot
  ref="plot"
  :data="initialData"
  :series="series"
  aria-label="Live residual plot"
  aria-description="Three residuals decrease over the solver iterations."
/>`;

export const statesCode = `<Chart loading ... />
<Chart empty empty-label="No samples in this range" ... />
<Chart error="The data query failed." ... />`;

export const engineRows = [
  {
    component: "Chart",
    engine: "ECharts",
    use: "Bar, line, pie, scatter, heatmap, Sankey, maps, and normal dashboards.",
    data: "Small and medium data sets; large-mode ECharts series where they fit.",
  },
  {
    component: "XYPlot",
    engine: "uPlot",
    use: "Dense numeric or time X/Y data, solver monitors, and live telemetry.",
    data: "Aligned columns, typed arrays, and 100,000 or more points.",
  },
  {
    component: "TimeseriesChart",
    engine: "ECharts",
    use: "Polished dashboard trends with opinionated line, area, bar, legend, and tooltip defaults.",
    data: "Normal dashboard ranges expressed as timestamp and value pairs.",
  },
] as const;

export const chartProps = [
  { name: "engine", type: "ChartEngine", defaultValue: "required", description: "Configured modular ECharts namespace." },
  { name: "options", type: "ChartOptions", defaultValue: "required", description: "Trusted ECharts options with safe standard tooltips." },
  { name: "ariaLabel", type: "string", defaultValue: "required", description: "Accessible name for the rendered chart." },
  { name: "ariaDescription", type: "string", defaultValue: "required", description: "Plain-language data summary or interaction instructions." },
  { name: "title / description", type: "string", defaultValue: "—", description: "Compact visible heading and context." },
  { name: "height", type: "CSS height | number", defaultValue: '"20rem"', description: "Stable plot body height. Numbers use pixels." },
  { name: "renderer", type: '"canvas" | "svg"', defaultValue: '"canvas"', description: "Registered ECharts renderer." },
  { name: "loading / empty / error", type: "boolean / boolean / string", defaultValue: "false / false / —", description: "Complete data states." },
  { name: "events", type: "ChartEvents", defaultValue: "—", description: "Stable event-to-handler map." },
  { name: "revision", type: "string | number", defaultValue: "0", description: "Reapplies options after controlled in-place mutation." },
  { name: "updateOptions", type: "SetOptionOpts", defaultValue: "—", description: "ECharts setOption update behavior." },
] as const;

export const xyPlotProps = [
  { name: "data", type: "XYPlotData", defaultValue: "required", description: "Aligned X and Y columns. Typed arrays are supported." },
  { name: "series", type: "XYPlotSeries[]", defaultValue: "required", description: "One definition for each Y column." },
  { name: "ariaLabel / ariaDescription", type: "string", defaultValue: "required", description: "Accessible chart name and data summary." },
  { name: "xScale", type: '"linear" | "time"', defaultValue: '"linear"', description: "X-axis scale." },
  { name: "yScale", type: '"linear" | "log"', defaultValue: '"linear"', description: "Y-axis scale." },
  { name: "zoom", type: '"none" | "x" | "xy"', defaultValue: '"xy"', description: "Drag and keyboard zoom axes." },
  { name: "wheelZoom", type: "boolean", defaultValue: "true", description: "Wheel zooms X. Shift plus wheel zooms Y." },
  { name: "showLegend / showReset", type: "boolean", defaultValue: "true", description: "Built-in live legend and reset action." },
  { name: "nativeOptions", type: "XYPlotNativeOptions", defaultValue: "—", description: "Trusted uPlot options for advanced composition." },
  { name: "revision", type: "string | number", defaultValue: "0", description: "Applies an in-place data mutation without a deep watcher." },
] as const;

export const methods = [
  { component: "Chart", name: "getInstance / resize / setOption / dispatchAction", description: "Access the ECharts instance and imperative engine operations." },
  { component: "TimeseriesChart", name: "getInstance / resize / setOption / dispatchAction", description: "Access advanced ECharts operations when the opinionated API is not enough." },
  { component: "XYPlot", name: "getInstance / resize / resetZoom / setData / setScale", description: "Control the uPlot instance without deep Vue reactivity." },
  { component: "XYPlot", name: "append / flush", description: "Batch bounded stream chunks into one animation-frame update." },
  { component: "XYPlot", name: "batch", description: "Run multiple uPlot operations in one engine batch." },
] as const;

export const exportsList = [
  { path: "@dicehub/kappa/components/chart", exports: "Chart, ChartProps, ChartOptions, ChartEngine, ChartInstance" },
  { path: "@dicehub/kappa/components/xy-plot", exports: "XYPlot, XYPlotProps, XYPlotData, XYPlotSeries, appendXYPlotData" },
  { path: "@dicehub/kappa/components/timeseries-chart", exports: "TimeseriesChart, TimeseriesChartProps, TimeseriesChartSeries, TimeseriesChartApi" },
] as const;
