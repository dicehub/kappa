<script setup lang="ts">
import {
  TimeseriesChart,
  type TimeseriesChartPoint,
  type TimeseriesChartSeries,
} from "@dicehub/kappa/components/timeseries-chart";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

type DemoVariant = "area" | "bars" | "gaps" | "preview" | "states" | "utc";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

const HOUR = 60 * 60 * 1_000;
const MINUTE = 60 * 1_000;
const START = Date.UTC(2026, 8, 22, 0, 0, 0);
const points = (
  values: readonly (number | null)[],
  step = HOUR,
  start = START,
): TimeseriesChartPoint[] => values.map((value, index) => [start + index * step, value]);

const utilizationSeries: TimeseriesChartSeries[] = [
  {
    name: "Compute",
    type: "area",
    curve: "smooth",
    data: points(Array.from({ length: 48 }, (_, index) =>
      Math.round(46 + Math.sin(index / 4) * 13 + index * 0.22),
    )),
    valueFormatter: (value) => `${value}%`,
  },
  {
    name: "Storage",
    curve: "smooth",
    data: points(Array.from({ length: 48 }, (_, index) =>
      Math.round(31 + Math.sin(index / 5.2) * 7 + index * 0.3),
    )),
    valueFormatter: (value) => `${value}%`,
  },
];

const completedSeries: TimeseriesChartSeries[] = [
  {
    name: "Completed",
    type: "bar",
    data: points([18, 24, 32, 28, 36, 42, 55, 61, 49, 44, 58, 72, 81, 78, 66, 59, 63, 70, 76, 68, 54, 48, 39, 27]),
    valueFormatter: (value) => `${value} tasks`,
  },
];

const gapSeries: TimeseriesChartSeries[] = [
  {
    name: "Primary",
    data: points([41, 44, 47, 46, 50, null, null, null, 55, 54, 58, 61, 63, null, 62, 64, 67, 69]),
    valueFormatter: (value) => `${value} MB/s`,
  },
  {
    name: "Replica",
    curve: "step",
    data: points([31, 33, 35, 38, 39, 41, 40, 42, 44, 45, 46, 48, 50, 51, 52, 54, 55, 57]),
    valueFormatter: (value) => `${value} MB/s`,
  },
];

const requestSeries: TimeseriesChartSeries[] = [
  {
    name: "Cached",
    type: "area",
    stack: "requests",
    curve: "smooth",
    data: points([420, 510, 630, 580, 690, 810, 940, 1020, 890, 760, 840, 920]),
  },
  {
    name: "Origin",
    type: "area",
    stack: "requests",
    curve: "smooth",
    data: points([130, 150, 170, 160, 190, 220, 250, 270, 240, 210, 230, 250]),
  },
];

const recentSeries: TimeseriesChartSeries[] = [
  {
    name: "Connections",
    curve: "step",
    showPoints: true,
    data: points(
      [12, 13, 12, 15, 18, 17, 21, 19, 23, 24, 22, 25],
      MINUTE,
      Date.UTC(2026, 8, 24, 10, 0, 0),
    ),
  },
];
</script>

<template>
  <div class="timeseries-demo" :data-timeseries-demo="props.variant">
    <TimeseriesChart
      v-if="props.variant === 'preview'"
      :engine="echarts"
      :series="utilizationSeries"
      title="Platform utilization"
      description="Last 48 hours"
      aria-label="Compute and storage utilization"
      aria-description="Compute utilization ranges from 37 to 66 percent. Storage rises from 31 to 50 percent."
      y-label="Utilization (%)"
      :y-min="0"
      :y-max="100"
      time-zone="utc"
      height="19rem"
    >
      <template #footer>Updated 2 minutes ago · UTC</template>
    </TimeseriesChart>

    <TimeseriesChart
      v-else-if="props.variant === 'bars'"
      :engine="echarts"
      :series="completedSeries"
      type="bar"
      title="Completed tasks"
      description="Hourly count"
      aria-label="Completed tasks by hour"
      aria-description="Hourly counts rise from 18 to a peak of 81, then fall to 27."
      y-label="Tasks"
      :y-min="0"
      :y-min-interval="1"
      time-zone="utc"
      height="18rem"
    />

    <TimeseriesChart
      v-else-if="props.variant === 'gaps'"
      :engine="echarts"
      :series="gapSeries"
      title="Storage throughput"
      description="Missing samples remain visible"
      aria-label="Primary and replica storage throughput"
      aria-description="The primary series has two data gaps. The replica series remains continuous."
      y-label="MB/s"
      time-zone="utc"
      height="18rem"
    />

    <TimeseriesChart
      v-else-if="props.variant === 'area'"
      :engine="echarts"
      :series="requestSeries"
      type="area"
      title="Request volume"
      description="Cached and origin traffic"
      aria-label="Stacked request volume"
      aria-description="Cached requests make up most of the traffic throughout the period."
      y-label="Requests"
      :y-min="0"
      time-zone="utc"
      height="18rem"
    />

    <TimeseriesChart
      v-else-if="props.variant === 'utc'"
      :engine="echarts"
      :series="recentSeries"
      title="Active connections"
      description="UTC timestamps in milliseconds"
      aria-label="Active connections in UTC"
      aria-description="Connections rise from 12 to 25 across twelve minutes."
      y-label="Connections"
      :y-min-interval="1"
      time-zone="utc"
      height="17rem"
    />

    <div v-else class="timeseries-demo__states">
      <TimeseriesChart
        :engine="echarts"
        :series="recentSeries"
        title="Loading"
        aria-label="Loading timeseries example"
        aria-description="Timeseries data is loading."
        loading
        height="11rem"
      />
      <TimeseriesChart
        :engine="echarts"
        :series="[]"
        title="Empty"
        aria-label="Empty timeseries example"
        aria-description="No timeseries data is available."
        empty
        empty-label="No samples in this range"
        height="11rem"
      />
      <TimeseriesChart
        :engine="echarts"
        :series="recentSeries"
        title="Error"
        aria-label="Timeseries error example"
        aria-description="The timeseries query failed."
        error="The data query failed."
        height="11rem"
      />
    </div>
  </div>
</template>

<style>
.timeseries-demo {
  inline-size: 100%;
  min-inline-size: 0;
}

.timeseries-demo__states {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

@media (max-width: 52rem) {
  .timeseries-demo__states {
    grid-template-columns: 1fr;
  }
}
</style>
