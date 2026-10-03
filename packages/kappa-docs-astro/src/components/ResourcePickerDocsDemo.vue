<script setup lang="ts">
import { computed, ref } from "vue";
import { ResourcePicker, type ResourcePickerItem } from "@dicehub/kappa/blocks/resource-picker";
import { Button } from "@dicehub/kappa/components/button";

const props = withDefaults(defineProps<{ variant?: "single" | "multiple" | "states" }>(), { variant: "single" });
const resources: ResourcePickerItem[] = [
  { value: "handbook", label: "Team handbook", description: "Shared document", meta: "Updated today" },
  { value: "guidelines", label: "Brand guidelines", description: "Shared document", meta: "Updated yesterday" },
  { value: "notes", label: "Research notes", description: "Private document", meta: "Updated Monday" },
  { value: "archive", label: "Archived draft", description: "This item is read-only.", meta: "Unavailable", disabled: true },
];
const files: ResourcePickerItem[] = [
  { value: "report", label: "report.pdf", description: "PDF document", meta: "1.2 MB" },
  { value: "notes", label: "notes.txt", description: "Text document", meta: "840 KB" },
  { value: "diagram", label: "diagram.svg", description: "Vector image", meta: "3.6 MB" },
  { value: "archive", label: "archive.zip", description: "Compressed archive", meta: "24 MB" },
];
const selected = ref(props.variant === "multiple" ? ["report"] : ["handbook"]);
const stateItems = ref<ResourcePickerItem[]>([]);
const hasRetried = ref(false);
const items = computed(() => props.variant === "multiple" ? files : resources);
const selection = computed(() => items.value.filter(item => selected.value.includes(item.value)).map(item => item.label).join(", ") || "None");

function retry() {
  hasRetried.value = true;
  stateItems.value = resources;
}
</script>

<template>
  <div class="resource-picker-demo" :data-resource-picker-demo="props.variant">
    <template v-if="props.variant !== 'states'">
      <div class="resource-picker-demo__field">
        <span class="resource-picker-demo__label">{{ props.variant === 'multiple' ? 'Selected files' : 'Selected item' }}</span>
        <output role="status">{{ selection }}</output>
      </div>
      <ResourcePicker
        v-model="selected"
        :items="items"
        :title="props.variant === 'multiple' ? 'Attach files' : 'Choose an item'"
        :description="props.variant === 'multiple' ? 'Select one or more files to attach.' : 'Select an item from the available resources.'"
        :selection-mode="props.variant === 'multiple' ? 'multiple' : 'single'"
        :labels="{ confirm: props.variant === 'multiple' ? 'Attach files' : 'Select item' }"
      >
        <template #trigger><Button variant="secondary">{{ props.variant === 'multiple' ? 'Choose files' : 'Choose item' }}</Button></template>
        <template #media>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path v-if="props.variant === 'multiple'" d="M7 3h7l4 4v14H7zM14 3v5h4" /><path v-else d="M3 6h7l2 2h9v12H3z" /></svg>
        </template>
      </ResourcePicker>
    </template>
    <template v-else>
      <div class="resource-picker-demo__buttons">
        <ResourcePicker
          v-for="state in (['loading', 'empty', 'error'] as const)"
          :key="state"
          :items="state === 'error' ? stateItems : []"
          title="Available items"
          :loading="state === 'loading'"
          :error="state === 'error' && !hasRetried ? 'Items could not be loaded. Please try again.' : undefined"
          @retry="retry"
        >
          <template #trigger><Button size="sm" variant="secondary">{{ state === 'loading' ? 'Loading' : state === 'empty' ? 'Empty' : 'Error and retry' }}</Button></template>
        </ResourcePicker>
      </div>
    </template>
  </div>
</template>

<style scoped>
.resource-picker-demo { display: flex; inline-size: min(100%, 34rem); align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; color: var(--kappa-default); font-family: var(--kappa-font-sans); }
.resource-picker-demo__field { display: grid; min-inline-size: 0; gap: 0.375rem; }
.resource-picker-demo__label { color: var(--kappa-subtle); font-size: 0.75rem; }
.resource-picker-demo output { font-size: 0.875rem; overflow-wrap: anywhere; }
.resource-picker-demo__buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; }
</style>
