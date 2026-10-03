import { watchEffect, type Ref } from "vue";

// Ark UI leaves the hidden input's `indeterminate` IDL property untouched. Native mixed-state
// announcement requires that property, so Kappa syncs it from the machine state.
export const syncCheckboxIndeterminate = (
  rootElement: Ref<{ $el?: Element } | Element | null | undefined>,
  isIndeterminate: () => boolean,
) =>
  watchEffect(() => {
    if (typeof window === "undefined") return;
    const value = rootElement.value;
    const root = value instanceof Element ? value : value?.$el;
    const input = root?.querySelector?.("input[type='checkbox']");
    if (input instanceof HTMLInputElement) {
      input.indeterminate = isIndeterminate();
    }
  });
