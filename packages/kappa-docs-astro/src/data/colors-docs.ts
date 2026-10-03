/**
 * Documentation view of the published Kappa theme metadata.
 *
 * The Colors page reads `@dicehub/kappa/styles/tokens.json` through the public
 * package export; it never imports the generator configuration.
 */

import themeTokens from "@dicehub/kappa/styles/tokens.json";
import { contrastRatio } from "../lib/contrast";

export type ColorMode = "light" | "dark";
export type ColorsTokenPreview = "background" | "shadow" | "text";

export interface ColorsToken {
  compatibility: string | null;
  dark: string;
  description: string;
  group: string;
  light: string;
  name: string;
  preview: ColorsTokenPreview;
  resolvedDark: string;
  resolvedLight: string;
}

export interface ColorsContrastPair {
  background: string;
  backgroundValues: Record<ColorMode, string>;
  foreground: string;
  foregroundValues: Record<ColorMode, string>;
  id: string;
  kind: "nontext" | "text";
  label: string;
  minimum: number;
  note: string;
  ratios: Record<ColorMode, number>;
}

export interface ColorsDeprecation {
  name: string;
  note: string;
  replacements: string[];
}

export interface ColorsReferenceModeValue {
  id: ColorMode;
  /** Display label, for example `Light`. */
  label: string;
  /** Value as configured in the theme, including `var(--kappa-...)` aliases. */
  value: string;
  /** Value the token resolves to in this mode. */
  resolved: string;
}

export interface ColorsReferenceToken {
  compatibility: string | null;
  description: string;
  modes: ColorsReferenceModeValue[];
  name: string;
  preview: ColorsTokenPreview;
  /** Background token used to preview `text` tokens so the specimen stays visible. */
  swatchBackground: string;
}

export interface ColorsReferenceGroup {
  description: string;
  id: string;
  label: string;
  tokens: ColorsReferenceToken[];
}

interface ThemeTokenMetadata {
  compatibility: string | null;
  dark: string;
  description: string;
  group: string;
  light: string;
  name: string;
  preview: ColorsTokenPreview;
  resolved: Record<ColorMode, string>;
}

interface ThemeMetadata {
  attributes: {
    canonical: string;
    compatibility: string[];
    precedence: string;
    values: string[];
  };
  contrastPairs: Array<{
    background: string;
    foreground: string;
    id: string;
    kind: "nontext" | "text";
    label: string;
    minimum: number;
    note: string;
  }>;
  defaultMode: ColorMode;
  deprecations: ColorsDeprecation[];
  groups: Array<{ description: string; id: string; label: string }>;
  modes: ColorMode[];
  package: string;
  schemaVersion: number;
  tokens: ThemeTokenMetadata[];
}

/**
 * `tokens.json` is generated and validated by
 * `packages/kappa/scripts/theme-generator`; this cast is the single trusted
 * boundary for its shape.
 */
const themeMetadata = themeTokens as unknown as ThemeMetadata;

export const themePackageName = themeMetadata.package;
export const colorModes: ColorMode[] = [...themeMetadata.modes];
export const colorThemeAttributes = themeMetadata.attributes;

export const colorTokens: ColorsToken[] = themeMetadata.tokens.map((token) => ({
  name: token.name,
  group: token.group,
  description: token.description,
  preview: token.preview,
  light: token.light,
  dark: token.dark,
  resolvedLight: token.resolved.light,
  resolvedDark: token.resolved.dark,
  compatibility: token.compatibility,
}));

export const colorTokenCount = colorTokens.length;

const tokenIndex: Record<string, ColorsToken | undefined> = Object.fromEntries(
  colorTokens.map((token) => [token.name, token]),
);

const resolvedValue = (name: string, mode: ColorMode) => {
  const token = tokenIndex[name];
  if (!token) throw new Error(`Unknown token in contrast metadata: ${name}`);
  return mode === "light" ? token.resolvedLight : token.resolvedDark;
};

export const colorContrastPairs: ColorsContrastPair[] = themeMetadata.contrastPairs.map(
  (pair) => {
    const foregroundValues: Record<ColorMode, string> = {
      light: resolvedValue(pair.foreground, "light"),
      dark: resolvedValue(pair.foreground, "dark"),
    };
    const backgroundValues: Record<ColorMode, string> = {
      light: resolvedValue(pair.background, "light"),
      dark: resolvedValue(pair.background, "dark"),
    };

    return {
      id: pair.id,
      label: pair.label,
      note: pair.note,
      foreground: pair.foreground,
      background: pair.background,
      kind: pair.kind,
      minimum: pair.minimum,
      foregroundValues,
      backgroundValues,
      ratios: {
        light: contrastRatio(foregroundValues.light, backgroundValues.light),
        dark: contrastRatio(foregroundValues.dark, backgroundValues.dark),
      },
    };
  },
);

export const colorDeprecations: ColorsDeprecation[] = themeMetadata.deprecations;

/**
 * First recommended text pair for each foreground token. Text swatches use it
 * as their background, so contrast tokens such as --kappa-accent-contrast stay
 * visible in both modes instead of sitting on their own color.
 */
const swatchBackgroundByToken: Record<string, string | undefined> = {};
for (const pair of themeMetadata.contrastPairs) {
  if (pair.kind === "text" && swatchBackgroundByToken[pair.foreground] === undefined) {
    swatchBackgroundByToken[pair.foreground] = pair.background;
  }
}

export const colorReferenceGroups: ColorsReferenceGroup[] = themeMetadata.groups.map((group) => ({
  id: group.id,
  label: group.label,
  description: group.description,
  tokens: colorTokens
    .filter((token) => token.group === group.id)
    .map((token) => ({
      name: token.name,
      description: token.description,
      compatibility: token.compatibility,
      preview: token.preview,
      swatchBackground: swatchBackgroundByToken[token.name] ?? "--kappa-base",
      modes: colorModes.map((mode) => ({
        id: mode,
        label: mode === "light" ? "Light" : "Dark",
        value: mode === "light" ? token.light : token.dark,
        resolved: mode === "light" ? token.resolvedLight : token.resolvedDark,
      })),
    })),
}));
