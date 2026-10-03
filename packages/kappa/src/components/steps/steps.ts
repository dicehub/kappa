import type {
  StepChangeDetails,
  StepsCompletedContentProps as ArkStepsCompletedContentProps,
  StepsContentProps as ArkStepsContentProps,
  StepsContextProps as ArkStepsContextProps,
  StepsIndicatorProps as ArkStepsIndicatorProps,
  StepsItemContextProps as ArkStepsItemContextProps,
  StepsItemProps as ArkStepsItemProps,
  StepsListProps as ArkStepsListProps,
  StepsNextTriggerProps as ArkStepsNextTriggerProps,
  StepsPrevTriggerProps as ArkStepsPrevTriggerProps,
  StepsProgressProps as ArkStepsProgressProps,
  StepsRootProps as ArkStepsRootProps,
  StepsRootProviderProps as ArkStepsRootProviderProps,
  StepsSeparatorProps as ArkStepsSeparatorProps,
  StepsTriggerProps as ArkStepsTriggerProps,
  UseStepsContext,
  UseStepsItemContext,
  UseStepsProps,
  UseStepsReturn,
} from "@ark-ui/vue/steps";
import type { UnwrapRef, VNodeChild } from "vue";

export const STEPS_SIZES = ["sm", "base"] as const;
export const STEPS_DEFAULT_SIZE = "base" satisfies StepsSize;

export type StepsSize = (typeof STEPS_SIZES)[number];
export type StepsDirection = "ltr" | "rtl";
export type StepsOrientation = NonNullable<ArkStepsRootProps["orientation"]>;
export type StepsApi = UnwrapRef<UseStepsReturn>;
export type StepsContextValue = UnwrapRef<UseStepsContext>;
export type StepsItemContextValue = UnwrapRef<UseStepsItemContext>;
export type StepsInvalidDetails = Parameters<
  NonNullable<UseStepsProps["onStepInvalid"]>
>[0];

export interface StepsProps {
  asChild?: ArkStepsRootProps["asChild"];
  count?: ArkStepsRootProps["count"];
  defaultStep?: ArkStepsRootProps["defaultStep"];
  /** Overrides the inherited Ark UI locale direction. */
  dir?: StepsDirection;
  id?: ArkStepsRootProps["id"];
  ids?: ArkStepsRootProps["ids"];
  isStepSkippable?: ArkStepsRootProps["isStepSkippable"];
  isStepValid?: ArkStepsRootProps["isStepValid"];
  linear?: ArkStepsRootProps["linear"];
  orientation?: ArkStepsRootProps["orientation"];
  step?: ArkStepsRootProps["step"];
}

export type StepsRootProps = StepsProps;

export type StepsEmits = {
  stepChange: [details: StepChangeDetails];
  stepComplete: [];
  stepInvalid: [details: StepsInvalidDetails];
  "update:step": [step: number];
};

export interface StepsSlots {
  default?: () => VNodeChild;
}

export type StepsRootSlots = StepsSlots;
export type StepsRootProviderProps = Omit<ArkStepsRootProviderProps, "value"> & {
  value: StepsApi;
};
export type StepsRootProviderSlots = StepsSlots;

export interface StepsListProps {
  asChild?: ArkStepsListProps["asChild"];
  /** Compact or default step geometry. */
  size?: StepsSize;
}

export type StepsListSlots = StepsSlots;
export type StepsItemProps = ArkStepsItemProps;
export type StepsItemSlots = StepsSlots;
export type StepsTriggerProps = ArkStepsTriggerProps;
export type StepsTriggerSlots = StepsSlots;
export type StepsSeparatorProps = ArkStepsSeparatorProps;
export type StepsSeparatorSlots = StepsSlots;
export type StepsContentProps = ArkStepsContentProps;
export type StepsContentSlots = StepsSlots;
export type StepsCompletedContentProps = ArkStepsCompletedContentProps;
export type StepsCompletedContentSlots = StepsSlots;
export type StepsPrevTriggerProps = ArkStepsPrevTriggerProps;
export type StepsPrevTriggerSlots = StepsSlots;
export type StepsNextTriggerProps = ArkStepsNextTriggerProps;
export type StepsNextTriggerSlots = StepsSlots;
export type StepsProgressProps = ArkStepsProgressProps;
export type StepsProgressSlots = StepsSlots;
export type StepsContextProps = ArkStepsContextProps;
export type StepsItemContextProps = ArkStepsItemContextProps;

export interface StepsContextSlots {
  default?: (context: StepsContextValue) => VNodeChild;
}

export interface StepsItemContextSlots {
  default?: (context: StepsItemContextValue) => VNodeChild;
}

export type StepsIndicatorProps = ArkStepsIndicatorProps;
export type StepsIndicatorSlots = StepsItemContextSlots;

export const isStepsSize = (value: unknown): value is StepsSize =>
  typeof value === "string" && STEPS_SIZES.includes(value as StepsSize);

export const resolveStepsSize = (value: unknown): StepsSize =>
  isStepsSize(value) ? value : STEPS_DEFAULT_SIZE;

export type {
  StepChangeDetails,
  UseStepsContext,
  UseStepsItemContext,
  UseStepsProps,
  UseStepsReturn,
};
