/**
 * Withdrawn tokens and their replacements. Deprecated names are never emitted
 * by the theme; component fallback chains keep reading explicit consumer
 * overrides instead.
 *
 * read_when: you withdraw a token or need the migration guidance published on
 * `/docs/colors`.
 */

import type { ThemeDeprecation } from "./types.ts";

export const themeDeprecations: ThemeDeprecation[] = [
  {
    name: "--kappa-selected",
    replacements: [
      "--kappa-selected-background",
      "--kappa-selected-contrast",
      "--kappa-selected-text",
    ],
    note: "Withdrawn as a global default because a single value served both selection fills and selection text. Component fallback chains still read an explicit --kappa-selected override first; set --kappa-selected-contrast beside it so the pair stays readable.",
  },
];
