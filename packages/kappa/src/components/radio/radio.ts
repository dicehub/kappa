import type {
  RadioGroupIndicatorProps as ArkRadioIndicatorProps,
  RadioGroupItemControlProps as ArkRadioItemControlProps,
  RadioGroupItemProps as ArkRadioItemProps,
  RadioGroupItemTextProps as ArkRadioItemTextProps,
  RadioGroupLabelProps as ArkRadioLabelProps,
  RadioGroupRootProps as ArkRadioRootProps,
  RadioGroupValueChangeDetails,
  UseRadioGroupContext,
  UseRadioGroupItemContext,
  UseRadioGroupReturn,
} from "@ark-ui/vue/radio-group";
import type { UnwrapRef, VNodeChild } from "vue";

export type RadioDirection = "ltr" | "rtl";
export type RadioApi = UnwrapRef<UseRadioGroupReturn>;
export type RadioContextValue = UnwrapRef<UseRadioGroupContext>;
export type RadioItemContextValue = UnwrapRef<UseRadioGroupItemContext>;

export interface RadioProps {
  asChild?: ArkRadioRootProps["asChild"];
  defaultValue?: ArkRadioRootProps["defaultValue"];
  disabled?: ArkRadioRootProps["disabled"];
  /** Overrides the inherited Ark UI locale direction. */
  dir?: RadioDirection;
  form?: ArkRadioRootProps["form"];
  id?: ArkRadioRootProps["id"];
  ids?: ArkRadioRootProps["ids"];
  invalid?: ArkRadioRootProps["invalid"];
  modelValue?: ArkRadioRootProps["modelValue"];
  name?: ArkRadioRootProps["name"];
  orientation?: ArkRadioRootProps["orientation"];
  readOnly?: ArkRadioRootProps["readOnly"];
  required?: ArkRadioRootProps["required"];
}

export type RadioRootProps = RadioProps;

export type RadioEmits = {
  valueChange: [details: RadioGroupValueChangeDetails];
  "update:modelValue": [value: string | null];
};

export interface RadioSlots {
  default?: () => VNodeChild;
}

export type RadioRootSlots = RadioSlots;

export interface RadioRootProviderProps {
  value: RadioApi;
  asChild?: boolean;
}

export type RadioRootProviderSlots = RadioSlots;

/**
 * Kappa keeps Radio.Item as a label and renders its native hidden input automatically.
 * This intentionally omits Ark UI's `asChild` escape hatch from the item contract.
 */
export interface RadioItemProps {
  disabled?: ArkRadioItemProps["disabled"];
  invalid?: ArkRadioItemProps["invalid"];
  value: ArkRadioItemProps["value"];
}

export type RadioIndicatorProps = ArkRadioIndicatorProps;
export type RadioItemControlProps = ArkRadioItemControlProps;
export type RadioItemTextProps = ArkRadioItemTextProps;
export type RadioLabelProps = ArkRadioLabelProps;

export interface RadioPartSlots {
  default?: () => VNodeChild;
}

export type RadioIndicatorSlots = RadioPartSlots;
export type RadioItemControlSlots = RadioPartSlots;
export type RadioItemSlots = RadioPartSlots;
export type RadioItemTextSlots = RadioPartSlots;
export type RadioLabelSlots = RadioPartSlots;

export interface RadioContextSlots {
  default?: (context: RadioContextValue) => VNodeChild;
}

export interface RadioItemContextSlots {
  default?: (context: RadioItemContextValue) => VNodeChild;
}

export type {
  RadioGroupValueChangeDetails,
  UseRadioGroupContext,
  UseRadioGroupItemContext,
  UseRadioGroupReturn,
};
