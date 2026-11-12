<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Dialog } from "@dicehub/kappa/components/dialog";
import { Table } from "@dicehub/kappa/components/table";
import type { WorkspaceProject } from "./paneled-workspace-projects";

const props = defineProps<{ projects: WorkspaceProject[]; hrefForPage: (page: string) => string }>();
const emit = defineEmits<{ open: [page: string, event: MouseEvent] }>();
// Synthetic public groups for this local preview.
const groups = computed(() => [
  { name: "Open Aerodynamics", description: "Shared reference studies for wings, drones, and wind turbines.", members: 28, codes: ["WA-01", "DR-03", "WT-05"] },
  { name: "Thermal Engineering", description: "Cooling systems, heat exchangers, and thermal management.", members: 16, codes: ["HX-04", "BC-10", "AB-24"] },
  { name: "Rotorcraft Research", description: "Rotor performance, aeroacoustics, and wake interactions.", members: 12, codes: ["HC-02", "PN-09", "AT-20"] },
  { name: "Open Flow Lab", description: "Reproducible internal-flow and ventilation examples.", members: 21, codes: ["CD-06", "RN-12", "CV-13"] },
].map(group => ({ ...group, projects: props.projects.filter(project => group.codes.includes(project.code)) })));
</script>

<template>
  <p class="paneled-project-pages__intro">Find groups that share CFD projects and engineering knowledge.</p>
  <div class="paneled-project-list__table-scroll" tabindex="0" role="region" aria-label="Public groups">
    <Table compact aria-label="Public groups">
      <Table.Header>
        <Table.Row><Table.Head scope="col">Group</Table.Head><Table.Head scope="col">Projects</Table.Head><Table.Head scope="col">Members</Table.Head></Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row v-for="group in groups" :key="group.name">
          <Table.Cell>
            <Dialog.Root lazy-mount unmount-on-exit>
              <Dialog.Trigger as-child><Button variant="link" size="sm">{{ group.name }}</Button></Dialog.Trigger>
              <Dialog.Content size="sm">
                <Dialog.Header><Dialog.Title>{{ group.name }}</Dialog.Title><Dialog.Description>{{ group.description }}</Dialog.Description></Dialog.Header>
                <div class="paneled-project-pages">
                  <p>{{ group.members }} members · {{ group.projects.length }} public projects</p>
                  <ul>
                    <li v-for="project in group.projects" :key="project.code">
                      <a :href="hrefForPage(project.code)" @click="emit('open', project.code, $event)">{{ project.name }}</a>
                    </li>
                  </ul>
                </div>
                <Dialog.Footer><Dialog.Close as-child><Button variant="outline" size="sm">Close</Button></Dialog.Close></Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
            <p class="paneled-project-pages__catalog-description">{{ group.description }}</p>
          </Table.Cell>
          <Table.Cell>{{ group.projects.length }}</Table.Cell>
          <Table.Cell>{{ group.members }}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </div>
</template>
