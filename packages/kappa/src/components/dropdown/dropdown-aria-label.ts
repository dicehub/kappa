import type { ComputedRef, InjectionKey } from "vue";

export const dropdownAriaLabelKey: InjectionKey<ComputedRef<string | undefined>> = Symbol(
  "kappa-dropdown-aria-label",
);
