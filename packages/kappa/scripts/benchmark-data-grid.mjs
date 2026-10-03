import { performance } from "node:perf_hooks";
import { useTable } from "@tanstack/vue-table";
import {
  createDataGridColumnDefs,
  dataGridFeatures,
} from "../src/components/data-grid/data-grid-engine.ts";
import { filterDataGridRows } from "../src/components/data-grid/data-grid.ts";

const data = Array.from({ length: 100_000 }, (_, index) => ({
  id: `row-${index}`,
  name: `Record ${String(index).padStart(6, "0")}`,
  owner: `Owner ${index % 50}`,
  score: index % 100,
  status: index % 2 === 0 ? "Ready" : "Running",
}));
const columns = [
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "owner", header: "Owner", accessorKey: "owner" },
  { id: "status", header: "Status", accessorKey: "status" },
  { id: "score", header: "Score", accessorKey: "score" },
];
const timings = {};
const measure = (name, operation) => {
  const start = performance.now();
  const value = operation();
  timings[name] = Number((performance.now() - start).toFixed(2));
  return value;
};

const filtered = measure("filter100kMs", () =>
  filterDataGridRows(data, columns, "record 099", { status: "ready" }),
);
const table = measure("createTable100kMs", () =>
  useTable({
    columns: createDataGridColumnDefs(columns, "none"),
    data,
    features: dataGridFeatures,
    getRowId: (row) => row.id,
  }),
);
measure("coreRowModel100kMs", () => table.getRowModel().rows.length);
table.setSorting([{ desc: true, id: "score" }]);
measure("sort100kMs", () => table.getRowModel().rows[0]?.getValue("score"));

process.stdout.write(`${JSON.stringify({
  filteredRows: filtered.length,
  nodeVersion: process.version,
  sourceRows: data.length,
  timingsMs: timings,
}, null, 2)}\n`);
