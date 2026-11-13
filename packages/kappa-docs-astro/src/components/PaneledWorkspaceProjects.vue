<script setup lang="ts">
import { computed, ref } from "vue";
import { ChevronDown, Circle, CircleCheck, CircleDashed, Ellipsis, Search, Star } from "@lucide/vue";
import { Button, ToolbarButton } from "@dicehub/kappa/components/button";
import { DataGrid, type DataGridColumn, type DataGridSort } from "@dicehub/kappa/components/data-grid";
import { Dropdown, type DropdownProps } from "@dicehub/kappa/components/dropdown";
import { InputGroup } from "@dicehub/kappa/components/input-group";
import type { WorkspaceProject } from "./paneled-workspace-projects";

const props = defineProps<{
  projects: WorkspaceProject[];
  hrefForPage: (page: string) => string;
}>();
const emit = defineEmits<{ open: [page: string, event: MouseEvent] }>();
const query = ref("");
const status = ref("All");
const sorting = ref<DataGridSort[]>([{ id: "name", direction: "asc" }]);
const favoritesOnly = ref(false);
const favorites = ref(new Set(["WA-01"]));
const statuses = ["All", "In progress", "In review", "Planning"];
const columns: DataGridColumn<WorkspaceProject>[] = [
  { id: "name", header: "Project", accessorKey: "name", width: 280 },
  { id: "status", header: "Status", accessorKey: "status", width: 160 },
  { id: "discipline", header: "Discipline", accessorKey: "discipline", width: 240 },
  { id: "owner", header: "Lead", accessorKey: "owner", width: 160 },
  { id: "actions", header: "Actions", width: 64, sortable: false, searchable: false, hideable: false },
];
const rowToValue = (project: WorkspaceProject) => project.code;
const activateLink: NonNullable<DropdownProps["navigate"]> = ({ node }) => {
  queueMicrotask(() => node.click());
};
const visibleProjects = computed(() => {
  const search = query.value.trim().toLowerCase();
  return props.projects.filter(project =>
    (status.value === "All" || project.status === status.value) &&
    (!favoritesOnly.value || favorites.value.has(project.code)) &&
    `${project.name} ${project.code} ${project.discipline} ${project.description} ${project.owner}`.toLowerCase().includes(search),
  );
});
function toggleFavorite(code: string) {
  const next = new Set(favorites.value);
  if (next.has(code)) next.delete(code);
  else next.add(code);
  favorites.value = next;
}
function clearFilters() { query.value = ""; status.value = "All"; favoritesOnly.value = false; }
</script>

<template>
  <div class="paneled-project-pages paneled-project-list">
    <p class="paneled-project-pages__intro">Manage your CFD and aerospace projects.</p>
    <div class="paneled-project-list__filters">
      <InputGroup.Root class="paneled-project-list__search">
        <InputGroup.Addon><Search aria-hidden="true" /></InputGroup.Addon>
        <InputGroup.Input v-model="query" type="search" aria-label="Search projects" placeholder="Search by project name, code, discipline, or lead…" @keydown.esc="query = ''" />
      </InputGroup.Root>
      <Dropdown.Root :positioning="{ placement: 'bottom-end', strategy: 'fixed', gutter: 6, fitViewport: true, overflowPadding: 8 }">
        <Dropdown.Trigger as-child>
          <Button variant="outline" :aria-label="`Project status: ${status}`">
            {{ status === 'All' ? 'All statuses' : status }}<ChevronDown class="paneled-project-list__caret" aria-hidden="true" />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content show-arrow>
          <Dropdown.RadioGroup v-model="status">
            <Dropdown.Label>Project status</Dropdown.Label>
            <Dropdown.RadioItem v-for="value in statuses" :key="value" :value="value" close-on-select>{{ value === 'All' ? 'All statuses' : value }}</Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>
      <Button variant="outline" shape="square" :icon="Star" aria-label="Show favorite projects" :aria-pressed="favoritesOnly" class="paneled-project-list__favorites" @click="favoritesOnly = !favoritesOnly" />
    </div>
    <DataGrid v-model:sorting="sorting" :columns="columns" :rows="visibleProjects" :row-to-value="rowToValue" :row-height="48" :resizable="false" aria-label="All projects" class="paneled-project-list__grid">
      <template #cell-name="{ row }">
        <div class="paneled-project-list__name">
          <a :href="hrefForPage(row.code)" @click="emit('open', row.code, $event)">{{ row.name }}</a>
          <span v-if="favorites.has(row.code)" class="paneled-project-list__favorite" role="img" aria-label="Favorite"><Star aria-hidden="true" /></span>
        </div>
      </template>
      <template #cell-status="{ row }">
        <span class="paneled-project-list__status">
          <component :is="row.status === 'In review' ? CircleCheck : row.status === 'Planning' ? CircleDashed : Circle" aria-hidden="true" />
          {{ row.status }}
        </span>
      </template>
      <template #header-actions><span class="paneled-project-list__sr-only">Actions</span></template>
      <template #cell-actions="{ row }">
        <Dropdown.Root :navigate="activateLink" :positioning="{ placement: 'bottom-end', strategy: 'fixed', gutter: 6, fitViewport: true, overflowPadding: 8 }">
          <Dropdown.Trigger as-child>
            <ToolbarButton :icon="Ellipsis" :aria-label="`Actions for ${row.name}`" />
          </Dropdown.Trigger>
          <Dropdown.Content show-arrow>
            <Dropdown.LinkItem value="open" :href="hrefForPage(row.code)" @click="emit('open', row.code, $event)">Open project</Dropdown.LinkItem>
            <Dropdown.Item value="favorite" @select="toggleFavorite(row.code)">{{ favorites.has(row.code) ? 'Remove from favorites' : 'Add to favorites' }}</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </template>
      <template #empty>
        <div class="paneled-project-list__empty">
          <h3>No projects found</h3>
          <p>Change your search or clear the filters.</p>
          <Button variant="outline" size="sm" @click="clearFilters">Clear filters</Button>
        </div>
      </template>
    </DataGrid>
    <p class="paneled-project-list__count" role="status">{{ visibleProjects.length }} of {{ projects.length }} projects</p>
  </div>
</template>

<style src="./paneled-workspace-project-pages.css"></style>
<style src="./paneled-workspace-project-list.css"></style>
