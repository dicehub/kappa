import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  XY_PLOT_DEFAULT_MAX_POINTS,
  appendXYPlotData,
  countXYPlotPoints,
  formatXYPlotValue,
  resolveXYPlotMaxPoints,
  validateXYPlotData,
} from "./xy-plot.ts";
import { createXYPlotPathBuilder } from "./xy-plot-paths.ts";

const source = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

test("validates aligned columns without scanning every point", () => {
  const data = [[0, 1, 2], [4, 5, 6], [7, 8, 9]];
  assert.equal(validateXYPlotData(data, 2), undefined);
  assert.equal(countXYPlotPoints(data), 3);
  assert.match(validateXYPlotData(data, 1), /2 data columns/);
  assert.match(validateXYPlotData([[0, 1], [2]], 1), /column 2/);
});

test("batches bounded append data and formats technical values", () => {
  const appended = appendXYPlotData([[0, 1, 2], [10, 11, 12]], [[3, 4], [13, 14]], 4);
  assert.deepEqual(appended, [[1, 2, 3, 4], [11, 12, 13, 14]]);
  assert.throws(() => appendXYPlotData([[0]], [[1], [2]]), /column count/);
  assert.equal(resolveXYPlotMaxPoints(-1), XY_PLOT_DEFAULT_MAX_POINTS);
  assert.equal(resolveXYPlotMaxPoints(10.9), 10);
  assert.equal(formatXYPlotValue(Number.NaN), "—");
  assert.match(formatXYPlotValue(0.00001), /e-/);
});

test("creates every supported uPlot path builder", () => {
  assert.equal(createXYPlotPathBuilder("line"), undefined);
  assert.equal(typeof createXYPlotPathBuilder("bars"), "function");
  assert.equal(typeof createXYPlotPathBuilder("spline"), "function");
  assert.equal(typeof createXYPlotPathBuilder("stepped"), "function");
  assert.equal(typeof createXYPlotPathBuilder("points"), "function");
});

test("keeps dense data shallow and cleans every browser resource", () => {
  const component = source("./XYPlot.vue");
  const styles = source("./xy-plot.css");
  const barrel = source("./index.ts");

  assert.match(component, /new uPlot/);
  assert.match(component, /shallowRef<XYPlotInstance>/);
  assert.match(component, /show: series\.show \?\? true/);
  assert.match(component, /series\.path === "bars"\) options\.fill = color/);
  assert.match(component, /createXYPlotPathBuilder\(series\.path\)/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /requestAnimationFrame\(flushAppend\)/);
  assert.match(component, /currentPointCount\.value = countXYPlotPoints\(data\)/);
  assert.match(component, /\!isEmpty\.value/);
  assert.match(component, /\{YYYY\}-\{MM\}-\{DD\}/);
  assert.doesNotMatch(component, /currentData = props\.data;\n\s*instance\.value = new uPlot/);
  assert.match(component, /instance\.value\?\.destroy\(\)/);
  assert.match(component, /aria-keyshortcuts/);
  assert.match(component, /@dblclick="resetZoom"/);
  assert.doesNotMatch(component, /deep:\s*true/);
  assert.match(styles, /\.kappa-xy-plot__plot/);
  assert.doesNotMatch(styles, /^\.uplot/m);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)/);

  for (const name of ["XYPlot", "XYPlotData", "XYPlotProps", "appendXYPlotData"]) {
    assert.match(barrel, new RegExp(name));
  }
});
