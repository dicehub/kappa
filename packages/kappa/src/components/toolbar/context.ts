import { inject, provide, type ComputedRef, type InjectionKey } from "vue";
import type { ToolbarOrientation, ToolbarSize } from "./toolbar";

export interface ToolbarContextValue {
  disabled: ComputedRef<boolean>;
  orientation: ComputedRef<ToolbarOrientation>;
  size: ComputedRef<ToolbarSize>;
}

const toolbarContextKey: InjectionKey<ToolbarContextValue> = Symbol(
  "kappa-toolbar",
);

export const provideToolbarContext = (context: ToolbarContextValue) => {
  provide(toolbarContextKey, context);
};

export const useToolbarContext = () =>
  inject(toolbarContextKey, undefined);
