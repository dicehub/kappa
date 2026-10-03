export const barrelCode = `import { Editable } from "@dicehub/kappa";`;

export const granularCode = `import { Editable } from "@dicehub/kappa/components/editable";`;

export const previewCode = `<script setup lang="ts">
import { Editable } from "@dicehub/kappa/components/editable";
</script>

<template>
  <Editable.Root
    id="project-name-editor"
    default-value="Ocean current study"
    activation-mode="click"
  >
    <Editable.Label>Project name</Editable.Label>
    <Editable.Area>
      <Editable.Input aria-label="Project name" />
      <Editable.Preview />
    </Editable.Area>
    <Editable.Control>
      <Editable.EditTrigger aria-label="Edit">Edit</Editable.EditTrigger>
      <Editable.SubmitTrigger aria-label="Save">Save</Editable.SubmitTrigger>
      <Editable.CancelTrigger aria-label="Cancel">Cancel</Editable.CancelTrigger>
    </Editable.Control>
  </Editable.Root>
</template>`;

export const usageCode = `<script setup lang="ts">
import { Editable } from "@dicehub/kappa/components/editable";
</script>

<template>
  <Editable.Root
    id="section-name-editor"
    default-value="Boundary conditions"
    activation-mode="click"
  >
    <Editable.Label>Section name</Editable.Label>
    <Editable.Area>
      <Editable.Input aria-label="Section name" />
      <Editable.Preview />
    </Editable.Area>
  </Editable.Root>
</template>`;

export const controlsCode = `<script setup lang="ts">
import { Editable } from "@dicehub/kappa/components/editable";
</script>

<template>
  <Editable.Root
    id="task-name-editor"
    default-value="Mesh review"
    activation-mode="click"
    submit-mode="none"
  >
    <Editable.Label>Task name</Editable.Label>
    <Editable.Area>
      <Editable.Input aria-label="Task name" />
      <Editable.Preview />
    </Editable.Area>
    <Editable.Control>
      <Editable.EditTrigger aria-label="Edit">Edit</Editable.EditTrigger>
      <Editable.SubmitTrigger aria-label="Save">Save</Editable.SubmitTrigger>
      <Editable.CancelTrigger aria-label="Cancel">Cancel</Editable.CancelTrigger>
    </Editable.Control>
  </Editable.Root>
</template>`;

export const controlledCode = `<script setup lang="ts">
import { ref } from "vue";
import { Editable } from "@dicehub/kappa/components/editable";

const projectName = ref("Ocean current study");
const committedName = ref(projectName.value);
</script>

<template>
  <Editable.Root
    id="controlled-project-name-editor"
    v-model="projectName"
    activation-mode="click"
    @value-commit="committedName = $event.value"
  >
    <Editable.Label>Project name</Editable.Label>
    <Editable.Area>
      <Editable.Input aria-label="Project name" />
      <Editable.Preview />
    </Editable.Area>
  </Editable.Root>
  <output aria-live="polite">Saved value: {{ committedName }}</output>
</template>`;

export const statesCode = `<script setup lang="ts">
import { Editable } from "@dicehub/kappa/components/editable";
</script>

<template>
  <Editable.Root id="disabled-project-editor" default-value="Archived project" disabled>
    <Editable.Label>Disabled</Editable.Label>
    <Editable.Area><Editable.Input aria-label="Disabled" /><Editable.Preview /></Editable.Area>
  </Editable.Root>

  <Editable.Root id="readonly-run-editor" default-value="Run 4189" read-only>
    <Editable.Label>Read only</Editable.Label>
    <Editable.Area><Editable.Input aria-label="Read only" /><Editable.Preview /></Editable.Area>
  </Editable.Root>

  <Editable.Root
    id="invalid-project-editor"
    default-value="Untitled"
    invalid
    activation-mode="click"
  >
    <Editable.Label>Invalid</Editable.Label>
    <Editable.Area><Editable.Input aria-label="Invalid" /><Editable.Preview /></Editable.Area>
  </Editable.Root>
</template>`;

export const sizesCode = `<script setup lang="ts">
import { Editable, EDITABLE_SIZES } from "@dicehub/kappa/components/editable";
</script>

<template>
  <Editable.Root
    v-for="size in EDITABLE_SIZES"
    :id="\`size-\${size}-editor\`"
    :key="size"
    :size="size"
    default-value="Surface refinement"
    activation-mode="click"
  >
    <Editable.Label>{{ size }}</Editable.Label>
    <Editable.Area>
      <Editable.Input :aria-label="\`\${size} editable field\`" />
      <Editable.Preview />
    </Editable.Area>
  </Editable.Root>
</template>`;

export const textareaCode = `<script setup lang="ts">
import { Editable } from "@dicehub/kappa/components/editable";
</script>

<template>
  <Editable.Root
    id="review-note-editor"
    default-value="Review the inlet values before the next solver run."
    activation-mode="click"
    submit-mode="none"
  >
    <Editable.Label>Review note</Editable.Label>
    <Editable.Area>
      <Editable.Input as-child aria-label="Review note">
        <textarea rows="3" />
      </Editable.Input>
      <Editable.Preview />
    </Editable.Area>
    <Editable.Control>
      <Editable.EditTrigger aria-label="Edit">Edit</Editable.EditTrigger>
      <Editable.SubmitTrigger aria-label="Save">Save</Editable.SubmitTrigger>
      <Editable.CancelTrigger aria-label="Cancel">Cancel</Editable.CancelTrigger>
    </Editable.Control>
  </Editable.Root>
</template>`;

export const compositionCode = `<Editable.Root default-value="Project Delta">
  <Editable.Label>Project name</Editable.Label>
  <Editable.Area>
    <Editable.Input aria-label="Project name" />
    <Editable.Preview />
  </Editable.Area>
  <Editable.Control>
    <Editable.EditTrigger aria-label="Edit">Edit</Editable.EditTrigger>
    <Editable.SubmitTrigger aria-label="Save">Save</Editable.SubmitTrigger>
    <Editable.CancelTrigger aria-label="Cancel">Cancel</Editable.CancelTrigger>
  </Editable.Control>
</Editable.Root>`;

export const rootProps = [
  { name: "modelValue", type: "string", defaultValue: "—", description: "Controlled text value. Use v-model for two-way binding." },
  { name: "defaultValue", type: "string", defaultValue: '""', description: "Initial text value for uncontrolled use." },
  { name: "edit", type: "boolean", defaultValue: "false", description: "Controlled edit mode. Use v-model:edit for two-way binding." },
  { name: "defaultEdit", type: "boolean", defaultValue: "false", description: "Starts an uncontrolled instance in edit mode." },
  { name: "activationMode", type: '"focus" | "click" | "dblclick" | "none"', defaultValue: '"focus"', description: "Interaction that enters edit mode." },
  { name: "submitMode", type: '"enter" | "blur" | "both" | "none"', defaultValue: '"both"', description: "Interaction that commits a value." },
  { name: "autoResize", type: "boolean", defaultValue: "false", description: "Sizes the input from its content." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents editing and focus interaction." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Keeps the value focusable without allowing edits." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks the current value as invalid." },
  { name: "required", type: "boolean", defaultValue: "false", description: "Marks the underlying form input as required." },
  { name: "maxLength", type: "number", defaultValue: "—", description: "Limits the editable value length." },
  { name: "name", type: "string", defaultValue: "—", description: "Name used for form submission." },
  { name: "placeholder", type: "string | { edit; preview }", defaultValue: "—", description: "Placeholder for empty preview and input states." },
  { name: "selectOnFocus", type: "boolean", defaultValue: "true", description: "Selects input text when edit mode starts." },
  { name: "size", type: '"xs" | "sm" | "default" | "lg"', defaultValue: '"default"', description: "Field height at a 16px root font size: xs 20px, sm 28px, default 36px, lg 40px. Available on Root and RootProvider." },
] as const;

export const parts = [
  { name: "Editable.Root", element: "div", description: "Owns inline-edit state and form integration." },
  { name: "Editable.Label", element: "label", description: "Labels the editable input." },
  { name: "Editable.Area", element: "div", description: "Aligns the preview and input in one stable area." },
  { name: "Editable.Preview", element: "span", description: "Shows the committed value outside edit mode." },
  { name: "Editable.Input", element: "input", description: "Edits the current value. Use as-child for a textarea." },
  { name: "Editable.Control", element: "div", description: "Groups edit, submit, and cancel actions." },
  { name: "Editable.EditTrigger", element: "button", description: "Enters edit mode." },
  { name: "Editable.SubmitTrigger", element: "button", description: "Commits the current value." },
  { name: "Editable.CancelTrigger", element: "button", description: "Restores the value present when editing started." },
  { name: "Editable.Context", element: "renderless", description: "Exposes the reactive Ark UI API to a slot." },
  { name: "Editable.RootProvider", element: "div", description: "Provides an external useEditable state machine." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string", description: "Emitted as the input value changes." },
  { name: "update:edit", payload: "boolean", description: "Emitted when edit mode changes." },
  { name: "valueChange", payload: "EditableValueChangeDetails", description: "Reports each value change." },
  { name: "valueCommit", payload: "EditableValueChangeDetails", description: "Reports a committed value." },
  { name: "valueRevert", payload: "EditableValueChangeDetails", description: "Reports a canceled edit." },
  { name: "editChange", payload: "EditableEditChangeDetails", description: "Reports edit-mode transitions." },
] as const;

export const exportsList = [
  { name: "Editable", description: "Compound component and root alias." },
  { name: "EditableRoot and named parts", description: "Unaugmented component exports." },
  { name: "useEditable", description: "Creates an external Ark UI state machine." },
  { name: "useEditableContext", description: "Reads the nearest Editable context." },
  { name: "EditableProps and part types", description: "Public TypeScript contracts." },
] as const;
