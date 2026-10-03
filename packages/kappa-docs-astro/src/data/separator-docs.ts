export const barrelCode = `import { Separator } from "@dicehub/kappa";`;

export const granularCode = `import { Separator } from "@dicehub/kappa/components/separator";`;

export const previewCode = `<script setup>
import { Separator } from "@dicehub/kappa/components/separator";
</script>

<template>
  <section>
    <strong>Project Atlas</strong>
    <p>Shared workspace for product documentation.</p>
    <Separator />
    <div class="metadata">
      <span>12 members</span>
      <Separator orientation="vertical" />
      <span>8 projects</span>
      <Separator orientation="vertical" />
      <span>Updated today</span>
    </div>
  </section>
</template>`;

export const usageCode = `<script setup>
import { Separator } from "@dicehub/kappa/components/separator";
</script>

<template>
  <strong>Account</strong>
  <Separator />
  <p>Manage profile details and sign-in preferences.</p>
</template>`;

export const verticalCode = `<nav class="sections" aria-label="Project sections">
  <a href="#overview">Overview</a>
  <Separator orientation="vertical" />
  <a href="#activity">Activity</a>
  <Separator orientation="vertical" />
  <a href="#settings">Settings</a>
</nav>`;

export const listCode = `<dl>
  <div><dt>Status</dt><dd>Active</dd></div>
  <Separator />
  <div><dt>Region</dt><dd>Europe</dd></div>
  <Separator />
  <div><dt>Plan</dt><dd>Standard</dd></div>
</dl>`;

export const semanticCode = `<section>
  <div>
    <strong>Service status</strong>
    <p>All systems are operational.</p>
  </div>
  <Separator :decorative="false" aria-label="Deployment details" />
  <div>
    <strong>Last deployment</strong>
    <p>Today at 09:42 UTC</p>
  </div>
</section>`;

export const separatorProps = [
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Sets the visual axis and semantic orientation of the line.",
  },
  {
    name: "decorative",
    type: "boolean",
    defaultValue: "true",
    description: "Removes separator semantics when the line only supports visual layout.",
  },
] as const;

export const dataSlots = [
  { name: "separator", element: "hr", description: "Native dividing line." },
] as const;

export const dataAttributes = [
  {
    name: "data-orientation",
    value: '"horizontal" | "vertical"',
    description: "Resolved visual axis.",
  },
] as const;

export const exportsList = [
  { name: "Separator", description: "Native horizontal or vertical dividing line." },
  { name: "SeparatorProps", description: "Public prop contract." },
  { name: "SeparatorOrientation", description: "Supported orientation values." },
  { name: "SEPARATOR_ORIENTATIONS", description: "Supported orientation list." },
  {
    name: "SEPARATOR_DEFAULT_ORIENTATION",
    description: "Default horizontal orientation.",
  },
  { name: "isSeparatorOrientation", description: "Orientation type guard." },
  { name: "resolveSeparatorOrientation", description: "Safe orientation resolver." },
] as const;
