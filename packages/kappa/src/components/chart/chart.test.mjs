import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { chartErrorMessage, prepareChartOptions } from "./chart.ts";

const source = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

test("keeps the standard ECharts boundary out of HTML mode", () => {
  const formatter = () => "<strong>unsafe</strong>";
  const options = prepareChartOptions({
    tooltip: {
      formatter,
      extraCssText: "position: fixed",
      renderMode: "html",
      trigger: "axis",
    },
    toolbox: {
      feature: {
        dataView: {},
        saveAsImage: {},
        restore: {},
      },
    },
  });

  assert.deepEqual(options.tooltip, { renderMode: "richText", trigger: "axis" });
  assert.deepEqual(options.toolbox.feature, { restore: {} });
  assert.equal(chartErrorMessage(new Error("Invalid series")), "Invalid series");
  assert.equal(chartErrorMessage(null), "The chart could not be rendered.");

  const minimal = prepareChartOptions({ series: [] });
  assert.equal("toolbox" in minimal, false);
  assert.equal("tooltip" in minimal, false);
});

test("uses shallow option updates and complete client lifecycle cleanup", () => {
  const component = source("./Chart.vue");
  const styles = source("./chart.css");
  const frameStyles = source("../../internal/chart/chart-frame.css");
  const barrel = source("./index.ts");

  assert.match(component, /props\.engine\.init/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /observeKappaChartTheme/);
  assert.match(component, /instance\.value\?\.dispose\(\)/);
  assert.match(component, /watch\(\(\) => \[props\.options, props\.revision/);
  assert.doesNotMatch(component, /deep:\s*true/);
  assert.match(component, /role="img"/);
  assert.match(component, /aria-describedby/);
  assert.match(styles, /\.kappa-chart__plot/);
  assert.match(frameStyles, /prefers-reduced-motion: reduce/);
  assert.match(frameStyles, /forced-colors: active/);
  assert.doesNotMatch(frameStyles, /(?:margin|padding|border)-(?:left|right)/);

  for (const name of ["Chart", "ChartOptions", "ChartProps", "prepareChartOptions"]) {
    assert.match(barrel, new RegExp(name));
  }
});

test("isolates optional chart engines from the root package entry", () => {
  const componentsBarrel = source("../index.ts");
  const manifest = JSON.parse(source("../../../package.json"));

  assert.doesNotMatch(componentsBarrel, /\.\/chart/);
  assert.doesNotMatch(componentsBarrel, /\.\/timeseries-chart/);
  assert.doesNotMatch(componentsBarrel, /\.\/xy-plot/);
  assert.equal(manifest.exports["./components/*"]["kappa-source"], "./src/components/*/index.ts");
  assert.equal(manifest.exports["./components/*"].import, "./dist/components/*.js");
  assert.equal(manifest.peerDependenciesMeta.echarts.optional, true);
  assert.equal(manifest.peerDependenciesMeta.uplot.optional, true);
});
