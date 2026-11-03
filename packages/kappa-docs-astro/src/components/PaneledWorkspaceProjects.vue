<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowDownAZ, ChevronDown } from "@lucide/vue";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { Input } from "@dicehub/kappa/components/input";
import { Table } from "@dicehub/kappa/components/table";
import { Tabs } from "@dicehub/kappa/components/tabs";
import type { WorkspaceProject } from "./paneled-workspace-projects";

const props = defineProps<{
  projects: WorkspaceProject[];
  hrefForPage: (page: string) => string;
}>();
const emit = defineEmits<{ open: [page: string, event: MouseEvent] }>();
const query = ref("");
const status = ref("All");
const sort = ref("ascending");
const statuses = ["All", "In progress", "In review", "Planning"];
const sortOptions = [
  { value: "ascending", label: "Name A–Z" },
  { value: "descending", label: "Name Z–A" },
];
const sortLabel = computed(() => sortOptions.find(option => option.value === sort.value)?.label);
const visibleProjects = computed(() => {
  const search = query.value.trim().toLowerCase();
  return props.projects.filter(project =>
    (status.value === "All" || project.status === status.value) &&
    `${project.name} ${project.code} ${project.discipline} ${project.description} ${project.owner}`.toLowerCase().includes(search),
  ).sort((left, right) => left.name.localeCompare(right.name, "en") * (sort.value === "descending" ? -1 : 1));
});
function clearFilters() { query.value = ""; status.value = "All"; }
</script>

<template>
  <div class="paneled-project-pages paneled-project-list">
    <p class="paneled-project-pages__intro">Browse {{ projects.length }} CFD and aerospace projects. Search by name, project code, discipline, or lead.</p>
    <Tabs.Root v-model="status" lazy-mount unmount-on-exit>
      <Tabs.List variant="line" size="sm" aria-label="Project status" class="paneled-project-list__tabs">
        <Tabs.Trigger v-for="value in statuses" :key="value" :value="value">{{ value }}</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <div class="paneled-project-list__filters">
        <Input v-model="query" type="search" size="sm" aria-label="Search projects" placeholder="Search projects…" @keydown.esc="query = ''" />
        <Dropdown.Root :positioning="{ placement: 'bottom-end', strategy: 'fixed', gutter: 6, fitViewport: true, overflowPadding: 8 }">
          <Dropdown.Trigger as-child>
            <Button variant="outline" size="sm" :icon="ArrowDownAZ" :aria-label="`Sort projects: ${sortLabel}`">
              {{ sortLabel }}<ChevronDown class="paneled-project-list__sort-caret" aria-hidden="true" />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Content show-arrow>
            <Dropdown.RadioGroup v-model="sort">
              <Dropdown.Label>Sort projects</Dropdown.Label>
              <Dropdown.RadioItem v-for="option in sortOptions" :key="option.value" :value="option.value">{{ option.label }}</Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
      <p class="paneled-project-list__count" role="status">{{ visibleProjects.length }} of {{ projects.length }} projects</p>
      <Tabs.Content v-for="value in statuses" :key="value" :value="value">
        <div v-if="visibleProjects.length" class="paneled-project-list__table-scroll" tabindex="0" role="region" aria-label="Project list">
          <Table compact aria-label="All projects">
            <Table.Header>
              <Table.Row><Table.Head scope="col">Project</Table.Head><Table.Head scope="col">Status</Table.Head><Table.Head scope="col">Lead</Table.Head></Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row v-for="project in visibleProjects" :key="project.code">
                <Table.Cell>
                  <a :href="hrefForPage(project.code)" @click="emit('open', project.code, $event)">{{ project.name }}</a>
                  <p class="paneled-project-pages__catalog-description">{{ project.code }} · {{ project.discipline }}</p>
                </Table.Cell>
                <Table.Cell><Badge :variant="project.status === 'In progress' ? 'info' : project.status === 'In review' ? 'warning' : 'outline'">{{ project.status }}</Badge></Table.Cell>
                <Table.Cell>{{ project.owner }}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <div v-else class="paneled-project-list__empty">
          <h3>No projects found</h3>
          <p>Change the search text or select another status.</p>
          <Button variant="outline" size="sm" @click="clearFilters">Clear filters</Button>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</template>

<style src="./paneled-workspace-project-pages.css"></style>
<style src="./paneled-workspace-project-list.css"></style>
