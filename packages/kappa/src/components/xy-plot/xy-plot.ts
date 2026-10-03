import type uPlot from "uplot";
import type { VNodeChild } from "vue";

export type XYPlotData = uPlot.AlignedData;
export type XYPlotInstance = uPlot;
export type XYPlotScale = "linear" | "log" | "time";
export type XYPlotZoom = "none" | "x" | "xy";
export type XYPlotSeriesPath = "bars" | "line" | "points" | "spline" | "stepped";
export type XYPlotNativeOptions = Partial<Omit<uPlot.Options, "height" | "series" | "width">>;

export interface XYPlotSeries {
  label: string;
  color?: string;
  dash?: number[];
  fill?: string;
  path?: XYPlotSeriesPath;
  points?: boolean;
  scale?: string;
  show?: boolean;
  spanGaps?: boolean;
  valueFormatter?: (value: number) => string;
  width?: number;
}

export interface XYPlotProps {
  /** Accessible name for the plot graphic. */
  ariaLabel: string;
  /** Visible range, series, units, and main trend in plain language. */
  ariaDescription: string;
  /** Aligned column data: one X column followed by one column per series. */
  data: XYPlotData;
  series: readonly XYPlotSeries[];
  description?: string;
  empty?: boolean;
  emptyLabel?: string;
  error?: string;
  height?: string | number;
  loading?: boolean;
  loadingLabel?: string;
  nativeOptions?: XYPlotNativeOptions;
  /** Reapply mutated data without a deep Vue watcher. */
  revision?: number | string;
  showLegend?: boolean;
  showReset?: boolean;
  title?: string;
  wheelZoom?: boolean;
  xLabel?: string;
  xScale?: Exclude<XYPlotScale, "log">;
  yLabel?: string;
  yScale?: Exclude<XYPlotScale, "time">;
  zoom?: XYPlotZoom;
}

export interface XYPlotAppendOptions {
  /** Retain only the newest points. This prevents unbounded stream memory. */
  maxPoints?: number;
}

export interface XYPlotEmits {
  error: [error: unknown];
  ready: [instance: XYPlotInstance];
}

export interface XYPlotSlots {
  empty?: () => VNodeChild;
  error?: (props: { error?: string }) => VNodeChild;
  footer?: () => VNodeChild;
  loading?: () => VNodeChild;
  toolbar?: () => VNodeChild;
}

export const XY_PLOT_DEFAULT_MAX_POINTS = 10_000;

export const countXYPlotPoints = (data: XYPlotData): number => data[0]?.length ?? 0;

export const validateXYPlotData = (
  data: XYPlotData,
  seriesCount: number,
): string | undefined => {
  if (data.length !== seriesCount + 1) {
    return `XYPlot needs ${seriesCount + 1} data columns for ${seriesCount} series.`;
  }

  const pointCount = countXYPlotPoints(data);
  const differentLength = data.findIndex((column) => column.length !== pointCount);
  if (differentLength >= 0) {
    return `XYPlot data column ${differentLength + 1} has a different length.`;
  }
  return undefined;
};

export const resolveXYPlotMaxPoints = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : XY_PLOT_DEFAULT_MAX_POINTS;

export const appendXYPlotData = (
  current: XYPlotData,
  incoming: XYPlotData,
  maxPoints: number = XY_PLOT_DEFAULT_MAX_POINTS,
): XYPlotData => {
  if (current.length !== incoming.length) {
    throw new RangeError("XYPlot append data must use the current column count.");
  }

  const limit = resolveXYPlotMaxPoints(maxPoints);
  return current.map((column, index) => {
    const combined = [...column, ...(incoming[index] ?? [])];
    return combined.length > limit ? combined.slice(combined.length - limit) : combined;
  }) as XYPlotData;
};

export const formatXYPlotValue = (value: number): string => {
  if (!Number.isFinite(value)) return "—";
  const absolute = Math.abs(value);
  if (absolute !== 0 && (absolute < 0.001 || absolute >= 100_000)) {
    return value.toExponential(2);
  }
  return new Intl.NumberFormat(undefined, { maximumSignificantDigits: 5 }).format(value);
};

export const xyPlotErrorMessage = (error: unknown): string =>
  error instanceof Error && error.message.trim() ? error.message : "The plot could not be rendered.";
