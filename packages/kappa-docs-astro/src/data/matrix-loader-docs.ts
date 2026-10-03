export const barrelCode = `import { MatrixLoader } from "@dicehub/kappa";`;

export const granularCode = `import { MatrixLoader } from "@dicehub/kappa/components/matrix-loader";`;

export const previewCode = `<script setup>
import { MatrixLoader } from "@dicehub/kappa/components/matrix-loader";
</script>

<template>
  <div role="status" aria-busy="true" aria-live="polite">
    <MatrixLoader decorative motion="orbit" shape="ring" size="lg" />
    <div>
      <strong>Indexing surface cells</strong>
      <span>Preparing the model for refinement.</span>
    </div>
  </div>
</template>`;

export const usageCode = `<script setup>
import { MatrixLoader } from "@dicehub/kappa/components/matrix-loader";
</script>

<template>
  <MatrixLoader label="Indexing surface cells" />
</template>`;

export const shapesCode = `<MatrixLoader shape="square" motion="pulse" />
<MatrixLoader shape="circle" motion="pulse" />
<MatrixLoader shape="diamond" motion="pulse" />
<MatrixLoader shape="ring" motion="pulse" />`;

export const motionsCode = `<MatrixLoader motion="pulse" shape="circle" />
<MatrixLoader motion="scan" shape="circle" />
<MatrixLoader motion="twinkle" shape="circle" />
<MatrixLoader motion="orbit" shape="circle" />`;

export const sizesCode = `<MatrixLoader size="sm" />
<MatrixLoader size="base" />
<MatrixLoader size="lg" />
<MatrixLoader :size="48" />`;

export const speedCode = `<MatrixLoader :duration="800" motion="scan" shape="diamond" />
<MatrixLoader :duration="1800" motion="scan" shape="diamond" />`;

export const matrixLoaderProps = [
  { name: "size", type: '"sm" | "base" | "lg" | number', defaultValue: '"base"', description: "Sets a preset size or an exact positive pixel size." },
  { name: "shape", type: '"square" | "circle" | "diamond" | "ring"', defaultValue: '"square"', description: "Selects which positions in the five-by-five matrix are visible." },
  { name: "motion", type: '"pulse" | "scan" | "twinkle" | "orbit"', defaultValue: '"pulse"', description: "Selects the phase sequence used by the visible dots." },
  { name: "duration", type: "number", defaultValue: "1200", description: "Sets the animation cycle in milliseconds. Values are limited to 400–10,000 ms." },
  { name: "label", type: "string", defaultValue: '"Loading"', description: "Provides the visually hidden status announced by assistive technology." },
  { name: "decorative", type: "boolean", defaultValue: "false", description: "Hides the loader when nearby visible text already reports the loading state." },
] as const;

export const exportsList = [
  { name: "MatrixLoader", description: "Dot-matrix loading status component." },
  { name: "MatrixLoaderProps", description: "Public MatrixLoader prop contract." },
  { name: "MatrixLoaderSize / Shape / Motion", description: "Supported visual option types." },
  { name: "MATRIX_LOADER_SIZES / SHAPES / MOTIONS", description: "Stable preset collections." },
  { name: "MATRIX_LOADER_DEFAULT_*", description: "Default size, shape, motion, duration, and label values." },
  { name: "resolveMatrixLoader*", description: "Safe runtime resolvers for public prop values." },
] as const;
