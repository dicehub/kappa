<script setup lang="ts">
import { ClientOnly } from "@dicehub/kappa/components/client-only";

type DemoVariant = "preview" | "usage" | "fallback" | "no-fallback";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});
</script>

<template>
  <div class="client-only-demo" :data-client-only-demo="props.variant">
    <section v-if="props.variant === 'preview'" class="client-only-demo__preview">
      <ClientOnly>
        <template #fallback>
          <div
            class="client-only-demo__surface client-only-demo__surface--fallback"
            data-client-only-fallback
          >
            <strong>Preparing browser controls…</strong>
            <span>Loading browser-only features.</span>
          </div>
        </template>
        <div
          class="client-only-demo__surface client-only-demo__surface--ready"
          data-client-only-ready
        >
          <strong>Browser controls are ready.</strong>
          <span>Rendered after client mount.</span>
        </div>
      </ClientOnly>
    </section>

    <section v-else-if="props.variant === 'usage'" class="client-only-demo__usage">
      <ClientOnly>
        <template #fallback>
          <span class="client-only-demo__inline-status" data-client-only-fallback>
            Loading run summary…
          </span>
        </template>
        <output class="client-only-demo__output" data-client-only-ready aria-live="polite">
          Run summary available in the browser.
        </output>
      </ClientOnly>
    </section>

    <section v-else-if="props.variant === 'fallback'" class="client-only-demo__chart">
      <ClientOnly>
        <template #fallback>
          <div class="client-only-demo__skeleton" data-client-only-fallback aria-hidden="true">
            <span class="client-only-demo__skeleton-line" />
            <span class="client-only-demo__skeleton-line client-only-demo__skeleton-line--short" />
            <span class="client-only-demo__skeleton-block" />
          </div>
        </template>
        <div class="client-only-demo__chart-ready" data-client-only-ready>
          <span class="client-only-demo__eyebrow">Residual history</span>
          <strong>Converging</strong>
          <span>Latest values are ready in the browser.</span>
        </div>
      </ClientOnly>
    </section>

    <section v-else class="client-only-demo__no-fallback">
      <ClientOnly>
        <div class="client-only-demo__ready-card" data-client-only-ready>
          <span class="client-only-demo__status-dot" aria-hidden="true" />
          <span><strong>Browser-only controls mounted</strong><small>No fallback supplied</small></span>
        </div>
      </ClientOnly>
    </section>
  </div>
</template>

<style scoped>
.client-only-demo {
  box-sizing: border-box;
  inline-size: min(100%, 38rem);
  min-block-size: 11rem;
  display: grid;
  align-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.client-only-demo__preview,
.client-only-demo__chart {
  display: grid;
  gap: 0.75rem;
}

.client-only-demo__status-dot {
  inline-size: 0.45rem;
  block-size: 0.45rem;
  flex: none;
  border-radius: 50%;
  background: var(--kappa-accent, #247a63);
  box-shadow: 0 0 0 0.25rem color-mix(in srgb, var(--kappa-accent, #247a63) 14%, transparent);
}

.client-only-demo__surface,
.client-only-demo__chart-ready,
.client-only-demo__skeleton {
  box-sizing: border-box;
  min-block-size: 8rem;
  padding: 1.25rem;
  border: 1px solid var(--kappa-line, #d9dee6);
  border-radius: 0.75rem;
  background: var(--kappa-control, #ffffff);
}

.client-only-demo__surface {
  display: grid;
  align-content: center;
  gap: 0.45rem;
}

.client-only-demo__surface--fallback,
.client-only-demo__skeleton {
  background: var(--kappa-tint, #f3f5f8);
}

.client-only-demo__surface strong,
.client-only-demo__chart-ready strong,
.client-only-demo__ready-card strong {
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}

.client-only-demo__eyebrow {
  color: var(--kappa-subtle, #69717e);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.client-only-demo__surface span,
.client-only-demo__chart-ready span,
.client-only-demo__ready-card small {
  color: var(--kappa-subtle, #69717e);
  font-size: 0.75rem;
}

.client-only-demo__usage {
  display: grid;
  gap: 0.7rem;
  justify-items: start;
}

.client-only-demo__inline-status,
.client-only-demo__output {
  display: inline-block;
  padding: 0.7rem 0.85rem;
  border-inline-start: 0.2rem solid var(--kappa-accent, #247a63);
  background: var(--kappa-tint, #f3f5f8);
  font-size: 0.88rem;
}

.client-only-demo__output {
  border-color: var(--kappa-info, #3672a3);
  background: color-mix(in srgb, var(--kappa-info, #3672a3) 8%, var(--kappa-control, #fff));
}

.client-only-demo__chart-ready {
  display: grid;
  gap: 0.75rem;
}

.client-only-demo__skeleton {
  display: grid;
  align-content: center;
  gap: 0.7rem;
}

.client-only-demo__skeleton-line {
  inline-size: 55%;
  block-size: 0.65rem;
  border-radius: 99px;
  background: var(--kappa-line-strong, #b7c0cd);
}

.client-only-demo__skeleton-line--short {
  inline-size: 32%;
}

.client-only-demo__skeleton-block {
  inline-size: 100%;
  block-size: 3.3rem;
  border-radius: 0.4rem;
  background: var(--kappa-line, #d9dee6);
}

.client-only-demo__no-fallback {
  display: flex;
  justify-content: center;
}

.client-only-demo__ready-card {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--kappa-line, #d9dee6);
  border-radius: 0.65rem;
  background: var(--kappa-control, #ffffff);
}

.client-only-demo__ready-card span:last-child {
  display: grid;
  gap: 0.2rem;
}

@media (max-width: 30rem) {
  .client-only-demo__surface,
  .client-only-demo__chart-ready,
  .client-only-demo__skeleton {
    padding: 1rem;
  }
}

@media (forced-colors: active) {
  .client-only-demo__surface,
  .client-only-demo__chart-ready,
  .client-only-demo__skeleton,
  .client-only-demo__ready-card {
    border-color: CanvasText;
  }
}
</style>
