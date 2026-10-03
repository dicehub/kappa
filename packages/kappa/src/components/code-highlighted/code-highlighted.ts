export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "json"
  | "jsonc"
  | "html"
  | "css"
  | "python"
  | "yaml"
  | "markdown"
  | "graphql"
  | "sql"
  | "bash"
  | "shell"
  | "diff"
  | "hcl"
  | "toml"
  | "vue";

export const LANGUAGE_ALIASES = {
  js: "javascript",
  cjs: "javascript",
  mjs: "javascript",
  ts: "typescript",
  cts: "typescript",
  mts: "typescript",
  sh: "bash",
  zsh: "bash",
  yml: "yaml",
  py: "python",
  md: "markdown",
  gql: "graphql",
} as const satisfies Record<string, SupportedLanguage>;

export type LanguageAlias = keyof typeof LANGUAGE_ALIASES;
export type LanguageInput = SupportedLanguage | LanguageAlias;
export type ShikiEngine = "javascript" | "wasm";

export type CodeHighlightedLabels = {
  copy?: string;
  copied?: string;
};

export const DEFAULT_CODE_HIGHLIGHTED_LABELS: Required<CodeHighlightedLabels> = {
  copy: "Copy",
  copied: "Copied!",
};

export interface CodeHighlightedProps {
  code: string;
  lang: LanguageInput | (string & {});
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  showCopyButton?: boolean;
  labels?: CodeHighlightedLabels;
}

export interface ShikiProviderProps {
  engine?: ShikiEngine;
  labels?: CodeHighlightedLabels;
  languages: Array<LanguageInput | (string & {})>;
}

export function normalizeCodeHighlightedLanguage(lang: string): SupportedLanguage | null {
  if (lang in CODE_HIGHLIGHTED_LANGUAGES) return lang as SupportedLanguage;
  if (lang in LANGUAGE_ALIASES) return LANGUAGE_ALIASES[lang as LanguageAlias];
  return null;
}

export function normalizeLanguageSet<Language extends string>(
  languages: readonly string[],
  normalize: (language: string) => Language | null,
): Language[] {
  return [
    ...new Set(
      languages
        .map((language) => normalize(language))
        .filter((language): language is Language => language !== null),
    ),
  ].sort();
}

export function getLanguageSetKey<Language extends string>(
  languages: readonly string[],
  normalize: (language: string) => Language | null,
): string {
  return normalizeLanguageSet(languages, normalize).join(",");
}

// Declared here so normalizeCodeHighlightedLanguage can validate against the supported set.
const CODE_HIGHLIGHTED_LANGUAGES: Record<SupportedLanguage, true> = {
  javascript: true,
  typescript: true,
  jsx: true,
  tsx: true,
  json: true,
  jsonc: true,
  html: true,
  css: true,
  python: true,
  yaml: true,
  markdown: true,
  graphql: true,
  sql: true,
  bash: true,
  shell: true,
  diff: true,
  hcl: true,
  toml: true,
  vue: true,
};
