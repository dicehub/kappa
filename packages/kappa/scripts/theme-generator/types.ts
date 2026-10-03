/**
 * Schema for the Kappa color theme configuration.
 *
 * read_when: you add or change a configuration field, or you consume
 * `tokens.json` from tooling and documentation.
 */

export type ThemeMode = "light" | "dark";

export type TokenPreview = "background" | "shadow" | "text";

export interface ThemeGroup {
  /** Stable identifier used by the token reference and grouped documentation. */
  id: string;
  /** Short heading for the group. */
  label: string;
  /** One sentence describing when the group applies. */
  description: string;
}

export interface ThemeToken {
  /** Full custom property name, for example `--kappa-tint`. */
  name: string;
  /** Group id from {@link ThemeGroup}. */
  group: string;
  /** What the token styles, written for documentation readers. */
  description: string;
  light: string;
  dark: string;
  /**
   * How the documentation previews the token. `background` fills a swatch,
   * `text` renders a specimen on its recommended background, `shadow` renders
   * the value as a box shadow.
   */
  preview: TokenPreview;
  /** Compatibility or migration note, omitted when the token is unchanged. */
  compatibility?: string;
}

export interface ThemeContrastPair {
  id: string;
  /** Human label used in the contrast table. */
  label: string;
  /** Token name used as the foreground. */
  foreground: string;
  /** Token name used as the background. */
  background: string;
  /** Text pairs need 4.5:1; non-text indicators need 3:1. */
  kind: "text" | "nontext";
  /** Minimum accepted ratio for this pair. */
  minimum: number;
  /** Why the pair exists and where it is used. */
  note: string;
}

export interface ThemeDeprecation {
  /** Withdrawn token name. */
  name: string;
  /** Tokens that replace the withdrawn role. */
  replacements: string[];
  /** Migration guidance for consumers that override the withdrawn token. */
  note: string;
}

export interface ThemeConfig {
  defaultMode: ThemeMode;
  modes: ThemeMode[];
  groups: ThemeGroup[];
  tokens: ThemeToken[];
  contrastPairs: ThemeContrastPair[];
  deprecations: ThemeDeprecation[];
}
