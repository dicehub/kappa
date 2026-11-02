import type { ButtonProps, ButtonSlots } from "./button";
import type { TooltipPositioningOptions } from "../tooltip";

export const TOOLBAR_BUTTON_VARIANTS = ["ghost", "outline"] as const;
export const TOOLBAR_BUTTON_SIZES = ["sm", "base"] as const;
export type ToolbarButtonVariant = (typeof TOOLBAR_BUTTON_VARIANTS)[number];
export type ToolbarButtonSize = (typeof TOOLBAR_BUTTON_SIZES)[number];

export const TOOLBAR_BUTTON_DEFAULT_VARIANT = "ghost" satisfies ToolbarButtonVariant;
export const TOOLBAR_BUTTON_DEFAULT_SIZE = "base" satisfies ToolbarButtonSize;

export const isToolbarButtonVariant = (value: unknown): value is ToolbarButtonVariant =>
  typeof value === "string" && TOOLBAR_BUTTON_VARIANTS.includes(value as ToolbarButtonVariant);
export const isToolbarButtonSize = (value: unknown): value is ToolbarButtonSize =>
  typeof value === "string" && TOOLBAR_BUTTON_SIZES.includes(value as ToolbarButtonSize);
export const resolveToolbarButtonVariant = (value: unknown): ToolbarButtonVariant =>
  isToolbarButtonVariant(value) ? value : TOOLBAR_BUTTON_DEFAULT_VARIANT;
export const resolveToolbarButtonSize = (value: unknown): ToolbarButtonSize =>
  isToolbarButtonSize(value) ? value : TOOLBAR_BUTTON_DEFAULT_SIZE;

export interface ToolbarButtonProps extends Omit<ButtonProps, "size" | "variant"> {
  /** Standalone height: sm is 24px, base is 32px. Toolbar.Root owns grouped sizing. */
  size?: ToolbarButtonSize;
  /** Bottom tooltip with a 500ms hover delay and immediate close. Replaces the native title. */
  tooltip?: string;
  /** Preferred tooltip side. Defaults to bottom; viewport collisions can adjust it. */
  tooltipPlacement?: TooltipPositioningOptions["placement"];
  /** Standalone emphasis. Toolbar.Root retains its grouped ghost appearance. */
  variant?: ToolbarButtonVariant;
}

export type ToolbarButtonSlots = ButtonSlots;
