export const previewCode = `<script setup lang="ts">
import { ref } from "vue";
import { FilterBar, type FilterBarView, type FilterBarSortDirection } from "@dicehub/kappa/components/filter-bar";

const query = ref("");
const sortBy = ref("updated");
const direction = ref<FilterBarSortDirection>("desc");
const view = ref<FilterBarView>("list");
const sortOptions = [
  { value: "updated", label: "Updated date" },
  { value: "name", label: "Name" },
];
</script>

<template>
  <FilterBar
    v-model="query"
    v-model:sort-by="sortBy"
    v-model:sort-direction="direction"
    v-model:view="view"
    :sort-options="sortOptions"
    show-view
  />
  <!-- Filter and sort your data with these values, then render the results. -->
</template>`;

export const searchCode = `<FilterBar v-model="query" :labels="{ search: 'Search projects', searchPlaceholder: 'Find a project...' }" />`;

export const slotsCode = `<FilterBar v-model="query" :sort-options="sortOptions" show-view>
  <template #filters="{ disabled }">
    <Button size="sm" variant="outline" :disabled="disabled" :aria-pressed="onlyMine" @click="onlyMine = !onlyMine">
      My projects
    </Button>
  </template>
  <template #actions="{ disabled }">
    <Button size="sm" variant="primary" :disabled="disabled" @click="createProject">
      New project
    </Button>
  </template>
</FilterBar>`;

export const disabledCode = `<FilterBar :sort-options="sortOptions" show-view disabled />`;

export const uncontrolledCode = `<FilterBar
  default-value="thermal"
  default-sort-by="name"
  default-sort-direction="asc"
  default-view="grid"
  :sort-options="sortOptions"
  show-view
  @update:model-value="searchResources"
/>`;

export const filterBarProps = [
  ["modelValue / defaultValue", "string", '""', "Controlled search text / initial search text."],
  ["showSearch", "boolean", "true", "Show the search input."],
  ["sortOptions", "FilterBarSortOption[]", "[]", "Sort choices with value, label, and optional disabled state. An empty list hides sorting."],
  ["sortBy / defaultSortBy", "string", "First enabled option", "Controlled sort field / initial field."],
  ["sortDirection / defaultSortDirection", '"asc" | "desc"', '"desc"', "Controlled sort direction / initial direction."],
  ["showView", "boolean", "false", "Show the list/grid toggle."],
  ["view / defaultView", '"list" | "grid"', '"list"', "Controlled view / initial view."],
  ["disabled", "boolean", "false", "Disable built-in controls. Slot content receives this state."],
  ["labels", "Partial<FilterBarLabels>", "English labels", "Override root, search, searchPlaceholder, sort, ascending, descending, view, list, and grid labels."],
];

export const events = [
  ["update:modelValue", "string", "Search input changes, emitted immediately."],
  ["update:sortBy", "string", "An enabled sort option is selected."],
  ["update:sortDirection", '"asc" | "desc"', "The sort direction button is activated."],
  ["update:view", '"list" | "grid"', "The selected view changes."],
];
