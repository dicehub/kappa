<script setup lang="ts">
import { Slider } from "@dicehub/kappa/components/slider";
import { ref } from "vue";

type DemoVariant =
  | "preview"
  | "usage"
  | "range"
  | "marks"
  | "vertical"
  | "sizes"
  | "states"
  | "controlled";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const previewValue = ref([64]);
const controlledValue = ref([36]);
</script>

<template>
  <div class="slider-demo" :data-slider-demo="props.variant">
    <section v-if="props.variant === 'preview'" class="slider-demo__stack">
      <Slider.Root v-model="previewValue" :aria-label="['Mix level']">
        <Slider.Label>Mix level</Slider.Label>
        <Slider.ValueText />
        <Slider.Control>
          <Slider.Track><Slider.Range /></Slider.Track>
          <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
      <output role="status">Current mix: {{ previewValue[0] }}%</output>
    </section>

    <Slider.Root
      v-else-if="props.variant === 'usage'"
      :default-value="[42]"
      :aria-label="['Opacity']"
    >
      <Slider.Label>Opacity</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track><Slider.Range /></Slider.Track>
        <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
      </Slider.Control>
    </Slider.Root>

    <Slider.Root
      v-else-if="props.variant === 'range'"
      :default-value="[22, 78]"
      :aria-label="['Visible range']"
      :min-steps-between-thumbs="8"
    >
      <Slider.Label>Visible range</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track><Slider.Range /></Slider.Track>
        <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
        <Slider.Thumb :index="1"><Slider.HiddenInput /></Slider.Thumb>
      </Slider.Control>
    </Slider.Root>

    <Slider.Root
      v-else-if="props.variant === 'marks'"
      :default-value="[50]"
      :aria-label="['CPU limit']"
    >
      <Slider.Label>CPU limit</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track><Slider.Range /></Slider.Track>
        <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
      </Slider.Control>
      <Slider.MarkerGroup>
        <Slider.Marker :value="0">0%</Slider.Marker>
        <Slider.Marker :value="50">50%</Slider.Marker>
        <Slider.Marker :value="100">100%</Slider.Marker>
      </Slider.MarkerGroup>
    </Slider.Root>

    <Slider.Root
      v-else-if="props.variant === 'vertical'"
      orientation="vertical"
      :default-value="[68]"
      :aria-label="['Temperature']"
    >
      <Slider.Label>Temperature</Slider.Label>
      <Slider.ValueText />
      <Slider.Control>
        <Slider.Track><Slider.Range /></Slider.Track>
        <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
      </Slider.Control>
    </Slider.Root>

    <div v-else-if="props.variant === 'sizes'" class="slider-demo__sizes">
      <Slider.Root size="sm" :default-value="[24]" :aria-label="['Small']">
        <Slider.Label>Small</Slider.Label>
        <Slider.ValueText />
        <Slider.Control>
          <Slider.Track><Slider.Range /></Slider.Track>
          <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
      <Slider.Root size="base" :default-value="[48]" :aria-label="['Base']">
        <Slider.Label>Base</Slider.Label>
        <Slider.ValueText />
        <Slider.Control>
          <Slider.Track><Slider.Range /></Slider.Track>
          <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
      <Slider.Root size="lg" :default-value="[72]" :aria-label="['Large']">
        <Slider.Label>Large</Slider.Label>
        <Slider.ValueText />
        <Slider.Control>
          <Slider.Track><Slider.Range /></Slider.Track>
          <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
    </div>

    <div v-else-if="props.variant === 'states'" class="slider-demo__states">
      <Slider.Root disabled :default-value="[30]" :aria-label="['Disabled']">
        <Slider.Label>Disabled</Slider.Label>
        <Slider.ValueText />
        <Slider.Control>
          <Slider.Track><Slider.Range /></Slider.Track>
          <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
      <Slider.Root read-only :default-value="[52]" :aria-label="['Read only']">
        <Slider.Label>Read only</Slider.Label>
        <Slider.ValueText />
        <Slider.Control>
          <Slider.Track><Slider.Range /></Slider.Track>
          <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
      <div class="slider-demo__invalid">
        <Slider.Root invalid :default-value="[72]" :aria-label="['Invalid']">
          <Slider.Label>Invalid</Slider.Label>
          <Slider.ValueText />
          <Slider.Control>
            <Slider.Track><Slider.Range /></Slider.Track>
            <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
        <p>Choose a value below 70%.</p>
      </div>
    </div>

    <section v-else class="slider-demo__controlled">
      <Slider.Root v-model="controlledValue" :aria-label="['Solver progress']">
        <Slider.Label>Solver progress</Slider.Label>
        <Slider.ValueText />
        <Slider.Control>
          <Slider.Track><Slider.Range /></Slider.Track>
          <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
      <label>
        <span>Set progress</span>
        <input v-model.number="controlledValue[0]" type="range" min="0" max="100" />
      </label>
    </section>
  </div>
</template>

<style scoped>
.slider-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 12rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.slider-demo__stack,
.slider-demo__controlled,
.slider-demo__sizes {
  display: grid;
  inline-size: min(100%, 30rem);
  min-inline-size: 0;
  gap: 1rem;
}

.slider-demo__stack output {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
}

.slider-demo__sizes {
  gap: 1.25rem;
}

.slider-demo__states {
  display: grid;
  inline-size: min(100%, 38rem);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem 2rem;
  align-items: start;
}

.slider-demo__invalid {
  display: grid;
  gap: 0.25rem;
}

.slider-demo__invalid p {
  margin: 0;
  color: var(--kappa-danger-text, #b42318);
  font-size: 0.75rem;
}

.slider-demo__controlled label {
  display: grid;
  gap: 0.5rem;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  font-weight: 600;
}

.slider-demo__controlled input {
  inline-size: 100%;
  accent-color: var(--kappa-accent-solid, #4356e8);
}

@media (max-width: 36rem) {
  .slider-demo__states {
    grid-template-columns: 1fr;
  }
}
</style>
