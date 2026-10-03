export const barrelCode = `import { ClientOnly } from "@dicehub/kappa";`;

export const granularCode = `import { ClientOnly } from "@dicehub/kappa/components/client-only";`;

export const previewCode = `<script setup>
import { ClientOnly } from "@dicehub/kappa/components/client-only";
</script>

<template>
  <ClientOnly>
    <template #fallback>
      <div class="runtime-surface runtime-surface--fallback">
        <strong>Preparing browser controls…</strong>
        <span>Loading browser-only features.</span>
      </div>
    </template>
    <div class="runtime-surface runtime-surface--ready">
      <strong>Browser controls are ready.</strong>
      <span>Rendered after client mount.</span>
    </div>
  </ClientOnly>
</template>`;

export const usageCode = `<script setup>
import { ClientOnly } from "@dicehub/kappa/components/client-only";
</script>

<template>
  <ClientOnly>
    <template #fallback>
      <span>Loading run summary…</span>
    </template>
    <output aria-live="polite">Run summary available in the browser.</output>
  </ClientOnly>
</template>`;

export const fallbackCode = `<ClientOnly>
  <template #fallback>
    <div class="summary-placeholder" aria-hidden="true">
      <span class="summary-placeholder__line" />
      <span class="summary-placeholder__line summary-placeholder__line--short" />
      <span class="summary-placeholder__block" />
    </div>
  </template>
  <div class="run-summary">
    <span>Residual history</span>
    <strong>Converging</strong>
    <span>Latest values are ready in the browser.</span>
  </div>
</ClientOnly>`;

export const noFallbackCode = `<ClientOnly>
  <div class="browser-controls">
    <span aria-hidden="true" />
    <span>
      <strong>Browser-only controls mounted</strong>
      <small>No fallback supplied</small>
    </span>
  </div>
</ClientOnly>`;

export const compositionCode = `ClientOnly (renderless)
├── #fallback (SSR and pre-mount content)
└── #default (browser-mounted content)`;

export const clientOnlyProps = [
  {
    name: "—",
    type: "none",
    defaultValue: "—",
    description:
      "ClientOnly has no component-specific props. Put attributes on content inside a slot.",
  },
] as const;

export const clientOnlySlots = [
  {
    name: "default",
    description: "Content rendered after the component mounts in the browser.",
  },
  {
    name: "fallback",
    description: "Content rendered during server-side rendering and before browser mount.",
  },
] as const;

export const dataAttributes = [
  {
    name: "—",
    value: "—",
    description:
      "ClientOnly renders no DOM root. Add attributes to an element inside default or fallback content.",
  },
] as const;

export const exportsList = [
  {
    name: "ClientOnly",
    description: "Renderless Ark-backed SSR and browser-mount boundary.",
  },
  {
    name: "ClientOnlyProps",
    description: "Public empty prop contract preserved from Ark UI.",
  },
  {
    name: "ClientOnlySlots",
    description: "Public default and fallback slot contract.",
  },
] as const;
