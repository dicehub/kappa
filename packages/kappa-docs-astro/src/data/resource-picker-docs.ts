export const resourcePickerExamples = [
  { id: "single", title: "Choose an item", description: "Search item names and details. Confirm to apply the selection; Cancel keeps the previous item." },
  { id: "multiple", title: "Attach files", description: "Select files across searches. The selection count includes resources outside the current results." },
  { id: "states", title: "Loading, empty, and error", description: "The application supplies the data and loading state. Retry requests another load from the application." },
] as const;

export const resourcePickerCode = `<script setup>
import { ref } from "vue";
import { ResourcePicker, Button } from "@dicehub/kappa";

const selected = ref(["handbook"]);
const items = [
  { value: "handbook", label: "Team handbook", description: "Shared document", meta: "Updated today" },
  { value: "guidelines", label: "Brand guidelines", description: "Shared document", meta: "Updated yesterday" },
  { value: "archive", label: "Archived draft", disabled: true },
];
</script>

<template>
  <ResourcePicker v-model="selected" :items="items" title="Choose an item">
    <template #trigger><Button variant="secondary">Choose item</Button></template>
  </ResourcePicker>
</template>`;

export const resourcePickerMultipleCode = `<script setup>
import { ref } from "vue";
import { ResourcePicker } from "@dicehub/kappa";
const selected = ref(["report"]);
const files = [
  { value: "report", label: "report.pdf", meta: "1.2 MB" },
  { value: "notes", label: "notes.txt", meta: "840 KB" },
  { value: "archive", label: "archive.zip", meta: "24 MB" },
];
</script>

<template>
  <ResourcePicker
    v-model="selected"
    :items="files"
    title="Attach files"
    selection-mode="multiple"
    :labels="{ trigger: 'Choose files', confirm: 'Attach files' }"
  />
</template>`;

export const resourcePickerExternalCode = `<ResourcePicker
  v-model="selectedIds"
  v-model:open="pickerOpen"
  :items="results"
  :loading="pending"
  :error="errorMessage"
  filter-mode="external"
  title="Choose resources"
  @search-change="searchResources"
  @retry="reloadResources"
/>`;

export const resourcePickerProps = [
  ["items", "ResourcePickerItem[]", "required", "Available resources; each value must be unique."],
  ["modelValue / defaultValue", "string[]", "[]", "Committed IDs. Single selection also uses an array."],
  ["open / defaultOpen", "boolean", "false", "Controlled or initial dialog state."],
  ["title", "string", '"Choose a resource"', "Accessible dialog and list name."],
  ["description", "string", "—", "Optional supporting text in the dialog header."],
  ["selectionMode", '"single" | "multiple"', '"single"', "Select one resource or toggle several."],
  ["filterMode", '"local" | "external"', '"local"', "Local search includes label, description, meta, and keywords."],
  ["loading / error", "boolean / string", "false / —", "Replace results and disable confirmation."],
  ["allowEmpty", "boolean", "false", "Permit confirmation with no selected resources."],
  ["disabled", "boolean", "false", "Disable the trigger, selection, and confirmation."],
  ["labels", "Partial<ResourcePickerLabels>", "English labels", "Translate controls, states, and the selectionCount function."],
] as const;
