import type {
  ToggleGroupContextProps as ArkToggleGroupContextProps,
  ToggleGroupItemProps as ArkToggleGroupItemProps,
  ToggleGroupRootProps as ArkToggleGroupRootProps,
  ToggleGroupRootProviderProps as ArkToggleGroupRootProviderProps,
  ToggleGroupValueChangeDetails,
  UseToggleGroupContext,
  UseToggleGroupReturn,
} from "@ark-ui/vue/toggle-group";
import type { UnwrapRef, VNodeChild } from "vue";

export const TOGGLE_GROUP_VARIANTS = ["default", "outline"] as const;
export const TOGGLE_GROUP_SIZES = ["sm", "base", "lg"] as const;
export const TOGGLE_GROUP_SPACINGS = ["none", "sm", "md"] as const;

export type ToggleGroupVariant = (typeof TOGGLE_GROUP_VARIANTS)[number];
export type ToggleGroupSize = (typeof TOGGLE_GROUP_SIZES)[number];
export type ToggleGroupSpacing = (typeof TOGGLE_GROUP_SPACINGS)[number];

export const TOGGLE_GROUP_DEFAULT_VARIANT =
  "default" satisfies ToggleGroupVariant;
export const TOGGLE_GROUP_DEFAULT_SIZE = "base" satisfies ToggleGroupSize;
export const TOGGLE_GROUP_DEFAULT_SPACING = "sm" satisfies ToggleGroupSpacing;

const includesOwn = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T => typeof value === "string" && values.includes(value as T);

export const isToggleGroupVariant = (value: unknown): value is ToggleGroupVariant =>
  includesOwn(TOGGLE_GROUP_VARIANTS, value);

export const isToggleGroupSize = (value: unknown): value is ToggleGroupSize =>
  includesOwn(TOGGLE_GROUP_SIZES, value);

export const isToggleGroupSpacing = (value: unknown): value is ToggleGroupSpacing =>
  includesOwn(TOGGLE_GROUP_SPACINGS, value);

export const resolveToggleGroupVariant = (value: unknown): ToggleGroupVariant =>
  isToggleGroupVariant(value) ? value : TOGGLE_GROUP_DEFAULT_VARIANT;

export const resolveToggleGroupSize = (value: unknown): ToggleGroupSize =>
  isToggleGroupSize(value) ? value : TOGGLE_GROUP_DEFAULT_SIZE;

export const resolveToggleGroupSpacing = (value: unknown): ToggleGroupSpacing =>
  isToggleGroupSpacing(value) ? value : TOGGLE_GROUP_DEFAULT_SPACING;

export type ToggleGroupApi = UnwrapRef<UseToggleGroupReturn>;
export type ToggleGroupContextValue = UnwrapRef<UseToggleGroupContext>;

export interface ToggleGroupProps {
  asChild?: ArkToggleGroupRootProps["asChild"];
  defaultValue?: ArkToggleGroupRootProps["defaultValue"];
  deselectable?: ArkToggleGroupRootProps["deselectable"];
  disabled?: ArkToggleGroupRootProps["disabled"];
  id?: ArkToggleGroupRootProps["id"];
  ids?: ArkToggleGroupRootProps["ids"];
  loopFocus?: ArkToggleGroupRootProps["loopFocus"];
  modelValue?: ArkToggleGroupRootProps["modelValue"];
  multiple?: ArkToggleGroupRootProps["multiple"];
  orientation?: ArkToggleGroupRootProps["orientation"];
  rovingFocus?: ArkToggleGroupRootProps["rovingFocus"];
  /** Quiet or bordered visual treatment for the item buttons. */
  variant?: ToggleGroupVariant;
  /** Compact control height. */
  size?: ToggleGroupSize;
  /** Space between items. Use `none` for a connected control group. */
  spacing?: ToggleGroupSpacing;
}

export type ToggleGroupRootProps = ToggleGroupProps;

export interface ToggleGroupRootProviderProps
  extends Pick<ArkToggleGroupRootProviderProps, "value" | "asChild"> {
  /** Quiet or bordered visual treatment for the item buttons. */
  variant?: ToggleGroupVariant;
  /** Compact control height. */
  size?: ToggleGroupSize;
  /** Space between items. Use `none` for a connected control group. */
  spacing?: ToggleGroupSpacing;
}

export type ToggleGroupItemProps = ArkToggleGroupItemProps;
export type ToggleGroupContextProps = ArkToggleGroupContextProps;

export type ToggleGroupEmits = {
  valueChange: [details: ToggleGroupValueChangeDetails];
  "update:modelValue": [value: string[]];
};

export interface ToggleGroupSlots {
  default?: () => VNodeChild;
}

export type ToggleGroupRootSlots = ToggleGroupSlots;
export type ToggleGroupRootProviderSlots = ToggleGroupSlots;
export type ToggleGroupItemSlots = ToggleGroupSlots;

export interface ToggleGroupContextSlots {
  default?: (context: ToggleGroupContextValue) => VNodeChild;
}

export type {
  ToggleGroupValueChangeDetails,
  UseToggleGroupContext,
  UseToggleGroupReturn,
};
