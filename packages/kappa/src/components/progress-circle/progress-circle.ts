import type {
  ProgressCircleProps as ArkProgressCircleProps,
  ProgressCircleRangeProps as ArkProgressCircleRangeProps,
  ProgressCircleTrackProps as ArkProgressCircleTrackProps,
  ProgressLabelProps as ArkProgressLabelProps,
  ProgressRootProps as ArkProgressRootProps,
  ProgressValueChangeDetails,
  ProgressValueTextProps as ArkProgressValueTextProps,
  ProgressViewProps as ArkProgressViewProps,
  UseProgressContext,
  UseProgressReturn,
} from "@ark-ui/vue/progress";
import type { UnwrapRef, VNodeChild } from "vue";

export type { ProgressValueChangeDetails };

export type ProgressCircleApi = UnwrapRef<UseProgressReturn>;
export type ProgressCircleContextValue = UnwrapRef<UseProgressContext>;

export interface ProgressCircleProps {
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

export type ProgressCircleRootProps = ProgressCircleProps;

export type ProgressCircleEmits = {
  valueChange: [details: ProgressValueChangeDetails];
  "update:modelValue": [value: number | null];
};

export interface ProgressCircleSlots {
  default?: () => VNodeChild;
}

export type ProgressCircleRootSlots = ProgressCircleSlots;

export interface ProgressCircleRootProviderProps {
  value: ProgressCircleApi;
  asChild?: boolean;
}

export interface ProgressCircleRootProviderSlots {
  default?: () => VNodeChild;
}

export type ProgressCircleLabelProps = ArkProgressLabelProps;
export type ProgressCircleValueTextProps = ArkProgressValueTextProps;
export type ProgressCircleGraphicProps = ArkProgressCircleProps;
export type ProgressCircleTrackProps = ArkProgressCircleTrackProps;
export type ProgressCircleRangeProps = ArkProgressCircleRangeProps;
export type ProgressCircleViewProps = ArkProgressViewProps;

export interface ProgressCirclePartSlots {
  default?: () => VNodeChild;
}

export type ProgressCircleLabelSlots = ProgressCirclePartSlots;
export type ProgressCircleValueTextSlots = ProgressCirclePartSlots;
export type ProgressCircleGraphicSlots = ProgressCirclePartSlots;
export type ProgressCircleTrackSlots = ProgressCirclePartSlots;
export type ProgressCircleRangeSlots = ProgressCirclePartSlots;
export type ProgressCircleViewSlots = ProgressCirclePartSlots;

export interface ProgressCircleContextSlots {
  default?: (context: ProgressCircleContextValue) => VNodeChild;
}

export type { UseProgressContext, UseProgressReturn } from "@ark-ui/vue/progress";
