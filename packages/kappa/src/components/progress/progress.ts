import type {
  ProgressLabelProps as ArkProgressLabelProps,
  ProgressRangeProps as ArkProgressRangeProps,
  ProgressRootProps as ArkProgressRootProps,
  ProgressTrackProps as ArkProgressTrackProps,
  ProgressValueChangeDetails,
  ProgressValueTextProps as ArkProgressValueTextProps,
  ProgressViewProps as ArkProgressViewProps,
  UseProgressContext,
  UseProgressReturn,
} from "@ark-ui/vue/progress";
import type { UnwrapRef, VNodeChild } from "vue";

export type { ProgressValueChangeDetails };

export type ProgressApi = UnwrapRef<UseProgressReturn>;
export type ProgressContextValue = UnwrapRef<UseProgressContext>;

export interface ProgressProps {
  asChild?: ArkProgressRootProps["asChild"];
  defaultValue?: ArkProgressRootProps["defaultValue"];
  formatOptions?: ArkProgressRootProps["formatOptions"];
  id?: ArkProgressRootProps["id"];
  ids?: ArkProgressRootProps["ids"];
  locale?: ArkProgressRootProps["locale"];
  max?: ArkProgressRootProps["max"];
  min?: ArkProgressRootProps["min"];
  modelValue?: ArkProgressRootProps["modelValue"];
  orientation?: ArkProgressRootProps["orientation"];
  translations?: ArkProgressRootProps["translations"];
}

export type ProgressRootProps = ProgressProps;

export type ProgressEmits = {
  valueChange: [details: ProgressValueChangeDetails];
  "update:modelValue": [value: number | null];
};

export interface ProgressSlots {
  default?: () => VNodeChild;
}

export type ProgressRootSlots = ProgressSlots;

export interface ProgressRootProviderProps {
  value: ProgressApi;
  asChild?: boolean;
}

export interface ProgressRootProviderSlots {
  default?: () => VNodeChild;
}

export type ProgressLabelProps = ArkProgressLabelProps;
export type ProgressValueTextProps = ArkProgressValueTextProps;
export type ProgressTrackProps = ArkProgressTrackProps;
export type ProgressRangeProps = ArkProgressRangeProps;
export type ProgressViewProps = ArkProgressViewProps;

export interface ProgressPartSlots {
  default?: () => VNodeChild;
}

export type ProgressLabelSlots = ProgressPartSlots;
export type ProgressValueTextSlots = ProgressPartSlots;
export type ProgressTrackSlots = ProgressPartSlots;
export type ProgressRangeSlots = ProgressPartSlots;
export type ProgressViewSlots = ProgressPartSlots;

export interface ProgressContextSlots {
  default?: (context: ProgressContextValue) => VNodeChild;
}

export type { UseProgressContext, UseProgressReturn } from "@ark-ui/vue/progress";
