import { computed, inject, ref, shallowRef, type ComputedRef, type Ref, type ShallowRef } from "vue";
import {
  DEFAULT_CODE_HIGHLIGHTED_LABELS,
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
  const context = inject<ShikiContextValue | null>(SHIKI_CONTEXT_KEY, null);

  if (!context) {
    throw new Error(
      "useShikiHighlighter must be used within a ShikiProvider. " +
        "Wrap your app with <ShikiProvider> from '@dicehub/kappa/components/code-highlighted'.",
    );
  }

  return createHighlighter(context);
}

export function useOptionalShikiHighlighter(): UseShikiHighlighterResult {
  return createHighlighter(inject<ShikiContextValue | null>(SHIKI_CONTEXT_KEY, null));
}

function createHighlighter(context: ShikiContextValue | null): UseShikiHighlighterResult {
  const highlight = (code: string, lang: LanguageInput | (string & {})): string | null => {
    if (!context?.highlighter.value || ["text", "plain", "txt"].includes(lang)) return null;

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
    isLoading: context?.isLoading ?? ref(false),
    isReady: computed(() => Boolean(context && !context.isLoading.value && context.highlighter.value)),
    error: context?.error ?? shallowRef(null),
    labels: context?.labels ?? computed(() => DEFAULT_CODE_HIGHLIGHTED_LABELS),
  };
}
