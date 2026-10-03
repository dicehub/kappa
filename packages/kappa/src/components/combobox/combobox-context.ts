import type { ListCollection } from "@ark-ui/vue/combobox";
import { inject, provide, type ComputedRef, type Ref } from "vue";
import type { ComboboxPositioningOptions, ComboboxSize } from "./combobox";

export type KappaComboboxContext = {
  clearContentPositioning: () => void;
  collection: ComputedRef<ListCollection<unknown>>;
  describedBy: ComputedRef<string | undefined>;
  disabled: ComputedRef<boolean>;
  filterValue: Ref<string>;
  invalid: ComputedRef<boolean>;
  readOnly: ComputedRef<boolean>;
  setContentPositioning: (positioning: ComboboxPositioningOptions) => void;
  size: ComputedRef<ComboboxSize>;
};

const comboboxContextKey = Symbol("kappa-combobox-context");

export const provideKappaComboboxContext = (context: KappaComboboxContext) => {
  provide(comboboxContextKey, context);
};

export const useKappaComboboxContext = () => {
  const context = inject<KappaComboboxContext | null>(comboboxContextKey, null);
  if (!context) throw new Error("Kappa Combobox parts must be used inside Combobox.Root.");
  return context;
};
