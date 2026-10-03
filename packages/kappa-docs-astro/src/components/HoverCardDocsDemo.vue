<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import {
  HoverCard,
  type HoverCardPositioningOptions,
} from "@dicehub/kappa/components/hover-card";

type DemoVariant =
  | "preview"
  | "usage"
  | "interactive-preview"
  | "placement"
  | "delay-control"
  | "controlled"
  | "custom-arrow"
  | "long-preview"
  | "disabled";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledOpen = ref(false);
const placements = [
  { label: "Top", placement: "top" },
  { label: "Bottom", placement: "bottom" },
  { label: "Left", placement: "left" },
  { label: "Right", placement: "right" },
] as const satisfies ReadonlyArray<{
  label: string;
  placement: HoverCardPositioningOptions["placement"];
}>;

const longPreview =
  "Residuals stayed below the configured threshold for the final 240 iterations. The full convergence report includes solver settings, mesh diagnostics, and the complete time history.";
</script>

<template>
  <div class="hover-card-demo" :data-hover-card-demo="props.variant">
    <HoverCard.Root v-if="props.variant === 'preview'" id="hover-card-demo-preview" :open-delay="0">
      <HoverCard.Trigger as-child>
        <Button variant="outline">Inspect run</Button>
      </HoverCard.Trigger>
      <HoverCard.Content data-hover-card-demo-surface="preview">
        <div class="hover-card-demo__identity">
          <span class="hover-card-demo__eyebrow">RUN 4189 · READY</span>
          <h3>Wake refinement</h3>
        </div>
        <p>Completed in 02:14:38. Residuals are within the acceptance limit.</p>
        <a href="#run-4189">Open run report</a>
      </HoverCard.Content>
    </HoverCard.Root>

    <HoverCard.Root
      v-else-if="props.variant === 'usage' || props.variant === 'interactive-preview'"
      :id="`hover-card-demo-${props.variant}`"
    >
      <HoverCard.Trigger as-child>
        <Button variant="secondary">View solver profile</Button>
      </HoverCard.Trigger>
      <HoverCard.Content :data-hover-card-demo-surface="props.variant">
        <div class="hover-card-demo__identity">
          <span class="hover-card-demo__eyebrow">SOLVER PROFILE</span>
          <h3>PIMPLE baseline</h3>
        </div>
        <p>Pressure-velocity coupling · 1,240 iterations · 8.4e-6 residual.</p>
        <a href="#pimple-baseline">Review the full run</a>
      </HoverCard.Content>
    </HoverCard.Root>

    <div v-else-if="props.variant === 'placement'" class="hover-card-demo__placements">
      <HoverCard.Root
        v-for="option in placements"
        :key="option.placement"
        :id="`hover-card-demo-placement-${option.placement}`"
        :open-delay="0"
        :positioning="{ placement: option.placement }"
      >
        <HoverCard.Trigger as-child>
          <Button
            class="hover-card-demo__placement-trigger"
            :data-demo-placement="option.placement"
            size="sm"
            variant="outline"
          >
            {{ option.label }}
          </Button>
        </HoverCard.Trigger>
        <HoverCard.Content :data-hover-card-demo-surface="`placement-${option.placement}`">
          <h3>{{ option.label }} placement</h3>
          <p>Ark UI flips this surface when the viewport is tight.</p>
        </HoverCard.Content>
      </HoverCard.Root>
    </div>

    <div v-else-if="props.variant === 'delay-control'" class="hover-card-demo__group">
      <HoverCard.Root id="hover-card-demo-delay-instant" :open-delay="0">
        <HoverCard.Trigger as-child><Button size="sm" variant="outline">Immediate</Button></HoverCard.Trigger>
        <HoverCard.Content data-hover-card-demo-surface="delay-instant">
          <h3>Immediate preview</h3>
          <p>Opens without a pointer delay.</p>
        </HoverCard.Content>
      </HoverCard.Root>
      <HoverCard.Root id="hover-card-demo-delay-default">
        <HoverCard.Trigger as-child><Button size="sm" variant="outline">Default</Button></HoverCard.Trigger>
        <HoverCard.Content data-hover-card-demo-surface="delay-default">
          <h3>Default preview</h3>
          <p>Uses Ark UI's 600 ms open delay.</p>
        </HoverCard.Content>
      </HoverCard.Root>
      <HoverCard.Root id="hover-card-demo-delay-custom" :open-delay="900">
        <HoverCard.Trigger as-child><Button size="sm" variant="outline">900 ms</Button></HoverCard.Trigger>
        <HoverCard.Content data-hover-card-demo-surface="delay-custom">
          <h3>Longer preview delay</h3>
          <p>Useful when the pointer crosses a dense control row.</p>
        </HoverCard.Content>
      </HoverCard.Root>
    </div>

    <div v-else-if="props.variant === 'controlled'" class="hover-card-demo__controlled">
      <HoverCard.Root
        id="hover-card-demo-controlled"
        v-model:open="controlledOpen"
        :open-delay="0"
      >
        <HoverCard.Trigger as-child>
          <Button variant="outline">Hover or focus</Button>
        </HoverCard.Trigger>
        <HoverCard.Content data-hover-card-demo-surface="controlled">
          <h3>Controlled state</h3>
          <p>The parent owns the open value while Ark UI owns pointer and focus events.</p>
        </HoverCard.Content>
      </HoverCard.Root>
      <output role="status" aria-live="polite">State: {{ controlledOpen ? "open" : "closed" }}</output>
    </div>

    <HoverCard.Root v-else-if="props.variant === 'custom-arrow'" id="hover-card-demo-custom-arrow">
      <HoverCard.Trigger as-child>
        <Button variant="outline">Custom arrow</Button>
      </HoverCard.Trigger>
      <HoverCard.Content data-hover-card-demo-surface="custom-arrow">
        <template #arrow>
          <HoverCard.Arrow class="hover-card-demo__custom-arrow">
            <HoverCard.ArrowTip />
          </HoverCard.Arrow>
        </template>
        <h3>Custom arrow slot</h3>
        <p>Replace the default arrow when the surface needs a different visual.</p>
      </HoverCard.Content>
    </HoverCard.Root>

    <HoverCard.Root v-else-if="props.variant === 'long-preview'" id="hover-card-demo-long-preview" :open-delay="0">
      <HoverCard.Trigger as-child>
        <Button variant="outline">Long preview</Button>
      </HoverCard.Trigger>
      <HoverCard.Content data-hover-card-demo-surface="long-preview">
        <h3>Convergence notes</h3>
        <p>{{ longPreview }}</p>
        <a href="#convergence-report">Open convergence report</a>
      </HoverCard.Content>
    </HoverCard.Root>

    <HoverCard.Root v-else id="hover-card-demo-disabled" disabled>
      <HoverCard.Trigger as-child>
        <Button disabled>Unavailable run</Button>
      </HoverCard.Trigger>
      <HoverCard.Content data-hover-card-demo-surface="disabled">
        <h3>Unavailable run</h3>
        <p>Validation must pass before this preview is available.</p>
      </HoverCard.Content>
    </HoverCard.Root>
  </div>
</template>

<style scoped>
.hover-card-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 8rem;
  place-items: center;
  color: var(--kappa-default);
  font-family: var(--kappa-font-sans);
}

.hover-card-demo__group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.hover-card-demo__placements {
  display: grid;
  inline-size: min(100%, 20rem);
  min-block-size: 10rem;
  grid-template-areas:
    ". top ."
    "left . right"
    ". bottom .";
  grid-template-columns: repeat(3, minmax(0, 1fr));
  place-items: center;
  gap: 0.75rem 1rem;
}

.hover-card-demo__placement-trigger[data-demo-placement="top"] {
  grid-area: top;
}

.hover-card-demo__placement-trigger[data-demo-placement="bottom"] {
  grid-area: bottom;
}

.hover-card-demo__placement-trigger[data-demo-placement="left"] {
  grid-area: left;
  justify-self: start;
}

.hover-card-demo__placement-trigger[data-demo-placement="right"] {
  grid-area: right;
  justify-self: end;
}

.hover-card-demo__controlled {
  display: grid;
  justify-items: center;
  gap: 0.625rem;
}

.hover-card-demo__controlled output {
  color: var(--kappa-subtle);
  font-family: var(--kappa-font-mono);
  font-size: 0.75rem;
}

.hover-card-demo__identity {
  display: grid;
  gap: 0.125rem;
}

.hover-card-demo__eyebrow {
  color: var(--kappa-accent);
  font-family: var(--kappa-font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1rem;
}

.hover-card-demo__custom-arrow {
  --arrow-background: var(--kappa-accent);
  color: var(--kappa-accent);
}

@media (max-width: 36rem) {
  .hover-card-demo__group {
    flex-direction: column;
  }
}
</style>
