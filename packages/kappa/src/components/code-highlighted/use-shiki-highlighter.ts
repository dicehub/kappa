import { computed, inject, type ComputedRef, type Ref, type ShallowRef } from "vue";
import {
  normalizeCodeHighlightedLanguage,
  type CodeHighlightedLabels,
  type LanguageInput,
} from "./code-highlighted";
import { SHIKI_CONTEXT_KEY, type ShikiContextValue } from "./code-highlighted-context";

export type UseShikiHighlighterResult = {
  highlight: (code: string, lang: LanguageInput | (string & {})) => string | null;
  isLoading: Ref<boolean>;
  isReady: ComputedRef<boolean>;
  error: ShallowRef<Error | null>;
  labels: ComputedRef<Required<CodeHighlightedLabels>>;
};

export function useShikiHighlighter(): UseShikiHighlighterResult {
  const context = inject<ShikiContextValue>(SHIKI_CONTEXT_KEY);

  if (!context) {
    throw new Error(
      "useShikiHighlighter must be used within a ShikiProvider. " +
        "Wrap your app with <ShikiProvider> from '@dicehub/kappa/components/code-highlighted'.",
    );
  }

  const highlight = (code: string, lang: LanguageInput | (string & {})): string | null => {
    if (!context.highlighter.value) return null;

    const normalizedLang = normalizeCodeHighlightedLanguage(lang);

    if (!normalizedLang || !context.languages.value.includes(normalizedLang)) {
      console.warn(
        `[Kappa CodeHighlighted] Language "${lang}" is not in the ShikiProvider languages list. Rendering as plain text.`,
      );
      return null;
    }

    try {
      return context.highlighter.value.codeToHtml(code, {
        lang: normalizedLang,
        themes: {
          light: "github-light",
          dark: "vesper",
        },
        defaultColor: "light-dark()",
      });
    } catch (error) {
      console.warn(`[Kappa CodeHighlighted] Failed to highlight code with language "${lang}":`, error);
      return null;
    }
  };

  return {
    highlight,
    isLoading: context.isLoading,
    isReady: computed(() => !context.isLoading.value && context.highlighter.value !== null),
    error: context.error,
    labels: context.labels,
  };
}
