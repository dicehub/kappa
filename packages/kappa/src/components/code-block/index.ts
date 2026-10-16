import CodeBlockRoot from "../code-highlighted/CodeHighlighted.vue";
import ShikiProvider from "../code-highlighted/ShikiProvider.vue";

export const CodeBlock = Object.assign(CodeBlockRoot, {
  Root: CodeBlockRoot,
  Provider: ShikiProvider,
});

export { CodeBlockRoot };
export {
  ShikiProvider,
  useShikiHighlighter,
  normalizeCodeHighlightedLanguage as normalizeCodeBlockLanguage,
  DEFAULT_CODE_HIGHLIGHTED_LABELS as DEFAULT_CODE_BLOCK_LABELS,
  type CodeHighlightedLabels as CodeBlockLabels,
  type CodeHighlightedEmits as CodeBlockEmits,
  type CodeHighlightedLanguageOption as CodeBlockLanguageOption,
  type CodeHighlightedProps as CodeBlockProps,
  type LanguageAlias,
  type LanguageInput,
  type ShikiEngine,
  type ShikiProviderProps,
  type SupportedLanguage,
  type UseShikiHighlighterResult,
} from "../code-highlighted";
