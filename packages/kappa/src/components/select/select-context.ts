import { inject, provide, type ComputedRef, type InjectionKey } from "vue";
import type { CollectionItem, ListCollection } from "@ark-ui/vue/select";
import type { SelectSize } from "./select";

export interface KappaSelectContext<T extends CollectionItem = CollectionItem> {
  ariaLabel: ComputedRef<string | undefined>;
  collection: ComputedRef<ListCollection<T>>;
  describedBy: ComputedRef<string | undefined>;
  disabled: ComputedRef<boolean>;
  invalid: ComputedRef<boolean>;
  readOnly: ComputedRef<boolean>;
  size: ComputedRef<SelectSize>;
}

const selectContextKey: InjectionKey<KappaSelectContext> = Symbol("kappa-select");

export const provideKappaSelectContext = <T extends CollectionItem>(
  context: KappaSelectContext<T>,
) => {
  provide(selectContextKey, context as KappaSelectContext);
};

export const useKappaSelectContext = () => inject(selectContextKey);
