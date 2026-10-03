export const barrelCode = `import { Format } from "@dicehub/kappa";`;

export const granularCode = `import { Format } from "@dicehub/kappa/components/format";`;

export const previewCode = `<script setup>
import { Format } from "@dicehub/kappa/components/format";

const indexedAt = new Date("2026-08-28T09:15:00.000Z");
</script>

<template>
  <Format locale="en-US">
    <div class="format-grid">
      <div class="format-card">
        <span>Artifact bundle</span>
        <Format.Byte :value="2684354560" unit-system="binary" />
        <code>build/output.tar</code>
      </div>
      <div class="format-card">
        <span>Jobs completed</span>
        <Format.Number :value="128400" notation="compact" />
        <code>worker/queue</code>
      </div>
      <div class="format-card">
        <span>Last indexed</span>
        <Format.RelativeTime :value="indexedAt" numeric="auto" />
        <code>search/index</code>
      </div>
      <div class="format-card">
        <span>Next deploy window</span>
        <Format.Time value="14:05:22" format="24h" :with-seconds="true" />
        <code>release/eu-central</code>
      </div>
    </div>
  </Format>
</template>`;

export const usageCode = `<script setup>
import { Format } from "@dicehub/kappa/components/format";
</script>

<template>
  <Format>
    Worker pool processed
    <Format.Number :value="128400" notation="compact" />
    jobs and produced
    <Format.Byte :value="536870912" unit-system="binary" />
    of artifacts.
  </Format>
</template>`;

export const localeCode = `<script setup>
import { Format } from "@dicehub/kappa/components/format";
</script>

<template>
  <Format locale="de-DE">
    <div lang="de">
      <span>Regional dashboard</span>
      <strong><Format.Number :value="1234567.89" /></strong>
      <small><Format.Byte :value="1073741824" unit-system="binary" /></small>
    </div>
    <p>
      A child can override the provider:
      <Format.Number locale="en-US" :value="1234567.89" />.
    </p>
  </Format>
</template>`;

export const relativeCode = `<script setup>
import { Format } from "@dicehub/kappa/components/format";

const indexedAt = new Date("2026-08-28T09:15:00.000Z");
</script>

<template>
  <div>
    <span>Index snapshot</span>
    <Format.RelativeTime :value="indexedAt" numeric="auto" :style="'long'" />
  </div>
</template>`;

export const timeCode = `<script setup>
import { Format } from "@dicehub/kappa/components/format";
</script>

<template>
  <Format locale="en-US">
    <div class="time-formats">
      <span>
        <small>24-hour</small>
        <Format.Time value="14:05:22" format="24h" :with-seconds="true" />
      </span>
      <span>
        <small>12-hour · nl-NL</small>
        <Format.Time locale="nl-NL" value="08:45" format="12h" />
      </span>
    </div>
  </Format>
</template>`;

export const formatProps = [
  {
    name: "locale",
    type: "string",
    defaultValue: '"en-US"',
    description: "BCP 47 locale for the root subtree or a single value override.",
  },
] as const;

export const partProps = [
  {
    component: "Format.Byte",
    props: "value*, unit, unitDisplay, unitSystem",
    description: "Formats a byte count with decimal or binary units.",
  },
  {
    component: "Format.Number",
    props: "value*, notation, compactDisplay, signDisplay, unit, unitDisplay, currencyDisplay, currencySign",
    description: "Formats a number with the supported Intl.NumberFormat options.",
  },
  {
    component: "Format.RelativeTime",
    props: "value*, localeMatcher, numeric, style",
    description: "Formats a Date relative to the current time.",
  },
  {
    component: "Format.Time",
    props: "value*, format, withSeconds, amLabel, pmLabel",
    description: "Formats a time string or Date in 12-hour or 24-hour form.",
  },
] as const;

export const dataSlots = [
  { name: "format-byte", element: "span", description: "Formatted byte value." },
  { name: "format-number", element: "span", description: "Formatted number value." },
  {
    name: "format-relative-time",
    element: "span",
    description: "Formatted relative time value.",
  },
  { name: "format-time", element: "span", description: "Formatted time value." },
] as const;

export const exportsList = [
  { name: "Format", description: "Transparent locale provider with named format parts." },
  { name: "Format.Byte / FormatByte", description: "Byte formatter and named component export." },
  { name: "Format.Number / FormatNumber", description: "Number formatter and named component export." },
  {
    name: "Format.RelativeTime / FormatRelativeTime",
    description: "Relative time formatter and named component export.",
  },
  { name: "Format.Time / FormatTime", description: "Time formatter and named component export." },
  {
    name: "FormatProps / FormatRootProps",
    description: "Locale-provider prop contracts.",
  },
  {
    name: "FormatByteProps / FormatNumberProps / FormatRelativeTimeProps / FormatTimeProps",
    description: "Explicit root and part prop contracts with locale support.",
  },
  { name: "FORMAT_DEFAULT_LOCALE / resolveFormatLocale", description: "Safe locale defaults and resolver." },
] as const;
