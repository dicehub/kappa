import type {
  Color,
  ColorPickerAreaBackgroundProps as ArkColorPickerAreaBackgroundProps,
  ColorPickerAreaProps as ArkColorPickerAreaProps,
  ColorPickerAreaThumbProps as ArkColorPickerAreaThumbProps,
  ColorPickerChannelInputProps as ArkColorPickerChannelInputProps,
  ColorPickerChannelSliderLabelProps as ArkColorPickerChannelSliderLabelProps,
  ColorPickerChannelSliderProps as ArkColorPickerChannelSliderProps,
  ColorPickerChannelSliderThumbProps as ArkColorPickerChannelSliderThumbProps,
  ColorPickerChannelSliderTrackProps as ArkColorPickerChannelSliderTrackProps,
  ColorPickerChannelSliderValueTextProps as ArkColorPickerChannelSliderValueTextProps,
  ColorPickerColorFormat,
  ColorPickerContentProps as ArkColorPickerContentProps,
  ColorPickerContextProps as ArkColorPickerContextProps,
  ColorPickerControlProps as ArkColorPickerControlProps,
  ColorPickerEyeDropperTriggerProps as ArkColorPickerEyeDropperTriggerProps,
  ColorPickerFocusOutsideEvent,
  ColorPickerFormatChangeDetails,
  ColorPickerFormatSelectProps as ArkColorPickerFormatSelectProps,
  ColorPickerFormatTriggerProps as ArkColorPickerFormatTriggerProps,
  ColorPickerHiddenInputProps as ArkColorPickerHiddenInputProps,
  ColorPickerInteractOutsideEvent,
  ColorPickerLabelProps as ArkColorPickerLabelProps,
  ColorPickerOpenChangeDetails,
  ColorPickerPointerDownOutsideEvent,
  ColorPickerRootProps as ArkColorPickerRootProps,
  ColorPickerRootProviderProps as ArkColorPickerRootProviderProps,
  ColorPickerSwatchGroupProps as ArkColorPickerSwatchGroupProps,
  ColorPickerSwatchIndicatorProps as ArkColorPickerSwatchIndicatorProps,
  ColorPickerSwatchProps as ArkColorPickerSwatchProps,
  ColorPickerSwatchTriggerProps as ArkColorPickerSwatchTriggerProps,
  ColorPickerTransparencyGridProps as ArkColorPickerTransparencyGridProps,
  ColorPickerTriggerProps as ArkColorPickerTriggerProps,
  ColorPickerValueChangeDetails,
  ColorPickerValueSwatchProps as ArkColorPickerValueSwatchProps,
  ColorPickerValueTextProps as ArkColorPickerValueTextProps,
  ColorPickerViewProps as ArkColorPickerViewProps,
  UseColorPickerContext,
  UseColorPickerReturn,
} from "@ark-ui/vue/color-picker";
import type { UnwrapRef, VNodeChild } from "vue";

export const COLOR_PICKER_SIZES = ["sm", "base", "lg"] as const;
export type ColorPickerSize = (typeof COLOR_PICKER_SIZES)[number];
export const COLOR_PICKER_DEFAULT_SIZE = "base" satisfies ColorPickerSize;

export const isColorPickerSize = (value: unknown): value is ColorPickerSize =>
  typeof value === "string" && COLOR_PICKER_SIZES.includes(value as ColorPickerSize);

export const resolveColorPickerSize = (value: unknown): ColorPickerSize =>
  isColorPickerSize(value) ? value : COLOR_PICKER_DEFAULT_SIZE;

export interface ColorPickerProps extends ArkColorPickerRootProps {
  /** Compact control geometry. The value does not change color behavior. */
  size?: ColorPickerSize;
}

export type ColorPickerRootProps = ColorPickerProps;
export interface ColorPickerRootProviderProps extends ArkColorPickerRootProviderProps {
  /** Compact control geometry. The value does not change color behavior. */
  size?: ColorPickerSize;
}

export type ColorPickerEmits = {
  exitComplete: [];
  focusOutside: [event: ColorPickerFocusOutsideEvent];
  formatChange: [details: ColorPickerFormatChangeDetails];
  interactOutside: [event: ColorPickerInteractOutsideEvent];
  openChange: [details: ColorPickerOpenChangeDetails];
  pointerDownOutside: [event: ColorPickerPointerDownOutsideEvent];
  valueChange: [details: ColorPickerValueChangeDetails];
  valueChangeEnd: [details: ColorPickerValueChangeDetails];
  "update:format": [format: ColorPickerColorFormat];
  "update:modelValue": [value: Color];
  "update:open": [open: boolean];
};

export type ColorPickerApi = UnwrapRef<UseColorPickerReturn>;
export type ColorPickerContextValue = UnwrapRef<UseColorPickerContext>;

export interface ColorPickerSlots { default?: () => VNodeChild }
export interface ColorPickerContextSlots { default?: (context: ColorPickerContextValue) => VNodeChild }
export type ColorPickerRootSlots = ColorPickerSlots;
export type ColorPickerPartSlots = ColorPickerSlots;

export interface ColorPickerContentProps extends ArkColorPickerContentProps {
  /** Render content through Vue Teleport. */
  teleport?: boolean;
  /** Teleport target. */
  teleportTo?: string | HTMLElement;
}

export type ColorPickerAreaProps = ArkColorPickerAreaProps;
export type ColorPickerAreaBackgroundProps = ArkColorPickerAreaBackgroundProps;
export type ColorPickerAreaThumbProps = ArkColorPickerAreaThumbProps;
export type ColorPickerChannelInputProps = ArkColorPickerChannelInputProps;
export type ColorPickerChannelSliderProps = ArkColorPickerChannelSliderProps;
export type ColorPickerChannelSliderLabelProps = ArkColorPickerChannelSliderLabelProps;
export type ColorPickerChannelSliderThumbProps = ArkColorPickerChannelSliderThumbProps;
export type ColorPickerChannelSliderTrackProps = ArkColorPickerChannelSliderTrackProps;
export type ColorPickerChannelSliderValueTextProps = ArkColorPickerChannelSliderValueTextProps;
export type ColorPickerContextProps = ArkColorPickerContextProps;
export type ColorPickerControlProps = ArkColorPickerControlProps;
export type ColorPickerEyeDropperTriggerProps = ArkColorPickerEyeDropperTriggerProps;
export type ColorPickerFormatSelectProps = ArkColorPickerFormatSelectProps;
export type ColorPickerFormatTriggerProps = ArkColorPickerFormatTriggerProps;
export type ColorPickerHiddenInputProps = ArkColorPickerHiddenInputProps;
export type ColorPickerLabelProps = ArkColorPickerLabelProps;
export type ColorPickerSwatchGroupProps = ArkColorPickerSwatchGroupProps;
export type ColorPickerSwatchIndicatorProps = ArkColorPickerSwatchIndicatorProps;
export type ColorPickerSwatchProps = ArkColorPickerSwatchProps;
export type ColorPickerSwatchTriggerProps = ArkColorPickerSwatchTriggerProps;
export type ColorPickerTransparencyGridProps = ArkColorPickerTransparencyGridProps;
export type ColorPickerTriggerProps = ArkColorPickerTriggerProps;
export type ColorPickerValueSwatchProps = ArkColorPickerValueSwatchProps;
export type ColorPickerValueTextProps = ArkColorPickerValueTextProps;
export type ColorPickerViewProps = ArkColorPickerViewProps;

export type {
  Color,
  ColorPickerColorFormat,
  ColorPickerFocusOutsideEvent,
  ColorPickerFormatChangeDetails,
  ColorPickerInteractOutsideEvent,
  ColorPickerOpenChangeDetails,
  ColorPickerPointerDownOutsideEvent,
  ColorPickerValueChangeDetails,
  UseColorPickerContext,
  UseColorPickerReturn,
};
