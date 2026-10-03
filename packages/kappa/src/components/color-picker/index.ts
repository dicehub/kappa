import ColorPickerRoot from "./ColorPicker.vue";
import ColorPickerArea from "./ColorPickerArea.vue";
import ColorPickerAreaBackground from "./ColorPickerAreaBackground.vue";
import ColorPickerAreaThumb from "./ColorPickerAreaThumb.vue";
import ColorPickerChannelInput from "./ColorPickerChannelInput.vue";
import ColorPickerChannelSlider from "./ColorPickerChannelSlider.vue";
import ColorPickerChannelSliderLabel from "./ColorPickerChannelSliderLabel.vue";
import ColorPickerChannelSliderThumb from "./ColorPickerChannelSliderThumb.vue";
import ColorPickerChannelSliderTrack from "./ColorPickerChannelSliderTrack.vue";
import ColorPickerChannelSliderValueText from "./ColorPickerChannelSliderValueText.vue";
import ColorPickerContent from "./ColorPickerContent.vue";
import ColorPickerContext from "./ColorPickerContext.vue";
import ColorPickerControl from "./ColorPickerControl.vue";
import ColorPickerEyeDropperTrigger from "./ColorPickerEyeDropperTrigger.vue";
import ColorPickerFormatSelect from "./ColorPickerFormatSelect.vue";
import ColorPickerFormatTrigger from "./ColorPickerFormatTrigger.vue";
import ColorPickerHiddenInput from "./ColorPickerHiddenInput.vue";
import ColorPickerLabel from "./ColorPickerLabel.vue";
import ColorPickerRootProvider from "./ColorPickerRootProvider.vue";
import ColorPickerSwatch from "./ColorPickerSwatch.vue";
import ColorPickerSwatchGroup from "./ColorPickerSwatchGroup.vue";
import ColorPickerSwatchIndicator from "./ColorPickerSwatchIndicator.vue";
import ColorPickerSwatchTrigger from "./ColorPickerSwatchTrigger.vue";
import ColorPickerTransparencyGrid from "./ColorPickerTransparencyGrid.vue";
import ColorPickerTrigger from "./ColorPickerTrigger.vue";
import ColorPickerValueSwatch from "./ColorPickerValueSwatch.vue";
import ColorPickerValueText from "./ColorPickerValueText.vue";
import ColorPickerView from "./ColorPickerView.vue";

export const ColorPicker = Object.assign(ColorPickerRoot, {
  Root: ColorPickerRoot, RootProvider: ColorPickerRootProvider, Label: ColorPickerLabel,
  Control: ColorPickerControl, ChannelInput: ColorPickerChannelInput, Trigger: ColorPickerTrigger,
  ValueSwatch: ColorPickerValueSwatch, ValueText: ColorPickerValueText, Content: ColorPickerContent,
  Area: ColorPickerArea, AreaBackground: ColorPickerAreaBackground, AreaThumb: ColorPickerAreaThumb,
  ChannelSlider: ColorPickerChannelSlider, ChannelSliderLabel: ColorPickerChannelSliderLabel,
  ChannelSliderTrack: ColorPickerChannelSliderTrack, ChannelSliderThumb: ColorPickerChannelSliderThumb,
  ChannelSliderValueText: ColorPickerChannelSliderValueText, FormatSelect: ColorPickerFormatSelect,
  FormatTrigger: ColorPickerFormatTrigger, EyeDropperTrigger: ColorPickerEyeDropperTrigger,
  TransparencyGrid: ColorPickerTransparencyGrid, SwatchGroup: ColorPickerSwatchGroup,
  SwatchTrigger: ColorPickerSwatchTrigger, Swatch: ColorPickerSwatch,
  SwatchIndicator: ColorPickerSwatchIndicator, View: ColorPickerView,
  HiddenInput: ColorPickerHiddenInput, Context: ColorPickerContext,
});

export {
  ColorPickerArea, ColorPickerAreaBackground, ColorPickerAreaThumb, ColorPickerChannelInput,
  ColorPickerChannelSlider, ColorPickerChannelSliderLabel, ColorPickerChannelSliderThumb,
  ColorPickerChannelSliderTrack, ColorPickerChannelSliderValueText, ColorPickerContent,
  ColorPickerContext, ColorPickerControl, ColorPickerEyeDropperTrigger, ColorPickerFormatSelect,
  ColorPickerFormatTrigger, ColorPickerHiddenInput, ColorPickerLabel, ColorPickerRoot,
  ColorPickerRootProvider, ColorPickerSwatch, ColorPickerSwatchGroup, ColorPickerSwatchIndicator,
  ColorPickerSwatchTrigger, ColorPickerTransparencyGrid, ColorPickerTrigger, ColorPickerValueSwatch,
  ColorPickerValueText, ColorPickerView,
};

export * from "./color-picker";
export { colorPickerAnatomy, parseColor, useColorPicker, useColorPickerContext, type ColorPickerColorFormat, type UseColorPickerProps } from "@ark-ui/vue/color-picker";
