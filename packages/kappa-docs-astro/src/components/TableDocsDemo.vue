<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Table,
  type TableCheckboxChangeDetails,
} from "@dicehub/kappa/components/table";

type DemoVariant = "preview" | "usage" | "compact" | "selection" | "fixed" | "sticky" | "states";

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const rows = [
  { id: "atlas", name: "Project Atlas", owner: "Mina Chen", status: "Running", updated: "2m ago" },
  { id: "beacon", name: "Beacon API", owner: "Owen Hart", status: "Ready", updated: "18m ago" },
  { id: "cinder", name: "Cinder worker", owner: "Sofia Bell", status: "Paused", updated: "1h ago" },
] as const;

const selected = ref<string[]>(["atlas"]);
const allSelected = computed(() => selected.value.length === rows.length);
const partiallySelected = computed(() => selected.value.length > 0 && !allSelected.value);

const toggleAll = (details: TableCheckboxChangeDetails) => {
  selected.value = details.checked ? rows.map((row) => row.id) : [];
};

const toggleRow = (id: string, details: TableCheckboxChangeDetails) => {
  selected.value = details.checked
    ? [...new Set([...selected.value, id])]
    : selected.value.filter((value) => value !== id);
};
</script>

<template>
  <div class="table-demo" :data-table-demo="variant">
    <div v-if="variant === 'preview'" class="table-demo__scroll">
      <Table aria-label="Recent projects">
        <Table.Caption>Project activity · 3 projects</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head scope="col">Project</Table.Head>
            <Table.Head scope="col">Owner</Table.Head>
            <Table.Head scope="col">Status</Table.Head>
            <Table.Head scope="col" class="table-demo__numeric">Updated</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row v-for="row in rows" :key="row.id">
            <Table.Cell>{{ row.name }}</Table.Cell>
            <Table.Cell>{{ row.owner }}</Table.Cell>
            <Table.Cell><span class="table-demo__status" :data-status="row.status">{{ row.status }}</span></Table.Cell>
            <Table.Cell class="table-demo__numeric">{{ row.updated }}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>

    <div v-else-if="variant === 'usage'" class="table-demo__scroll table-demo__scroll--compact">
      <Table aria-label="Deployment queue">
        <Table.Header variant="compact">
          <Table.Row>
            <Table.Head scope="col">Run</Table.Head>
            <Table.Head scope="col">Environment</Table.Head>
            <Table.Head scope="col">Result</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>release-241</Table.Cell>
            <Table.Cell>production</Table.Cell>
            <Table.Cell><span class="table-demo__status table-demo__status--ready">Passed</span></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>

    <div v-else-if="variant === 'selection' || variant === 'compact'" class="table-demo__stack">
      <div class="table-demo__selection-summary" role="status">
        {{ selected.length }} of {{ rows.length }} projects selected
      </div>
      <div class="table-demo__scroll">
        <Table :compact="variant === 'compact'" aria-label="Selectable projects">
          <Table.Header sticky :variant="variant === 'compact' ? 'compact' : 'default'">
            <Table.Row>
              <Table.CheckHead
                :checked="allSelected"
                :indeterminate="partiallySelected"
                @checked-change="toggleAll"
              />
              <Table.Head scope="col">Project</Table.Head>
              <Table.Head scope="col">Owner</Table.Head>
              <Table.Head scope="col">Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row
              v-for="row in rows"
              :key="row.id"
              :aria-selected="selected.includes(row.id)"
              :variant="selected.includes(row.id) ? 'selected' : 'default'"
            >
              <Table.CheckCell
                :checked="selected.includes(row.id)"
                :label="`Select ${row.name}`"
                @checked-change="(details) => toggleRow(row.id, details)"
              />
              <Table.Cell>{{ row.name }}</Table.Cell>
              <Table.Cell>{{ row.owner }}</Table.Cell>
              <Table.Cell>{{ row.status }}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>

    <div v-else-if="variant === 'fixed'" class="table-demo__scroll">
      <Table layout="fixed" aria-label="Fixed width deployment runs">
        <colgroup>
          <col style="width: 42%" />
          <col style="width: 28%" />
          <col style="width: 30%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.Head scope="col">
              Run
              <Table.ResizeHandle label="Resize run column" />
            </Table.Head>
            <Table.Head scope="col">Duration</Table.Head>
            <Table.Head scope="col">Region</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>release-241</Table.Cell>
            <Table.Cell>18m 42s</Table.Cell>
            <Table.Cell>eu-central</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>release-240</Table.Cell>
            <Table.Cell>21m 05s</Table.Cell>
            <Table.Cell>us-east</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>

    <div v-else-if="variant === 'sticky'" class="table-demo__scroll table-demo__scroll--sticky">
      <Table layout="fixed" aria-label="Sticky project columns">
        <Table.Header sticky variant="compact">
          <Table.Row>
            <Table.Head sticky="left" scope="col">Project</Table.Head>
            <Table.Head scope="col">Owner</Table.Head>
            <Table.Head scope="col">Environment</Table.Head>
            <Table.Head scope="col">Last commit</Table.Head>
            <Table.Head sticky="right" scope="col">Health</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row v-for="row in rows" :key="row.id">
            <Table.Cell sticky="left">{{ row.name }}</Table.Cell>
            <Table.Cell>{{ row.owner }}</Table.Cell>
            <Table.Cell>production</Table.Cell>
            <Table.Cell>9f31c2a · {{ row.updated }}</Table.Cell>
            <Table.Cell sticky="right"><span class="table-demo__status table-demo__status--ready">Nominal</span></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>

    <div v-else class="table-demo__states">
      <div class="table-demo__state-group">
        <span class="table-demo__state-label">Selected</span>
        <Table aria-label="Selected state example">
          <Table.Body>
            <Table.Row variant="selected" aria-selected="true">
              <Table.Cell>Project Atlas</Table.Cell>
              <Table.Cell>Ready for review</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
      <div class="table-demo__state-group">
        <span class="table-demo__state-label">Loading and invalid</span>
        <Table aria-label="Loading and invalid state examples">
          <Table.Body>
            <Table.Row data-loading aria-busy="true">
              <Table.Cell>Refreshing metrics…</Table.Cell>
              <Table.Cell>Pending</Table.Cell>
            </Table.Row>
            <Table.Row data-invalid aria-invalid="true">
              <Table.Cell>Worker Cinder</Table.Cell>
              <Table.Cell>Connection failed</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
      <div class="table-demo__state-group">
        <span class="table-demo__state-label">Empty</span>
        <Table aria-label="Empty state example">
          <Table.Body>
            <Table.Row data-empty>
              <Table.Cell :colspan="2">No runs match the current filters.</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  </div>
</template>

<style scoped src="./TableDocsDemo.css"></style>
