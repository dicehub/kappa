export const LOADER_SIZES = {
  sm: 16,
  base: 24,
  lg: 32,
} as const;

export const LOADER_VARIANTS = [
  "spinner",
  "waveform",
  "helix",
  "quantum",
  "dot-wave",
  "dot-stream",
  "mirage",
  "ping",
  "orbit",
] as const;

export type LoaderSize = keyof typeof LOADER_SIZES;
export type LoaderVariant = (typeof LOADER_VARIANTS)[number];

export const LOADER_DEFAULT_SIZE = "base" satisfies LoaderSize;
export const LOADER_DEFAULT_VARIANT = "spinner" satisfies LoaderVariant;
export const LOADER_DEFAULT_DURATION = 1500;
export const LOADER_DEFAULT_LABEL = "Loading";

const LOADER_MIN_DURATION = 400;
const LOADER_MAX_DURATION = 10_000;

export interface LoaderProps {
  /** Preset size or a custom positive pixel value. */
  size?: LoaderSize | number;
  /** Visual motion used by the loading graphic. */
  variant?: LoaderVariant;
  /** Duration of one animation cycle in milliseconds. */
  duration?: number;
  /** Text announced when the loader appears. Translate this value for the current locale. */
  label?: string;
  /** Hides the loader from assistive technology when nearby visible text already describes the state. */
  decorative?: boolean;
}

export const isLoaderSize = (value: unknown): value is LoaderSize =>
  typeof value === "string" && Object.hasOwn(LOADER_SIZES, value);

export const isLoaderVariant = (value: unknown): value is LoaderVariant =>
  typeof value === "string" && LOADER_VARIANTS.includes(value as LoaderVariant);

export const resolveLoaderSize = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  return isLoaderSize(value) ? LOADER_SIZES[value] : LOADER_SIZES[LOADER_DEFAULT_SIZE];
};

export const resolveLoaderVariant = (value: unknown): LoaderVariant =>
  isLoaderVariant(value) ? value : LOADER_DEFAULT_VARIANT;

export const resolveLoaderDuration = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return LOADER_DEFAULT_DURATION;
  return Math.min(LOADER_MAX_DURATION, Math.max(LOADER_MIN_DURATION, value));
};

export const resolveLoaderLabel = (value: unknown): string =>
  typeof value === "string" && value.trim().length > 0 ? value : LOADER_DEFAULT_LABEL;
