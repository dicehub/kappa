export const barrelCode = `import { Grid, GridItem } from "@dicehub/kappa";`;

export const granularCode = `import { Grid, GridItem } from "@dicehub/kappa/components/grid";`;

export const previewCode = `<script setup>
import { Grid, GridItem } from "@dicehub/kappa/components/grid";
</script>

<template>
  <Grid variant="2up" gap="base">
    <GridItem>
      <article>
        <strong>Plan</strong>
        <p>Set scope, owners, and delivery milestones.</p>
      </article>
    </GridItem>
    <GridItem>
      <article>
        <strong>Review</strong>
        <p>Track decisions, feedback, and final approval.</p>
      </article>
    </GridItem>
  </Grid>
</template>`;

export const usageCode = `<script setup>
import { Grid, GridItem } from "@dicehub/kappa/components/grid";
</script>

<template>
  <Grid variant="2up">
    <GridItem>Primary content</GridItem>
    <GridItem>Supporting content</GridItem>
  </Grid>
</template>`;

export const variantsCode = `<template>
  <Grid variant="2up" gap="sm">
    <GridItem>1</GridItem>
    <GridItem>2</GridItem>
  </Grid>

  <Grid variant="3up" gap="sm">
    <GridItem>1</GridItem>
    <GridItem>2</GridItem>
    <GridItem>3</GridItem>
  </Grid>

  <Grid variant="4up" gap="sm">
    <GridItem>1</GridItem>
    <GridItem>2</GridItem>
    <GridItem>3</GridItem>
    <GridItem>4</GridItem>
  </Grid>
</template>`;

export const asymmetricCode = `<template>
  <Grid variant="2-1" gap="base">
    <GridItem as="article">Main content</GridItem>
    <GridItem as="section">Supporting content</GridItem>
  </Grid>

  <Grid variant="1-2" gap="base">
    <GridItem as="section">Supporting content</GridItem>
    <GridItem as="article">Main content</GridItem>
  </Grid>
</template>`;

export const gapsCode = `<template>
  <Grid variant="side-by-side" gap="none">…</Grid>
  <Grid variant="side-by-side" gap="sm">…</Grid>
  <Grid variant="side-by-side" gap="base">…</Grid>
  <Grid variant="side-by-side" gap="lg">…</Grid>
</template>`;

export const mobileDividerCode = `<template>
  <Grid variant="4up" gap="base" mobile-divider>
    <GridItem>Research</GridItem>
    <GridItem>Design</GridItem>
    <GridItem>Build</GridItem>
    <GridItem>Release</GridItem>
  </Grid>
</template>`;

export const semanticCode = `<template>
  <Grid as="ul" variant="3up" gap="sm" aria-label="Team members">
    <GridItem as="li">Avery Morgan</GridItem>
    <GridItem as="li">Jordan Lee</GridItem>
    <GridItem as="li">Sam Rivera</GridItem>
  </Grid>
</template>`;

export const gridVariantRows = [
  { variant: "2up", layout: "1 → 2", description: "General two-column content." },
  { variant: "side-by-side", layout: "2", description: "Two columns at every width." },
  { variant: "2-1", layout: "1 → 2:1", description: "Main content before a narrow side region." },
  { variant: "1-2", layout: "1 → 1:2", description: "Narrow side region before main content." },
  { variant: "1-3up", layout: "1 → 3", description: "Three columns only at the large breakpoint." },
  { variant: "3up", layout: "1 → 2 → 3", description: "Progressive three-column content." },
  { variant: "4up", layout: "1 → 2 → 3 → 4", description: "Progressive four-column content." },
  { variant: "6up", layout: "2 → 3 → 4 → 6", description: "Dense metrics or compact items." },
  { variant: "1-2-4up", layout: "1 → 2 → 4", description: "Four columns without the three-column step." },
] as const;

export const gridProps = [
  {
    name: "as",
    type: '"div" | "section" | "ul" | "ol"',
    defaultValue: '"div"',
    description: "Native element rendered by the grid container.",
  },
  {
    name: "variant",
    type: '"2up" | "side-by-side" | "2-1" | "1-2" | "1-3up" | "3up" | "4up" | "6up" | "1-2-4up"',
    defaultValue: "undefined",
    description: "Responsive column layout preset. Omit it for the browser's single implicit column.",
  },
  {
    name: "gap",
    type: '"none" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Space between items. Base grows across responsive breakpoints.",
  },
  {
    name: "mobileDivider",
    type: "boolean",
    defaultValue: "false",
    description: 'Shows dividers between stacked items on small screens for the "4up" preset.',
  },
  {
    name: "default slot",
    type: "slot",
    defaultValue: "—",
    description: "GridItem children.",
  },
] as const;

export const gridItemProps = [
  {
    name: "as",
    type: '"div" | "article" | "section" | "li"',
    defaultValue: '"div"',
    description: "Native element rendered by the item.",
  },
  {
    name: "default slot",
    type: "slot",
    defaultValue: "—",
    description: "Content inside the grid cell.",
  },
] as const;

export const dataSlots = [
  { name: "grid", element: "dynamic", description: "Responsive grid container." },
  { name: "grid-item", element: "dynamic", description: "Min-width-safe grid item." },
] as const;

export const dataAttributes = [
  {
    name: "data-variant",
    value: "GridVariant",
    description: "Resolved column preset. Absent when no preset is set.",
  },
  { name: "data-gap", value: "GridGap", description: "Resolved gap preset." },
  {
    name: "data-mobile-divider",
    value: '""',
    description: "Present on the opted-in root and participating GridItem parts.",
  },
] as const;

export const exportsList = [
  { name: "Grid", description: "Compound Grid root with Grid.Root and Grid.Item." },
  { name: "GridRoot", description: "Named responsive grid container." },
  { name: "GridItem", description: "Named min-width-safe grid item." },
  { name: "GridProps / GridRootProps", description: "Public root prop contracts." },
  { name: "GridItemProps", description: "Public item prop contract." },
  { name: "GridVariant / GridGap", description: "Supported layout and spacing values." },
  { name: "GRID_VARIANTS / GRID_GAPS", description: "Supported preset metadata." },
  { name: "resolveGridVariant / resolveGridGap", description: "Safe runtime resolvers." },
] as const;
