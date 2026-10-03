<script setup lang="ts">
import { Progress } from "@dicehub/kappa/components/progress";
import { ref } from "vue";

type DemoVariant = "preview" | "usage" | "custom-range" | "indeterminate" | "controlled";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledValue = ref(36);
</script>

<template>
  <div class="progress-demo" :data-progress-demo="props.variant">
    <Progress.Root
      v-if="props.variant === 'preview' || props.variant === 'usage'"
      :default-value="68"
    >
      <Progress.Label>Uploading simulation results</Progress.Label>
      <Progress.ValueText />
      <Progress.Track aria-label="Uploading simulation results">
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>

    <Progress.Root
      v-else-if="props.variant === 'custom-range'"
      :default-value="5"
      :min="0"
      :max="8"
    >
      <Progress.Label>Result files</Progress.Label>
      <Progress.ValueText>5 / 8</Progress.ValueText>
      <Progress.Track aria-label="Result files">
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>

    <Progress.Root v-else-if="props.variant === 'indeterminate'" :model-value="null">
      <Progress.Label>Preparing mesh</Progress.Label>
      <Progress.ValueText>Working…</Progress.ValueText>
      <Progress.Track aria-label="Preparing mesh">
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>

    <div v-else class="progress-demo__controlled">
      <Progress.Root v-model="controlledValue">
        <Progress.Label>Solver progress</Progress.Label>
        <Progress.ValueText />
        <Progress.Track aria-label="Solver progress">
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <label>
        <span>Set progress</span>
        <input v-model.number="controlledValue" type="range" min="0" max="100" />
      </label>
    </div>
  </div>
</template>

<style scoped>
.progress-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 10rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.progress-demo > :deep(.kappa-progress),
.progress-demo__controlled {
  inline-size: min(100%, 28rem);
}

.progress-demo__controlled {
  display: grid;
  gap: 1.25rem;
}

.progress-demo__controlled label {
  display: grid;
  gap: 0.5rem;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  font-weight: 600;
}

.progress-demo__controlled input {
  inline-size: 100%;
  accent-color: var(--kappa-accent-solid, #4356e8);
}
</style>
