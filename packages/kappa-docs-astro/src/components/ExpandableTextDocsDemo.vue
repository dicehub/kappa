<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { ExpandableText } from "@dicehub/kappa/components/expandable-text";

type DemoVariant = "preview" | "lines" | "controlled" | "custom-trigger" | "short";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledOpen = ref(false);

const previewText =
  "Run 184 reached the target residual after 1,240 iterations. The pressure field is stable, but the rear-wheel wake still changes between the final sampling windows. The drag coefficient varies by 1.8 percent after the residual plateau, and the separation point moves between the final three samples. Keep this result as the baseline, add one refinement level around the rear wheel and diffuser, then repeat the comparison with a longer averaging window.";

const detailedText =
  "The imported surface contains 48 patches and 2.6 million triangles. All edges are manifold, every face has a valid normal, and the bounding box matches the expected vehicle dimensions. Three small gaps remain near the rear diffuser and must be repaired before volume meshing starts.";
</script>

<template>
  <div class="expandable-text-demo" :data-expandable-text-demo="props.variant">
    <article v-if="props.variant === 'preview'" class="expandable-text-demo__note">
      <header class="expandable-text-demo__header">
        <div>
          <span class="expandable-text-demo__eyebrow">REVIEW NOTE</span>
          <h3>Mesh convergence</h3>
        </div>
        <span class="expandable-text-demo__time">14:32</span>
      </header>
      <ExpandableText :lines="3">
        <p>{{ previewText }}</p>
      </ExpandableText>
    </article>

    <div v-else-if="props.variant === 'lines'" class="expandable-text-demo__stack">
      <section class="expandable-text-demo__sample">
        <span class="expandable-text-demo__label">Two lines</span>
        <ExpandableText :lines="2">
          <p>{{ detailedText }}</p>
        </ExpandableText>
      </section>
      <section class="expandable-text-demo__sample">
        <span class="expandable-text-demo__label">Four lines</span>
        <ExpandableText :lines="4">
          <p>{{ detailedText }}</p>
        </ExpandableText>
      </section>
    </div>

    <div v-else-if="props.variant === 'controlled'" class="expandable-text-demo__controlled">
      <div class="expandable-text-demo__controls">
        <Button size="sm" variant="outline" @click="controlledOpen = !controlledOpen">
          {{ controlledOpen ? "Collapse externally" : "Expand externally" }}
        </Button>
        <output aria-live="polite">{{ controlledOpen ? "Expanded" : "Collapsed" }}</output>
      </div>
      <ExpandableText v-model:open="controlledOpen" :lines="2">
        <p>{{ detailedText }}</p>
      </ExpandableText>
    </div>

    <ExpandableText
      v-else-if="props.variant === 'custom-trigger'"
      :lines="2"
      expand-label="Read run note"
      collapse-label="Close run note"
    >
      <p>{{ detailedText }}</p>
      <template #trigger="{ open }">
        {{ open ? "Close run note" : "Read run note" }}
      </template>
    </ExpandableText>

    <ExpandableText v-else :lines="3">
      <p>Mesh quality checks passed. The case is ready to run.</p>
    </ExpandableText>
  </div>
</template>

<style scoped>
.expandable-text-demo {
  inline-size: min(100%, 36rem);
  min-inline-size: 0;
  margin-inline: auto;
  color: var(--kappa-default);
  font-family: var(--kappa-font-sans);
  font-size: 0.875rem;
}

.expandable-text-demo__note {
  padding: 1rem;
  border: 1px solid var(--kappa-line);
  border-radius: var(--kappa-radius-md);
  background: var(--kappa-surface);
}

.expandable-text-demo__header,
.expandable-text-demo__controls {
  display: flex;
  min-inline-size: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.expandable-text-demo__header {
  margin-block-end: 0.625rem;
}

.expandable-text-demo__header h3 {
  margin: 0.125rem 0 0;
  font-size: 0.9375rem;
  font-weight: 650;
  line-height: 1.25rem;
}

.expandable-text-demo__eyebrow,
.expandable-text-demo__label,
.expandable-text-demo__time,
.expandable-text-demo__controls output {
  color: var(--kappa-subtle);
  font-size: 0.75rem;
  line-height: 1rem;
}

.expandable-text-demo__eyebrow,
.expandable-text-demo__label {
  font-weight: 650;
  letter-spacing: 0.04em;
}

.expandable-text-demo p {
  margin: 0;
}

.expandable-text-demo__stack {
  display: grid;
  gap: 1.25rem;
}

.expandable-text-demo__sample {
  min-inline-size: 0;
}

.expandable-text-demo__label {
  display: block;
  margin-block-end: 0.375rem;
  text-transform: uppercase;
}

.expandable-text-demo__controlled {
  display: grid;
  gap: 0.75rem;
}

.expandable-text-demo__controls {
  align-items: center;
}

@media (max-width: 30rem) {
  .expandable-text-demo__note {
    padding: 0.875rem;
  }
}
</style>
