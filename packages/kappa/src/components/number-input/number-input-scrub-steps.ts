import {
  computed,
  inject,
  provide,
  toValue,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
} from "vue";
import type { NumberInputScrubSensitivity } from "./number-input";

export interface NumberInputScrubSteps {
  step: number;
  smallStep: number;
  largeStep: number;
}

interface NumberInputScrubStepOptions {
  formatOptions?: Intl.NumberFormatOptions;
  largeStep?: number;
  smallStep?: number;
  step?: number;
}

const NUMBER_INPUT_SCRUB_STEPS: InjectionKey<ComputedRef<NumberInputScrubSteps>> =
  Symbol("kappa-number-input-scrub-steps");

const validStep = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;

export const resolveNumberInputPointerStep = (
  event: Pick<PointerEvent, "ctrlKey" | "shiftKey" | "altKey">,
  steps: NumberInputScrubSteps,
  sensitivity?: NumberInputScrubSensitivity,
) => {
  if (sensitivity) {
    const multiplier = event.ctrlKey ? sensitivity.control
      : event.shiftKey ? sensitivity.shift
        : event.altKey ? sensitivity.alt : 1;
    return validStep(steps.step * validStep(multiplier, 1), steps.step);
  }
  return event.ctrlKey || event.altKey ? steps.smallStep
    : event.shiftKey ? steps.largeStep : steps.step;
};

export const resolveNumberInputScrubSteps = (
  options: NumberInputScrubStepOptions,
): NumberInputScrubSteps => {
  const defaultStep = options.formatOptions?.style === "percent" ? 0.01 : 1;
  const step = validStep(options.step, defaultStep);

  return {
    step,
    smallStep: validStep(options.smallStep, step / 10),
    largeStep: validStep(options.largeStep, step * 10),
  };
};

export const provideNumberInputScrubSteps = (
  options: MaybeRefOrGetter<NumberInputScrubStepOptions>,
) => {
  const inherited = inject(NUMBER_INPUT_SCRUB_STEPS, undefined);
  const steps = computed(() => {
    const value = toValue(options);
    const hasOverride =
      value.step !== undefined ||
      value.smallStep !== undefined ||
      value.largeStep !== undefined ||
      value.formatOptions !== undefined;

    return hasOverride || inherited === undefined
      ? resolveNumberInputScrubSteps(value)
      : inherited.value;
  });

  provide(NUMBER_INPUT_SCRUB_STEPS, steps);
  return steps;
};

export const useNumberInputScrubSteps = () =>
  inject(
    NUMBER_INPUT_SCRUB_STEPS,
    computed(() => resolveNumberInputScrubSteps({})),
  );
