export const previewCode = `<script setup>
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
</script>

<template>
  <DicehubLogo style="width: 18rem;" />
</template>`;

export const barrelCode = `import {
  DicehubLogo,
  PoweredByDicehub,
  generateDicehubLogoSvg,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  DicehubLogo,
  PoweredByDicehub,
  generateDicehubLogoSvg,
} from "@dicehub/kappa/components/dicehub-logo";`;

export const usageCode = `<script setup>
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
</script>

<template>
  <DicehubLogo style="width: 9rem;" />
</template>`;

export const glyphCode = `<script setup>
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
</script>

<template>
  <DicehubLogo variant="glyph" style="width: 6rem;" />
</template>`;

export const verticalCode = `<script setup>
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 2rem;">
    <DicehubLogo variant="vertical" style="width: 6rem;" />
    <div style="padding: 1rem; background: white;">
      <DicehubLogo variant="vertical" color="black" style="width: 6rem;" />
    </div>
    <div style="padding: 1rem; background: black;">
      <DicehubLogo variant="vertical" color="white" style="width: 6rem;" />
    </div>
  </div>
</template>`;

export const colorVariantsCode = `<script setup>
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 2rem;">
    <DicehubLogo color="color" style="width: 7rem;" />
    <div style="padding: 1rem; border-radius: 0.5rem; background: white;">
      <DicehubLogo color="black" style="width: 7rem;" />
    </div>
    <div style="padding: 1rem; border-radius: 0.5rem; background: black;">
      <DicehubLogo color="white" style="width: 7rem;" />
    </div>
  </div>
</template>`;

export const glyphVariantsCode = `<script setup>
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 2rem;">
    <DicehubLogo variant="glyph" color="color" style="width: 3rem;" />
    <div style="padding: 1rem; border-radius: 0.5rem; background: white;">
      <DicehubLogo variant="glyph" color="black" style="width: 3rem;" />
    </div>
    <div style="padding: 1rem; border-radius: 0.5rem; background: black;">
      <DicehubLogo variant="glyph" color="white" style="width: 3rem;" />
    </div>
  </div>
</template>`;

export const sizesCode = `<script setup>
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; align-items: flex-end; gap: 1.5rem;">
    <DicehubLogo style="width: 5rem;" />
    <DicehubLogo style="width: 7rem;" />
    <DicehubLogo style="width: 11rem;" />
  </div>
</template>`;

export const copyCode = `<script setup>
import { ref } from "vue";
import {
  DicehubLogo,
  generateDicehubLogoSvg,
} from "@dicehub/kappa/components/dicehub-logo";

const copied = ref(null);

const copyToClipboard = async (variant) => {
  await navigator.clipboard.writeText(generateDicehubLogoSvg({ variant }));
  copied.value = variant;
};

const downloadLogo = (variant = "full") => {
  const blob = new Blob([generateDicehubLogoSvg({ variant })], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = variant === "vertical" ? "dicehub-logo-vertical.svg" : "dicehub-logo.svg";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};
</script>

<template>
  <details>
    <summary>
      <DicehubLogo title="dicehub" style="width: 6rem;" />
    </summary>
    <button type="button" @click="copyToClipboard('glyph')">
      {{ copied === "glyph" ? "Copied!" : "Copy mark as SVG" }}
    </button>
    <button type="button" @click="copyToClipboard('full')">
      {{ copied === "full" ? "Copied!" : "Copy full logo as SVG" }}
    </button>
    <button type="button" @click="copyToClipboard('vertical')">
      {{ copied === "vertical" ? "Copied!" : "Copy vertical logo as SVG" }}
    </button>
    <button type="button" @click="downloadLogo()">Download brand assets</button>
    <button type="button" @click="downloadLogo('vertical')">Download vertical logo</button>
    <a href="https://dicehub.com" target="_blank" rel="noopener noreferrer">
      Visit brand guidelines
    </a>
  </details>
</template>`;

export const poweredBasicCode = `<script setup>
import { PoweredByDicehub } from "@dicehub/kappa/components/dicehub-logo";
</script>

<template>
  <PoweredByDicehub />
</template>`;

export const poweredVariantsCode = `<script setup>
import { PoweredByDicehub } from "@dicehub/kappa/components/dicehub-logo";
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;">
    <PoweredByDicehub />
    <PoweredByDicehub color="black" />
    <div style="padding: 0.75rem; border-radius: 0.5rem; background: black;">
      <PoweredByDicehub color="white" />
    </div>
  </div>
</template>`;

export const poweredFooterCode = `<script setup>
import { PoweredByDicehub } from "@dicehub/kappa/components/dicehub-logo";
</script>

<template>
  <footer style="display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1.5rem; border: 1px solid #d4d4d4; border-radius: 0.5rem;">
    <span>© 2026 Your Company. All rights reserved.</span>
    <PoweredByDicehub />
  </footer>
</template>`;

export const svgGenerationCode = `import { generateDicehubLogoSvg } from "@dicehub/kappa/components/dicehub-logo";

// Generate mark SVG
const glyphSvg = generateDicehubLogoSvg({ variant: "glyph" });

// Generate full logo SVG
const fullSvg = generateDicehubLogoSvg({ variant: "full" });

// Generate a white vertical logo for a dark background
const verticalSvg = generateDicehubLogoSvg({ variant: "vertical", color: "white" });

// Generate black logo
const blackSvg = generateDicehubLogoSvg({ color: "black" });

// Copy to clipboard
await navigator.clipboard.writeText(
  generateDicehubLogoSvg({ variant: "glyph", color: "color" }),
);`;

export const logoProps = [
  {
    name: "variant",
    type: '"glyph" | "full" | "vertical"',
    defaultValue: '"full"',
    description: "Glyph shows the mark, full places the wordmark beside it, and vertical stacks them.",
  },
  {
    name: "color",
    type: '"color" | "black" | "white"',
    defaultValue: '"color"',
    description: "Color follows the theme: dicehub ink in light mode and white in dark mode. Black and white stay fixed.",
  },
  {
    name: "title",
    type: "string",
    defaultValue: '"dicehub logo"',
    description: "Accessible label for the SVG.",
  },
] as const;

export const poweredProps = [
  {
    name: "color",
    type: '"color" | "black" | "white"',
    defaultValue: '"color"',
    description: "Color scheme for the mark and badge text.",
  },
  {
    name: "href",
    type: "string",
    defaultValue: '"https://dicehub.com"',
    description: "Link destination.",
  },
  {
    name: "target",
    type: "string",
    defaultValue: '"_blank"',
    description: "Anchor target.",
  },
  {
    name: "rel",
    type: "string",
    defaultValue: '"noopener noreferrer"',
    description: "Anchor relationship. A safe external value is applied by default.",
  },
] as const;
