<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import {
  Badge,
  Button,
  DataGrid,
  Input,
  type DataGridColumn,
  type DataGridSort,
} from "@dicehub/kappa";

type DemoVariant = "preview" | "virtual" | "controlled" | "row-selection" | "compact" | "multiline" | "states";
type RecordRow = {
  id: string;
  name: string;
  owner: string;
  status: "Active" | "Paused" | "Review";
  updated: string;
  score: number;
};

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const baseRows: RecordRow[] = [
  { id: "rec-001", name: "Northwind report", owner: "Mina Chen", status: "Active", updated: "2 min ago", score: 96 },
  { id: "rec-002", name: "Atlas migration", owner: "Owen Hart", status: "Review", updated: "18 min ago", score: 82 },
  { id: "rec-003", name: "Beacon audit", owner: "Sofia Bell", status: "Paused", updated: "1 hr ago", score: 71 },
  { id: "rec-004", name: "Cinder catalog", owner: "Noah Park", status: "Active", updated: "3 hr ago", score: 91 },
  { id: "rec-005", name: "Delta archive", owner: "Iris King", status: "Review", updated: "Yesterday", score: 86 },
  { id: "rec-006", name: "Ember index", owner: "Luca Reed", status: "Active", updated: "Yesterday", score: 93 },
  { id: "rec-007", name: "Foundry plan", owner: "Maya Singh", status: "Paused", updated: "2 days ago", score: 64 },
  { id: "rec-008", name: "Granite notes", owner: "Theo West", status: "Active", updated: "3 days ago", score: 89 },
];

const largeRows = shallowRef<RecordRow[]>([]);
const virtualLoading = ref(props.variant === "virtual");
let loadFrame = 0;
onMounted(() => {
  if (props.variant !== "virtual") return;
  loadFrame = requestAnimationFrame(() => {
    loadFrame = requestAnimationFrame(() => {
      largeRows.value = Array.from({ length: 100_000 }, (_, index): RecordRow => ({
        id: `row-${index + 1}`,
        name: `Record ${String(index + 1).padStart(6, "0")}`,
        owner: ["Mina Chen", "Owen Hart", "Sofia Bell", "Noah Park"][index % 4]!,
        status: (["Active", "Review", "Paused"] as const)[index % 3]!,
        updated: `${index % 59 + 1} min ago`,
        score: 60 + (index % 40),
      }));
      virtualLoading.value = false;
    });
  });
});
onBeforeUnmount(() => cancelAnimationFrame(loadFrame));

const columns: DataGridColumn<RecordRow>[] = [
  { id: "name", header: "Name", accessorKey: "name", pinned: "start", width: 220, minWidth: 160 },
  { id: "owner", header: "Owner", accessorKey: "owner", width: 150 },
  { id: "status", header: "Status", accessorKey: "status", width: 110 },
  { id: "updated", header: "Updated", accessorKey: "updated", width: 120 },
  { id: "score", header: "Score", accessorKey: "score", align: "end", width: 84 },
  { id: "actions", header: "Actions", pinned: "end", sortable: false, hideable: false, resizable: false, width: 84 },
];

const query = ref("");
const selected = ref<string[]>(["rec-001"]);
const sorting = ref<DataGridSort[]>([{ id: "name", direction: "asc" }]);
const page = ref(1);
const pageSize = ref(props.variant === "controlled" ? 3 : 5);
const columnVisibility = ref({});
const serverRows = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase();
  const filtered = normalizedQuery
    ? baseRows.filter((row) => Object.values(row).some((value) =>
        String(value).toLocaleLowerCase().includes(normalizedQuery),
      ))
    : [...baseRows];
  const [sort] = sorting.value;
  if (sort) {
    filtered.sort((left, right) => {
      const leftValue = left[sort.id as keyof RecordRow];
      const rightValue = right[sort.id as keyof RecordRow];
      const result = typeof leftValue === "number" && typeof rightValue === "number"
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue));
      return sort.direction === "desc" ? -result : result;
    });
  }
  return filtered;
});
const currentServerPage = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return serverRows.value.slice(start, start + pageSize.value);
});
const rows = computed(() => {
  if (props.variant === "virtual") return largeRows.value;
  if (props.variant === "controlled") return currentServerPage.value;
  return baseRows;
});
const rowToValue = (row: RecordRow) => row.id;
</script>

<template>
  <div class="data-grid-demo" :data-data-grid-demo="props.variant">
    <template v-if="props.variant === 'states'">
      <div class="data-grid-demo__states">
        <DataGrid :columns="columns" :rows="[]" :row-to-value="rowToValue" loading aria-label="Loading grid" />
        <DataGrid :columns="columns" :rows="[]" :row-to-value="rowToValue" aria-label="Empty grid" />
        <DataGrid :columns="columns" :rows="[]" :row-to-value="rowToValue" error="Offline" aria-label="Error grid" />
      </div>
    </template>

    <DataGrid
      v-else
      v-model:column-visibility="columnVisibility"
      v-model:page="page"
      v-model:page-size="pageSize"
      v-model:query="query"
      v-model:selected-value="selected"
      v-model:sorting="sorting"
      :aria-label="props.variant === 'virtual' ? 'Large records' : 'Records'"
      :columns="columns"
      :compact="props.variant === 'compact' || props.variant === 'virtual'"
      :height="props.variant === 'virtual' ? '22rem' : undefined"
      :mode="props.variant === 'virtual' ? 'virtual' : 'standard'"
      :manual-filtering="props.variant === 'controlled'"
      :manual-pagination="props.variant === 'controlled'"
      :manual-sorting="props.variant === 'controlled'"
      :loading="props.variant === 'virtual' && virtualLoading"
      :paginated="props.variant !== 'virtual'"
      :row-count="props.variant === 'controlled' ? serverRows.length : undefined"
      :row-height="28"
      :rows="rows"
      :row-to-value="rowToValue"
      selection-mode="multiple"
      :show-selection-column="props.variant !== 'row-selection'"
    >
      <template #toolbar="{ rowCount }">
        <Input
          v-model="query"
          aria-label="Search records"
          placeholder="Search records..."
          size="sm"
          type="search"
        />
        <span class="data-grid-demo__count">
          {{ props.variant === 'virtual' && virtualLoading ? 'Preparing 100,000 rows' : `${rowCount.toLocaleString()} records` }}
        </span>
        <DataGrid.ColumnVisibility />
      </template>

      <template #cell-status="{ value }">
        <Badge :variant="value === 'Active' ? 'success' : value === 'Paused' ? 'neutral' : 'warning'">
          {{ value }}
        </Badge>
      </template>

      <template v-if="props.variant === 'multiline'" #cell-name="{ row }">
        <div class="data-grid-demo__multiline">
          <strong>{{ row.name }}</strong>
          <span>Contains a longer description that wraps naturally in standard mode without a fixed row height.</span>
        </div>
      </template>

      <template #cell-score="{ value }">
        <span class="data-grid-demo__score">{{ value }}%</span>
      </template>

      <template #cell-actions="{ row }">
        <Button size="xs" variant="ghost" :aria-label="`Open ${row.name}`">Open</Button>
      </template>

      <template v-if="props.variant !== 'virtual'" #footer>
        <DataGrid.Pagination />
      </template>
    </DataGrid>
  </div>
</template>

<style scoped src="./DataGridDocsDemo.css"></style>
