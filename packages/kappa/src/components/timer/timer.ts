import type {
  TimerActionTriggerProps as ArkTimerActionTriggerProps,
  TimerAreaProps as ArkTimerAreaProps,
  TimerControlProps as ArkTimerControlProps,
  TimerItemProps as ArkTimerItemProps,
  TimerRootEmits as ArkTimerRootEmits,
  TimerRootProps as ArkTimerRootProps,
  TimerSeparatorProps as ArkTimerSeparatorProps,
  UseTimerContext,
  UseTimerReturn,
} from "@ark-ui/vue/timer";
import type { UnwrapRef, VNodeChild } from "vue";

export type TickDetails = ArkTimerRootEmits["tick"][0];

export const TIMER_SIZES = ["sm", "base", "lg"] as const;
export const TIMER_DEFAULT_SIZE = "base" as const;

export type TimerSize = (typeof TIMER_SIZES)[number];
export type TimerApi = UnwrapRef<UseTimerReturn>;
export type TimerContextValue = UnwrapRef<UseTimerContext>;

export interface TimerProps {
  asChild?: ArkTimerRootProps["asChild"];
  autoStart?: ArkTimerRootProps["autoStart"];
  countdown?: ArkTimerRootProps["countdown"];
  id?: ArkTimerRootProps["id"];
  ids?: ArkTimerRootProps["ids"];
  interval?: ArkTimerRootProps["interval"];
  size?: TimerSize;
  startMs?: ArkTimerRootProps["startMs"];
  targetMs?: ArkTimerRootProps["targetMs"];
  translations?: ArkTimerRootProps["translations"];
}

export type TimerRootProps = TimerProps;

export type TimerEmits = {
  complete: [];
  tick: [details: TickDetails];
};

export interface TimerSlots {
  default?: () => VNodeChild;
}

export type TimerRootSlots = TimerSlots;

export interface TimerRootProviderProps {
  value: TimerApi;
  asChild?: boolean;
  size?: TimerSize;
}

export type TimerRootProviderSlots = TimerSlots;
export type TimerAreaProps = ArkTimerAreaProps;
export type TimerControlProps = ArkTimerControlProps;
export type TimerSeparatorProps = ArkTimerSeparatorProps;
export type TimerActionTriggerProps = ArkTimerActionTriggerProps;

export interface TimerItemProps extends ArkTimerItemProps {
  /** Animate the item when its formatted value changes. */
  animate?: boolean;
}

export interface TimerPartSlots {
  default?: () => VNodeChild;
}

export type TimerAreaSlots = TimerPartSlots;
export type TimerControlSlots = TimerPartSlots;
export type TimerSeparatorSlots = TimerPartSlots;
export type TimerActionTriggerSlots = TimerPartSlots;

export interface TimerContextSlots {
  default?: (context: TimerContextValue) => VNodeChild;
}

export type { UseTimerContext, UseTimerReturn } from "@ark-ui/vue/timer";
