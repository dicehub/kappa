import type { HTMLAttributes, VNodeChild } from "vue";

export const BUTTON_GROUP_ORIENTATIONS = ["horizontal", "vertical"] as const;

export type ButtonGroupOrientation = (typeof BUTTON_GROUP_ORIENTATIONS)[number];

export const BUTTON_GROUP_DEFAULT_ORIENTATION =
  "horizontal" satisfies ButtonGroupOrientation;
export const BUTTON_GROUP_SEPARATOR_DEFAULT_ORIENTATION =
  "vertical" satisfies ButtonGroupOrientation;

export const isButtonGroupOrientation = (
  value: unknown,
): value is ButtonGroupOrientation =>
  typeof value === "string" &&
  BUTTON_GROUP_ORIENTATIONS.includes(value as ButtonGroupOrientation);

export const resolveButtonGroupOrientation = (
  value: unknown,
): ButtonGroupOrientation =>
  isButtonGroupOrientation(value) ? value : BUTTON_GROUP_DEFAULT_ORIENTATION;

export const resolveButtonGroupSeparatorOrientation = (
  value: unknown,
): ButtonGroupOrientation =>
  isButtonGroupOrientation(value)
    ? value
    : BUTTON_GROUP_SEPARATOR_DEFAULT_ORIENTATION;

export interface ButtonGroupProps
  extends /* @vue-ignore */ Omit<HTMLAttributes, "role"> {
  /** Layout axis. Does not change native keyboard behavior. */
  orientation?: ButtonGroupOrientation;
}

export type ButtonGroupRootProps = ButtonGroupProps;

export interface ButtonGroupTextProps extends /* @vue-ignore */ HTMLAttributes {
  /** Merge attributes and styling onto one semantic child, such as a label. */
  asChild?: boolean;
}

export interface ButtonGroupSeparatorProps
  extends /* @vue-ignore */ Omit<HTMLAttributes, "role"> {
  /** Separator axis. Use horizontal inside a vertical group. */
  orientation?: ButtonGroupOrientation;
}

export interface ButtonGroupSlots {
  default?: () => VNodeChild;
}

export type ButtonGroupRootSlots = ButtonGroupSlots;
export type ButtonGroupTextSlots = ButtonGroupSlots;
