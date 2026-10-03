import type { ButtonProps, ButtonSlots, LinkButtonProps } from "../button/button";
import type {
  InputGroupRootProps,
  InputGroupSlots,
} from "../input-group/input-group";
import type { InputProps } from "../input/input";
import type { SeparatorProps } from "../separator/separator";
import type { HTMLAttributes, VNodeChild } from "vue";

export const TOOLBAR_ORIENTATIONS = ["horizontal", "vertical"] as const;
export const TOOLBAR_SIZES = ["xs", "sm", "base", "lg"] as const;

export type ToolbarOrientation = (typeof TOOLBAR_ORIENTATIONS)[number];
export type ToolbarSize = (typeof TOOLBAR_SIZES)[number];

export const TOOLBAR_DEFAULT_ORIENTATION =
  "horizontal" satisfies ToolbarOrientation;
export const TOOLBAR_DEFAULT_SIZE = "base" satisfies ToolbarSize;
export const TOOLBAR_DEFAULT_LOOP_FOCUS = true;

const includesOwn = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T => typeof value === "string" && values.includes(value as T);

export const isToolbarOrientation = (
  value: unknown,
): value is ToolbarOrientation => includesOwn(TOOLBAR_ORIENTATIONS, value);

export const isToolbarSize = (value: unknown): value is ToolbarSize =>
  includesOwn(TOOLBAR_SIZES, value);

export const resolveToolbarOrientation = (
  value: unknown,
): ToolbarOrientation =>
  isToolbarOrientation(value) ? value : TOOLBAR_DEFAULT_ORIENTATION;

export const resolveToolbarSize = (value: unknown): ToolbarSize =>
  isToolbarSize(value) ? value : TOOLBAR_DEFAULT_SIZE;

export interface ToolbarRootProps
  extends /* @vue-ignore */ Omit<HTMLAttributes, "role"> {
  /** Layout axis used by arrow-key navigation. */
  orientation?: ToolbarOrientation;
  /** Shared density for supported toolbar controls. */
  size?: ToolbarSize;
  /** Disable navigation and mark the toolbar unavailable. */
  disabled?: boolean;
  /** Whether arrow navigation wraps from the last item to the first. */
  loopFocus?: boolean;
}

export type ToolbarProps = ToolbarRootProps;

export interface ToolbarSlots {
  default?: () => VNodeChild;
}

export type ToolbarButtonProps = Omit<ButtonProps, "size" | "variant">;

export type ToolbarButtonSlots = ButtonSlots;

export interface ToolbarLinkProps
  extends Omit<LinkButtonProps, "size" | "variant"> {}

export type ToolbarLinkSlots = ButtonSlots;

export type ToolbarInputProps = Omit<InputProps, "size">;

/** Props consumed by Toolbar.Input; other input attributes remain in `$attrs`. */
export interface ToolbarInputComponentProps {
  disabled?: boolean;
  invalid?: boolean;
  modelValue?: string | number;
  passwordManagerIgnore?: boolean;
}

export type ToolbarInputEmits = {
  "update:modelValue": [value: string];
  valueChange: [value: string];
};

export interface ToolbarInputSlots {}

export type ToolbarInputGroupProps = Omit<InputGroupRootProps, "size">;

export type ToolbarInputGroupSlots = InputGroupSlots;
export type ToolbarSeparatorProps = SeparatorProps;

export interface ToolbarSeparatorSlots {}
