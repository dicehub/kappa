import type { HTMLAttributes } from "vue";

export const METER_SIZES = ["sm", "base", "lg"] as const;
export const METER_TONES = [
  "accent",
  "neutral",
  "success",
  "warning",
  "danger",
] as const;

export type MeterSize = (typeof METER_SIZES)[number];
export type MeterTone = (typeof METER_TONES)[number];
export type MeterValueState = "empty" | "partial" | "full";

export const METER_DEFAULT_MIN = 0;
export const METER_DEFAULT_MAX = 100;
export const METER_DEFAULT_LABEL = "Meter";
export const METER_DEFAULT_SIZE = "base" satisfies MeterSize;
export const METER_DEFAULT_TONE = "accent" satisfies MeterTone;

export interface MeterProps
  extends /* @vue-ignore */ Omit<
    HTMLAttributes,
    | "aria-label"
    | "aria-labelledby"
    | "aria-valuemax"
    | "aria-valuemin"
    | "aria-valuenow"
    | "aria-valuetext"
    | "role"
  > {
  /** Visible and accessible name for the measurement. */
  label: string;
  /** Current numeric measurement. Values outside the range are clamped. */
  value: number;
  /** Lowest value in the known range. */
  min?: number;
  /** Highest value in the known range. Must be greater than min. */
  max?: number;
  /** Replaces the default percentage in visible and assistive text. */
  valueText?: string;
  /** Shows the formatted value beside the label. */
  showValue?: boolean;
  /** Controls the text and track density. */
  size?: MeterSize;
  /** Consumer-selected meaning of the indicator color. */
  tone?: MeterTone;
}

export interface MeterRange {
  min: number;
  max: number;
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value =>
  typeof value === "string" && values.includes(value as Value);

export const isMeterSize = (value: unknown): value is MeterSize =>
  includes(METER_SIZES, value);

export const isMeterTone = (value: unknown): value is MeterTone =>
  includes(METER_TONES, value);

export const resolveMeterSize = (value: unknown): MeterSize =>
  isMeterSize(value) ? value : METER_DEFAULT_SIZE;

export const resolveMeterTone = (value: unknown): MeterTone =>
  isMeterTone(value) ? value : METER_DEFAULT_TONE;

export const resolveMeterLabel = (value: unknown): string =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : METER_DEFAULT_LABEL;

export const resolveMeterRange = (
  min: unknown = METER_DEFAULT_MIN,
  max: unknown = METER_DEFAULT_MAX,
): MeterRange => {
  const resolvedMin = isFiniteNumber(min) ? min : METER_DEFAULT_MIN;
  const candidateMax = isFiniteNumber(max) ? max : METER_DEFAULT_MAX;

  return {
    min: resolvedMin,
    max:
      candidateMax > resolvedMin
        ? candidateMax
        : resolvedMin + (METER_DEFAULT_MAX - METER_DEFAULT_MIN),
  };
};

export const clampMeterValue = (
  value: unknown,
  min: unknown = METER_DEFAULT_MIN,
  max: unknown = METER_DEFAULT_MAX,
): number => {
  const range = resolveMeterRange(min, max);
  const resolvedValue = isFiniteNumber(value) ? value : range.min;

  return Math.min(Math.max(resolvedValue, range.min), range.max);
};

export const getMeterPercentage = (
  value: unknown,
  min: unknown = METER_DEFAULT_MIN,
  max: unknown = METER_DEFAULT_MAX,
): number => {
  const range = resolveMeterRange(min, max);
  const resolvedValue = clampMeterValue(value, range.min, range.max);

  return ((resolvedValue - range.min) / (range.max - range.min)) * 100;
};

export const formatMeterValue = (
  value: unknown,
  min: unknown = METER_DEFAULT_MIN,
  max: unknown = METER_DEFAULT_MAX,
): string => `${Math.round(getMeterPercentage(value, min, max))}%`;

export const resolveMeterValueText = (
  valueText: unknown,
  value: unknown,
  min: unknown = METER_DEFAULT_MIN,
  max: unknown = METER_DEFAULT_MAX,
): string =>
  typeof valueText === "string" && valueText.trim().length > 0
    ? valueText.trim()
    : formatMeterValue(value, min, max);

export const resolveMeterValueState = (percentage: number): MeterValueState => {
  if (percentage <= 0) return "empty";
  if (percentage >= 100) return "full";
  return "partial";
};
