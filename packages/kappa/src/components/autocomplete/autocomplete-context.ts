import type { ListCollection } from "@ark-ui/vue/combobox";
import { inject, provide, type ComputedRef } from "vue";

export type AutocompleteContext = {
  collection: ComputedRef<ListCollection<unknown>>;
};

const autocompleteContextKey = Symbol("kappa-autocomplete-context");

export const provideAutocompleteContext = (context: AutocompleteContext) => {
  provide(autocompleteContextKey, context);
};

export const useAutocompleteContext = () =>
  inject<AutocompleteContext | null>(autocompleteContextKey, null);
