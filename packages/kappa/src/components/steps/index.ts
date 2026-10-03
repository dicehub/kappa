import StepsRoot from "./Steps.vue";
import StepsCompletedContent from "./StepsCompletedContent.vue";
import StepsContent from "./StepsContent.vue";
import StepsContext from "./StepsContext.vue";
import StepsIndicator from "./StepsIndicator.vue";
import StepsItem from "./StepsItem.vue";
import StepsItemContext from "./StepsItemContext.vue";
import StepsList from "./StepsList.vue";
import StepsNextTrigger from "./StepsNextTrigger.vue";
import StepsPrevTrigger from "./StepsPrevTrigger.vue";
import StepsProgress from "./StepsProgress.vue";
import StepsRootProvider from "./StepsRootProvider.vue";
import StepsSeparator from "./StepsSeparator.vue";
import StepsTrigger from "./StepsTrigger.vue";

export const Steps = Object.assign(StepsRoot, {
  Root: StepsRoot,
  RootProvider: StepsRootProvider,
  List: StepsList,
  Item: StepsItem,
  Trigger: StepsTrigger,
  Indicator: StepsIndicator,
  Separator: StepsSeparator,
  Content: StepsContent,
  CompletedContent: StepsCompletedContent,
  PrevTrigger: StepsPrevTrigger,
  NextTrigger: StepsNextTrigger,
  Progress: StepsProgress,
  Context: StepsContext,
  ItemContext: StepsItemContext,
});

export {
  StepsCompletedContent,
  StepsContent,
  StepsContext,
  StepsIndicator,
  StepsItem,
  StepsItemContext,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsProgress,
  StepsRoot,
  StepsRootProvider,
  StepsSeparator,
  StepsTrigger,
};

export {
  STEPS_DEFAULT_SIZE,
  STEPS_SIZES,
  isStepsSize,
  resolveStepsSize,
  type StepChangeDetails,
  type StepsApi,
  type StepsCompletedContentProps,
  type StepsCompletedContentSlots,
  type StepsContentProps,
  type StepsContentSlots,
  type StepsContextProps,
  type StepsContextSlots,
  type StepsContextValue,
  type StepsDirection,
  type StepsEmits,
  type StepsIndicatorProps,
  type StepsIndicatorSlots,
  type StepsInvalidDetails,
  type StepsItemContextProps,
  type StepsItemContextSlots,
  type StepsItemContextValue,
  type StepsItemProps,
  type StepsItemSlots,
  type StepsListProps,
  type StepsListSlots,
  type StepsNextTriggerProps,
  type StepsNextTriggerSlots,
  type StepsOrientation,
  type StepsPrevTriggerProps,
  type StepsPrevTriggerSlots,
  type StepsProgressProps,
  type StepsProgressSlots,
  type StepsProps,
  type StepsRootProps,
  type StepsRootProviderProps,
  type StepsRootProviderSlots,
  type StepsRootSlots,
  type StepsSeparatorProps,
  type StepsSeparatorSlots,
  type StepsSize,
  type StepsSlots,
  type StepsTriggerProps,
  type StepsTriggerSlots,
  type UseStepsContext,
  type UseStepsItemContext,
  type UseStepsProps,
  type UseStepsReturn,
} from "./steps";

export {
  stepsAnatomy,
  useSteps,
  useStepsContext,
  useStepsItemContext,
} from "@ark-ui/vue/steps";
