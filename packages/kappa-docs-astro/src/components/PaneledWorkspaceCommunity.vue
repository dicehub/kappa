<script setup lang="ts">
import { computed } from "vue";
import { Table } from "@dicehub/kappa/components/table";
import { Tabs } from "@dicehub/kappa/components/tabs";
import PaneledWorkspacePublicGroups from "./PaneledWorkspacePublicGroups.vue";
import PaneledWorkspaceCommunityProjects from "./PaneledWorkspaceCommunityProjects.vue";
import type { WorkspaceProject } from "./paneled-workspace-projects";

const props = defineProps<{
  page: string;
  projects: WorkspaceProject[];
  hrefForPage: (page: string) => string;
}>();
const emit = defineEmits<{ open: [page: string, event: MouseEvent]; navigate: [page: string] }>();
// Local sample collections; these are not project visibility permissions.
const collections = [
  { value: "Community", label: "Community projects", description: "Explore studies shared by the dicehub community.", codes: ["HC-02", "DR-03", "WT-05", "WO-08", "PN-09", "AT-20"] },
  { value: "Public projects", label: "Public projects", description: "Browse public projects for CFD and aerospace analysis.", codes: ["WA-01", "HX-04", "BC-10", "RN-12", "CV-13", "AB-24"] },
];
const tabs = computed(() => collections.map(collection => ({
  ...collection,
  projects: props.projects.filter(project => collection.codes.includes(project.code)),
})));
</script>

<template>
  <div class="paneled-project-pages paneled-project-list paneled-workspace-community">
    <Tabs.Root :model-value="page" lazy-mount unmount-on-exit @update:model-value="emit('navigate', $event)">
      <Tabs.List class="paneled-workspace-community__sections" aria-label="Community sections">
        <Tabs.Trigger v-for="tab in tabs" :key="tab.value" :value="tab.value">{{ tab.label }}</Tabs.Trigger>
        <Tabs.Trigger value="Public groups">Public groups</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content v-for="tab in tabs" :key="tab.value" :value="tab.value">
        <PaneledWorkspaceCommunityProjects v-if="tab.value === 'Community'" :projects="tab.projects" :href-for-page="hrefForPage" @open="(page, event) => emit('open', page, event)" />
        <template v-else>
          <p class="paneled-project-pages__intro">{{ tab.description }}</p>
          <div class="paneled-project-list__table-scroll" tabindex="0" role="region" :aria-label="tab.label">
            <Table compact :aria-label="tab.label">
              <Table.Header>
                <Table.Row><Table.Head scope="col">Project</Table.Head><Table.Head scope="col">Discipline</Table.Head><Table.Head scope="col">Lead</Table.Head></Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row v-for="project in tab.projects" :key="project.code">
                  <Table.Cell>
                    <a :href="hrefForPage(project.code)" @click="emit('open', project.code, $event)">{{ project.name }}</a>
                    <p class="paneled-project-pages__catalog-description">{{ project.description }}</p>
                  </Table.Cell>
                  <Table.Cell>{{ project.discipline }}</Table.Cell>
                  <Table.Cell>{{ project.owner }}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </template>
      </Tabs.Content>
      <Tabs.Content value="Public groups">
        <PaneledWorkspacePublicGroups :projects="projects" :href-for-page="hrefForPage" @open="(page, event) => emit('open', page, event)" />
      </Tabs.Content>
    </Tabs.Root>
  </div>
</template>

<style src="./paneled-workspace-project-pages.css"></style>
<style src="./paneled-workspace-project-list.css"></style>
<style src="./paneled-workspace-community.css"></style>
