import TimerRoot from "./Timer.vue";
import TimerActionTrigger from "./TimerActionTrigger.vue";
import TimerArea from "./TimerArea.vue";
import TimerContext from "./TimerContext.vue";
import TimerControl from "./TimerControl.vue";
import TimerItem from "./TimerItem.vue";
import TimerRootProvider from "./TimerRootProvider.vue";
import TimerSeparator from "./TimerSeparator.vue";

export const Timer = Object.assign(TimerRoot, {
  Root: TimerRoot,
  RootProvider: TimerRootProvider,
  Area: TimerArea,
  Item: TimerItem,
  Separator: TimerSeparator,
  Control: TimerControl,
  ActionTrigger: TimerActionTrigger,
  Context: TimerContext,
});

export {
  TimerActionTrigger,
  TimerArea,
  TimerContext,
  TimerControl,
  TimerItem,
  TimerRoot,
  TimerRootProvider,
  TimerSeparator,
};

export type {
  TickDetails,
  TimerActionTriggerProps,
  TimerActionTriggerSlots,
  TimerApi,
  TimerAreaProps,
  TimerAreaSlots,
  TimerContextSlots,
  TimerContextValue,
  TimerControlProps,
  TimerControlSlots,
  TimerEmits,
  TimerItemProps,
  TimerPartSlots,
  TimerProps,
  TimerRootProps,
  TimerRootProviderProps,
  TimerRootProviderSlots,
  TimerRootSlots,
  TimerSeparatorProps,
  TimerSeparatorSlots,
  TimerSize,
  TimerSlots,
  UseTimerContext,
  UseTimerReturn,
} from "./timer";

export { TIMER_DEFAULT_SIZE, TIMER_SIZES } from "./timer";

export {
  timerAnatomy,
  useTimer,
  useTimerContext,
  type UseTimerProps,
} from "@ark-ui/vue/timer";
