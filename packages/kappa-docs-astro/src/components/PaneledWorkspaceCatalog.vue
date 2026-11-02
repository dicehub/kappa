<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowUpRight } from "@lucide/vue";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Table } from "@dicehub/kappa/components/table";
import { Tabs } from "@dicehub/kappa/components/tabs";

const props = defineProps<{ page: string }>();
const emit = defineEmits<{ navigate: [page: string] }>();
const filter = ref("All");
const filters = ["All", "Ready", "In review"];
const catalogs: Record<string, { name: string; description: string; status: string; page: string }[]> = {
  Applications: [
    { name: "Aerodynamics", description: "Flow analysis and rotor performance.", status: "Ready", page: "Simulation runs" },
    { name: "Airframe design", description: "Aircraft geometry and configuration reviews.", status: "Ready", page: "Airframe" },
    { name: "Flight test planner", description: "Test cards, campaign dates, and readiness reviews.", status: "In review", page: "Flight test plan" },
  ],
};
const entries = computed(() => catalogs[props.page] ?? []);
</script>

<template>
  <p class="paneled-project-pages__intro">{{ props.page === 'Applications' ? 'Open an engineering application in this project.' : 'Browse reusable starting points for aerospace projects.' }}</p>
  <Tabs.Root v-model="filter" lazy-mount unmount-on-exit>
    <Tabs.List variant="line" size="sm" :aria-label="`${props.page} status`">
      <Tabs.Trigger v-for="value in filters" :key="value" :value="value">{{ value }}</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content v-for="value in filters" :key="value" :value="value">
      <div class="paneled-project-pages__table-scroll">
        <Table compact :aria-label="props.page">
          <Table.Header><Table.Row><Table.Head scope="col">Name</Table.Head><Table.Head scope="col">Status</Table.Head><Table.Head scope="col">Workspace</Table.Head></Table.Row></Table.Header>
          <Table.Body>
            <Table.Row v-for="entry in entries.filter(entry => value === 'All' || entry.status === value)" :key="entry.name">
              <Table.Cell><strong>{{ entry.name }}</strong><p class="paneled-project-pages__catalog-description">{{ entry.description }}</p></Table.Cell>
              <Table.Cell><Badge :variant="entry.status === 'Ready' ? 'success' : 'warning'">{{ entry.status }}</Badge></Table.Cell>
              <Table.Cell><Button variant="link" size="sm" :icon="ArrowUpRight" icon-position="inline-end" @click="emit('navigate', entry.page)">{{ entry.page }}</Button></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <p v-if="!entries.some(entry => value === 'All' || entry.status === value)">No entries with this status.</p>
      </div>
    </Tabs.Content>
  </Tabs.Root>
</template>
