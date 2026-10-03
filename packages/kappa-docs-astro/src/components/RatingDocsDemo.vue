<script setup lang="ts">
import { Button, Rating } from "@dicehub/kappa";
import { Hexagon } from "@lucide/vue";
import { ref } from "vue";

type DemoVariant = "preview" | "usage" | "sizes" | "half" | "controlled" | "custom" | "states";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const meshRating = ref(4);
const usageRating = ref(3);
const halfRating = ref(3.5);
const controlledRating = ref(2);
const customRating = ref(4);
const invalidRating = ref(0);

const setControlledRating = (value: number) => {
  controlledRating.value = Math.min(5, Math.max(0, value));
};
</script>

<template>
  <div class="rating-demo" :data-rating-demo="props.variant">
    <section v-if="props.variant === 'preview'" class="rating-demo__feedback">
      <div class="rating-demo__heading">
        <div>
          <strong>Mesh quality</strong>
          <span>How useful was this generated mesh?</span>
        </div>
        <output aria-live="polite">{{ meshRating }} / 5</output>
      </div>
      <Rating.Root v-model="meshRating" name="mesh-quality">
        <Rating.Label>Rating</Rating.Label>
        <Rating.Control data-rating-control="preview" />
      </Rating.Root>
    </section>

    <Rating.Root v-else-if="props.variant === 'usage'" v-model="usageRating" name="result-quality">
      <Rating.Label>Result quality</Rating.Label>
      <Rating.Control />
    </Rating.Root>

    <div v-else-if="props.variant === 'sizes'" class="rating-demo__sizes">
      <Rating.Root v-for="size in ['sm', 'base', 'lg'] as const" :key="size" :default-value="3" :size="size" read-only>
        <Rating.Label>{{ size === 'base' ? 'Base' : size.toUpperCase() }}</Rating.Label>
        <Rating.Control />
      </Rating.Root>
    </div>

    <section v-else-if="props.variant === 'half'" class="rating-demo__stack">
      <Rating.Root v-model="halfRating" allow-half name="solver-rating">
        <Rating.Label>Solver rating</Rating.Label>
        <Rating.Control data-rating-control="half" />
      </Rating.Root>
      <output aria-live="polite">Selected: <strong>{{ halfRating }}</strong></output>
    </section>

    <section v-else-if="props.variant === 'controlled'" class="rating-demo__stack">
      <Rating.Root v-model="controlledRating" name="review-rating">
        <Rating.Label>Review rating</Rating.Label>
        <Rating.Control data-rating-control="controlled" />
      </Rating.Root>
      <div class="rating-demo__controlled">
        <Button size="sm" variant="outline" @click="setControlledRating(controlledRating - 1)">Decrease</Button>
        <output aria-live="polite">{{ controlledRating }} of 5</output>
        <Button size="sm" variant="outline" @click="setControlledRating(controlledRating + 1)">Increase</Button>
      </div>
    </section>

    <Rating.Root v-else-if="props.variant === 'custom'" v-model="customRating" name="confidence" class="rating-demo__custom">
      <Rating.Label>Result confidence</Rating.Label>
      <Rating.Control v-slot="{ items }">
        <Rating.Item v-for="item in items" :key="item" :index="item">
          <Hexagon class="rating-demo__hexagon" aria-hidden="true" />
        </Rating.Item>
      </Rating.Control>
    </Rating.Root>

    <div v-else class="rating-demo__states">
      <Rating.Root :default-value="3" disabled>
        <Rating.Label>Disabled</Rating.Label>
        <Rating.Control />
      </Rating.Root>
      <Rating.Root :default-value="4" read-only>
        <Rating.Label>Read-only</Rating.Label>
        <Rating.Control />
      </Rating.Root>
      <div>
        <Rating.Root v-model="invalidRating" invalid required name="required-rating" aria-describedby="rating-error">
          <Rating.Label>Required rating</Rating.Label>
          <Rating.Control />
        </Rating.Root>
        <p id="rating-error" class="rating-demo__error">Select a rating.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rating-demo {
  display: grid;
  inline-size: min(100%, 38rem);
  min-block-size: 8rem;
  place-items: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.rating-demo__feedback {
  display: grid;
  inline-size: min(100%, 27rem);
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--docs-line);
  border-radius: 0.625rem;
  background: color-mix(in oklab, var(--docs-control) 74%, transparent);
}

.rating-demo__heading,
.rating-demo__controlled {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.rating-demo__heading > div,
.rating-demo__stack {
  display: grid;
  gap: 0.25rem;
}

.rating-demo__heading span,
.rating-demo__stack > output,
.rating-demo__controlled output {
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.rating-demo__heading output {
  color: var(--docs-default);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.rating-demo__feedback :deep(.kappa-rating) {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.rating-demo__sizes,
.rating-demo__states {
  display: grid;
  inline-size: min(100%, 30rem);
  gap: 1rem;
}

.rating-demo__sizes :deep(.kappa-rating) {
  grid-template-columns: 4rem auto;
  align-items: center;
}

.rating-demo__controlled {
  margin-block-start: 0.5rem;
}

.rating-demo__controlled output {
  min-inline-size: 4rem;
  text-align: center;
}

.rating-demo__custom :deep(.rating-demo__hexagon) {
  inline-size: 1.2rem;
  block-size: 1.2rem;
  fill: transparent;
  stroke-width: 1.6;
}

.rating-demo__custom :deep(.kappa-rating__item[data-highlighted] .rating-demo__hexagon) {
  fill: currentColor;
}

.rating-demo__error {
  margin: 0.375rem 0 0;
  color: var(--docs-danger);
  font-size: 0.75rem;
}
</style>
