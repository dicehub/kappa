export const timeseriesInstallCode = `pnpm add @dicehub/kappa echarts`;

export const timeseriesCode = `<script setup lang="ts">
import {
  TimeseriesChart,
  type TimeseriesChartPoint,
  type TimeseriesChartSeries,
} from "@dicehub/kappa/components/timeseries-chart";
import { LineChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const hour = 60 * 60 * 1000;
const start = Date.UTC(2026, 8, 22);
const toPoints = (values: number[]): TimeseriesChartPoint[] =>
  values.map((value, index) => [start + index * hour, value]);
const compute = [46, 51, 58, 55, 62, 66, 59, 53];
const storage = [31, 34, 36, 39, 42, 44, 47, 50];
const series: TimeseriesChartSeries[] = [
  { name: "Compute", type: "area", curve: "smooth", data: toPoints(compute) },
  { name: "Storage", curve: "smooth", data: toPoints(storage) },
];
</script>

<template>
  <TimeseriesChart
    :engine="echarts"
    :series="series"
    title="Platform utilization"
    aria-label="Compute and storage utilization"
    aria-description="Compute peaks at 66 percent. Storage rises to 50 percent."
    y-label="Utilization (%)"
    :y-min="0"
    :y-max="100"
    time-zone="utc"
  />
</template>`;

export const barsCode = `<script setup lang="ts">
import { BarChart } from "echarts/charts";

// Register BarChart with the same ECharts engine used in the main example.
echarts.use([BarChart]);
</script>

<template>
  <TimeseriesChart
    :engine="echarts"
    :series="[{ name: 'Completed', type: 'bar', data: completed }]"
    type="bar"
    aria-label="Completed tasks by hour"
    aria-description="Hourly counts peak at 81."
    y-label="Tasks"
    :y-min="0"
    :y-min-interval="1"
  />
</template>`;

export const gapsCode = `const series = [
  {
    name: "Primary",
    data: [[time[0], 41], [time[1], 44], [time[2], null], [time[3], 55]],
  },
  {
    name: "Replica",
    curve: "step",
    data: [[time[0], 31], [time[1], 33], [time[2], 35], [time[3], 38]],
  },
];

<TimeseriesChart
  :engine="echarts"
  :series="series"
  aria-label="Storage throughput"
  aria-description="The primary series has a data gap."
/>`;

export const areaCode = `<TimeseriesChart
  :engine="echarts"
  :series="[
    { name: 'Cached', type: 'area', stack: 'requests', data: cached },
    { name: 'Origin', type: 'area', stack: 'requests', data: origin },
  ]"
  type="area"
  aria-label="Stacked request volume"
  aria-description="Cached requests make up most of the traffic."
  :y-min="0"
/>`;

export const utcCode = `<TimeseriesChart
  :engine="echarts"
  :series="series"
  time-zone="utc"
  locale="en-GB"
  aria-label="Active connections in UTC"
  aria-description="Connections rise from 12 to 25."
/>`;

export const timeseriesStatesCode = `<TimeseriesChart :engine="echarts" :series="series" loading ... />
<TimeseriesChart :engine="echarts" :series="[]" empty empty-label="No samples in this range" ... />
<TimeseriesChart :engine="echarts" :series="series" error="The data query failed." ... />`;

export const timeseriesProps = [
  { name: "engine", type: "ChartEngine", defaultValue: "required", description: "Configured modular ECharts namespace." },
  { name: "series", type: "TimeseriesChartSeries[]", defaultValue: "required", description: "Named series with Unix-millisecond timestamp and value pairs." },
  { name: "ariaLabel / ariaDescription", type: "string", defaultValue: "required", description: "Accessible name and plain-language data summary." },
  { name: "type", type: '"line" | "area" | "bar"', defaultValue: '"line"', description: "Default rendering type. A series can override it." },
  { name: "curve", type: '"linear" | "smooth" | "step"', defaultValue: '"linear"', description: "Default line interpolation. A series can override it." },
  { name: "timeZone", type: '"local" | "utc"', defaultValue: '"local"', description: "Axis and tooltip time zone." },
  { name: "locale", type: "string", defaultValue: "browser", description: "Locale for time and numeric axis labels." },
  { name: "showLegend / showGrid / tooltip", type: "boolean", defaultValue: "true", description: "Visible chart furniture." },
  { name: "animation", type: "boolean", defaultValue: "true", description: "Animate normal updates. Reduced-motion preferences always take priority." },
  { name: "yMin / yMax / yMinInterval", type: "number | data bound", defaultValue: "—", description: "Optional value-axis bounds and tick interval." },
  { name: "loading / empty / error", type: "boolean / boolean / string", defaultValue: "false / false / —", description: "Explicit data states." },
  { name: "events", type: "ChartEvents", defaultValue: "—", description: "Stable ECharts event-to-handler map." },
  { name: "revision", type: "string | number", defaultValue: "0", description: "Reapply data after a controlled in-place mutation." },
] as const;

export const timeseriesMethods = [
  { name: "getInstance / resize", description: "Read or resize the ECharts instance." },
  { name: "setOption / dispatchAction", description: "Use advanced ECharts operations without replacing the component." },
] as const;
