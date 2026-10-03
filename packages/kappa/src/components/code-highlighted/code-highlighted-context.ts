import type { ComputedRef, Ref, ShallowRef } from "vue";
import type { HighlighterCore } from "shiki/core";
import type { CodeHighlightedLabels, SupportedLanguage } from "./code-highlighted";

export type ShikiContextValue = {
  highlighter: ShallowRef<HighlighterCore | null>;
  isLoading: Ref<boolean>;
  error: ShallowRef<Error | null>;
  languages: Ref<SupportedLanguage[]>;
  labels: ComputedRef<Required<CodeHighlightedLabels>>;
};

export const SHIKI_CONTEXT_KEY = Symbol("kappa-shiki-context");
