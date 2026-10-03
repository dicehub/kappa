import type { HTMLAttributes, VNodeChild } from "vue";

export const ASPECT_RATIO_DEFAULT_RATIO = 1;

export interface AspectRatioProps
  extends /* @vue-ignore */ HTMLAttributes {
  /** Width divided by height. Invalid values use a square ratio at runtime. */
  ratio: number;
}

export interface AspectRatioSlots {
  /** Content constrained by the resolved ratio. */
  default?: () => VNodeChild;
}

const isFinitePositiveNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

export const isAspectRatio = (value: unknown): value is number =>
  isFinitePositiveNumber(value);

export const resolveAspectRatio = (value: unknown): number =>
  isAspectRatio(value) ? value : ASPECT_RATIO_DEFAULT_RATIO;
