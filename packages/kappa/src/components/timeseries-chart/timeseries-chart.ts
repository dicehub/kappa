import type {
  ChartEmits,
  ChartInstance,
  ChartOptions,
  ChartProps,
  ChartSlots,
  ChartUpdateOptions,
} from "../chart";

export type TimeseriesChartType = "area" | "bar" | "line";
export type TimeseriesChartCurve = "linear" | "smooth" | "step";
export type TimeseriesChartTimeZone = "local" | "utc";
export type TimeseriesChartPoint = readonly [timestamp: number, value: number | null];

export interface TimeseriesChartSeries {
  /** Stable identity used when series are reordered. Defaults to the series name. */
  id?: string;
  /** Visible series name used by the legend and tooltip. */
  name: string;
  /** Timestamp and value pairs. Timestamps use Unix milliseconds. */
  data: readonly TimeseriesChartPoint[];
  /** Override the chart-wide rendering type. */
  type?: TimeseriesChartType;
  /** Override the chart-wide line interpolation. */
  curve?: TimeseriesChartCurve;
  /** Set an explicit series color instead of the Kappa chart palette. */
  color?: string;
  /** Join bars or areas with the same stack name. */
  stack?: string;
  /** Join a line across null values. */
  connectNulls?: boolean;
  /** Show a symbol for every sample. */
  showPoints?: boolean;
  /** Format values in the standard rich-text tooltip. */
  valueFormatter?: (value: number) => string;
  /** Line width in CSS pixels. */
  width?: number;
  /** Use a dashed or dotted line. */
  dash?: "dashed" | "dotted";
}

export interface TimeseriesChartProps extends Omit<ChartProps, "options"> {
  series: readonly TimeseriesChartSeries[];
  /** Default rendering type for every series. */
  type?: TimeseriesChartType;
  /** Default line interpolation. */
  curve?: TimeseriesChartCurve;
  /** Format chart time in the browser time zone or UTC. */
  timeZone?: TimeseriesChartTimeZone;
  /** Locale used by time and numeric axis labels. */
  locale?: string;
  /** Show the series legend. */
  showLegend?: boolean;
  /** Show horizontal reference lines. */
  showGrid?: boolean;
  /** Show the standard axis tooltip. */
  tooltip?: boolean;
  /** Animate normal dashboard-sized data updates. */
  animation?: boolean;
  /** Optional label for the time axis. */
  xLabel?: string;
  /** Optional label for the value axis. */
  yLabel?: string;
  /** Fixed minimum value or an ECharts data-bound minimum. */
  yMin?: number | "dataMin";
  /** Fixed maximum value or an ECharts data-bound maximum. */
  yMax?: number | "dataMax";
  /** Minimum interval between value-axis ticks. */
  yMinInterval?: number;
}

export type TimeseriesChartEmits = ChartEmits;
export type TimeseriesChartSlots = ChartSlots;

export interface TimeseriesChartApi {
  dispatchAction: ChartInstance["dispatchAction"];
  getInstance: () => ChartInstance | undefined;
  resize: () => void;
  setOption: (options: ChartOptions, settings?: ChartUpdateOptions) => void;
}

export interface CreateTimeseriesChartOptions {
  animation: boolean;
  curve: TimeseriesChartCurve;
  locale?: string;
  reducedMotion: boolean;
  series: readonly TimeseriesChartSeries[];
  showGrid: boolean;
  showLegend: boolean;
  timeZone: TimeseriesChartTimeZone;
  tooltip: boolean;
  type: TimeseriesChartType;
  xLabel?: string;
  yLabel?: string;
  yMax?: number | "dataMax";
  yMin?: number | "dataMin";
  yMinInterval?: number;
}

type TimeseriesTimeUnit = "day" | "hour" | "millisecond" | "minute" | "month" | "second" | "year";

interface TimeseriesTimeFormatterExtra {
  time?: {
    lowerTimeUnit?: TimeseriesTimeUnit;
    upperTimeUnit?: TimeseriesTimeUnit;
  };
}

export const resolveTimeseriesUpdateOptions = (
  options?: ChartUpdateOptions,
): ChartUpdateOptions => {
  const current = options?.replaceMerge;
  const replaceMerge = Array.isArray(current) ? current : current ? [current] : [];
  return {
    ...options,
    replaceMerge: [...new Set([...replaceMerge, "series"])],
  };
};

const curveOptions = (curve: TimeseriesChartCurve) => ({
  smooth: curve === "smooth" ? 0.32 : false,
  step: curve === "step" ? "end" : false,
});

const createSeries = (
  item: TimeseriesChartSeries,
  defaultType: TimeseriesChartType,
  defaultCurve: TimeseriesChartCurve,
) => {
  const type = item.type ?? defaultType;
  const curve = item.curve ?? defaultCurve;
  const tooltip = item.valueFormatter
    ? {
        valueFormatter: (raw: unknown) => {
          const value = Array.isArray(raw) ? raw[1] : raw;
          return typeof value === "number" ? item.valueFormatter?.(value) : "—";
        },
      }
    : undefined;

  if (type === "bar") {
    return {
      id: item.id ?? item.name,
      name: item.name,
      type: "bar" as const,
      data: item.data,
      stack: item.stack,
      itemStyle: {
        borderRadius: [3, 3, 0, 0],
        color: item.color,
      },
      barMaxWidth: 24,
      emphasis: { focus: "series" as const },
      tooltip,
    };
  }

  return {
    id: item.id ?? item.name,
    name: item.name,
    type: "line" as const,
    data: item.data,
    stack: item.stack,
    connectNulls: item.connectNulls ?? false,
    showSymbol: item.showPoints ?? false,
    symbol: "circle" as const,
    symbolSize: 6,
    ...curveOptions(curve),
    lineStyle: {
      color: item.color,
      type: item.dash ?? "solid",
      width: item.width ?? 2,
    },
    itemStyle: { color: item.color },
    areaStyle: type === "area" ? { opacity: 0.12 } : undefined,
    emphasis: {
      focus: "series" as const,
      lineStyle: { width: (item.width ?? 2) + 0.5 },
    },
    tooltip,
  };
};

export const createTimeseriesChartOptions = (
  config: CreateTimeseriesChartOptions,
): ChartOptions => {
  const motionEnabled = config.animation && !config.reducedMotion;
  const numberFormatter = new Intl.NumberFormat(config.locale, {
    maximumFractionDigits: 2,
    notation: "compact",
  });
  const timeFormatters = new Map<string, Intl.DateTimeFormat>();
  const formatTime = (value: number, extra?: TimeseriesTimeFormatterExtra) => {
    const lowerUnit = extra?.time?.lowerTimeUnit ?? "minute";
    const includeYear = lowerUnit === "year" || extra?.time?.upperTimeUnit === "year";
    const key = `${lowerUnit}:${includeYear}`;
    let formatter = timeFormatters.get(key);
    if (!formatter) {
      const date: Intl.DateTimeFormatOptions =
        lowerUnit === "millisecond"
          ? { fractionalSecondDigits: 3, hour: "2-digit", minute: "2-digit", second: "2-digit" }
          : lowerUnit === "second"
            ? { hour: "2-digit", minute: "2-digit", second: "2-digit" }
            : lowerUnit === "minute"
              ? { hour: "2-digit", minute: "2-digit" }
              : lowerUnit === "hour"
                ? { day: "numeric", hour: "2-digit", month: "short" }
                : lowerUnit === "day"
                  ? { day: "numeric", month: "short", year: includeYear ? "numeric" : undefined }
                  : lowerUnit === "month"
                    ? { month: "short", year: "numeric" }
                    : { year: "numeric" };
      formatter = new Intl.DateTimeFormat(config.locale, {
        ...date,
        timeZone: config.timeZone === "utc" ? "UTC" : undefined,
      });
      timeFormatters.set(key, formatter);
    }
    return formatter.format(value);
  };

  return {
    animation: motionEnabled,
    animationDuration: 350,
    animationDurationUpdate: 260,
    animationEasing: "cubicOut",
    animationEasingUpdate: "cubicOut",
    useUTC: config.timeZone === "utc",
    grid: {
      outerBoundsMode: "same",
      outerBoundsContain: "all",
      top: config.showLegend ? 44 : 20,
      right: 18,
      bottom: config.xLabel ? 16 : 10,
      left: config.yLabel ? 28 : 12,
    },
    legend: config.showLegend
      ? {
          show: true,
          selectedMode: false,
          top: 12,
          left: 12,
          itemGap: 18,
          itemHeight: 8,
          itemWidth: 18,
          icon: "roundRect",
          textStyle: { fontSize: 11 },
        }
      : { show: false },
    tooltip: config.tooltip
      ? {
          show: true,
          trigger: "axis",
          confine: true,
          order: "valueDesc",
          transitionDuration: motionEnabled ? 0.12 : 0,
          axisPointer: {
            animation: motionEnabled,
            type: "line",
            lineStyle: { type: "dashed", width: 1 },
          },
          textStyle: { fontSize: 11 },
        }
      : { show: false },
    xAxis: {
      type: "time",
      name: config.xLabel,
      nameGap: 22,
      nameLocation: "middle",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        hideOverlap: true,
        margin: 12,
        fontSize: 10,
        formatter: (value: number, _index: number, extra: TimeseriesTimeFormatterExtra) =>
          formatTime(value, extra),
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      name: config.yLabel,
      nameGap: 38,
      nameLocation: "middle",
      nameRotate: 90,
      min: config.yMin,
      max: config.yMax,
      minInterval: config.yMinInterval,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        margin: 10,
        fontSize: 10,
        formatter: (value: number) => numberFormatter.format(value),
      },
      splitLine: {
        show: config.showGrid,
        lineStyle: { type: "dashed", width: 1 },
      },
    },
    series: config.series.map((item) =>
      createSeries(item, config.type, config.curve),
    ),
  };
};
