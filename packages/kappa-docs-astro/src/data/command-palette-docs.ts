export const barrelCode = `import { CommandPalette } from "@dicehub/kappa";`;

export const granularCode = `import { CommandPalette } from "@dicehub/kappa/components/command-palette";`;

export const previewCode = `<script setup>
import { computed, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";

const open = ref(false);
const query = ref("");
const selected = ref("");
const groups = [
  {
    label: "Commands",
    items: [
      { id: "create", title: "Create new project" },
      { id: "settings", title: "Open settings" },
      { id: "search", title: "Search files" },
    ],
  },
  {
    label: "Pages",
    items: [
      { id: "home", title: "Home" },
      { id: "dashboard", title: "Dashboard" },
    ],
  },
];
const filteredGroups = computed(() => groups
  .map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.title.toLowerCase().includes(query.value.toLowerCase()),
    ),
  }))
  .filter((group) => group.items.length));
const flatten = (items) => items.flatMap((group) => group.items);
const title = (item) => item.title;
const select = (item) => {
  selected.value = item.title;
  query.value = "";
  open.value = false;
};
</script>

<template>
  <Button @click="open = true">Open Command Palette</Button>
  <p v-if="selected">Last selected: {{ selected }}</p>
  <CommandPalette.Root
    v-model:open="open"
    v-model:value="query"
    :filter="false"
    :get-selectable-items="flatten"
    :item-to-string-value="title"
    :items="filteredGroups"
    @select="select"
  >
    <CommandPalette.Input placeholder="Type a command or search..." />
    <CommandPalette.List>
      <CommandPalette.Results v-slot="{ item: group }">
        <CommandPalette.Group :items="group.items">
          <CommandPalette.GroupLabel>{{ group.label }}</CommandPalette.GroupLabel>
          <CommandPalette.Items v-slot="{ item }">
            <CommandPalette.Item :value="item">{{ item.title }}</CommandPalette.Item>
          </CommandPalette.Items>
        </CommandPalette.Group>
      </CommandPalette.Results>
      <CommandPalette.Empty>No commands found.</CommandPalette.Empty>
    </CommandPalette.List>
    <CommandPalette.Footer>
      <span><kbd>↑↓</kbd> Navigate</span>
      <span><kbd>Enter</kbd> Select</span>
    </CommandPalette.Footer>
  </CommandPalette.Root>
</template>`;

export const usageCode = `<script setup>
import { ref } from "vue";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";

const open = ref(false);
const commands = [
  { id: "create", title: "Create project" },
  { id: "settings", title: "Open settings" },
];
</script>

<template>
  <button @click="open = true">Open</button>
  <CommandPalette.Root v-model:open="open" :items="commands" @select="open = false">
    <CommandPalette.Input placeholder="Search..." />
    <CommandPalette.List>
      <CommandPalette.Results v-slot="{ item }">
        <CommandPalette.Item :value="item">{{ item.title }}</CommandPalette.Item>
      </CommandPalette.Results>
      <CommandPalette.Empty>No results.</CommandPalette.Empty>
    </CommandPalette.List>
  </CommandPalette.Root>
</template>`;

export const compositionCode = `<CommandPalette.Root>
  <CommandPalette.Dialog>
    <CommandPalette.Panel>
      <CommandPalette.Input />
      <CommandPalette.List>
        <CommandPalette.Empty />
        <CommandPalette.Results>
          <CommandPalette.Group>
            <CommandPalette.GroupLabel />
            <CommandPalette.Items>
              <CommandPalette.Item />
            </CommandPalette.Items>
          </CommandPalette.Group>
        </CommandPalette.Results>
      </CommandPalette.List>
      <CommandPalette.Footer />
    </CommandPalette.Panel>
  </CommandPalette.Dialog>
</CommandPalette.Root>`;

export const simpleCode = `<script setup>
import { ref } from "vue";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";

const open = ref(false);
const actions = [
  { id: "copy", title: "Copy" },
  { id: "paste", title: "Paste" },
  { id: "cut", title: "Cut" },
  { id: "delete", title: "Delete" },
];
</script>

<template>
  <button @click="open = true">Open Simple Palette</button>
  <CommandPalette.Root v-model:open="open" :items="actions" @select="open = false">
    <CommandPalette.Input placeholder="Search actions..." />
    <CommandPalette.List>
      <CommandPalette.Results v-slot="{ item }">
        <CommandPalette.Item :value="item">{{ item.title }}</CommandPalette.Item>
      </CommandPalette.Results>
      <CommandPalette.Empty>No actions found.</CommandPalette.Empty>
    </CommandPalette.List>
  </CommandPalette.Root>
</template>`;

export const loadingCode = `<script setup>
import { ref } from "vue";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";

const open = ref(false);
const loading = ref(false);
const items = ref([]);
const openPalette = async () => {
  open.value = true;
  loading.value = true;
  items.value = await loadCommands();
  loading.value = false;
};
</script>

<template>
  <button @click="openPalette">Open with Loading</button>
  <CommandPalette.Root v-model:open="open" :items="loading ? [] : items">
    <CommandPalette.Input placeholder="Search..." />
    <CommandPalette.List>
      <CommandPalette.Loading v-if="loading" />
      <template v-else>
        <CommandPalette.Results v-slot="{ item }">
          <CommandPalette.Item :value="item">{{ item.title }}</CommandPalette.Item>
        </CommandPalette.Results>
        <CommandPalette.Empty>No results found.</CommandPalette.Empty>
      </template>
    </CommandPalette.List>
  </CommandPalette.Root>
</template>`;

export const autocompleteCode = `<CommandPalette.Input
  autocomplete="off"
  autocapitalize="none"
  autocorrect="off"
  data-1p-ignore="true"
  data-lpignore="true"
  placeholder="Search commands..."
  :spellcheck="false"
/>`;

export const resultItemCode = `<script setup>
import { ref } from "vue";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";

const open = ref(false);
const results = [
  { id: "button", title: "Button", breadcrumbs: ["Components"] },
  { id: "dialog", title: "Dialog", breadcrumbs: ["Components"] },
  { id: "header", title: "Page Header", breadcrumbs: ["Blocks"] },
];
</script>

<template>
  <button @click="open = true">Open with ResultItem</button>
  <CommandPalette.Root v-model:open="open" :items="results" @select="open = false">
    <CommandPalette.Input placeholder="Search documentation..." />
    <CommandPalette.List>
      <CommandPalette.Results v-slot="{ item }">
        <CommandPalette.ResultItem
          :breadcrumbs="item.breadcrumbs"
          :description="item.description"
          :title="item.title"
          :value="item"
        />
      </CommandPalette.Results>
      <CommandPalette.Empty>No pages found.</CommandPalette.Empty>
    </CommandPalette.List>
  </CommandPalette.Root>
</template>`;

export const keyboardShortcuts = [
  { keys: ["↑", "↓"], description: "Move the highlight between enabled commands." },
  { keys: ["Home", "End"], description: "Move to the first or last enabled command." },
  { keys: ["Enter"], description: "Run the highlighted command." },
  { keys: ["⌘/Ctrl", "Enter"], description: "Run with newTab set to true." },
  { keys: ["Escape"], description: "Close the dialog and restore focus." },
] as const;

export const componentParts = [
  { id: "command-palette-root", name: "Root", description: "Combines Dialog and Panel and owns controlled or uncontrolled state." },
  { id: "command-palette-dialog", name: "Dialog", description: "Provides the modal layer, focus trap, dismissal, portal, and focus restoration." },
  { id: "command-palette-panel", name: "Panel", description: "Provides the Combobox collection, filtering, highlighting, and selection state." },
  { id: "command-palette-input", name: "Input", description: "Forwards input attributes and handles search and keyboard activation." },
  { id: "command-palette-list", name: "List", description: "Contains the scrollable result area." },
  { id: "command-palette-results", name: "Results", description: "Iterates the visible top-level items or groups." },
  { id: "command-palette-group", name: "Group", description: "Groups related commands and supplies items to Items." },
  { id: "command-palette-group-label", name: "GroupLabel", description: "Labels a command group." },
  { id: "command-palette-items", name: "Items", description: "Iterates commands inside the nearest Group." },
  { id: "command-palette-item", name: "Item", description: "Provides one selectable or disabled command." },
  { id: "command-palette-result-item", name: "ResultItem", description: "Adds breadcrumbs, description, icon, highlights, and destination cues." },
  { id: "command-palette-highlighted-text", name: "HighlightedText", description: "Marks inclusive match ranges without using HTML injection." },
  { id: "command-palette-empty", name: "Empty", description: "Displays the no-results state." },
  { id: "command-palette-loading", name: "Loading", description: "Displays an accessible loading status." },
  { id: "command-palette-footer", name: "Footer", description: "Contains keyboard help or related status information." },
] as const;

export const rootProps = [
  { name: "open", type: "boolean", defaultValue: "-", description: "Controlled dialog state; supports v-model:open." },
  { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial dialog state for uncontrolled use." },
  { name: "value", type: "string", defaultValue: "-", description: "Controlled search query; supports v-model:value." },
  { name: "defaultValue", type: "string", defaultValue: '""', description: "Initial uncontrolled search query." },
  { name: "items", type: "T[]", defaultValue: "[]", description: "Flat results or top-level groups rendered by Results." },
  { name: "getSelectableItems", type: "(items: T[]) => T[]", defaultValue: "identity", description: "Flattens grouped data into keyboard-selectable items." },
  { name: "itemToStringValue", type: "(item: T) => string", defaultValue: "title / label / name / value", description: "Maps an object item to searchable text." },
  { name: "itemToValue", type: "(item: T) => string", defaultValue: "id / value / title / label", description: "Maps an item to its stable Ark UI value." },
  { name: "isItemDisabled", type: "(item: T) => boolean", defaultValue: "item.disabled", description: "Marks commands unavailable and skips them during navigation." },
  { name: "filter", type: "false | (item, query) => boolean", defaultValue: "contains text", description: "Filters flat items. Use false for externally filtered groups." },
  { name: "ariaLabel", type: "string", defaultValue: '"Command palette"', description: "Accessible name for the dialog." },
  { name: "modal", type: "boolean", defaultValue: "true", description: "Controls focus trapping and outside interaction." },
] as const;

export const resultItemProps = [
  { name: "value", type: "T", defaultValue: "-", description: "Item passed to selection events." },
  { name: "title", type: "string", defaultValue: "-", description: "Primary result label." },
  { name: "breadcrumbs", type: "string[]", defaultValue: "[]", description: "Hierarchy rendered before the title." },
  { name: "description", type: "string", defaultValue: "-", description: "Supporting result text." },
  { name: "titleHighlights", type: "[number, number][]", defaultValue: "[]", description: "Inclusive title match ranges." },
  { name: "breadcrumbHighlights", type: "[number, number][][]", defaultValue: "[]", description: "Inclusive ranges for each breadcrumb." },
  { name: "showArrow", type: "boolean", defaultValue: "true", description: "Shows the destination arrow." },
  { name: "external", type: "boolean", defaultValue: "false", description: "Shows an external-destination cue." },
  { name: "nonInteractive", type: "boolean", defaultValue: "false", description: "Renders rich result content without activation." },
] as const;

export const events = [
  { name: "update:open", payload: "boolean", description: "Updates controlled dialog state." },
  { name: "openChange", payload: "boolean", description: "Reports each dialog state change." },
  { name: "update:value", payload: "string", description: "Updates the controlled search query." },
  { name: "valueChange", payload: "string", description: "Reports each search query change." },
  { name: "select", payload: "item, { newTab, event? }", description: "Reports activation and modified-key intent." },
  { name: "itemHighlighted", payload: "item, { index, reason }", description: "Reports keyboard, pointer, and reset highlights." },
  { name: "close", payload: "void", description: "Reports closure after dismissal or a state change." },
] as const;
