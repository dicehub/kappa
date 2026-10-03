<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { FilterBar, type FilterBarSortDirection, type FilterBarView } from "@dicehub/kappa/components/filter-bar";
import { Item } from "@dicehub/kappa/components/item";

const props = withDefaults(defineProps<{ variant?: "complete" | "search" | "slots" | "disabled" | "uncontrolled" }>(), { variant: "complete" });
const query = ref(props.variant === "uncontrolled" ? "thermal" : "");
const sortBy = ref(props.variant === "uncontrolled" ? "name" : "updated");
const direction = ref<FilterBarSortDirection>(props.variant === "uncontrolled" ? "asc" : "desc");
const view = ref<FilterBarView>(props.variant === "uncontrolled" ? "grid" : "list");
const onlyMine = ref(false);
const sortOptions = [{ value: "updated", label: "Updated date" }, { value: "name", label: "Name" }];
const resources = ref([
  { name: "Turbine cooling study", detail: "Thermal analysis", updated: 4, mine: true },
  { name: "Mach 2 inlet", detail: "Aerodynamics", updated: 3, mine: false },
  { name: "Cryogenic transfer line", detail: "Two-phase flow", updated: 2, mine: true },
  { name: "Pump validation", detail: "Rotating machinery", updated: 1, mine: false },
]);
const visible = computed(() => resources.value.filter(resource =>
  `${resource.name} ${resource.detail}`.toLowerCase().includes(query.value.trim().toLowerCase()) && (!onlyMine.value || resource.mine),
).sort((first, second) => {
  const order = sortBy.value === "name" ? first.name.localeCompare(second.name) : first.updated - second.updated;
  return direction.value === "asc" ? order : -order;
}));
function addResource() {
  resources.value.push({ name: `Untitled project ${resources.value.length - 3}`, detail: "New project", updated: resources.value.length + 1, mine: true });
}
</script>

<template>
  <div class="filter-bar-demo" :data-filter-bar-demo="props.variant">
    <FilterBar
      v-if="props.variant === 'uncontrolled'"
      default-value="thermal"
      default-sort-by="name"
      default-sort-direction="asc"
      default-view="grid"
      :sort-options="sortOptions"
      show-view
      @update:model-value="query = $event"
      @update:sort-by="sortBy = $event"
      @update:sort-direction="direction = $event"
      @update:view="view = $event"
    />
    <FilterBar
      v-else
      v-model="query"
      v-model:sort-by="sortBy"
      v-model:sort-direction="direction"
      v-model:view="view"
      :sort-options="props.variant === 'search' ? [] : sortOptions"
      :show-view="props.variant !== 'search'"
      :disabled="props.variant === 'disabled'"
    >
      <template v-if="props.variant === 'slots'" #filters="{ disabled }">
        <Button size="sm" variant="outline" :disabled="disabled" :aria-pressed="onlyMine" @click="onlyMine = !onlyMine">My projects</Button>
      </template>
      <template v-if="props.variant === 'slots'" #actions="{ disabled }">
        <Button size="sm" variant="primary" :disabled="disabled" @click="addResource">New project</Button>
      </template>
    </FilterBar>
    <template v-if="props.variant !== 'disabled'">
      <p class="filter-bar-demo__count" role="status">{{ visible.length }} {{ visible.length === 1 ? 'resource' : 'resources' }}</p>
      <Item.Group v-if="visible.length" class="filter-bar-demo__results" :data-view="view">
        <Item.Root v-for="resource in visible" :key="resource.name" as="article" size="sm" class="filter-bar-demo__resource">
          <Item.Media variant="icon"><span aria-hidden="true">{{ resource.name.charAt(0) }}</span></Item.Media>
          <Item.Content><Item.Title>{{ resource.name }}</Item.Title><Item.Description>{{ resource.detail }}</Item.Description></Item.Content>
        </Item.Root>
      </Item.Group>
      <p v-else class="filter-bar-demo__empty">No matching resources. Change the search or filters.</p>
    </template>
  </div>
</template>

<style scoped>
.filter-bar-demo {
  box-sizing: border-box;
  inline-size: 100%;
  padding: 1.25rem;
  background: var(--kappa-tint, #f2f3f5);
}
.filter-bar-demo__count {
  margin: 1rem 0 0.5rem;
  color: var(--kappa-subtle);
  font-size: 0.75rem;
}
.filter-bar-demo__results {
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--kappa-line);
  border-radius: 0.25rem;
  background: var(--kappa-control);
}
.filter-bar-demo__resource { min-block-size: 4.25rem; border-radius: 0; }
.filter-bar-demo__resource + .filter-bar-demo__resource { border-block-start: 1px solid var(--kappa-line); }
.filter-bar-demo__results[data-view="grid"] { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr)); gap: 0.5rem; border: 0; background: transparent; }
.filter-bar-demo__results[data-view="grid"] .filter-bar-demo__resource { border: 1px solid var(--kappa-line); border-radius: 0.25rem; background: var(--kappa-control); }
.filter-bar-demo__empty { padding: 1.25rem 0; margin: 0; color: var(--kappa-subtle); font-size: 0.8125rem; }
@media (max-width: 480px) { .filter-bar-demo { padding: 0.75rem; } }
</style>
