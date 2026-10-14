<script setup lang="ts">
import { ref } from "vue";
import { ResourcePicker, type ResourcePickerItem } from "@dicehub/kappa/blocks/resource-picker";
const parameters = new URL(location.href).searchParams;
const open = ref(false), rejectClose = ref(parameters.has("reject-close"));
const loading = ref(parameters.has("loading"));
const items = ref<ResourcePickerItem[]>(loading.value ? [] : [
  { value: "alpha", label: "Alpha", keywords: ["first"] },
  { value: "beta", label: "Beta" },
  { value: "disabled", label: "Disabled", disabled: true },
]);
const events = ref<string[]>([]);
function record(name: string, data?: unknown) { events.value.push(`${name}:${JSON.stringify(data)}`); }
function updateOpen(value: boolean) {
  record("open", value);
  if (value || !rejectClose.value) open.value = value;
}
function updateItems(mode: string) {
  if (mode === "disable") items.value = [{ value: "alpha", label: "Alpha", disabled: true }];
  else if (mode === "omit") items.value = [{ value: "beta", label: "Beta" }];
  else items.value = [{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta" }];
  loading.value = false;
}
</script>

<template>
  <main>
    <h1>Resource picker consumer</h1>
    <ResourcePicker :items="items" :open="open" :loading="loading" selection-mode="multiple"
      :filter-mode="parameters.has('external') ? 'external' : 'local'"
      :default-value="['alpha', 'disabled']" title="Pick resources"
      @update:open="updateOpen" @confirm="record('confirm', $event)" @cancel="record('cancel')"
      @update:model-value="record('value', $event)" @search-change="record('search', $event)">
      <template #selection="{ value }">
        <output aria-label="Draft selection">{{ JSON.stringify(value) }}</output>
        <button type="button" @click="updateItems('disable')">Disable selected resource</button>
        <button type="button" @click="updateItems('omit')">Show other results</button>
        <button type="button" @click="updateItems('restore')">Restore results</button>
        <button type="button" @click="rejectClose = false">Accept next close</button>
      </template>
    </ResourcePicker>
    <output aria-label="Public events">{{ events.join('\n') }}</output>
  </main>
</template>
