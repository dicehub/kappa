/**
 * Authoritative Kappa color theme.
 *
 * `pnpm --filter @dicehub/kappa codegen:themes` renders this configuration into
 * `src/styles/theme-kappa.css` and `src/styles/tokens.json`; never edit those
 * generated assets directly.
 *
 * read_when: adding or renaming a semantic token (`tokens.ts`), retuning a
 * published pair (`contrast-pairs.ts`), withdrawing a token
 * (`deprecations.ts`), or changing the schema (`types.ts`).
 */

import { themeContrastPairs } from "./contrast-pairs.ts";
import { themeDeprecations } from "./deprecations.ts";
import { themeGroups } from "./groups.ts";
import { themeTokens } from "./tokens.ts";
import type { ThemeConfig } from "./types.ts";

export const themeConfig: ThemeConfig = {
  defaultMode: "light",
  modes: ["light", "dark"],
  groups: themeGroups,
  tokens: themeTokens,
  contrastPairs: themeContrastPairs,
  deprecations: themeDeprecations,
};

export type {
  ThemeConfig,
  ThemeContrastPair,
  ThemeDeprecation,
  ThemeGroup,
  ThemeMode,
  ThemeToken,
  TokenPreview,
} from "./types.ts";
