import ProgressCircleRoot from "./ProgressCircle.vue";
import ProgressCircleContext from "./ProgressCircleContext.vue";
import ProgressCircleGraphic from "./ProgressCircleGraphic.vue";
import ProgressCircleLabel from "./ProgressCircleLabel.vue";
import ProgressCircleRange from "./ProgressCircleRange.vue";
import ProgressCircleRootProvider from "./ProgressCircleRootProvider.vue";
import ProgressCircleTrack from "./ProgressCircleTrack.vue";
import ProgressCircleValueText from "./ProgressCircleValueText.vue";
import ProgressCircleView from "./ProgressCircleView.vue";

export const ProgressCircle = Object.assign(ProgressCircleRoot, {
  Root: ProgressCircleRoot,
  RootProvider: ProgressCircleRootProvider,
  Label: ProgressCircleLabel,
  ValueText: ProgressCircleValueText,
  Circle: ProgressCircleGraphic,
  CircleTrack: ProgressCircleTrack,
  CircleRange: ProgressCircleRange,
  View: ProgressCircleView,
  Context: ProgressCircleContext,
});

export {
  ProgressCircleContext,
  ProgressCircleGraphic,
  ProgressCircleLabel,
  ProgressCircleRange,
  ProgressCircleRoot,
  ProgressCircleRootProvider,
  ProgressCircleTrack,
  ProgressCircleValueText,
  ProgressCircleView,
};

export type {
  ProgressCircleApi,
  ProgressCircleContextSlots,
  ProgressCircleContextValue,
  ProgressCircleEmits,
  ProgressCircleGraphicProps,
  ProgressCircleGraphicSlots,
  ProgressCircleLabelProps,
  ProgressCircleLabelSlots,
  ProgressCirclePartSlots,
  ProgressCircleProps,
  ProgressCircleRangeProps,
  ProgressCircleRangeSlots,
  ProgressCircleRootProps,
  ProgressCircleRootProviderProps,
  ProgressCircleRootProviderSlots,
  ProgressCircleRootSlots,
  ProgressCircleSlots,
  ProgressCircleTrackProps,
  ProgressCircleTrackSlots,
  ProgressCircleValueTextProps,
  ProgressCircleValueTextSlots,
  ProgressCircleViewProps,
  ProgressCircleViewSlots,
  ProgressValueChangeDetails,
  UseProgressContext,
  UseProgressReturn,
} from "./progress-circle";

export {
  progressAnatomy,
  useProgress,
  useProgressContext,
  type UseProgressProps,
} from "@ark-ui/vue/progress";
