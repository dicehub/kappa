import type {
  EChartsInitOpts,
  EChartsOption,
  EChartsType,
  SetOptionOpts,
  TooltipComponentOption,
} from "echarts";
import type * as EChartsCore from "echarts/core";
import type { VNodeChild } from "vue";

export type ChartEngine = typeof EChartsCore;
export type ChartInstance = EChartsType;
export type ChartRenderer = NonNullable<EChartsInitOpts["renderer"]>;
export type ChartUpdateOptions = SetOptionOpts;
export type ChartEventHandler = (params: unknown) => void;
export type ChartEvents = Readonly<Record<string, ChartEventHandler | undefined>>;

export type ChartTooltipOptions = Omit<
  TooltipComponentOption,
  "extraCssText" | "formatter" | "renderMode"
> & {
  /** Kappa keeps the standard tooltip in non-HTML rich-text mode. */
  renderMode?: "richText";
  extraCssText?: never;
  formatter?: never;
};

export type ChartOptions = Omit<EChartsOption, "tooltip"> & {
  /** Safe standard tooltip. Use application-owned DOM for custom content. */
  tooltip?: ChartTooltipOptions | ChartTooltipOptions[];
};

export interface ChartProps {
  /** Accessible name for the chart graphic. */
  ariaLabel: string;
  /** Data summary or instructions for users who cannot inspect the canvas. */
  ariaDescription: string;
  /** Modular ECharts namespace after the consumer registers its required features. */
  engine: ChartEngine;
  /** Trusted application options. Never pass serialized user configuration directly. */
  options: ChartOptions;
  description?: string;
  empty?: boolean;
  emptyLabel?: string;
  error?: string;
  events?: ChartEvents;
  height?: string | number;
  loading?: boolean;
  loadingLabel?: string;
  renderer?: ChartRenderer;
  /** Reapply mutated options without a deep Vue watcher. */
  revision?: number | string;
  title?: string;
  updateOptions?: ChartUpdateOptions;
}

export interface ChartEmits {
  error: [error: unknown];
  ready: [instance: ChartInstance];
}

export interface ChartSlots {
  empty?: () => VNodeChild;
  error?: (props: { error?: string }) => VNodeChild;
  footer?: () => VNodeChild;
  loading?: () => VNodeChild;
  toolbar?: () => VNodeChild;
}

type UnsafeTooltipOptions = TooltipComponentOption & {
  extraCssText?: string;
  formatter?: unknown;
};

const sanitizeTooltip = (tooltip: ChartTooltipOptions): TooltipComponentOption => {
  const {
    extraCssText: _extraCssText,
    formatter: _formatter,
    renderMode: _renderMode,
    ...safe
  } = tooltip as UnsafeTooltipOptions;
  return { ...safe, renderMode: "richText" };
};

const sanitizeToolbox = (toolbox: unknown): unknown => {
  if (!toolbox || typeof toolbox !== "object") return toolbox;
  if (Array.isArray(toolbox)) return toolbox.map(sanitizeToolbox);

  const value = toolbox as Record<string, unknown>;
  const feature =
    value.feature && typeof value.feature === "object"
      ? { ...(value.feature as Record<string, unknown>) }
      : undefined;
  if (feature) {
    delete feature.dataView;
    delete feature.saveAsImage;
  }
  return { ...value, ...(feature ? { feature } : {}) };
};

/** Apply Kappa's safe tooltip and toolbox boundary without walking large series data. */
export const prepareChartOptions = (options: ChartOptions): EChartsOption => {
  const prepared: EChartsOption = { ...options };

  if (options.toolbox !== undefined) {
    prepared.toolbox = sanitizeToolbox(options.toolbox) as EChartsOption["toolbox"];
  } else {
    delete prepared.toolbox;
  }

  if (options.tooltip !== undefined) {
    prepared.tooltip = Array.isArray(options.tooltip)
      ? options.tooltip.map(sanitizeTooltip)
      : sanitizeTooltip(options.tooltip);
  } else {
    delete prepared.tooltip;
  }

  return prepared;
};

export const chartErrorMessage = (error: unknown) =>
  error instanceof Error && error.message.trim() ? error.message : "The chart could not be rendered.";
