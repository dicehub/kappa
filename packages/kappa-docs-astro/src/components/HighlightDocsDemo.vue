<script setup lang="ts">
import { Highlight } from "@dicehub/kappa/components/highlight";

type DemoVariant = "preview" | "usage" | "single" | "multiple" | "case-sensitive" | "exact";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});
</script>

<template>
  <div class="highlight-demo" :data-highlight-demo="props.variant">
    <Highlight
      v-if="props.variant === 'preview'"
      text="Mesh convergence reached 92% after the final solve."
      query="convergence"
    />

    <p v-else-if="props.variant === 'usage'">
      <Highlight
        text="Solver status: converged"
        :query="['solver', 'status']"
        ignore-case
        :match-all="true"
      />
    </p>

    <Highlight
      v-else-if="props.variant === 'single'"
      text="The solver is ready; the solver can start the next run."
      query="solver"
    />

    <Highlight
      v-else-if="props.variant === 'multiple'"
      text="Export includes mesh, field, and mesh metadata."
      :query="['mesh', 'field']"
      :match-all="true"
    />

    <Highlight
      v-else-if="props.variant === 'case-sensitive'"
      text="Kappa and kappa are different matches."
      query="kappa"
    />

    <Highlight
      v-else
      text="mesh meshlet mesh"
      query="mesh"
      :match-all="true"
      :exact-match="true"
    />
  </div>
</template>

<style scoped>
.highlight-demo {
  display: grid;
  gap: 0.5rem;
  min-inline-size: 0;
  padding: 0.875rem 1rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.5rem;
  background: var(--kappa-surface, #ffffff);
  color: var(--kappa-default, #17191f);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.highlight-demo p {
  margin: 0;
}
</style>
