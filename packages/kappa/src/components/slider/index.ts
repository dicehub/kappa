import SliderRoot from "./Slider.vue";
import SliderContext from "./SliderContext.vue";
import SliderControl from "./SliderControl.vue";
import SliderDraggingIndicator from "./SliderDraggingIndicator.vue";
import SliderHiddenInput from "./SliderHiddenInput.vue";
import SliderLabel from "./SliderLabel.vue";
import SliderMarker from "./SliderMarker.vue";
import SliderMarkerGroup from "./SliderMarkerGroup.vue";
import SliderRange from "./SliderRange.vue";
import SliderRootProvider from "./SliderRootProvider.vue";
import SliderThumb from "./SliderThumb.vue";
import SliderTrack from "./SliderTrack.vue";
import SliderValueText from "./SliderValueText.vue";

export const Slider = Object.assign(SliderRoot, {
  Root: SliderRoot,
  RootProvider: SliderRootProvider,
  Label: SliderLabel,
  ValueText: SliderValueText,
  Control: SliderControl,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
  HiddenInput: SliderHiddenInput,
  MarkerGroup: SliderMarkerGroup,
  Marker: SliderMarker,
  DraggingIndicator: SliderDraggingIndicator,
  Context: SliderContext,
});

export {
  SliderContext,
  SliderControl,
  SliderDraggingIndicator,
  SliderHiddenInput,
  SliderLabel,
  SliderMarker,
  SliderMarkerGroup,
  SliderRange,
  SliderRoot,
  SliderRootProvider,
  SliderThumb,
  SliderTrack,
  SliderValueText,
};

export type {
  SliderApi,
  SliderContextProps,
  SliderContextSlots,
  SliderContextValue,
  SliderControlProps,
  SliderControlSlots,
  SliderDraggingIndicatorProps,
  SliderDraggingIndicatorSlots,
  SliderEmits,
  SliderFocusChangeDetails,
  SliderHiddenInputProps,
  SliderHiddenInputSlots,
  SliderLabelProps,
  SliderLabelSlots,
  SliderMarkerGroupProps,
  SliderMarkerGroupSlots,
  SliderMarkerProps,
  SliderMarkerSlots,
  SliderPartSlots,
  SliderProps,
  SliderRangeProps,
  SliderRangeSlots,
  SliderRootProps,
  SliderRootProviderProps,
  SliderRootProviderSlots,
  SliderRootSlots,
  SliderSize,
  SliderSlots,
  SliderThumbProps,
  SliderThumbSlots,
  SliderTrackProps,
  SliderTrackSlots,
  SliderValueChangeDetails,
  SliderValueTextProps,
  SliderValueTextSlots,
  UseSliderContext,
  UseSliderReturn,
} from "./slider";

export { SLIDER_DEFAULT_SIZE, SLIDER_SIZES, isSliderSize, resolveSliderSize } from "./slider";

export {
  sliderAnatomy,
  useSlider,
  useSliderContext,
  type UseSliderProps,
} from "@ark-ui/vue/slider";
