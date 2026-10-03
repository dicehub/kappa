export const barrelCode = `import { Badge } from "@dicehub/kappa";`;

export const granularCode = `import { Badge } from "@dicehub/kappa/components/badge";`;

export const previewCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
</script>

<template>
  <div class="status-row">
    <Badge>Primary</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="success">Ready</Badge>
    <Badge variant="warning">12 warnings</Badge>
    <Badge variant="error">Failed</Badge>
  </div>
</template>`;

export const usageCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
</script>

<template>
  <Badge>Stable</Badge>
</template>`;

export const semanticCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
</script>

<template>
  <Badge>Primary</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="beta">Beta</Badge>
  <Badge variant="info">Info</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="error">Error</Badge>
  <Badge variant="destructive">Destructive</Badge>
</template>`;

export const colorsCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
</script>

<template>
  <Badge variant="red">Red</Badge>
  <Badge variant="orange">Orange</Badge>
  <Badge variant="green">Green</Badge>
  <Badge variant="teal">Teal</Badge>
  <Badge variant="teal-subtle">Teal subtle</Badge>
  <Badge variant="blue">Blue</Badge>
  <Badge variant="purple">Purple</Badge>
  <Badge variant="neutral">Neutral</Badge>
</template>`;

export const iconsCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
</script>

<template>
  <Badge variant="success">
    <svg data-icon="inline-start" viewBox="0 0 16 16" aria-hidden="true">
      <path d="m3 8 3 3 7-7" />
    </svg>
    Verified
  </Badge>
  <Badge variant="outline">
    Pinned
    <svg data-icon="inline-end" viewBox="0 0 16 16" aria-hidden="true">
      <path d="m5 2 6 6-2 1 3 3-1 1-3-3-1 2-2-10Z" />
    </svg>
  </Badge>
</template>`;

export const linkCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
</script>

<template>
  <Badge as="a" href="/runs/latest">
    Open run
    <svg data-icon="inline-end" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  </Badge>
</template>`;

export const sentenceCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
</script>

<template>
  <p>Simulation <Badge variant="success">Complete</Badge> in 18m 42s.</p>
</template>`;

export const numericCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";

const queuedJobs = 128;
</script>

<template>
  <Badge variant="secondary">
    <span aria-hidden="true">{{ queuedJobs > 99 ? "99+" : queuedJobs }}</span>
    <span class="visually-hidden">{{ queuedJobs }}</span>
  </Badge>
  <span>queued jobs</span>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>`;

export const badgeProps = [
  {
    name: "variant",
    type: "BadgeVariant",
    defaultValue: '"primary"',
    description: "Selects a semantic or color treatment.",
  },
  {
    name: "as",
    type: '"span" | "a"',
    defaultValue: '"span"',
    description: "Changes the rendered element while retaining Badge styling and attributes.",
  },
] as const;

export const semanticVariants = [
  { name: "primary", purpose: "Strong default label or classification." },
  { name: "secondary", purpose: "Quiet supporting metadata." },
  { name: "outline", purpose: "Neutral label on the surrounding surface." },
  { name: "beta", purpose: "Pre-release or experimental availability." },
  { name: "info", purpose: "Informational state." },
  { name: "success", purpose: "Successful or ready state." },
  { name: "warning", purpose: "Caution or degraded state." },
  { name: "error", purpose: "Failed or invalid state." },
  { name: "destructive", purpose: "Destructive state; retained as the solid red compatibility treatment." },
] as const;

export const colorVariants = [
  "red",
  "orange",
  "green",
  "teal",
  "teal-subtle",
  "blue",
  "purple",
  "neutral",
] as const;

export const exportsList = [
  { name: "Badge", description: "Presentational badge with semantic element composition." },
  { name: "BADGE_VARIANTS", description: "Readonly map of supported variant names." },
  { name: "BADGE_DEFAULT_VARIANT", description: "The default variant name: primary." },
  { name: "BADGE_DEFAULT_ELEMENT", description: "The default rendered element: span." },
  { name: "isBadgeElement", description: "Runtime type guard for span and a element names." },
  { name: "isBadgeVariant", description: "Runtime type guard for variant strings." },
  { name: "BadgeVariant", description: "Union of supported variant names." },
  { name: "BadgeElement", description: "Union of the supported span and a element names." },
  { name: "BadgeProps", description: "Public as and variant props." },
] as const;
