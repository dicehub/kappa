import {
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
} from "vue";
import type { InputGroupContextValue, InputGroupSize } from "./input-group";

export const inputGroupContextKey: InjectionKey<InputGroupContextValue> =
  Symbol("kappa-input-group");

export const provideInputGroupContext = (context: InputGroupContextValue) =>
  provide(inputGroupContextKey, context);

export const useInputGroupContext = () => inject(inputGroupContextKey);

export const createInputGroupContext = (
  size: ComputedRef<InputGroupSize>,
  disabled: ComputedRef<boolean>,
  invalid: ComputedRef<boolean>,
): InputGroupContextValue => ({ size, disabled, invalid });
