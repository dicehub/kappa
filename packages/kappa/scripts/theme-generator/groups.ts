/**
 * Token groups. The order here is the order used by the generated CSS,
 * `tokens.json`, and the grouped documentation reference.
 *
 * read_when: you add a token group or rename its documentation heading.
 */

import type { ThemeGroup } from "./types.ts";

export const themeGroups: ThemeGroup[] = [
  {
    id: "surfaces",
    label: "Surfaces",
    description: "Page, panel, and control backgrounds, plus their recessed and overlay steps.",
  },
  {
    id: "text",
    label: "Text",
    description: "Body copy, emphasis, supporting text, and placeholders.",
  },
  {
    id: "accent",
    label: "Accent",
    description: "The dicehub accent for links, selected indicators, and solid actions.",
  },
  {
    id: "selection",
    label: "Selection",
    description: "Selected states that pair a fill with readable contrast text.",
  },
  {
    id: "status",
    label: "Status",
    description:
      "Informational, success, warning, and danger colors as text, solid fill, and tint.",
  },
  {
    id: "charts",
    label: "Charts",
    description: "Ordered series colors for data visualization in light and dark themes.",
  },
  {
    id: "border",
    label: "Borders and focus",
    description: "Hairline separators, stronger boundaries, and keyboard focus rings.",
  },
  {
    id: "supporting",
    label: "Supporting",
    description: "Shadows, backdrops, and the compatibility values existing components require.",
  },
];
