<script setup lang="ts">
import {
  MatrixLoader,
  type MatrixLoaderMotion,
  type MatrixLoaderShape,
  type MatrixLoaderSize,
} from "@dicehub/kappa/components/matrix-loader";

type DemoVariant = "preview" | "basic" | "shapes" | "motions" | "sizes" | "speed";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const shapes: Array<{ label: string; value: MatrixLoaderShape }> = [
  { label: "Square", value: "square" },
  { label: "Circle", value: "circle" },
  { label: "Diamond", value: "diamond" },
  { label: "Ring", value: "ring" },
];

const motions: Array<{ label: string; value: MatrixLoaderMotion }> = [
  { label: "Pulse", value: "pulse" },
  { label: "Scan", value: "scan" },
  { label: "Twinkle", value: "twinkle" },
  { label: "Orbit", value: "orbit" },
];

const sizes: Array<{ label: string; value: MatrixLoaderSize }> = [
  { label: "Small", value: "sm" },
  { label: "Base", value: "base" },
  { label: "Large", value: "lg" },
];
</script>

<template>
  <div class="matrix-loader-demo" :data-matrix-loader-demo="props.variant">
    <div
      v-if="props.variant === 'preview'"
      class="matrix-loader-demo__job"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span class="matrix-loader-demo__signal">
        <MatrixLoader decorative motion="orbit" shape="ring" size="lg" />
      </span>
      <span class="matrix-loader-demo__copy">
        <span class="matrix-loader-demo__eyebrow">GEOMETRY PIPELINE</span>
        <strong>Indexing surface cells</strong>
        <span>Preparing the model for refinement.</span>
      </span>
      <span class="matrix-loader-demo__metric">
        <strong>48,216</strong>
        <span>cells</span>
      </span>
    </div>

    <MatrixLoader v-else-if="props.variant === 'basic'" label="Indexing surface cells" />

    <div v-else-if="props.variant === 'shapes'" class="matrix-loader-demo__collection">
      <div v-for="item in shapes" :key="item.value" class="matrix-loader-demo__sample">
        <MatrixLoader decorative motion="pulse" :shape="item.value" size="lg" />
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div v-else-if="props.variant === 'motions'" class="matrix-loader-demo__collection">
      <div v-for="item in motions" :key="item.value" class="matrix-loader-demo__sample">
        <MatrixLoader decorative :motion="item.value" shape="circle" size="lg" />
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div v-else-if="props.variant === 'sizes'" class="matrix-loader-demo__collection">
      <div v-for="item in sizes" :key="item.value" class="matrix-loader-demo__sample">
        <MatrixLoader decorative motion="scan" shape="square" :size="item.value" />
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div v-else class="matrix-loader-demo__collection">
      <div class="matrix-loader-demo__sample">
        <MatrixLoader decorative :duration="800" motion="scan" shape="diamond" size="lg" />
        <span>Fast</span>
      </div>
      <div class="matrix-loader-demo__sample">
        <MatrixLoader decorative :duration="1800" motion="scan" shape="diamond" size="lg" />
        <span>Measured</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.matrix-loader-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 7rem;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.matrix-loader-demo__job {
  box-sizing: border-box;
  display: grid;
  inline-size: min(100%, 30rem);
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.5rem;
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--kappa-accent, #4869ee) 4%, transparent),
      transparent 42%
    ),
    var(--kappa-control, #ffffff);
  box-shadow: var(--kappa-shadow-sm, 0 1px 2px rgb(16 24 40 / 6%));
}

.matrix-loader-demo__signal {
  display: grid;
  inline-size: 3rem;
  block-size: 3rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--kappa-accent, #4869ee) 20%, transparent);
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--kappa-accent, #4869ee) 7%, transparent);
  color: var(--kappa-accent, #4869ee);
}

.matrix-loader-demo__copy,
.matrix-loader-demo__metric {
  display: flex;
  min-inline-size: 0;
  flex-direction: column;
}

.matrix-loader-demo__copy {
  gap: 0.125rem;
}

.matrix-loader-demo__copy strong,
.matrix-loader-demo__metric strong {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
}

.matrix-loader-demo__copy > span:last-child,
.matrix-loader-demo__metric span {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1rem;
}

.matrix-loader-demo__eyebrow {
  color: var(--kappa-accent, #4869ee);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 0.875rem;
}

.matrix-loader-demo__metric {
  align-items: flex-end;
  font-variant-numeric: tabular-nums;
}

.matrix-loader-demo__collection {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: center;
  gap: clamp(1.25rem, 5vw, 2.75rem);
}

.matrix-loader-demo__sample {
  display: grid;
  min-inline-size: 3.75rem;
  justify-items: center;
  gap: 0.625rem;
}

.matrix-loader-demo__sample > span {
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.6875rem;
  line-height: 1rem;
}

@media (max-width: 30rem) {
  .matrix-loader-demo__job {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .matrix-loader-demo__metric {
    display: none;
  }
}
</style>
