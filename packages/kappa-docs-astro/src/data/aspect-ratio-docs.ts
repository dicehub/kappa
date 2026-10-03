export const barrelCode = `import { AspectRatio } from "@dicehub/kappa";`;

export const granularCode = `import { AspectRatio } from "@dicehub/kappa/components/aspect-ratio";`;

export const previewCode = `<script setup>
import { AspectRatio } from "@dicehub/kappa/components/aspect-ratio";
</script>

<template>
  <AspectRatio :ratio="16 / 9" class="ratio-box">
    <img
      src="/illustrations/aspect-ratio-astronaut.webp"
      alt="Astronaut helmet with a reflective visor"
      class="ratio-box__image"
    />
  </AspectRatio>
</template>

<style scoped>
.ratio-box { inline-size: min(100%, 34rem); overflow: hidden; border: 1px solid var(--kappa-line); border-radius: 0.75rem; background: var(--kappa-tint); }
.ratio-box__image { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; }
</style>`;

export const usageCode = `<script setup>
import { AspectRatio } from "@dicehub/kappa/components/aspect-ratio";
</script>

<template>
  <AspectRatio :ratio="4 / 3" class="ratio-box">
    <img
      src="/illustrations/aspect-ratio-astronaut.webp"
      alt="Astronaut helmet with a reflective visor"
      class="ratio-box__image"
    />
  </AspectRatio>
</template>

<style scoped>
.ratio-box { inline-size: min(100%, 34rem); overflow: hidden; border: 1px solid var(--kappa-line); border-radius: 0.75rem; background: var(--kappa-tint); }
.ratio-box__image { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; }
</style>`;

export const squareCode = `<script setup>
import { AspectRatio } from "@dicehub/kappa/components/aspect-ratio";
</script>

<template>
  <AspectRatio :ratio="1 / 1" class="ratio-box ratio-box--square">
    <img
      src="/illustrations/aspect-ratio-astronaut.webp"
      alt="Astronaut helmet with a reflective visor"
      class="ratio-box__image"
    />
  </AspectRatio>
</template>

<style scoped>
.ratio-box { inline-size: min(100%, 34rem); overflow: hidden; border: 1px solid var(--kappa-line); border-radius: 0.75rem; background: var(--kappa-tint); }
.ratio-box--square { max-inline-size: 16rem; }
.ratio-box__image { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; }
</style>`;

export const portraitCode = `<script setup>
import { AspectRatio } from "@dicehub/kappa/components/aspect-ratio";
</script>

<template>
  <AspectRatio :ratio="9 / 16" class="ratio-box ratio-box--portrait">
    <img
      src="/illustrations/aspect-ratio-astronaut.webp"
      alt="Astronaut helmet with a reflective visor"
      class="ratio-box__image"
    />
  </AspectRatio>
</template>

<style scoped>
.ratio-box { inline-size: min(100%, 34rem); overflow: hidden; border: 1px solid var(--kappa-line); border-radius: 0.75rem; background: var(--kappa-tint); }
.ratio-box--portrait { max-inline-size: 12rem; }
.ratio-box__image { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; }
</style>`;

export const customCode = `<script setup>
import { AspectRatio } from "@dicehub/kappa/components/aspect-ratio";
</script>

<template>
  <AspectRatio :ratio="3 / 2" class="ratio-box">
    <img
      src="/illustrations/aspect-ratio-astronaut.webp"
      alt="Astronaut helmet with a reflective visor"
      class="ratio-box__image"
    />
  </AspectRatio>
</template>

<style scoped>
.ratio-box { inline-size: min(100%, 34rem); overflow: hidden; border: 1px solid var(--kappa-line); border-radius: 0.75rem; background: var(--kappa-tint); }
.ratio-box__image { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; }
</style>`;

export const aspectRatioProps = [
  {
    name: "ratio",
    type: "number",
    defaultValue: "— (required)",
    description: "Width divided by height. Invalid runtime values resolve to 1 (square).",
  },
] as const;

export const slots = [
  {
    name: "default",
    description: "Content rendered inside the ratio-constrained root.",
  },
] as const;

export const dataSlots = [
  { name: "aspect-ratio", element: "div", description: "Native ratio-constrained root." },
] as const;

export const dataAttributes = [
  {
    name: "data-ratio",
    value: "positive finite number",
    description: "Resolved ratio used by the component, including the invalid-value fallback.",
  },
] as const;

export const exportsList = [
  { name: "AspectRatio", description: "Native CSS aspect-ratio wrapper." },
  { name: "AspectRatioProps", description: "Public ratio prop and native attribute contract." },
  { name: "AspectRatioSlots", description: "Default content slot contract." },
  { name: "ASPECT_RATIO_DEFAULT_RATIO", description: "Square runtime fallback for invalid ratios." },
  { name: "isAspectRatio", description: "Positive finite ratio type guard." },
  { name: "resolveAspectRatio", description: "Safe ratio resolver with a square fallback." },
] as const;
