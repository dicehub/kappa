import type { HTMLAttributes } from "vue";

export const SEPARATOR_ORIENTATIONS = ["horizontal", "vertical"] as const;

export type SeparatorOrientation = (typeof SEPARATOR_ORIENTATIONS)[number];

export const SEPARATOR_DEFAULT_ORIENTATION =
  "horizontal" satisfies SeparatorOrientation;

export interface SeparatorProps
  extends /* @vue-ignore */ Omit<HTMLAttributes, "role"> {
  /** Axis of the dividing line. */
  orientation?: SeparatorOrientation;
  /** Removes separator semantics when the line only supports visual layout. */
  decorative?: boolean;
}

export const isSeparatorOrientation = (
  value: unknown,
): value is SeparatorOrientation =>
  typeof value === "string" &&
  SEPARATOR_ORIENTATIONS.includes(value as SeparatorOrientation);

export const resolveSeparatorOrientation = (
  value: unknown,
): SeparatorOrientation =>
  isSeparatorOrientation(value) ? value : SEPARATOR_DEFAULT_ORIENTATION;
