<script setup lang="ts">
import { computed, ref } from "vue";
import { Checkbox, type CheckboxCheckedState } from "@dicehub/kappa/components/checkbox";

type DemoVariant =
  | "preview"
  | "usage"
  | "basic"
  | "indeterminate"
  | "group"
  | "bordered"
  | "controlled"
  | "states";

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const meshChecks = ref(true);
const residualHistory = ref(false);
const borderedRows = [
  {
    value: "mesh-checks",
    title: "Run pre-solver mesh checks",
    description: "Blocks the run while quality metrics fail.",
    state: meshChecks,
  },
  {
    value: "residual-history",
    title: "Write residual history",
    description: "Appends normalized residuals at every iteration.",
    state: residualHistory,
  },
];

const fieldOptions = [
  { value: "residuals", label: "Residuals" },
  { value: "forces", label: "Force coefficients" },
  { value: "spectra", label: "Pressure spectra" },
] as const;

const selectedFields = ref<string[]>(["residuals", "forces"]);
const allFieldsState = computed<CheckboxCheckedState>(() => {
  if (selectedFields.value.length === 0) return false;
  return selectedFields.value.length === fieldOptions.length ? true : "indeterminate";
});
const toggleAllFields = () => {
  selectedFields.value =
    selectedFields.value.length === fieldOptions.length
      ? []
      : fieldOptions.map((option) => option.value);
};

const exportSelection = ref<string[]>(["vtk"]);
const verifyMesh = ref(true);
const meshChecked = ref<CheckboxCheckedState>(true);
</script>

<template>
  <div class="checkbox-demo" :data-checkbox-demo="variant">
    <section v-if="variant === 'preview'" class="checkbox-demo__preview">
      <Checkbox.Root v-model:checked="verifyMesh" name="verify-mesh">
        <Checkbox.Control />
        <Checkbox.Label>Verify mesh quality before solving</Checkbox.Label>
      </Checkbox.Root>
      <span class="checkbox-demo__hint">
        Pre-solver checks are {{ verifyMesh ? "enabled" : "disabled" }} for this case.
      </span>
    </section>

    <Checkbox.Root v-else-if="variant === 'usage'" default-checked name="residual-export" value="residuals">
      <Checkbox.Control />
      <Checkbox.Label>Export residuals after each write interval</Checkbox.Label>
    </Checkbox.Root>

    <Checkbox.Root v-else-if="variant === 'basic'">
      <Checkbox.Control />
      <Checkbox.Label>Enable adaptive time step</Checkbox.Label>
    </Checkbox.Root>

    <div v-else-if="variant === 'indeterminate'" class="checkbox-demo__stack">
      <Checkbox.Root :checked="allFieldsState" @checked-change="toggleAllFields">
        <Checkbox.Control />
        <Checkbox.Label>Monitor all fields</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Group v-model="selectedFields" class="checkbox-demo__nested" name="monitored-fields">
        <Checkbox.Root v-for="option in fieldOptions" :key="option.value" :value="option.value">
          <Checkbox.Control />
          <Checkbox.Label>{{ option.label }}</Checkbox.Label>
        </Checkbox.Root>
      </Checkbox.Group>
    </div>

    <div v-else-if="variant === 'group'" class="checkbox-demo__stack">
      <span id="export-group-label" class="checkbox-demo__group-label">Export formats</span>
      <Checkbox.Group
        v-model="exportSelection"
        aria-labelledby="export-group-label"
        name="export-formats"
        :max-selected-values="2"
      >
        <Checkbox.Root value="vtk">
          <Checkbox.Control />
          <Checkbox.Label>VTK surface data</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root value="csv">
          <Checkbox.Control />
          <Checkbox.Label>CSV force history</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root value="hdf5">
          <Checkbox.Control />
          <Checkbox.Label>HDF5 field archive</Checkbox.Label>
        </Checkbox.Root>
      </Checkbox.Group>
      <output class="checkbox-demo__readout" aria-live="polite">
        Selected: <strong>{{ exportSelection.join(", ") || "none" }}</strong> (max 2)
      </output>
    </div>

    <div v-else-if="variant === 'bordered'" class="checkbox-demo__bordered">
      <Checkbox.Root
        v-for="row in borderedRows"
        :key="row.value"
        v-model:checked="row.state.value"
        class="checkbox-demo__item"
        :name="row.value"
      >
        <Checkbox.Control class="checkbox-demo__item-control" />
        <Checkbox.Label class="checkbox-demo__item-text">
          <span class="checkbox-demo__item-title">{{ row.title }}</span>
          <span class="checkbox-demo__item-description">{{ row.description }}</span>
        </Checkbox.Label>
      </Checkbox.Root>
    </div>

    <div v-else-if="variant === 'controlled'" class="checkbox-demo__stack">
      <Checkbox.Root
        :checked="meshChecked"
        name="mesh-check-controlled"
        @update:checked="meshChecked = $event"
      >
        <Checkbox.Control />
        <Checkbox.Label>Run orthogonal quality check</Checkbox.Label>
      </Checkbox.Root>
      <output class="checkbox-demo__readout" aria-live="polite">
        State: <strong>{{ meshChecked }}</strong>
      </output>
    </div>

    <div v-else class="checkbox-demo__states">
      <Checkbox.Root disabled>
        <Checkbox.Control />
        <Checkbox.Label>Disabled while meshing</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root read-only default-checked>
        <Checkbox.Control />
        <Checkbox.Label>Read-only license option</Checkbox.Label>
      </Checkbox.Root>
      <div class="checkbox-demo__invalid">
        <Checkbox.Root invalid aria-describedby="terms-error">
          <Checkbox.Control />
          <Checkbox.Label>Accept the compute policy</Checkbox.Label>
        </Checkbox.Root>
        <p id="terms-error" class="checkbox-demo__error">Acceptance is required to submit the job.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkbox-demo {
  display: grid;
  width: min(100%, 40rem);
  min-width: 0;
  min-height: 6rem;
  place-items: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.checkbox-demo__preview,
.checkbox-demo__stack,
.checkbox-demo__states {
  display: grid;
  width: min(100%, 22rem);
  gap: 0.625rem;
}

.checkbox-demo__preview {
  justify-items: center;
}

.checkbox-demo__hint,
.checkbox-demo__readout {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.checkbox-demo__readout strong {
  color: var(--docs-default);
}

.checkbox-demo__nested {
  padding-inline-start: 1.5rem;
}

.checkbox-demo__group-label {
  font-size: 0.8125rem;
  font-weight: 600;
}

.checkbox-demo__invalid {
  display: grid;
  gap: 0.25rem;
}

.checkbox-demo__error {
  margin: 0;
  padding-inline-start: 1.5rem;
  color: var(--kappa-danger-text, #b42318);
  font-size: 0.75rem;
}

.checkbox-demo__bordered {
  display: grid;
  width: min(100%, 24rem);
  gap: 0.5rem;
}

.checkbox-demo__item {
  inline-size: 100%;
  align-items: flex-start;
  gap: 0.625rem;
  border: 1px solid var(--docs-line);
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  transition:
    border-color 140ms ease,
    background-color 140ms ease;
}

.checkbox-demo__item:hover:not([data-disabled]) {
  border-color: var(--docs-subtle);
}

.checkbox-demo__item:has([data-slot="checkbox-control"][data-state="checked"]) {
  border-color: var(--kappa-accent, #4356e8);
  background: color-mix(in oklab, var(--kappa-accent, #4356e8) 5%, transparent);
}

.checkbox-demo__item:focus-within {
  border-color: var(--docs-brand);
}

.checkbox-demo__item-control {
  margin-block-start: 0.125rem;
}

.checkbox-demo__item-text {
  display: grid;
  gap: 0.125rem;
}

.checkbox-demo__item-title {
  font-size: 0.875rem;
  font-weight: 500;
}

.checkbox-demo__item-description {
  color: var(--docs-subtle);
  font-size: 0.75rem;
  font-weight: 400;
}
</style>
