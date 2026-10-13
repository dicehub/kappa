<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { TimeseriesChart, type TimeseriesChartApi, type TimeseriesChartSeries } from "@dicehub/kappa/components/timeseries-chart";
import { LineChart } from "echarts/charts";
import { GridComponent, LegendComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { AxisBreak } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";

echarts.use([LineChart, GridComponent, LegendComponent, SVGRenderer, AxisBreak]);

const start = Date.UTC(2026, 0, 1, 10);
const series = ref<TimeseriesChartSeries[]>([
  { name: "A", data: [[start, 1], [start + 60_000, 3]] },
  { name: "B", data: [[start, 4], [start + 60_000, 2]] },
]);
const seconds: TimeseriesChartSeries[] = [{
  name: "Samples",
  data: [[start + 5_000, 1], [start + 55_000, 2]],
}];
const years: TimeseriesChartSeries[] = [{
  name: "Samples",
  data: [[Date.UTC(2025, 0, 1), 1], [Date.UTC(2026, 0, 1), 2]],
}];
const yearBoundary: TimeseriesChartSeries[] = [{
  name: "Samples",
  data: [[Date.UTC(2025, 11, 27), 1], [Date.UTC(2026, 0, 7), 2]],
}];
const boundaryChart = useTemplateRef<TimeseriesChartApi>("boundaryChart");
const skipHolidayRange = () => boundaryChart.value?.setOption({
  xAxis: {
    breaks: [{ start: Date.UTC(2025, 11, 30), end: Date.UTC(2026, 0, 3), gap: "20%" }],
  },
});
const errors = ref<string[]>([]);
</script>

<template>
  <main style="width: 960px; max-width: 100%">
    <h1>Timeseries consumer</h1>
    <button type="button" @click="series = [{ name: 'A', data: [[start, 2], [start + 60_000, 5]] }]">
      Remove series B
    </button>
    <p v-for="error in errors" :key="error" role="alert">{{ error }}</p>
    <TimeseriesChart
      :engine="echarts" :series="series" renderer="svg" :animation="false"
      ariaLabel="Updating series" ariaDescription="Two series, then only A."
      time-zone="utc" locale="en-GB" :height="240" @error="errors.push(String($event))"
    />
    <TimeseriesChart
      :engine="echarts" :series="seconds" renderer="svg" :animation="false" :show-legend="false"
      ariaLabel="Second-scale samples" ariaDescription="Samples within one minute."
      time-zone="utc" locale="en-GB" :height="240" @error="errors.push(String($event))"
    />
    <TimeseriesChart
      :engine="echarts" :series="years" renderer="svg" :animation="false" :show-legend="false"
      ariaLabel="Year-scale samples" ariaDescription="Samples in 2025 and 2026."
      time-zone="utc" locale="en-GB" :height="240" @error="errors.push(String($event))"
    />
    <TimeseriesChart
      ref="boundaryChart"
      :engine="echarts" :series="yearBoundary" renderer="svg" :animation="false" :show-legend="false"
      ariaLabel="Year-boundary samples" ariaDescription="Daily labels around a skipped holiday range across New Year."
      time-zone="utc" locale="en-GB" :height="240" @error="errors.push(String($event))"
      @ready="skipHolidayRange"
    />
  </main>
</template>
