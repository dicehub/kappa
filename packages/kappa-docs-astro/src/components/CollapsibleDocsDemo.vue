<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Collapsible } from "@dicehub/kappa/components/collapsible";

type DemoVariant =
  | "preview"
  | "basic"
  | "multiple"
  | "controlled"
  | "custom-trigger"
  | "partial"
  | "lazy"
  | "disabled"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const previewOpen = ref(true);
const controlledOpen = ref(false);
const customOpen = ref(false);
const partialOpen = ref(false);
const lazyOpen = ref(false);
</script>

<template>
  <div class="collapsible-demo" :data-collapsible-demo="props.variant">
    <Collapsible.Root v-if="props.variant === 'preview'" v-model:open="previewOpen">
      <Collapsible.Trigger>
        <span class="collapsible-demo__trigger-copy">
          <span class="collapsible-demo__kicker">RUN 4189 · PIMPLE</span>
          <span>Solver diagnostics</span>
        </span>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <dl class="collapsible-demo__metrics">
          <div><dt>Iterations</dt><dd>1,240</dd></div>
          <div><dt>Residual</dt><dd>8.4e-6</dd></div>
          <div><dt>Courant max</dt><dd>0.82</dd></div>
        </dl>
      </Collapsible.Content>
    </Collapsible.Root>

    <Collapsible.Root v-else-if="props.variant === 'basic'">
      <Collapsible.Trigger>What is Kappa?</Collapsible.Trigger>
      <Collapsible.Content>
        <p>Kappa is dicehub's Vue component library.</p>
      </Collapsible.Content>
    </Collapsible.Root>

    <div v-else-if="props.variant === 'multiple'" class="collapsible-demo__stack">
      <Collapsible.Root>
        <Collapsible.Trigger>What is Kappa?</Collapsible.Trigger>
        <Collapsible.Content>
          <p>Kappa is dicehub's Vue component library.</p>
        </Collapsible.Content>
      </Collapsible.Root>
      <Collapsible.Root>
        <Collapsible.Trigger>How do I use it?</Collapsible.Trigger>
        <Collapsible.Content>
          <p>Install the package and import the components that your project needs.</p>
        </Collapsible.Content>
      </Collapsible.Root>
      <Collapsible.Root>
        <Collapsible.Trigger>Is it accessible?</Collapsible.Trigger>
        <Collapsible.Content>
          <p>Yes. Ark UI supplies keyboard and screen reader behavior.</p>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>

    <div v-else-if="props.variant === 'controlled'" class="collapsible-demo__controlled">
      <Collapsible.Root v-model:open="controlledOpen">
        <Collapsible.Trigger>Boundary summary</Collapsible.Trigger>
        <Collapsible.Content>
          <p>Seven boundary patches cover every face in the volume mesh.</p>
        </Collapsible.Content>
      </Collapsible.Root>
      <output aria-live="polite">Panel state: {{ controlledOpen ? "open" : "closed" }}</output>
    </div>

    <Collapsible.Root
      v-else-if="props.variant === 'custom-trigger'"
      v-model:open="customOpen"
      class="collapsible-demo__custom-root"
    >
      <Collapsible.Trigger as-child>
        <Button variant="outline" size="sm">
          {{ customOpen ? "Hide details" : "Show details" }}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content class="collapsible-demo__custom-content">
        <p>The Kappa Button keeps its styling while Collapsible supplies disclosure behavior.</p>
      </Collapsible.Content>
    </Collapsible.Root>

    <Collapsible.Root
      v-else-if="props.variant === 'partial'"
      v-model:open="partialOpen"
      :collapsed-height="44"
    >
      <Collapsible.Trigger>Solver log</Collapsible.Trigger>
      <Collapsible.Content>
        <div class="collapsible-demo__log" aria-label="Solver log excerpt">
          <span>Time = 2.35</span>
          <span>smoothSolver: Solving for Ux, Initial residual = 2.1e-05</span>
          <span>GAMG: Solving for p, Initial residual = 8.4e-06</span>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>

    <Collapsible.Root
      v-else-if="props.variant === 'lazy'"
      v-model:open="lazyOpen"
      lazy-mount
      unmount-on-exit
    >
      <Collapsible.Trigger>Residual plot</Collapsible.Trigger>
      <Collapsible.Content>
        <div class="collapsible-demo__plot" data-lazy-panel>
          <span class="collapsible-demo__plot-line" aria-hidden="true" />
          <span>Plot renderer mounted</span>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>

    <Collapsible.Root v-else-if="props.variant === 'disabled'" disabled>
      <Collapsible.Trigger>Transient controls</Collapsible.Trigger>
      <Collapsible.Content>
        <p>Controls become available after the steady-state initialization completes.</p>
      </Collapsible.Content>
    </Collapsible.Root>

    <Collapsible.Root v-else dir="rtl" default-open>
      <Collapsible.Trigger>نتائج المحاكاة</Collapsible.Trigger>
      <Collapsible.Content>
        <p>اكتملت المحاكاة والنتائج جاهزة للمراجعة.</p>
      </Collapsible.Content>
    </Collapsible.Root>
  </div>
</template>

<style scoped>
.collapsible-demo {
  display: grid;
  inline-size: min(100%, 34rem);
  min-inline-size: 0;
  align-self: flex-start;
  color: var(--kappa-default);
  font-family: var(--kappa-font-sans);
}

.collapsible-demo__trigger-copy {
  display: grid;
  min-inline-size: 0;
  gap: 0.0625rem;
}

.collapsible-demo__kicker {
  color: var(--kappa-subtle);
  font-family: var(--kappa-font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  line-height: 1rem;
}

.collapsible-demo__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
}

.collapsible-demo__metrics div {
  display: grid;
  min-inline-size: 0;
  gap: 0.1875rem;
  padding-inline: 0.75rem;
}

.collapsible-demo__metrics div:first-child {
  padding-inline-start: 0;
}

.collapsible-demo__metrics div:last-child {
  padding-inline-end: 0;
}

.collapsible-demo__metrics div + div {
  border-inline-start: 1px solid var(--kappa-line);
}

.collapsible-demo__metrics dt {
  overflow: hidden;
  color: var(--kappa-subtle);
  font-size: 0.75rem;
  line-height: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collapsible-demo__metrics dd {
  margin: 0;
  font-family: var(--kappa-font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.25rem;
}

.collapsible-demo p {
  margin: 0;
}

.collapsible-demo__stack {
  display: grid;
  gap: 0.5rem;
}

.collapsible-demo__controlled {
  display: grid;
  gap: 0.625rem;
}

.collapsible-demo__controlled output {
  color: var(--kappa-subtle);
  font-family: var(--kappa-font-mono);
  font-size: 0.75rem;
}

.collapsible-demo__custom-root {
  border: 0;
  background: transparent;
}

.collapsible-demo__custom-root :deep(.kappa-collapsible__trigger) {
  inline-size: max-content;
}

.collapsible-demo__custom-content {
  margin-block-start: 0.625rem;
  border: 1px solid var(--kappa-line);
  border-radius: var(--kappa-radius-md);
  background: var(--kappa-tint);
}

.collapsible-demo__log {
  display: grid;
  gap: 0.375rem;
  color: var(--kappa-subtle);
  font-family: var(--kappa-font-mono);
  font-size: 0.75rem;
  line-height: 1.25rem;
}

.collapsible-demo__log span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collapsible-demo__plot {
  position: relative;
  display: flex;
  min-block-size: 5rem;
  align-items: flex-end;
  padding: 0.75rem;
  border: 1px solid var(--kappa-line);
  border-radius: var(--kappa-radius-sm);
  background: var(--kappa-tint);
  color: var(--kappa-subtle);
  font-family: var(--kappa-font-mono);
  font-size: 0.75rem;
  overflow: hidden;
}

.collapsible-demo__plot-line {
  position: absolute;
  inset: 0.75rem;
  border-block-end: 2px solid var(--kappa-accent);
  clip-path: polygon(0 72%, 18% 64%, 34% 67%, 50% 38%, 68% 46%, 82% 20%, 100% 12%, 100% 22%, 82% 30%, 68% 56%, 50% 48%, 34% 77%, 18% 74%, 0 82%);
}

@media (max-width: 30rem) {
  .collapsible-demo__metrics {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .collapsible-demo__metrics div {
    padding-inline: 0;
  }

  .collapsible-demo__metrics div + div {
    padding-block-start: 0.5rem;
    border-block-start: 1px solid var(--kappa-line);
    border-inline-start: 0;
  }
}
</style>
