import type {
  SliderControlProps as ArkSliderControlProps,
  SliderContextProps as ArkSliderContextProps,
  SliderDraggingIndicatorProps as ArkSliderDraggingIndicatorProps,
  SliderFocusChangeDetails,
  SliderLabelProps as ArkSliderLabelProps,
  SliderMarkerGroupProps as ArkSliderMarkerGroupProps,
  SliderMarkerProps as ArkSliderMarkerProps,
  SliderRangeProps as ArkSliderRangeProps,
  SliderRootProps as ArkSliderRootProps,
  SliderRootProviderProps as ArkSliderRootProviderProps,
  SliderThumbProps as ArkSliderThumbProps,
  SliderTrackProps as ArkSliderTrackProps,
  SliderValueChangeDetails,
  SliderValueTextProps as ArkSliderValueTextProps,
  UseSliderContext,
  UseSliderReturn,
} from "@ark-ui/vue/slider";
import type { UnwrapRef, VNodeChild } from "vue";

export const SLIDER_SIZES = ["sm", "base", "lg"] as const;
export type SliderSize = (typeof SLIDER_SIZES)[number];
export const SLIDER_DEFAULT_SIZE = "base" satisfies SliderSize;

export const isSliderSize = (value: unknown): value is SliderSize =>
  typeof value === "string" && SLIDER_SIZES.includes(value as SliderSize);

export const resolveSliderSize = (value: unknown): SliderSize =>
  isSliderSize(value) ? value : SLIDER_DEFAULT_SIZE;

export type SliderApi = UnwrapRef<UseSliderReturn>;
export type SliderContextValue = UnwrapRef<UseSliderContext>;

export interface SliderProps {
  "aria-label"?: ArkSliderRootProps["aria-label"];
  "aria-labelledby"?: ArkSliderRootProps["aria-labelledby"];
  asChild?: ArkSliderRootProps["asChild"];
  defaultValue?: ArkSliderRootProps["defaultValue"];
  dir?: ArkSliderRootProps["dir"];
  disabled?: ArkSliderRootProps["disabled"];
  form?: ArkSliderRootProps["form"];
  getAriaValueText?: ArkSliderRootProps["getAriaValueText"];
  getRootNode?: ArkSliderRootProps["getRootNode"];
  id?: ArkSliderRootProps["id"];
  ids?: ArkSliderRootProps["ids"];
  invalid?: ArkSliderRootProps["invalid"];
  largeStep?: ArkSliderRootProps["largeStep"];
  max?: ArkSliderRootProps["max"];
  min?: ArkSliderRootProps["min"];
  minStepsBetweenThumbs?: ArkSliderRootProps["minStepsBetweenThumbs"];
  modelValue?: ArkSliderRootProps["modelValue"];
  name?: ArkSliderRootProps["name"];
  orientation?: ArkSliderRootProps["orientation"];
  origin?: ArkSliderRootProps["origin"];
  readOnly?: ArkSliderRootProps["readOnly"];
  step?: ArkSliderRootProps["step"];
  thumbAlignment?: ArkSliderRootProps["thumbAlignment"];
  thumbCollisionBehavior?: ArkSliderRootProps["thumbCollisionBehavior"];
  thumbSize?: ArkSliderRootProps["thumbSize"];
  /** Compact control geometry. The value does not change slider behavior. */
  size?: SliderSize;
}

export type SliderRootProps = SliderProps;

export interface SliderRootProviderProps
  extends Pick<ArkSliderRootProviderProps, "value" | "asChild"> {
  /** Compact control geometry. The value does not change slider behavior. */
  size?: SliderSize;
}

export type SliderEmits = {
  focusChange: [details: SliderFocusChangeDetails];
  valueChange: [details: SliderValueChangeDetails];
  valueChangeEnd: [details: SliderValueChangeDetails];
  "update:modelValue": [value: number[]];
};

export interface SliderSlots {
  default?: () => VNodeChild;
}

export type SliderRootSlots = SliderSlots;
export type SliderRootProviderSlots = SliderSlots;
export type SliderPartSlots = SliderSlots;
export type SliderControlSlots = SliderPartSlots;
export type SliderDraggingIndicatorSlots = SliderPartSlots;
export type SliderHiddenInputSlots = SliderPartSlots;
export type SliderLabelSlots = SliderPartSlots;
export type SliderMarkerGroupSlots = SliderPartSlots;
export type SliderMarkerSlots = SliderPartSlots;
export type SliderRangeSlots = SliderPartSlots;
export type SliderThumbSlots = SliderPartSlots;
export type SliderTrackSlots = SliderPartSlots;
export type SliderValueTextSlots = SliderPartSlots;

export interface SliderContextSlots {
  default?: (context: SliderContextValue) => VNodeChild;
}

export type SliderControlProps = ArkSliderControlProps;
export type SliderDraggingIndicatorProps = ArkSliderDraggingIndicatorProps;
/** Native input attributes pass through as fallthrough attributes. */
export interface SliderHiddenInputProps {
  asChild?: boolean;
}
export type SliderLabelProps = ArkSliderLabelProps;
export type SliderMarkerGroupProps = ArkSliderMarkerGroupProps;
export type SliderMarkerProps = ArkSliderMarkerProps;
export type SliderRangeProps = ArkSliderRangeProps;
export type SliderThumbProps = ArkSliderThumbProps;
export type SliderTrackProps = ArkSliderTrackProps;
export type SliderValueTextProps = ArkSliderValueTextProps;
export type SliderContextProps = ArkSliderContextProps;

export type {
  SliderFocusChangeDetails,
  SliderValueChangeDetails,
  UseSliderContext,
  UseSliderReturn,
};
