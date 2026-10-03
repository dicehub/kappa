export const barrelCode = `import {
  Checkbox,
  CheckboxRoot,
  CheckboxRootProvider,
  CheckboxGroup,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxContext,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Checkbox,
  CheckboxRoot,
  CheckboxRootProvider,
  CheckboxGroup,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxContext,
} from "@dicehub/kappa/components/checkbox";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Checkbox } from "@dicehub/kappa/components/checkbox";

const verifyMesh = ref(true);
</script>

<template>
  <Checkbox.Root v-model:checked="verifyMesh" name="verify-mesh">
    <Checkbox.Control />
    <Checkbox.Label>Verify mesh quality before solving</Checkbox.Label>
  </Checkbox.Root>
</template>`;

export const usageCode = `<script setup>
import { Checkbox } from "@dicehub/kappa/components/checkbox";
</script>

<template>
  <Checkbox.Root default-checked name="residual-export" value="residuals">
    <Checkbox.Control />
    <Checkbox.Label>Export residuals after each write interval</Checkbox.Label>
  </Checkbox.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  CheckboxRoot,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
} from "@dicehub/kappa/components/checkbox";
</script>

<template>
  <CheckboxRoot>
    <CheckboxControl>
      <CheckboxIndicator>
        <CustomCheckIcon />
      </CheckboxIndicator>
      <CheckboxIndicator indeterminate>
        <CustomMinusIcon />
      </CheckboxIndicator>
    </CheckboxControl>
    <CheckboxLabel>Custom indicator marks</CheckboxLabel>
  </CheckboxRoot>
</template>`;

export const basicCode = `<script setup>
import { Checkbox } from "@dicehub/kappa/components/checkbox";
</script>

<template>
  <Checkbox.Root>
    <Checkbox.Control />
    <Checkbox.Label>Enable adaptive time step</Checkbox.Label>
  </Checkbox.Root>
</template>`;

export const indeterminateCode = `<script setup>
import { computed, ref } from "vue";
import { Checkbox } from "@dicehub/kappa/components/checkbox";

const fieldOptions = [
  { value: "residuals", label: "Residuals" },
  { value: "forces", label: "Force coefficients" },
  { value: "spectra", label: "Pressure spectra" },
];

const selectedFields = ref(["residuals", "forces"]);
const allFieldsState = computed(() => {
  if (selectedFields.value.length === 0) return false;
  return selectedFields.value.length === fieldOptions.length ? true : "indeterminate";
});
const toggleAllFields = () => {
  selectedFields.value =
    selectedFields.value.length === fieldOptions.length
      ? []
      : fieldOptions.map((option) => option.value);
};
</script>

<template>
  <Checkbox.Root :checked="allFieldsState" @checked-change="toggleAllFields">
    <Checkbox.Control />
    <Checkbox.Label>Monitor all fields</Checkbox.Label>
  </Checkbox.Root>
  <Checkbox.Group v-model="selectedFields" name="monitored-fields">
    <Checkbox.Root v-for="option in fieldOptions" :key="option.value" :value="option.value">
      <Checkbox.Control />
      <Checkbox.Label>{{ option.label }}</Checkbox.Label>
    </Checkbox.Root>
  </Checkbox.Group>
</template>`;

export const groupCode = `<script setup>
import { ref } from "vue";
import { Checkbox } from "@dicehub/kappa/components/checkbox";

const exportSelection = ref(["vtk"]);
</script>

<template>
  <span id="export-group-label">Export formats</span>
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
</template>`;

export const borderedCode = `<script setup>
import { ref } from "vue";
import { Checkbox } from "@dicehub/kappa/components/checkbox";

const meshChecks = ref(true);
const residualHistory = ref(false);
</script>

<template>
  <Checkbox.Root v-model:checked="meshChecks" class="settings-row" name="mesh-checks">
    <Checkbox.Control />
    <Checkbox.Label class="settings-row__text">
      <span class="settings-row__title">Run pre-solver mesh checks</span>
      <span class="settings-row__description">Blocks the run while quality metrics fail.</span>
    </Checkbox.Label>
  </Checkbox.Root>
  <Checkbox.Root v-model:checked="residualHistory" class="settings-row" name="residual-history">
    <Checkbox.Control />
    <Checkbox.Label class="settings-row__text">
      <span class="settings-row__title">Write residual history</span>
      <span class="settings-row__description">Appends normalized residuals at every iteration.</span>
    </Checkbox.Label>
  </Checkbox.Root>
</template>

<style scoped>
/* The root renders a label, so the whole bordered row toggles the checkbox. */
.settings-row {
  width: 100%;
  align-items: flex-start;
  gap: 0.625rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
}

.settings-row:has([data-state="checked"]) {
  border-color: var(--kappa-accent, #4356e8);
}

.settings-row__text {
  display: grid;
  gap: 0.125rem;
}

.settings-row__description {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
}
</style>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Checkbox } from "@dicehub/kappa/components/checkbox";

const meshChecked = ref(true);
</script>

<template>
  <Checkbox.Root :checked="meshChecked" @update:checked="meshChecked = $event">
    <Checkbox.Control />
    <Checkbox.Label>Run orthogonal quality check</Checkbox.Label>
  </Checkbox.Root>
  <p>State: {{ meshChecked }}</p>
</template>`;

export const statesCode = `<script setup>
import { Checkbox } from "@dicehub/kappa/components/checkbox";
</script>

<template>
  <Checkbox.Root disabled>
    <Checkbox.Control />
    <Checkbox.Label>Disabled while meshing</Checkbox.Label>
  </Checkbox.Root>
  <Checkbox.Root read-only default-checked>
    <Checkbox.Control />
    <Checkbox.Label>Read-only license option</Checkbox.Label>
  </Checkbox.Root>
  <Checkbox.Root invalid aria-describedby="terms-error">
    <Checkbox.Control />
    <Checkbox.Label>Accept the compute policy</Checkbox.Label>
  </Checkbox.Root>
  <p id="terms-error">Acceptance is required to submit the job.</p>
</template>`;

export const rootProps = [
  { name: "checked", type: "CheckboxCheckedState", defaultValue: "-", description: "Controlled checked state; supports v-model:checked." },
  { name: "defaultChecked", type: "CheckboxCheckedState", defaultValue: "false", description: "Initial state for uncontrolled use; accepts true, false, or \"indeterminate\"." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Blocks interaction and form submission." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Keeps focus and selection but blocks changes." },
  { name: "required", type: "boolean", defaultValue: "false", description: "Marks the input required for native form validation." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Applies the invalid data attribute and danger styling." },
  { name: "name", type: "string", defaultValue: "-", description: "Form field name submitted by the hidden input." },
  { name: "value", type: "string", defaultValue: '"on"', description: "Submitted value, and the item key inside Checkbox.Group." },
  { name: "form", type: "string", defaultValue: "-", description: "Associates the hidden input with an external form id." },
  { name: "id", type: "string", defaultValue: "generated", description: "Stable identifier for the checkbox state machine." },
  { name: "ids", type: "CheckboxRootProps['ids']", defaultValue: "generated", description: "Overrides generated root, control, label, and hidden input IDs." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into the single child element." },
] as const;

export const groupProps = [
  { name: "modelValue", type: "string[]", defaultValue: "-", description: "Controlled list of checked item values; supports v-model." },
  { name: "defaultValue", type: "string[]", defaultValue: "[]", description: "Initially checked item values for uncontrolled use." },
  { name: "name", type: "string", defaultValue: "-", description: "Shared form field name for every item in the group." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables every checkbox in the group." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Blocks changes on every checkbox in the group." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks every checkbox in the group invalid." },
  { name: "maxSelectedValues", type: "number", defaultValue: "-", description: "Disables unchecked items once this many values are checked." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges group behavior into the single child element." },
] as const;

export const parts = [
  { name: "Control", element: "span", description: "Visual box; renders the default check and indeterminate marks unless its slot is overridden." },
  { name: "Indicator", element: "div", description: "State mark wrapper; shown when checked, or when indeterminate with its indeterminate prop." },
  { name: "Label", element: "span", description: "Accessible label text; clicking it toggles the checkbox." },
  { name: "Context", element: "renderless", description: "Exposes the root checkbox API to its slot." },
  { name: "RootProvider", element: "label", description: "Root variant driven by an external useCheckbox machine." },
] as const;

export const events = [
  { name: "update:checked", payload: "CheckboxCheckedState", description: "Emitted on every state change; drives v-model:checked." },
  { name: "checkedChange", payload: "{ checked: CheckboxCheckedState }", description: "Ark UI detail emitted after the state changes." },
  { name: "update:modelValue", payload: "string[]", description: "Group event that drives v-model on Checkbox.Group." },
  { name: "valueChange", payload: "string[]", description: "Group event emitted after an item checks or unchecks." },
] as const;

export const exportsList = [
  { name: "Checkbox", description: "Compound API exposing Root, RootProvider, Group, Control, Indicator, Label, and Context." },
  { name: "CheckboxRoot", description: "Unaugmented root component with automatic hidden input." },
  { name: "CheckboxRootProvider", description: "Root driven by an external useCheckbox machine." },
  { name: "CheckboxGroup", description: "Shared name, state, and max-selection boundary for related checkboxes." },
  { name: "CheckboxControl", description: "Visual control with default state marks." },
  { name: "CheckboxIndicator", description: "Customizable state mark." },
  { name: "CheckboxLabel", description: "Accessible checkbox label." },
  { name: "CheckboxContext", description: "Renderless context consumer." },
  { name: "CheckboxProps", description: "Public root props and Ark UI state contract." },
  { name: "CheckboxEmits", description: "Root event contract." },
  { name: "CheckboxGroupProps", description: "Public group props." },
  { name: "CheckboxGroupEmits", description: "Group event contract." },
  { name: "CheckboxCheckedState", description: "boolean | \"indeterminate\" state union." },
  { name: "CheckboxCheckedChangeDetails", description: "Payload for checkedChange." },
  { name: "useCheckbox", description: "Ark UI machine hook for external state control." },
  { name: "useCheckboxGroup", description: "Ark UI group machine hook." },
  { name: "checkboxAnatomy", description: "Ark UI part anatomy metadata." },
] as const;
