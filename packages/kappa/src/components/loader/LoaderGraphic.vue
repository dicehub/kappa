<script setup lang="ts">
import type { LoaderVariant } from "./loader";

const props = defineProps<{ duration: number; variant: LoaderVariant }>();

const helixSlices = Array.from({ length: 6 }, (_, index) => index);
const quantumParticles = Array.from({ length: 12 }, (_, index) => index);
const fourDots = Array.from({ length: 4 }, (_, index) => index);
const fiveDots = Array.from({ length: 5 }, (_, index) => index);

const phaseStyle = (index: number): Record<string, string> => ({
  "--kappa-loader-delay": `${Math.round((-index * props.duration) / 5)}ms`,
  "--kappa-loader-opposite-delay": `${Math.round((-(index / 5 + 0.5)) * props.duration)}ms`,
  "--kappa-loader-rotation": `${index * 30}deg`,
});
</script>

<template>
  <svg
    v-if="variant === 'spinner'"
    aria-hidden="true"
    class="kappa-loader__graphic kappa-loader__spinner"
    data-graphic="spinner"
    focusable="false"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle class="kappa-loader__track" cx="12" cy="12" r="9.5" />
    <circle class="kappa-loader__indicator" cx="12" cy="12" r="9.5" />
  </svg>

  <span
    v-else
    aria-hidden="true"
    class="kappa-loader__graphic"
    :data-graphic="variant"
  >
    <template v-if="variant === 'waveform'">
      <span
        v-for="index in fourDots"
        :key="index"
        class="kappa-loader__bar"
        :style="phaseStyle(index)"
      />
    </template>

    <template v-else-if="variant === 'helix'">
      <span
        v-for="index in helixSlices"
        :key="index"
        class="kappa-loader__helix-slice"
        :style="phaseStyle(index)"
      />
    </template>

    <template v-else-if="variant === 'quantum'">
      <span class="kappa-loader__quantum-field">
        <span
          v-for="index in quantumParticles"
          :key="index"
          class="kappa-loader__quantum-particle"
          :style="phaseStyle(index)"
        />
      </span>
    </template>

    <template v-else-if="variant === 'dot-wave'">
      <span
        v-for="index in fourDots"
        :key="index"
        class="kappa-loader__dot"
        :style="phaseStyle(index)"
      />
    </template>

    <template v-else-if="variant === 'dot-stream' || variant === 'mirage'">
      <span
        v-for="index in fiveDots"
        :key="index"
        class="kappa-loader__dot"
        :style="phaseStyle(index)"
      />
    </template>

    <span v-else-if="variant === 'ping'" class="kappa-loader__ping" />

    <template v-else-if="variant === 'orbit'">
      <span class="kappa-loader__orbit kappa-loader__orbit--one" />
      <span class="kappa-loader__orbit kappa-loader__orbit--two" />
      <span class="kappa-loader__orbit kappa-loader__orbit--three" />
    </template>
  </span>
</template>
