<script setup lang="ts">
import { computed } from "vue";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Input } from "@dicehub/kappa/components/input";
import { Table } from "@dicehub/kappa/components/table";
import { Tabs } from "@dicehub/kappa/components/tabs";
import { creditAmount, currentUsage, monthUsage, runningJobs, runStatusVariant, type WorkspaceCompute, type WorkspaceRun } from "./paneled-workspace-compute";

const props = defineProps<{ page: string; namespace: string; compute: WorkspaceCompute; selectedId?: string }>();
const emit = defineEmits<{ open: [run: WorkspaceRun, event: MouseEvent] }>();
const filter = defineModel<string>("filter", { default: "All runs" });
const query = defineModel<string>("query", { default: "" });
const filters = ["All runs", "Running", "Queued", "Completed", "Failed", "Cancelled"];
const active = computed(() => runningJobs(props.compute.runs));
const visibleRuns = (value: string) => props.compute.runs.filter(run =>
  (value === "All runs" || run.status === value) &&
  `${run.name} ${run.id} ${run.status}`.toLowerCase().includes(query.value.trim().toLowerCase()),
);
</script>

<template>
  <div class="paneled-compute">
    <p class="paneled-compute__intro">{{ namespace }} · {{ active.length }} active runs · {{ active.reduce((total, run) => total + run.cpus, 0) }} vCPUs in use</p>
    <template v-if="page === 'Simulation runs'">
      <Input v-model="query" class="paneled-compute__search" size="sm" type="search" aria-label="Filter simulation runs" placeholder="Filter simulation runs" @keydown.esc="query = ''" />
      <Tabs.Root v-model="filter" lazy-mount unmount-on-exit>
        <Tabs.List size="sm" variant="line" aria-label="Simulation run status">
          <Tabs.Trigger v-for="value in filters" :key="value" :value="value">{{ value }} <span>{{ visibleRuns(value).length }}</span></Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content v-for="value in filters" :key="value" :value="value">
          <div class="paneled-compute__table">
            <Table compact :aria-label="`${value} simulations`">
              <Table.Header><Table.Row><Table.Head scope="col">Run</Table.Head><Table.Head scope="col">Status</Table.Head><Table.Head scope="col">Compute</Table.Head><Table.Head scope="col">Runtime</Table.Head></Table.Row></Table.Header>
              <Table.Body>
                <Table.Row v-for="run in visibleRuns(value)" :key="run.id" :variant="selectedId === run.id ? 'selected' : 'default'">
                  <Table.Cell><Button variant="link" size="sm" :data-simulation-run="run.id" :aria-expanded="selectedId === run.id" aria-haspopup="dialog" @click="emit('open', run, $event)">{{ run.name }}</Button><small>{{ run.id }}</small></Table.Cell>
                  <Table.Cell><Badge :variant="runStatusVariant(run.status)">{{ run.status }}</Badge></Table.Cell>
                  <Table.Cell>{{ run.cpus }} vCPUs</Table.Cell><Table.Cell>{{ run.elapsed }}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
          <p v-if="!visibleRuns(value).length" class="paneled-compute__empty">{{ query.trim() ? 'No simulation runs match your search.' : value === 'All runs' ? 'No simulation runs yet.' : `No ${value.toLowerCase()} simulation runs.` }}</p>
        </Tabs.Content>
      </Tabs.Root>
    </template>
    <template v-else>
      <dl class="paneled-compute__metrics paneled-compute__usage">
        <div><dt>Available credits</dt><dd>{{ creditAmount(compute.balanceCents) }}</dd></div>
        <div><dt>Current usage</dt><dd>{{ creditAmount(currentUsage(compute.runs)) }} / hour</dd></div>
        <div><dt>Used this month</dt><dd>{{ creditAmount(monthUsage(compute.runs)) }}</dd></div>
      </dl>
      <h3>Usage by run</h3>
      <p class="paneled-compute__intro">All amounts in USD. Queued runs do not consume credits.</p>
      <div class="paneled-compute__table">
        <Table compact aria-label="Compute usage by run">
          <Table.Header><Table.Row><Table.Head scope="col">Run</Table.Head><Table.Head scope="col">Status</Table.Head><Table.Head scope="col">Runtime</Table.Head><Table.Head scope="col">Cost to date</Table.Head></Table.Row></Table.Header>
          <Table.Body>
            <Table.Row v-for="run in compute.runs" :key="run.id"><Table.Cell><strong>{{ run.name }}</strong><small>{{ run.id }}</small></Table.Cell><Table.Cell><Badge :variant="runStatusVariant(run.status)">{{ run.status }}</Badge></Table.Cell><Table.Cell>{{ run.elapsed }}</Table.Cell><Table.Cell>{{ creditAmount(run.costCents) }}</Table.Cell></Table.Row>
          </Table.Body>
        </Table>
      </div>
    </template>
  </div>
</template>

<style src="./paneled-workspace-compute.css"></style>
