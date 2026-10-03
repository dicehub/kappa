import ProgressRoot from "./Progress.vue";
import ProgressContext from "./ProgressContext.vue";
import ProgressLabel from "./ProgressLabel.vue";
import ProgressRange from "./ProgressRange.vue";
import ProgressRootProvider from "./ProgressRootProvider.vue";
import ProgressTrack from "./ProgressTrack.vue";
import ProgressValueText from "./ProgressValueText.vue";
import ProgressView from "./ProgressView.vue";

export const Progress = Object.assign(ProgressRoot, {
  Root: ProgressRoot,
  RootProvider: ProgressRootProvider,
  Label: ProgressLabel,
  ValueText: ProgressValueText,
  Track: ProgressTrack,
  Range: ProgressRange,
  View: ProgressView,
  Context: ProgressContext,
});

export {
  ProgressContext,
  ProgressLabel,
  ProgressRange,
  ProgressRoot,
  ProgressRootProvider,
  ProgressTrack,
  ProgressValueText,
  ProgressView,
};

export type {
  ProgressApi,
  ProgressContextSlots,
  ProgressContextValue,
  ProgressEmits,
  ProgressLabelProps,
  ProgressLabelSlots,
  ProgressPartSlots,
  ProgressProps,
  ProgressRangeProps,
  ProgressRangeSlots,
  ProgressRootProps,
  ProgressRootProviderProps,
  ProgressRootProviderSlots,
  ProgressRootSlots,
  ProgressSlots,
  ProgressTrackProps,
  ProgressTrackSlots,
  ProgressValueChangeDetails,
  ProgressValueTextProps,
  ProgressValueTextSlots,
  ProgressViewProps,
  ProgressViewSlots,
  UseProgressContext,
  UseProgressReturn,
} from "./progress";

export {
  progressAnatomy,
  useProgress,
  useProgressContext,
  type UseProgressProps,
} from "@ark-ui/vue/progress";
