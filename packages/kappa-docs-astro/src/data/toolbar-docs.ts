export const toolbarBarrelCode = `import { Toolbar } from "@dicehub/kappa";`;

export const toolbarGranularCode = `import { Toolbar } from "@dicehub/kappa/components/toolbar";`;

export const toolbarPreviewCode = `<script setup>
import { Toolbar } from "@dicehub/kappa/components/toolbar";
import { InputGroup } from "@dicehub/kappa/components/input-group";
import { ListFilter, Search, Settings2 } from "@lucide/vue";
</script>

<template>
  <Toolbar aria-label="Record tools" class="record-toolbar">
    <Toolbar.InputGroup aria-label="Search records" class="record-toolbar__search">
      <InputGroup.Addon><Search aria-hidden="true" /></InputGroup.Addon>
      <InputGroup.Input placeholder="Search records" />
    </Toolbar.InputGroup>
    <Toolbar.Button :icon="ListFilter" aria-label="Filter" />
    <Toolbar.Button :icon="Settings2" aria-label="Settings" />
  </Toolbar>
</template>

<style scoped>
.record-toolbar { width: min(100%, 28rem); }
.record-toolbar__search { flex: 1 1 auto; }
</style>`;

export const toolbarUsageCode = `<script setup>
import { Toolbar } from "@dicehub/kappa/components/toolbar";
import { InputGroup } from "@dicehub/kappa/components/input-group";
import { ListFilter, Search } from "@lucide/vue";
</script>

<template>
  <Toolbar aria-label="Record tools">
    <Toolbar.InputGroup aria-label="Search records">
      <InputGroup.Addon><Search aria-hidden="true" /></InputGroup.Addon>
      <InputGroup.Input placeholder="Search records" />
    </Toolbar.InputGroup>
    <Toolbar.Button :icon="ListFilter" aria-label="Filter" />
  </Toolbar>
</template>`;

export const toolbarSelectCode = `<script setup>
import { Toolbar } from "@dicehub/kappa/components/toolbar";
import { Select } from "@dicehub/kappa/components/select";
import { ListFilter, Settings2 } from "@lucide/vue";

const sortItems = ["Name", "Created date", "Status"];
</script>

<template>
  <Toolbar aria-label="Filter and sort records">
    <Toolbar.Button :icon="ListFilter">Filter</Toolbar.Button>
    <Select
      id="toolbar-sort-records"
      aria-label="Sort records"
      :default-value="['Name']"
      :items="sortItems"
      :positioning="{ sameWidth: false }"
    >
      <Select.Trigger as-child>
        <Toolbar.Button><Select.ValueText /></Toolbar.Button>
      </Select.Trigger>
      <Select.Positioner>
        <Select.Content class="sort-menu">
          <Select.List>
            <template #default="{ item }">
              <Select.Item :item="item">{{ item }}</Select.Item>
            </template>
          </Select.List>
        </Select.Content>
      </Select.Positioner>
    </Select>
    <Toolbar.Button :icon="Settings2" aria-label="View settings" />
  </Toolbar>
</template>

<style scoped>
.sort-menu { min-width: 10rem; }
</style>`;

export const toolbarComboboxCode = `<script setup>
import { Toolbar } from "@dicehub/kappa/components/toolbar";
import { Combobox } from "@dicehub/kappa/components/combobox";
import { ListFilter, Settings2 } from "@lucide/vue";

const statusItems = ["All records", "Active", "Paused", "Failed"];
</script>

<template>
  <Toolbar aria-label="Filter record status" class="status-toolbar">
    <Toolbar.Button :icon="ListFilter">Status</Toolbar.Button>
    <Combobox
      id="toolbar-filter-status"
      :default-value="['All records']"
      :items="statusItems"
    >
      <Combobox.TriggerInput as-child>
        <Toolbar.Input
          aria-label="Filter status"
          class="status-toolbar__input"
          placeholder="Filter status…"
        />
      </Combobox.TriggerInput>
      <Combobox.Content>
        <Combobox.Empty>No matching status.</Combobox.Empty>
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">{{ item }}</Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
    <Toolbar.Button :icon="Settings2" aria-label="Status settings" />
  </Toolbar>
</template>

<style scoped>
.status-toolbar { width: min(100%, 28rem); }
.status-toolbar__input { flex: 1 1 auto; }
</style>`;

export const toolbarInputShorthandCode = `<script setup>
import { Toolbar } from "@dicehub/kappa/components/toolbar";
import { ListFilter, Settings2 } from "@lucide/vue";
</script>

<template>
  <Toolbar aria-label="Search records" class="search-toolbar">
    <Toolbar.Input
      aria-label="Search records"
      class="search-toolbar__input"
      placeholder="Search records"
    />
    <Toolbar.Button :icon="ListFilter" aria-label="Filter" />
    <Toolbar.Button :icon="Settings2" aria-label="Settings" />
  </Toolbar>
</template>

<style scoped>
.search-toolbar { width: min(100%, 28rem); }
.search-toolbar__input { flex: 1 1 auto; }
</style>`;

export const toolbarInputGroupCode = `<script setup>
import { Toolbar } from "@dicehub/kappa/components/toolbar";
import { InputGroup } from "@dicehub/kappa/components/input-group";
</script>

<template>
  <Toolbar aria-label="Open a site" class="site-toolbar">
    <Toolbar.InputGroup aria-label="Site address" class="site-toolbar__input">
      <InputGroup.Input aria-label="Site subdomain" placeholder="docs" />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>.example.com</InputGroup.Text>
      </InputGroup.Addon>
    </Toolbar.InputGroup>
    <Toolbar.Button>Open</Toolbar.Button>
  </Toolbar>
</template>

<style scoped>
.site-toolbar { width: min(100%, 32rem); }
.site-toolbar__input { flex: 1 1 auto; }
</style>`;

export const toolbarSizesCode = `<script setup>
import { Toolbar, type ToolbarSize } from "@dicehub/kappa/components/toolbar";

const sizes: ToolbarSize[] = ["xs", "sm", "base", "lg"];
</script>

<template>
  <div class="toolbar-sizes">
    <div v-for="size in sizes" :key="size" class="toolbar-size-row">
      <span class="toolbar-size-label">{{ size }}</span>
      <Toolbar :aria-label="\`\${size} toolbar\`" :size="size">
        <Toolbar.Input :aria-label="\`\${size} search\`" placeholder="Search…" />
        <Toolbar.Button>Apply</Toolbar.Button>
      </Toolbar>
    </div>
  </div>
</template>

<style scoped>
.toolbar-sizes { display: grid; gap: 0.75rem; }
.toolbar-size-row { display: flex; align-items: center; gap: 0.75rem; }
.toolbar-size-label { width: 2.5rem; }
</style>`;

export const toolbarActionsCode = `<script setup>
import { Toolbar } from "@dicehub/kappa/components/toolbar";
import { Download, Upload } from "@lucide/vue";
</script>

<template>
  <Toolbar aria-label="File actions">
    <Toolbar.Button :icon="Upload">Upload</Toolbar.Button>
    <Toolbar.Button :icon="Download">Download</Toolbar.Button>
  </Toolbar>
</template>`;

export const toolbarLinksCode = `<script setup>
import { Toolbar } from "@dicehub/kappa/components/toolbar";
import { BookOpen, Download } from "@lucide/vue";
</script>

<template>
  <Toolbar aria-label="Documentation actions">
    <Toolbar.Link href="/docs/components/button" :icon="BookOpen">Button docs</Toolbar.Link>
    <Toolbar.Button :icon="Download">Download</Toolbar.Button>
  </Toolbar>
</template>`;

export const toolbarLabelsCode = `<script setup>
import { Toolbar } from "@dicehub/kappa/components/toolbar";
import { Search } from "@lucide/vue";
</script>

<template>
  <Toolbar aria-label="Search records">
    <Toolbar.Input aria-label="Search records" placeholder="Search" />
    <Toolbar.Button :icon="Search" aria-label="Search" />
  </Toolbar>
</template>`;

export const toolbarExamples = [
  {
    id: "select",
    title: "Select",
    variant: "select",
    description: "Wrap a `Toolbar.Button` with `Select.Trigger` and `as-child` to keep Select behavior in the grouped control.",
    code: toolbarSelectCode,
  },
  {
    id: "combobox",
    title: "Combobox",
    variant: "combobox",
    description: "Use `Combobox.TriggerInput` with `as-child` to make a `Toolbar.Input` an editable popup trigger.",
    code: toolbarComboboxCode,
  },
  {
    id: "input-shorthand",
    title: "Input shorthand",
    variant: "input-shorthand",
    description: "Use `Toolbar.Input` for simple text input that does not need an addon or suffix.",
    code: toolbarInputShorthandCode,
  },
  {
    id: "input-group",
    title: "Input group",
    variant: "input-group",
    description: "Use `Toolbar.InputGroup` when one toolbar item needs an inline addon or suffix.",
    code: toolbarInputGroupCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    variant: "sizes",
    description: "Set `size` on the root to give every supported toolbar item the same density.",
    code: toolbarSizesCode,
  },
  {
    id: "button-actions",
    title: "Button actions",
    variant: "button-actions",
    description: "Use quiet toolbar buttons for related actions that have the same priority.",
    code: toolbarActionsCode,
  },
  {
    id: "links",
    title: "Links",
    variant: "links",
    description: "Use `Toolbar.Link` for navigation. It keeps link semantics and joins arrow-key navigation.",
    code: toolbarLinksCode,
  },
  {
    id: "accessible-labels",
    title: "Accessible labels",
    variant: "accessible-labels",
    description: "Use `aria-label` for compact controls that do not have visible text.",
    code: toolbarLabelsCode,
  },
] as const;

export const toolbarProps = [
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Sets the layout axis and the arrow-key direction.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Sets the shared density for Toolbar.Button, Toolbar.Input, and Toolbar.InputGroup.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the toolbar and propagates native disabled behavior to its compound controls.",
  },
  {
    name: "loopFocus",
    type: "boolean",
    defaultValue: "true",
    description: "Wraps arrow-key focus from the first enabled item to the last and back.",
  },
  {
    name: "default slot",
    type: "slot",
    defaultValue: "-",
    description: "Toolbar parts or native controls. Native controls are discovered for roving focus.",
  },
] as const;

export const toolbarPartProps = [
  {
    name: "Toolbar.Button",
    type: "ToolbarButtonProps",
    description: "Button action with quiet toolbar styling and inherited size.",
  },
  {
    name: "Toolbar.Link",
    type: "ToolbarLinkProps",
    description: "LinkButton-based navigation control with inherited size.",
  },
  {
    name: "Toolbar.Input",
    type: "ToolbarInputProps",
    description: "Text input with inherited size and native input events.",
  },
  {
    name: "Toolbar.InputGroup",
    type: "ToolbarInputGroupProps",
    description: "Each focusable InputGroup control participates in toolbar focus movement.",
  },
  {
    name: "Toolbar.Separator",
    type: "ToolbarSeparatorProps",
    description: "Decorative divider; defaults to the cross-axis of the toolbar.",
  },
] as const;

export const toolbarKeyboardRows = [
  { key: "Tab", description: "Enter the toolbar at its first enabled item; leave the toolbar normally." },
  { key: "Arrow Left / Right", description: "Move between items in a horizontal toolbar. Direction follows RTL layout." },
  { key: "Arrow Up / Down", description: "Move between items in a vertical toolbar." },
  { key: "Home / End", description: "Move to the first or last enabled item when the focused control has no native movement." },
  { key: "Enter", description: "Activate the focused native button or link." },
  { key: "Space", description: "Activate the focused native button; inputs retain Space for editing." },
] as const;

export const toolbarDataAttributes = [
  { name: "data-slot", value: '"toolbar"', description: "Identifies the toolbar root." },
  { name: "data-orientation", value: '"horizontal" | "vertical"', description: "Resolved toolbar orientation." },
  { name: "data-size", value: '"xs" | "sm" | "base" | "lg"', description: "Resolved toolbar density." },
  { name: "data-disabled", value: "present", description: "Appears when the root is disabled." },
] as const;

export const toolbarExports = [
  { name: "Toolbar", description: "Compound toolbar root with Button, Link, Input, InputGroup, and Separator parts." },
  { name: "ToolbarRoot / ToolbarButton / ToolbarLink", description: "Named Vue component exports for granular composition." },
  { name: "ToolbarInput / ToolbarInputGroup / ToolbarSeparator", description: "Named input and divider component exports." },
  { name: "ToolbarProps and part prop types", description: "Public prop and slot contracts." },
  { name: "ToolbarOrientation / ToolbarSize", description: "Supported orientation and density values." },
  { name: "resolveToolbarOrientation / resolveToolbarSize", description: "Safe resolvers with Kappa defaults." },
] as const;
