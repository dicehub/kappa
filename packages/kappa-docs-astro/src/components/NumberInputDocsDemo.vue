<script setup lang="ts">
import { computed, ref } from "vue";
import { NumberInput, NUMBER_INPUT_SIZES } from "@dicehub/kappa/components/number-input";

type DemoVariant =
  | "preview"
  | "usage"
  | "basic"
  | "scrubbable"
  | "scrubbing"
  | "range"
  | "precision"
  | "units"
  | "controlled"
  | "states"
  | "sizes"
  | "locale"
  | "mouse-wheel"
  | "rtl";

type ValueDetails = { value: string; valueAsNumber: number };

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledValue = ref("0.005");
const committedValue = ref("0.005");
const liveValue = computed(() => controlledValue.value || "empty");
const sizes = NUMBER_INPUT_SIZES;

const updateControlledValue = (details: ValueDetails) => {
  controlledValue.value = details.value;
};

const recordCommit = (details: ValueDetails) => {
  committedValue.value = details.value;
};
</script>

<template>
  <div class="number-input-demo" :data-number-input-demo="variant">
    <section v-if="variant === 'preview'" class="number-input-demo__parameter">
      <div class="number-input-demo__parameter-copy">
        <span>Transient solver · Time controls</span>
        <strong>Maximum Courant number</strong>
      </div>
      <NumberInput.Root
        class="number-input-demo__field"
        default-value="0.8"
        :min="0"
        :max="5"
        :step="0.1"
        :format-options="{ minimumFractionDigits: 1, maximumFractionDigits: 1 }"
      >
        <NumberInput.Label class="docs-visually-hidden">Maximum Courant number</NumberInput.Label>
        <NumberInput.Control>
          <NumberInput.ScrubbableInput />
        </NumberInput.Control>
      </NumberInput.Root>
      <span class="number-input-demo__hint">Drag the value, or click it to type.</span>
    </section>

    <NumberInput.Root v-else-if="variant === 'usage'" default-value="1" :min="0" :step="0.1" name="inlet-velocity">
      <NumberInput.Label>Inlet velocity (m/s)</NumberInput.Label>
      <NumberInput.Control>
        <NumberInput.DecrementTrigger aria-label="Decrease inlet velocity" />
        <NumberInput.Input />
        <NumberInput.Unit aria-hidden="true">m/s</NumberInput.Unit>
        <NumberInput.IncrementTrigger aria-label="Increase inlet velocity" />
      </NumberInput.Control>
    </NumberInput.Root>

    <NumberInput.Root v-else-if="variant === 'basic'" default-value="12" :min="1" :max="64">
      <NumberInput.Label>Solver processes</NumberInput.Label>
      <NumberInput.Control>
        <NumberInput.DecrementTrigger aria-label="Decrease solver processes" />
        <NumberInput.Input />
        <NumberInput.IncrementTrigger aria-label="Increase solver processes" />
      </NumberInput.Control>
    </NumberInput.Root>

    <div v-else-if="variant === 'scrubbable'" class="number-input-demo__scrubbable-stack">
      <NumberInput.Root
        default-value="0.35"
        :min="0"
        :max="1"
        :step="0.01"
        :small-step="0.001"
        :large-step="0.1"
        :format-options="{ minimumFractionDigits: 3, maximumFractionDigits: 3 }"
      >
        <NumberInput.Label>Under-relaxation factor</NumberInput.Label>
        <NumberInput.Control>
          <NumberInput.ScrubbableInput />
        </NumberInput.Control>
      </NumberInput.Root>
      <NumberInput.Root
        default-value="12.5"
        :min="-100"
        :max="100"
        :step="0.5"
        :small-step="0.05"
        :large-step="5"
        :focus-input-on-change="false"
        :format-options="{ minimumFractionDigits: 1, maximumFractionDigits: 2 }"
      >
        <NumberInput.Label>Clipping plane offset (mm)</NumberInput.Label>
        <NumberInput.Control>
          <NumberInput.DecrementTrigger aria-label="Decrease clipping plane offset" />
          <NumberInput.ScrubbableInput edit-alignment="center" />
          <NumberInput.IncrementTrigger aria-label="Increase clipping plane offset" />
        </NumberInput.Control>
      </NumberInput.Root>
      <p class="number-input-demo__hint">
        Drag after 10 px. Ctrl or Alt gives fine steps; Shift gives coarse steps. Escape restores.
      </p>
      <div class="number-input-demo__safety-row">
        <NumberInput.Root default-value="0.5" disabled :step="0.01">
          <NumberInput.Label>Disabled coefficient</NumberInput.Label>
          <NumberInput.Control><NumberInput.ScrubbableInput /></NumberInput.Control>
        </NumberInput.Root>
        <NumberInput.Root default-value="0.7" read-only :step="0.01">
          <NumberInput.Label>Read-only coefficient</NumberInput.Label>
          <NumberInput.Control><NumberInput.ScrubbableInput /></NumberInput.Control>
        </NumberInput.Root>
      </div>
    </div>

    <NumberInput.Root
      v-else-if="variant === 'scrubbing'"
      default-value="0.35"
      :min="0"
      :max="1"
      :step="0.01"
      :format-options="{ minimumFractionDigits: 2, maximumFractionDigits: 2 }"
    >
      <div class="number-input-demo__label-line">
        <NumberInput.Label>Under-relaxation factor</NumberInput.Label>
        <NumberInput.Scrubber title="Drag horizontally to adjust" />
      </div>
      <NumberInput.Control>
        <NumberInput.DecrementTrigger aria-label="Decrease under-relaxation factor" />
        <NumberInput.Input />
        <NumberInput.IncrementTrigger aria-label="Increase under-relaxation factor" />
      </NumberInput.Control>
    </NumberInput.Root>

    <NumberInput.Root
      v-else-if="variant === 'range'"
      default-value="300"
      :min="250"
      :max="400"
      :step="5"
    >
      <NumberInput.Label>Inlet temperature (K)</NumberInput.Label>
      <NumberInput.Control>
        <NumberInput.DecrementTrigger aria-label="Decrease inlet temperature" />
        <NumberInput.Input />
        <NumberInput.Unit aria-hidden="true">K</NumberInput.Unit>
        <NumberInput.IncrementTrigger aria-label="Increase inlet temperature" />
      </NumberInput.Control>
    </NumberInput.Root>

    <NumberInput.Root
      v-else-if="variant === 'precision'"
      default-value="0.0025"
      :min="0.0001"
      :step="0.0001"
      :format-options="{ minimumFractionDigits: 4, maximumFractionDigits: 4 }"
    >
      <NumberInput.Label>Time step (s)</NumberInput.Label>
      <NumberInput.Control>
        <NumberInput.DecrementTrigger aria-label="Decrease time step" />
        <NumberInput.Input />
        <NumberInput.Unit aria-hidden="true">s</NumberInput.Unit>
        <NumberInput.IncrementTrigger aria-label="Increase time step" />
      </NumberInput.Control>
    </NumberInput.Root>

    <div v-else-if="variant === 'units'" class="number-input-demo__row">
      <NumberInput.Root default-value="18.5" :step="0.5">
        <NumberInput.Label>Cell size (mm)</NumberInput.Label>
        <NumberInput.Control>
          <NumberInput.Input />
          <NumberInput.Unit aria-hidden="true">mm</NumberInput.Unit>
        </NumberInput.Control>
      </NumberInput.Root>
      <NumberInput.Root
        default-value="12.5"
        locale="en-GB"
        :step="0.5"
        :format-options="{ style: 'unit', unit: 'liter-per-second', unitDisplay: 'short' }"
      >
        <NumberInput.Label>Volume flow rate</NumberInput.Label>
        <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
      </NumberInput.Root>
    </div>

    <div v-else-if="variant === 'controlled'" class="number-input-demo__stack">
      <NumberInput.Root
        :model-value="controlledValue"
        :min="0.0001"
        :max="0.1"
        :step="0.001"
        @value-change="updateControlledValue"
        @value-commit="recordCommit"
      >
        <NumberInput.Label>Write interval (s)</NumberInput.Label>
        <NumberInput.Control>
          <NumberInput.DecrementTrigger aria-label="Decrease write interval" />
          <NumberInput.Input />
          <NumberInput.Unit aria-hidden="true">s</NumberInput.Unit>
          <NumberInput.IncrementTrigger aria-label="Increase write interval" />
        </NumberInput.Control>
      </NumberInput.Root>
      <output class="number-input-demo__readout" aria-live="polite">
        Live: <strong>{{ liveValue }}</strong> · Committed: <strong>{{ committedValue }}</strong>
      </output>
    </div>

    <div v-else-if="variant === 'states'" class="number-input-demo__states">
      <NumberInput.Root default-value="8" disabled>
        <NumberInput.Label>Disabled partitions</NumberInput.Label>
        <NumberInput.Control>
          <NumberInput.Input />
          <NumberInput.IncrementTrigger aria-label="Increase disabled partitions" />
        </NumberInput.Control>
      </NumberInput.Root>
      <NumberInput.Root default-value="24" read-only>
        <NumberInput.Label>Read-only partitions</NumberInput.Label>
        <NumberInput.Control>
          <NumberInput.Scrubber title="Read-only value" />
          <NumberInput.Input />
        </NumberInput.Control>
      </NumberInput.Root>
      <NumberInput.Root default-value="125" :max="100" invalid>
        <NumberInput.Label>Invalid load balance (%)</NumberInput.Label>
        <NumberInput.Control><NumberInput.Input aria-describedby="load-balance-error" /></NumberInput.Control>
      </NumberInput.Root>
      <p id="load-balance-error" class="number-input-demo__error">Enter a value from 0 to 100.</p>
    </div>

    <div v-else-if="variant === 'sizes'" class="number-input-demo__sizes">
      <NumberInput.Root v-for="size in sizes" :key="size" :size="size" default-value="32">
        <NumberInput.Label>{{ size === 'default' ? 'Default' : size.toUpperCase() }}</NumberInput.Label>
        <NumberInput.Control>
          <NumberInput.DecrementTrigger :aria-label="`Decrease ${size} value`" />
          <NumberInput.Input />
          <NumberInput.IncrementTrigger :aria-label="`Increase ${size} value`" />
        </NumberInput.Control>
      </NumberInput.Root>
    </div>

    <NumberInput.Root
      v-else-if="variant === 'locale'"
      default-value="1234,5"
      locale="de-DE"
      :step="0.5"
      :format-options="{ minimumFractionDigits: 1, maximumFractionDigits: 2, useGrouping: true }"
    >
      <NumberInput.Label>Volumenstrom (m³/s)</NumberInput.Label>
      <NumberInput.Control>
        <NumberInput.DecrementTrigger aria-label="Volumenstrom verringern" />
        <NumberInput.Input />
        <NumberInput.Unit aria-hidden="true">m³/s</NumberInput.Unit>
        <NumberInput.IncrementTrigger aria-label="Volumenstrom erhöhen" />
      </NumberInput.Control>
    </NumberInput.Root>

    <div v-else-if="variant === 'mouse-wheel'" class="number-input-demo__stack">
      <NumberInput.Root default-value="50" :step="5" allow-mouse-wheel>
        <NumberInput.Label>Mesh refinement (%)</NumberInput.Label>
        <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
      </NumberInput.Root>
      <span class="number-input-demo__hint">Hover the input, then use the mouse wheel.</span>
    </div>

    <div v-else dir="rtl" class="number-input-demo__rtl">
      <NumberInput.Root dir="rtl" locale="ar-EG" default-value="24" :min="1" :max="128">
        <NumberInput.Label>عدد عمليات الحل</NumberInput.Label>
        <NumberInput.Control>
          <NumberInput.DecrementTrigger aria-label="تقليل عدد العمليات" />
          <NumberInput.Input />
          <NumberInput.IncrementTrigger aria-label="زيادة عدد العمليات" />
        </NumberInput.Control>
      </NumberInput.Root>
      <NumberInput.Root
        dir="rtl"
        locale="de-DE"
        default-value="1234,5"
        :step="0.5"
        :format-options="{ minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: true }"
      >
        <NumberInput.Label>RTL layout, German number format</NumberInput.Label>
        <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
      </NumberInput.Root>
    </div>
  </div>
</template>

<style scoped>
.number-input-demo {
  display: grid;
  width: min(100%, 40rem);
  min-width: 0;
  min-height: 10rem;
  place-items: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.number-input-demo > :deep(.kappa-number-input),
.number-input-demo__stack,
.number-input-demo__rtl {
  width: min(100%, 20rem);
}

.number-input-demo__parameter {
  display: grid;
  width: min(100%, 31rem);
  grid-template-columns: minmax(0, 1fr) minmax(10rem, 13rem);
  align-items: end;
  gap: 0.5rem 1.25rem;
  border-block: 1px solid var(--docs-line);
  padding-block: 1rem;
}

.number-input-demo__parameter-copy { display: grid; gap: 0.1875rem; }
.number-input-demo__parameter-copy span,
.number-input-demo__hint,
.number-input-demo__readout { color: var(--docs-subtle); font-size: 0.75rem; }
.number-input-demo__parameter-copy strong { font-size: 0.875rem; }
.number-input-demo__parameter .number-input-demo__hint { grid-column: 1 / -1; text-align: end; }
.number-input-demo__label-line { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
.number-input-demo__row { display: grid; width: min(100%, 38rem); grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.number-input-demo__stack { display: grid; gap: 0.625rem; }
.number-input-demo__scrubbable-stack { display: grid; width: min(100%, 24rem); gap: 0.625rem; }
.number-input-demo__safety-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
.number-input-demo__readout { margin: 0; text-align: end; }
.number-input-demo__readout strong { color: var(--docs-default); font-variant-numeric: tabular-nums; }
.number-input-demo__states { display: grid; width: min(100%, 38rem); grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; align-items: start; }
.number-input-demo__error { grid-column: 3; margin: -0.5rem 0 0; color: var(--kappa-danger, #b42318); font-size: 0.6875rem; }
.number-input-demo__sizes { display: flex; width: 100%; flex-wrap: wrap; align-items: end; justify-content: center; gap: 1rem; }
.number-input-demo__sizes > :deep(.kappa-number-input) { width: 9rem; }
.number-input-demo__rtl { display: grid; direction: rtl; gap: 0.75rem; }

@media (max-width: 620px) {
  .number-input-demo { min-height: 12rem; }
  .number-input-demo__parameter,
  .number-input-demo__row,
  .number-input-demo__safety-row,
  .number-input-demo__states { grid-template-columns: 1fr; }
  .number-input-demo__parameter .number-input-demo__hint,
  .number-input-demo__error { grid-column: auto; }
  .number-input-demo__parameter .number-input-demo__hint { text-align: start; }
}
</style>
