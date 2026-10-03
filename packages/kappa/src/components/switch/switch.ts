import type {
  SwitchCheckedChangeDetails,
  SwitchControlProps as ArkSwitchControlProps,
  SwitchLabelProps as ArkSwitchLabelProps,
  SwitchRootProps as ArkSwitchRootProps,
  SwitchThumbProps as ArkSwitchThumbProps,
  UseSwitchContext,
  UseSwitchReturn,
} from "@ark-ui/vue/switch";
import type { UnwrapRef, VNodeChild } from "vue";

export const SWITCH_SIZES = ["sm", "base", "lg"] as const;
export const SWITCH_DEFAULT_SIZE = "base" satisfies SwitchSize;

export type SwitchSize = (typeof SWITCH_SIZES)[number];
export type SwitchDirection = "ltr" | "rtl";
export type SwitchApi = UnwrapRef<UseSwitchReturn>;
export type SwitchContextValue = UnwrapRef<UseSwitchContext>;

export const isSwitchSize = (value: unknown): value is SwitchSize =>
  typeof value === "string" && SWITCH_SIZES.includes(value as SwitchSize);

export const resolveSwitchSize = (value: unknown): SwitchSize =>
  isSwitchSize(value) ? value : SWITCH_DEFAULT_SIZE;

export interface SwitchProps {
  asChild?: ArkSwitchRootProps["asChild"];
  checked?: ArkSwitchRootProps["checked"];
  defaultChecked?: ArkSwitchRootProps["defaultChecked"];
  disabled?: ArkSwitchRootProps["disabled"];
  /** Overrides the inherited Ark UI locale direction. */
  dir?: SwitchDirection;
  form?: ArkSwitchRootProps["form"];
  id?: ArkSwitchRootProps["id"];
  ids?: ArkSwitchRootProps["ids"];
  invalid?: ArkSwitchRootProps["invalid"];
  label?: ArkSwitchRootProps["label"];
  name?: ArkSwitchRootProps["name"];
  readOnly?: ArkSwitchRootProps["readOnly"];
  required?: ArkSwitchRootProps["required"];
  /** Compact track geometry. */
  size?: SwitchSize;
  value?: ArkSwitchRootProps["value"];
}

export type SwitchRootProps = SwitchProps;

export type SwitchEmits = {
  checkedChange: [details: SwitchCheckedChangeDetails];
  "update:checked": [checked: boolean];
};

export interface SwitchSlots {
  default?: () => VNodeChild;
}

export type SwitchRootSlots = SwitchSlots;

export interface SwitchRootProviderProps {
  value: SwitchApi;
  asChild?: boolean;
  size?: SwitchSize;
}

export type SwitchRootProviderSlots = SwitchSlots;
export type SwitchControlProps = ArkSwitchControlProps;
export type SwitchLabelProps = ArkSwitchLabelProps;
export type SwitchThumbProps = ArkSwitchThumbProps;

export interface SwitchPartSlots {
  default?: () => VNodeChild;
}

export type SwitchControlSlots = SwitchPartSlots;
export type SwitchLabelSlots = SwitchPartSlots;
export type SwitchThumbSlots = SwitchPartSlots;

export interface SwitchContextSlots {
  default?: (context: SwitchContextValue) => VNodeChild;
}

export type { SwitchCheckedChangeDetails, UseSwitchContext, UseSwitchReturn };
