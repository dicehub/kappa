export const barrelCode = `import { SkeletonLine } from "@dicehub/kappa";`;

export const granularCode = `import { SkeletonLine } from "@dicehub/kappa/components/skeleton-line";`;

export const previewCode = `<script setup>
import { SkeletonLine } from "@dicehub/kappa/components/skeleton-line";
</script>

<template>
  <section aria-busy="true">
    <span role="status" class="visually-hidden">Loading recent activity</span>
    <article v-for="item in 3" :key="item">
      <SkeletonLine :width="40" :height="40" class="activity-avatar" />
      <div>
        <SkeletonLine width="72%" />
        <SkeletonLine width="46%" />
      </div>
    </article>
  </section>
</template>`;

export const usageCode = `<script setup>
import { SkeletonLine } from "@dicehub/kappa/components/skeleton-line";
</script>

<template>
  <div aria-busy="true">
    <span role="status" class="visually-hidden">Loading article</span>
    <SkeletonLine />
    <SkeletonLine width="78%" />
    <SkeletonLine width="52%" />
  </div>
</template>`;

export const widthsCode = `<SkeletonLine />
<SkeletonLine width="78%" />
<SkeletonLine width="52%" />
<SkeletonLine :width="112" />`;

export const heightsCode = `<SkeletonLine :height="8" />
<SkeletonLine :height="12" />
<SkeletonLine :height="20" />`;

export const blockHeightCode = `<SkeletonLine :block-height="32" width="64%" />
<SkeletonLine :block-height="48" width="72%" />
<SkeletonLine block-height="4rem" width="56%" />`;

export const cardCode = `<section class="profile-card" aria-busy="true">
  <span role="status" class="visually-hidden">Loading profile</span>
  <SkeletonLine :width="48" :height="48" class="profile-avatar" />
  <div>
    <SkeletonLine width="9rem" :height="12" />
    <SkeletonLine width="6rem" />
  </div>
</section>`;

export const tableCode = `<div class="table-loading" aria-busy="true">
  <span role="status" class="visually-hidden">Loading records</span>
  <div v-for="row in 4" :key="row" class="table-loading__row">
    <SkeletonLine width="55%" />
    <SkeletonLine width="38%" />
    <SkeletonLine width="62%" />
  </div>
</div>`;

export const staticCode = `<SkeletonLine :animated="false" width="72%" />`;

export const skeletonLineProps = [
  {
    name: "width",
    type: "string | number",
    defaultValue: '"100%"',
    description: "Sets an exact CSS width. Positive numbers use pixels.",
  },
  {
    name: "height",
    type: "string | number",
    defaultValue: '"0.5rem"',
    description: "Sets an exact CSS height. Positive numbers use pixels.",
  },
  {
    name: "blockHeight",
    type: "string | number",
    defaultValue: "—",
    description: "Adds a container that vertically centers the line at the given height.",
  },
  {
    name: "animated",
    type: "boolean",
    defaultValue: "true",
    description: "Enables the restrained loading scan. Reduced-motion settings always stop it.",
  },
] as const;

export const exportsList = [
  { name: "SkeletonLine", description: "Decorative loading placeholder with deterministic geometry." },
  { name: "SkeletonLineProps", description: "Public geometry and animation prop contract." },
  { name: "SkeletonLineLength", description: "String or numeric CSS length accepted by geometry props." },
  { name: "SKELETON_LINE_DEFAULT_WIDTH", description: "Default full-width line value." },
  { name: "SKELETON_LINE_DEFAULT_HEIGHT", description: "Default 0.5 rem line height." },
  { name: "resolveSkeletonLineLength", description: "Safe CSS-length resolver used by geometry props." },
] as const;
