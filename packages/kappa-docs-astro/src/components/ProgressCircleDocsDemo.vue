<script setup lang="ts">
import { ProgressCircle } from "@dicehub/kappa/components/progress-circle";
import { ref } from "vue";

type DemoVariant = "preview" | "usage" | "sizes" | "indeterminate" | "controlled";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledValue = ref(42);
const sizes = [
  { label: "Small", size: "3rem", thickness: "0.25rem", value: 28 },
  { label: "Default", size: "4.5rem", thickness: "0.375rem", value: 62 },
  { label: "Large", size: "6rem", thickness: "0.5rem", value: 84 },
] as const;
</script>

<template>
  <div class="progress-circle-demo" :data-progress-circle-demo="props.variant">
    <ProgressCircle.Root
      v-if="props.variant === 'preview' || props.variant === 'usage'"
      :default-value="72"
    >
      <ProgressCircle.Circle aria-label="Simulation progress">
        <ProgressCircle.CircleTrack />
        <ProgressCircle.CircleRange />
      </ProgressCircle.Circle>
      <ProgressCircle.ValueText />
      <ProgressCircle.Label>Simulation</ProgressCircle.Label>
    </ProgressCircle.Root>

    <div v-else-if="props.variant === 'sizes'" class="progress-circle-demo__row">
      <ProgressCircle.Root
        v-for="item in sizes"
        :key="item.label"
        :default-value="item.value"
        :style="{
          '--kappa-progress-circle-size': item.size,
          '--kappa-progress-circle-thickness': item.thickness,
        }"
      >
        <ProgressCircle.Circle :aria-label="`${item.label} progress`">
          <ProgressCircle.CircleTrack />
          <ProgressCircle.CircleRange />
        </ProgressCircle.Circle>
        <ProgressCircle.ValueText />
        <ProgressCircle.Label>{{ item.label }}</ProgressCircle.Label>
      </ProgressCircle.Root>
    </div>

    <ProgressCircle.Root v-else-if="props.variant === 'indeterminate'" :model-value="null">
      <ProgressCircle.Circle aria-label="Preparing results">
        <ProgressCircle.CircleTrack />
        <ProgressCircle.CircleRange />
      </ProgressCircle.Circle>
      <ProgressCircle.ValueText>•••</ProgressCircle.ValueText>
      <ProgressCircle.Label>Preparing results</ProgressCircle.Label>
    </ProgressCircle.Root>

    <div v-else class="progress-circle-demo__controlled">
      <ProgressCircle.Root v-model="controlledValue">
        <ProgressCircle.Circle aria-label="Export progress">
          <ProgressCircle.CircleTrack />
          <ProgressCircle.CircleRange />
        </ProgressCircle.Circle>
        <ProgressCircle.ValueText />
        <ProgressCircle.Label>Export</ProgressCircle.Label>
      </ProgressCircle.Root>
      <label>
        <span>Set progress</span>
        <input v-model.number="controlledValue" type="range" min="0" max="100" />
      </label>
    </div>
  </div>
</template>

<style scoped>
.progress-circle-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 12rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.progress-circle-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: center;
  gap: 2rem;
}

.progress-circle-demo__controlled {
  display: grid;
  inline-size: min(100%, 22rem);
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 2rem;
}

.progress-circle-demo__controlled label {
  display: grid;
  gap: 0.5rem;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  font-weight: 600;
}

.progress-circle-demo__controlled input {
  inline-size: 100%;
  accent-color: var(--kappa-accent-solid, #4356e8);
}

@media (max-width: 32rem) {
  .progress-circle-demo__controlled {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .progress-circle-demo__controlled label {
    inline-size: 100%;
  }
}
</style>
