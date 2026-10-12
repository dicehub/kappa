<script setup lang="ts">
import { ref } from "vue";
import { DataGrid, type DataGridColumn, type DataGridDirection } from "@dicehub/kappa/components/data-grid";

type Row = { id: string; name: string };
const direction = ref<DataGridDirection>("ltr");
const loading = ref(false);
const rows: Row[] = [{ id: "atlas", name: "Atlas" }, { id: "beacon", name: "Beacon" }];
const columns: DataGridColumn<Row>[] = [
  { id: "name", header: "Name", accessorKey: "name", width: 120, minWidth: 80, maxWidth: 160 },
];
const rowValue = (row: Row) => row.id;
const pinnedColumns: DataGridColumn<Row>[] = [
  { ...columns[0]!, pinned: "start", resizable: false },
  { id: "details", header: "Details", accessor: row => `${row.name} summary`, width: 480 },
  { id: "identity", header: "ID", accessorKey: "id", pinned: "end", width: 80, resizable: false },
];
</script>

<template>
  <main>
    <h1>Grid consumer</h1>
    <button @click="direction = 'ltr'">Use LTR</button>
    <button @click="direction = 'rtl'">Use RTL</button>
    <button @click="loading = true">Show loading state</button>
    <section :dir="direction">
      <DataGrid.Root aria-label="Resize records" :columns="columns" :rows="rows" :row-to-value="rowValue"
        :direction="direction" :loading="loading" />
    </section>
    <section :dir="direction" style="width: 320px">
      <DataGrid.Root aria-label="Pinned records" :columns="pinnedColumns" :rows="rows"
        :row-to-value="rowValue" :direction="direction" />
    </section>
  </main>
</template>
