<script setup lang="ts">
import { Badge } from "@dicehub/kappa/components/badge";

type DemoVariant =
  | "preview"
  | "usage"
  | "semantic"
  | "colors"
  | "icons"
  | "link"
  | "sentence"
  | "numeric";

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const queuedJobs = 128;
</script>

<template>
  <div class="badge-demo" :data-badge-demo="variant">
    <div v-if="variant === 'preview'" class="badge-demo__row">
      <Badge>Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Ready</Badge>
      <Badge variant="warning">12 warnings</Badge>
      <Badge variant="error">Failed</Badge>
    </div>

    <Badge v-else-if="variant === 'usage'">Stable</Badge>

    <div v-else-if="variant === 'semantic'" class="badge-demo__groups">
      <div class="badge-demo__group" role="group" aria-labelledby="badge-general-label">
        <span id="badge-general-label" class="badge-demo__label">General</span>
        <div class="badge-demo__row">
          <Badge>Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="beta">Beta</Badge>
        </div>
      </div>
      <div class="badge-demo__group" role="group" aria-labelledby="badge-status-label">
        <span id="badge-status-label" class="badge-demo__label">Status</span>
        <div class="badge-demo__row">
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>
    </div>

    <div v-else-if="variant === 'colors'" class="badge-demo__row">
      <Badge variant="red">Red</Badge>
      <Badge variant="orange">Orange</Badge>
      <Badge variant="green">Green</Badge>
      <Badge variant="teal">Teal</Badge>
      <Badge variant="teal-subtle">Teal subtle</Badge>
      <Badge variant="blue">Blue</Badge>
      <Badge variant="purple">Purple</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>

    <div v-else-if="variant === 'icons'" class="badge-demo__row">
      <Badge variant="success">
        <svg data-icon="inline-start" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m3 8 3 3 7-7" />
        </svg>
        Verified
      </Badge>
      <Badge variant="outline">
        Pinned
        <svg data-icon="inline-end" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m5 2 6 6-2 1 3 3-1 1-3-3-1 2-2-10Z" />
        </svg>
      </Badge>
    </div>

    <Badge v-else-if="variant === 'link'" as="a" href="#badge-link-example">
      Open run
      <svg data-icon="inline-end" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M5 11 11 5M6 5h5v5" />
      </svg>
    </Badge>

    <p v-else-if="variant === 'sentence'" class="badge-demo__sentence">
      Simulation <Badge variant="success">Complete</Badge> in 18m 42s.
    </p>

    <div v-else class="badge-demo__numeric">
      <Badge variant="secondary">
        <span aria-hidden="true">{{ queuedJobs > 99 ? "99+" : queuedJobs }}</span>
        <span class="docs-visually-hidden">{{ queuedJobs }}</span>
      </Badge>
      <span>queued jobs</span>
    </div>
  </div>
</template>

<style scoped>
.badge-demo {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 9rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.badge-demo__row {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.badge-demo__groups {
  display: grid;
  width: min(100%, 34rem);
  gap: 1.25rem;
}

.badge-demo__group {
  display: grid;
  gap: 0.625rem;
}

.badge-demo__label {
  color: var(--docs-subtle);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-align: center;
  text-transform: uppercase;
}

.badge-demo svg {
  width: 0.75rem;
  height: 0.75rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.75;
}

.badge-demo__sentence {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.75;
}

.badge-demo__numeric {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--docs-subtle);
  font-size: 0.8125rem;
}

@media (max-width: 620px) {
  .badge-demo {
    min-height: 11rem;
  }
}
</style>
