import uPlot from "uplot";
import type { XYPlotSeriesPath } from "./xy-plot";

export const createXYPlotPathBuilder = (
  path: XYPlotSeriesPath | undefined,
): uPlot.Series.PathBuilder | undefined => {
  if (path === "bars") return uPlot.paths.bars?.({ size: [0.72, 48, 1] });
  if (path === "spline") return uPlot.paths.spline?.();
  if (path === "stepped") return uPlot.paths.stepped?.({});
  if (path === "points") return () => null;
  return undefined;
};
