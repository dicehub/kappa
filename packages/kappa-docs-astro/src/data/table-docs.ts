export const barrelCode = `import { Table } from "@dicehub/kappa";`;

export const granularCode = `import { Table } from "@dicehub/kappa/components/table";`;

export const previewCode = `<script setup>
import { Table } from "@dicehub/kappa/components/table";
</script>

<template>
  <Table aria-label="Recent projects">
    <Table.Caption>Project activity · 3 projects</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head scope="col">Project</Table.Head>
        <Table.Head scope="col">Owner</Table.Head>
        <Table.Head scope="col">Status</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Project Atlas</Table.Cell>
        <Table.Cell>Mina Chen</Table.Cell>
        <Table.Cell>Running</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</template>`;

export const usageCode = `<Table aria-label="Deployment queue">
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
      <Table.Cell>Passed</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`;

export const selectionCode = `<script setup lang="ts">
import { ref } from "vue";
import { Table, type TableCheckboxChangeDetails } from "@dicehub/kappa/components/table";

const selected = ref<string[]>([]);
const toggle = (id: string, details: TableCheckboxChangeDetails) => {
  selected.value = details.checked
    ? [...selected.value, id]
    : selected.value.filter((value) => value !== id);
};
</script>

<Table.CheckHead
  :checked="selected.length === rows.length"
  :indeterminate="selected.length > 0 && selected.length < rows.length"
  @checked-change="(details) => selectAll(details.checked)"
/>
<Table.CheckCell
  v-for="row in rows"
  :key="row.id"
  :checked="selected.includes(row.id)"
  :label="\`Select \${row.name}\`"
  @checked-change="(details) => toggle(row.id, details)"
/>`;

export const compactCode = `<Table compact aria-label="Projects">
  <Table.Header variant="compact">
    <Table.Row>
      <Table.Head scope="col">Project</Table.Head>
      <Table.Head scope="col">Owner</Table.Head>
      <Table.Head scope="col">Status</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Project Atlas</Table.Cell>
      <Table.Cell>Mina Chen</Table.Cell>
      <Table.Cell>Running</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`;

export const fixedCode = `<Table layout="fixed" aria-label="Deployment runs">
  <colgroup>
    <col style="width: 42%" />
    <col style="width: 28%" />
    <col style="width: 30%" />
  </colgroup>
  <Table.Header>
    <Table.Row>
      <Table.Head scope="col">Run</Table.Head>
      <Table.Head scope="col">Duration</Table.Head>
      <Table.Head scope="col">Region</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body><!-- rows --></Table.Body>
</Table>`;

export const stickyCode = `<div class="table-scroll" tabindex="0">
  <Table layout="fixed" aria-label="Project health">
    <Table.Header sticky variant="compact">
      <Table.Row>
        <Table.Head sticky="left" scope="col">Project</Table.Head>
        <Table.Head scope="col">Owner</Table.Head>
        <Table.Head scope="col">Environment</Table.Head>
        <Table.Head sticky="right" scope="col">Health</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body><!-- rows --></Table.Body>
  </Table>
</div>`;

export const statesCode = `<Table aria-label="Run states">
  <Table.Body>
    <Table.Row data-loading aria-busy="true">
      <Table.Cell>Refreshing metrics...</Table.Cell>
    </Table.Row>
    <Table.Row data-invalid aria-invalid="true">
      <Table.Cell>Connection failed</Table.Cell>
    </Table.Row>
    <Table.Row data-empty>
      <Table.Cell :colspan="2">No runs match the filters.</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`;

export const examples = [
  {
    id: "compact",
    title: "Compact",
    description: "Add compact to Table for 12px text, 4px vertical padding, and 8px horizontal padding across all cells. Single-line rows are about 24px high. Selection and sticky columns remain available. The header variant only controls the header surface and padding.",
    variant: "compact",
    code: compactCode,
  },
  {
    id: "selection",
    title: "Selection",
    description: "Use the checkbox parts for row and select-all behavior.",
    variant: "selection",
    code: selectionCode,
  },
  {
    id: "fixed",
    title: "Fixed Layout",
    description: "Use fixed layout with colgroup when column widths must stay predictable.",
    variant: "fixed",
    code: fixedCode,
  },
  {
    id: "sticky",
    title: "Sticky Columns",
    description: "Pin important columns while the surrounding table scrolls horizontally.",
    variant: "sticky",
    code: stickyCode,
  },
  {
    id: "states",
    title: "States",
    description: "Mark loading, invalid, empty, selected, and disabled rows with native or data attributes.",
    variant: "states",
    code: statesCode,
  },
] as const;

export const tableProps = [
  {
    name: "compact",
    type: "boolean",
    defaultValue: "false",
    description: "Reduces text size and padding across the whole table, including selection cells and captions.",
  },
  {
    name: "layout",
    type: '"auto" | "fixed"',
    defaultValue: '"auto"',
    description: "Selects the native table layout algorithm.",
  },
] as const;

export const headerProps = [
  {
    name: "variant",
    type: '"default" | "compact"',
    defaultValue: '"default"',
    description: "Chooses the header surface and vertical padding. Use Table compact to reduce all rows.",
  },
  {
    name: "sticky",
    type: "boolean",
    defaultValue: "false",
    description: "Pins header cells to the top of a scrolling parent.",
  },
] as const;

export const rowProps = [
  {
    name: "variant",
    type: '"default" | "selected"',
    defaultValue: '"default"',
    description: "Sets the row surface. Native aria-selected and data attributes also style states.",
  },
] as const;

export const cellProps = [
  {
    name: "sticky",
    type: '"left" | "right"',
    defaultValue: "—",
    description: "Pins a head or body cell to the corresponding scroll edge.",
  },
] as const;

export const selectionProps = [
  {
    name: "checked",
    type: "boolean",
    defaultValue: "—",
    description: "Controlled checkbox state.",
  },
  {
    name: "indeterminate",
    type: "boolean",
    defaultValue: "false",
    description: "Displays the mixed selection state.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the nested checkbox.",
  },
  {
    name: "label",
    type: "string",
    defaultValue: "—",
    description: "Accessible checkbox name; aria-label is used when label is omitted.",
  },
] as const;

export const dataSlots = [
  ["table", "table", "Native table root."],
  ["table-caption", "caption", "Optional table caption."],
  ["table-header", "thead", "Header section."],
  ["table-body", "tbody", "Body section."],
  ["table-footer", "tfoot", "Footer section."],
  ["table-row", "tr", "Row."],
  ["table-head", "th", "Header cell."],
  ["table-cell", "td", "Body cell."],
  ["table-resize-handle", "button", "Column resize affordance."],
] as const;

export const dataAttributes = [
  ["data-compact", "present", "Reduced text size and padding for the whole table."],
  ["data-layout", '"auto" | "fixed"', "Resolved table layout."],
  ["data-variant", '"default" | "selected" | "compact"', "Resolved row or header variant."],
  ["data-sticky", '"left" | "right"', "Resolved sticky column or header state."],
  ["data-selected", "present", "Optional selected-row styling hook."],
  ["data-loading", "present", "Optional loading-row styling hook."],
  ["data-invalid", "present", "Optional invalid-row styling hook."],
  ["data-empty", "present", "Optional empty-row styling hook."],
] as const;

export const exportsList = [
  { name: "Table", description: "Native semantic table compound component." },
  { name: "Table.Caption", description: "Optional caption rendered as caption." },
  { name: "Table.Header / Body / Footer", description: "Native table section parts." },
  { name: "Table.Row / Head / Cell", description: "Native rows and cells with state and sticky styling." },
  { name: "Table.CheckHead / CheckCell", description: "Checkbox selection parts with checked-change events." },
  { name: "Table.ResizeHandle", description: "Keyboard-focusable resize affordance for headless table integrations." },
  { name: "TABLE_VARIANTS", description: "Readonly metadata for layout, row, and sticky options." },
  { name: "TableLayout / TableRowVariant / TableStickyColumn", description: "Public option unions." },
  { name: "TableCheckboxChangeDetails", description: "Selection event payload with checkbox details." },
  { name: "isTable* / resolveTable*", description: "Runtime guards and safe option resolvers." },
] as const;
