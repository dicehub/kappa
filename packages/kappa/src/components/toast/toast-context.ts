import type { ComputedRef, InjectionKey } from "vue";

export interface ToastMeasurements { index: number; height: number }
export interface ToastLayoutContext {
  limit: ComputedRef<number>;
  measurements: Map<string, ToastMeasurements>;
}

export const toastLayoutKey: InjectionKey<ToastLayoutContext> = Symbol("KappaToastLayout");
