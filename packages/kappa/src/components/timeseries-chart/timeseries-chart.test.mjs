import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as echarts from "echarts";
import {
  createTimeseriesChartOptions,
  resolveTimeseriesUpdateOptions,
} from "./timeseries-chart.ts";

const source = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const options = (overrides = {}) =>
  createTimeseriesChartOptions({
    animation: true,
    curve: "linear",
    reducedMotion: false,
    series: [],
    showGrid: true,
    showLegend: true,
    timeZone: "utc",
    tooltip: true,
    type: "line",
    ...overrides,
  });

test("builds polished ECharts defaults for dashboard time data", () => {
  const result = options({
    series: [
      { name: "Requests", data: [[0, 12]], type: "area", curve: "smooth" },
      { name: "Errors", data: [[0, 2]], curve: "step", dash: "dashed" },
      { name: "Jobs", data: [[0, 6]], type: "bar" },
    ],
  });

  assert.equal(result.useUTC, true);
  assert.equal(result.tooltip.renderMode, undefined);
  assert.equal(result.tooltip.show, true);
  assert.equal(result.tooltip.trigger, "axis");
  assert.equal(result.legend.show, true);
  assert.equal(result.legend.selectedMode, false);
  assert.equal("containLabel" in result.grid, false);
  assert.equal(result.grid.outerBoundsMode, "same");
  assert.equal(result.xAxis.type, "time");
  assert.equal(result.yAxis.splitLine.lineStyle.type, "dashed");
  assert.equal(result.series[0].type, "line");
  assert.deepEqual(result.series[0].areaStyle, { opacity: 0.12 });
  assert.equal(result.series[0].smooth, 0.32);
  assert.equal(result.series[1].step, "end");
  assert.equal(result.series[1].lineStyle.type, "dashed");
  assert.equal(result.series[2].type, "bar");
  assert.equal(result.series[2].barMaxWidth, 24);
});

test("turns off motion and optional chart furniture", () => {
  const result = options({
    reducedMotion: true,
    showGrid: false,
    showLegend: false,
    tooltip: false,
  });

  assert.equal(result.animation, false);
  assert.equal(result.legend.show, false);
  assert.equal(result.tooltip.show, false);
  assert.equal(result.yAxis.splitLine.show, false);
});

test("turns off all tooltip motion for reduced-motion users", () => {
  const result = options({ reducedMotion: true });

  assert.equal(result.animation, false);
  assert.equal(result.tooltip.transitionDuration, 0);
  assert.equal(result.tooltip.axisPointer.animation, false);
});

test("replaces removed ECharts series instead of retaining stale data", () => {
  const instance = echarts.init(null, null, {
    height: 200,
    renderer: "svg",
    ssr: true,
    width: 400,
  });
  const first = options({
    series: [
      { name: "A", data: [[0, 1]] },
      { name: "B", data: [[0, 2]] },
    ],
  });
  const second = options({ series: [{ name: "A", data: [[0, 3]] }] });

  instance.setOption(first);
  instance.setOption(second, resolveTimeseriesUpdateOptions());
  assert.deepEqual(instance.getOption().series.map((series) => series.name), ["A"]);
  instance.dispose();
});

test("keeps seconds and years distinct in time-axis labels", () => {
  const seconds = options({
    locale: "en-GB",
    series: [{ name: "A", data: [[Date.UTC(2026, 0, 1, 10, 0, 5), 1], [Date.UTC(2026, 0, 1, 10, 0, 55), 2]] }],
  });
  const years = options({
    locale: "en-GB",
    series: [{ name: "A", data: [[Date.UTC(2025, 0, 1), 1], [Date.UTC(2026, 0, 1), 2]] }],
  });

  assert.notEqual(
    seconds.xAxis.axisLabel.formatter(Date.UTC(2026, 0, 1, 10, 0, 5), 0, {
      time: { lowerTimeUnit: "second", upperTimeUnit: "minute" },
    }),
    seconds.xAxis.axisLabel.formatter(Date.UTC(2026, 0, 1, 10, 0, 55), 1, {
      time: { lowerTimeUnit: "second", upperTimeUnit: "minute" },
    }),
  );
  assert.match(
    years.xAxis.axisLabel.formatter(Date.UTC(2025, 0, 1), 0, {
      time: { lowerTimeUnit: "day", upperTimeUnit: "year" },
    }),
    /2025/,
  );
  assert.match(
    years.xAxis.axisLabel.formatter(Date.UTC(2026, 0, 1), 1, {
      time: { lowerTimeUnit: "day", upperTimeUnit: "year" },
    }),
    /2026/,
  );
});

test("composes Chart and keeps ECharts isolated from the root entry", () => {
  const component = source("./TimeseriesChart.vue");
  const implementation = source("./timeseries-chart.ts");
  const styles = source("./timeseries-chart.css");
  const barrel = source("./index.ts");
  const componentsBarrel = source("../index.ts");

  assert.match(component, /<Chart/);
  assert.match(component, /window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(component, /defineExpose<TimeseriesChartApi>/);
  assert.match(component, /void props\.revision/);
  assert.match(component, /resolveTimeseriesUpdateOptions/);
  assert.doesNotMatch(implementation, /uplot|XYPlot/);
  assert.match(styles, /\.kappa-timeseries-chart/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)/);
  assert.doesNotMatch(componentsBarrel, /\.\/timeseries-chart/);

  for (const name of ["TimeseriesChart", "TimeseriesChartProps", "TimeseriesChartSeries"]) {
    assert.match(barrel, new RegExp(name));
  }
});
