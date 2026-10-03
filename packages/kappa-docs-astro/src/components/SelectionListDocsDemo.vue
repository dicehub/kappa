<script setup lang="ts">
import { computed, ref } from "vue";
import {
  SelectionList,
  createSelectionListCollection,
} from "@dicehub/kappa/components/selection-list";
import SelectionListOption, { type SelectionListDemoItem } from "./SelectionListOption.vue";

type DemoVariant = "preview" | "usage" | "multiple" | "filter" | "groups" | "sizes";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const computeProfiles: SelectionListDemoItem[] = [
  { value: "balanced", label: "Balanced", description: "General simulation work with predictable queue times.", meta: "8 CPU · 32 GB", icon: "compute" },
  { value: "fast", label: "Fast turnaround", description: "More parallel workers for short solver runs.", meta: "32 CPU · 64 GB", icon: "compute" },
  { value: "memory", label: "High memory", description: "Large meshes and memory-bound post-processing.", meta: "16 CPU · 256 GB", icon: "compute" },
];

const resultFields: SelectionListDemoItem[] = [
  { value: "pressure", label: "Pressure", description: "Static pressure field", meta: "p", icon: "surface" },
  { value: "velocity", label: "Velocity", description: "Velocity vector field", meta: "U", icon: "surface" },
  { value: "temperature", label: "Temperature", description: "Fluid temperature field", meta: "T", icon: "surface" },
  { value: "turbulence", label: "Turbulence", description: "Turbulent kinetic energy", meta: "k", icon: "surface" },
];

const fileItems: SelectionListDemoItem[] = [
  { value: "control-dict", label: "controlDict", description: "Time controls and write interval", meta: "system", icon: "file", group: "Case configuration" },
  { value: "fv-schemes", label: "fvSchemes", description: "Discretization schemes", meta: "system", icon: "file", group: "Case configuration" },
  { value: "fv-solution", label: "fvSolution", description: "Solver controls and tolerances", meta: "system", icon: "file", group: "Case configuration" },
  { value: "transport", label: "physicalProperties", description: "Material and transport properties", meta: "constant", icon: "file", group: "Physical model" },
  { value: "turbulence-properties", label: "momentumTransport", description: "Turbulence model settings", meta: "constant", icon: "file", group: "Physical model" },
  { value: "mesh", label: "polyMesh", description: "Generated volume mesh", meta: "constant", icon: "mesh", group: "Mesh" },
];

const disabledItems: SelectionListDemoItem[] = [
  { value: "local", label: "Local runner", description: "Run on this workstation.", meta: "Ready", icon: "compute", group: "Available" },
  { value: "cluster", label: "Shared cluster", description: "Submit to the engineering queue.", meta: "Ready", icon: "compute", group: "Available" },
  { value: "gpu", label: "GPU runner", description: "Requires a GPU project quota.", meta: "Unavailable", icon: "compute", group: "Restricted", disabled: true },
];

const collectionFrom = (items: SelectionListDemoItem[], groupBy = false) =>
  createSelectionListCollection({
    items,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
    isItemDisabled: (item) => Boolean(item.disabled),
    ...(groupBy ? { groupBy: (item: SelectionListDemoItem) => item.group ?? "Other" } : {}),
  });

const profileCollection = collectionFrom(computeProfiles);
const fieldCollection = collectionFrom(resultFields);
const fileCollection = collectionFrom(fileItems);
const groupedCollection = collectionFrom(disabledItems, true);
const selectedProfile = ref(["balanced"]);
const selectedFields = ref(["pressure", "velocity"]);
const filterQuery = ref("");
const filteredFileCollection = computed(() => {
  const query = filterQuery.value.trim().toLocaleLowerCase();
  return query
    ? fileCollection.filter((text, _index, item) =>
        `${text} ${item.description ?? ""} ${item.meta ?? ""}`.toLocaleLowerCase().includes(query),
      )
    : fileCollection;
});

const onFilterInput = (event: Event) => {
  filterQuery.value = (event.target as HTMLInputElement).value;
};
</script>

<template>
  <div class="selection-list-demo" :data-selection-list-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="selection-list-demo__stack">
      <SelectionList.Root v-model="selectedProfile" :collection="profileCollection">
        <SelectionList.Label>Compute profile</SelectionList.Label>
        <SelectionList.Content>
          <SelectionListOption v-for="item in profileCollection.items" :key="item.value" :item="item" />
        </SelectionList.Content>
      </SelectionList.Root>
      <output class="selection-list-demo__status" role="status">
        Selected: {{ profileCollection.stringifyMany(selectedProfile) }}
      </output>
    </div>

    <SelectionList.Root
      v-else-if="props.variant === 'usage'"
      :collection="profileCollection"
      :default-value="['balanced']"
    >
      <SelectionList.Label>Compute profile</SelectionList.Label>
      <SelectionList.Content>
        <SelectionListOption v-for="item in profileCollection.items" :key="item.value" :item="item" />
      </SelectionList.Content>
    </SelectionList.Root>

    <div v-else-if="props.variant === 'multiple'" class="selection-list-demo__stack">
      <SelectionList.Root v-model="selectedFields" :collection="fieldCollection" selection-mode="multiple">
        <SelectionList.Label>Result fields</SelectionList.Label>
        <SelectionList.Content>
          <SelectionListOption v-for="item in fieldCollection.items" :key="item.value" :item="item" />
        </SelectionList.Content>
      </SelectionList.Root>
      <output class="selection-list-demo__status" role="status">
        {{ selectedFields.length }} fields selected
      </output>
    </div>

    <SelectionList.Root v-else-if="props.variant === 'filter'" :collection="filteredFileCollection">
      <SelectionList.Label>Case file</SelectionList.Label>
      <SelectionList.Input
        :value="filterQuery"
        aria-label="Filter case files"
        auto-highlight
        keyboard-priority="navigate"
        placeholder="Filter files…"
        @input="onFilterInput"
      />
      <SelectionList.Content>
        <SelectionList.Empty>No matching files</SelectionList.Empty>
        <SelectionListOption v-for="item in filteredFileCollection.items" :key="item.value" :item="item" />
      </SelectionList.Content>
    </SelectionList.Root>

    <SelectionList.Root
      v-else-if="props.variant === 'groups'"
      :collection="groupedCollection"
      :default-value="['local']"
    >
      <SelectionList.Label>Execution target</SelectionList.Label>
      <SelectionList.Content>
        <SelectionList.ItemGroup
          v-for="([group, items], index) in groupedCollection.group()"
          :id="`selection-list-group-${index}`"
          :key="group"
        >
          <SelectionList.ItemGroupLabel>{{ group }}</SelectionList.ItemGroupLabel>
          <SelectionListOption v-for="item in items" :key="item.value" :item="item" />
        </SelectionList.ItemGroup>
      </SelectionList.Content>
    </SelectionList.Root>

    <div v-else class="selection-list-demo__sizes">
      <SelectionList.Root
        v-for="size in (['base', 'sm'] as const)"
        :key="size"
        :aria-label="`${size} selection list`"
        :collection="profileCollection"
        :default-value="['balanced']"
        :size="size"
      >
        <SelectionList.ValueText :placeholder="`${size} density`" />
        <SelectionList.Content>
          <SelectionListOption v-for="item in profileCollection.items" :key="item.value" :item="item" />
        </SelectionList.Content>
      </SelectionList.Root>
    </div>
  </div>
</template>

<style scoped>
.selection-list-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.selection-list-demo > :deep(.kappa-selection-list),
.selection-list-demo__stack {
  inline-size: min(100%, 34rem);
}

.selection-list-demo__stack {
  display: grid;
  gap: 0.625rem;
}

.selection-list-demo__status {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1rem;
}

.selection-list-demo__sizes {
  display: grid;
  inline-size: min(100%, 48rem);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 44rem) {
  .selection-list-demo__sizes {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
