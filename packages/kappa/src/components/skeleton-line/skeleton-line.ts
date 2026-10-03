export const SKELETON_LINE_DEFAULT_WIDTH = "100%";
export const SKELETON_LINE_DEFAULT_HEIGHT = "0.5rem";

export type SkeletonLineLength = string | number;

export interface SkeletonLineProps {
  /** Exact CSS width. Positive numbers are converted to pixels. */
  width?: SkeletonLineLength;
  /** Exact CSS height. Positive numbers are converted to pixels. */
  height?: SkeletonLineLength;
  /** Optional container height that vertically centers the line. */
  blockHeight?: SkeletonLineLength;
  /** Enables the loading scan. */
  animated?: boolean;
}

export const resolveSkeletonLineLength = (value: unknown, fallback: string): string => {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? `${value}px` : fallback;
  }

  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
};
