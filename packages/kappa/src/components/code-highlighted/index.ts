import CodeHighlightedRoot from "./CodeHighlighted.vue";
import ShikiProvider from "./ShikiProvider.vue";

export const CodeHighlighted = Object.assign(CodeHighlightedRoot, {
  Root: CodeHighlightedRoot,
  Provider: ShikiProvider,
});

export { CodeHighlightedRoot, ShikiProvider };

export { useShikiHighlighter, type UseShikiHighlighterResult } from "./use-shiki-highlighter";

export {
  DEFAULT_CODE_HIGHLIGHTED_LABELS,
  normalizeCodeHighlightedLanguage,
  type CodeHighlightedLabels,
  type CodeHighlightedEmits,
  type CodeHighlightedLanguageOption,
  type CodeHighlightedProps,
  type LanguageAlias,
  type LanguageInput,
  type ShikiEngine,
  type ShikiProviderProps,
  type SupportedLanguage,
} from "./code-highlighted";
