export const barrelCode = `import { Highlight } from "@dicehub/kappa";`;

export const granularCode = `import { Highlight } from "@dicehub/kappa/components/highlight";`;

export const previewCode = `<script setup>
import { Highlight } from "@dicehub/kappa/components/highlight";
</script>

<template>
  <Highlight
    text="Mesh convergence reached 92% after the final solve."
    query="convergence"
  />
</template>`;

export const usageCode = `<script setup>
import { Highlight } from "@dicehub/kappa/components/highlight";
</script>

<template>
  <p>
    <Highlight
      text="Solver status: converged"
      :query="['solver', 'status']"
      ignore-case
      :match-all="true"
    />
  </p>
</template>`;

export const singleQueryCode = `<script setup>
import { Highlight } from "@dicehub/kappa/components/highlight";
</script>

<template>
  <Highlight
    text="The solver is ready; the solver can start the next run."
    query="solver"
  />
</template>`;

export const multipleQueryCode = `<script setup>
import { Highlight } from "@dicehub/kappa/components/highlight";
</script>

<template>
  <Highlight
    text="Export includes mesh, field, and mesh metadata."
    :query="['mesh', 'field']"
    :match-all="true"
  />
</template>`;

export const caseSensitiveCode = `<script setup>
import { Highlight } from "@dicehub/kappa/components/highlight";
</script>

<template>
  <Highlight
    text="Kappa and kappa are different matches."
    query="kappa"
  />
</template>`;

export const exactMatchCode = `<script setup>
import { Highlight } from "@dicehub/kappa/components/highlight";
</script>

<template>
  <Highlight
    text="mesh meshlet mesh"
    query="mesh"
    :match-all="true"
    :exact-match="true"
  />
</template>`;

export const highlightProps = [
  {
    name: "text",
    type: "string",
    defaultValue: "—",
    description: "Text rendered by the component and searched for matches.",
  },
  {
    name: "query",
    type: "string | string[]",
    defaultValue: "—",
    description: "One query or a list of query terms to mark.",
  },
  {
    name: "ignoreCase",
    type: "boolean",
    defaultValue: "false",
    description: "Matches query terms without regard to letter case.",
  },
  {
    name: "matchAll",
    type: "boolean",
    defaultValue: "false for string; true for string[]",
    description: "Marks every matching occurrence. Set true when using multiple queries.",
  },
  {
    name: "exactMatch",
    type: "boolean",
    defaultValue: "false",
    description: "Matches complete words instead of query substrings.",
  },
] as const;

export const dataSlots = [
  {
    name: "highlight",
    element: "span",
    description: "Inline Kappa root; consumer attributes and listeners pass through.",
  },
  {
    name: "mark",
    element: "mark",
    description: "Ark UI-generated matching chunk with Kappa semantic styling.",
  },
] as const;

export const exportsList = [
  { name: "Highlight", description: "Inline text highlighter with Kappa mark styling." },
  { name: "HighlightProps", description: "Public text, query, and matching prop contract." },
  { name: "HighlightQuery / HighlightChunk", description: "Public query and generated chunk types." },
  { name: "useHighlight / UseHighlightProps", description: "Ark UI matching hook and its prop contract." },
  {
    name: "HIGHLIGHT_DEFAULT_IGNORE_CASE / HIGHLIGHT_DEFAULT_EXACT_MATCH",
    description: "Boolean defaults used by the Kappa wrapper.",
  },
  {
    name: "resolveHighlightMatchAll",
    description: "Preserves explicit values and resolves Ark's string-versus-array default.",
  },
] as const;
