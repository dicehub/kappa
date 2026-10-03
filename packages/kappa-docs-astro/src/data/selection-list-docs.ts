export const barrelCode = `import {
  SelectionList,
  createSelectionListCollection,
  type SelectionListProps,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  SelectionList,
  createSelectionListCollection,
  type SelectionListProps,
} from "@dicehub/kappa/components/selection-list";`;

export const usageCode = `<script setup>
import {
  SelectionList,
  createSelectionListCollection,
} from "@dicehub/kappa/components/selection-list";

const profiles = createSelectionListCollection({
  items: [
    { value: "balanced", label: "Balanced", detail: "8 CPU · 32 GB" },
    { value: "fast", label: "Fast turnaround", detail: "32 CPU · 64 GB" },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <SelectionList.Root :collection="profiles" :default-value="['balanced']">
    <SelectionList.Label>Compute profile</SelectionList.Label>
    <SelectionList.Content>
      <SelectionList.Item v-for="item in profiles.items" :key="item.value" :item="item">
        <SelectionList.ItemContent>
          <SelectionList.ItemText>{{ item.label }}</SelectionList.ItemText>
          <SelectionList.ItemDescription>{{ item.detail }}</SelectionList.ItemDescription>
        </SelectionList.ItemContent>
        <SelectionList.ItemIndicator />
      </SelectionList.Item>
    </SelectionList.Content>
  </SelectionList.Root>
</template>`;

export const multipleCode = `<script setup>
import { ref } from "vue";
import { SelectionList, createSelectionListCollection } from "@dicehub/kappa";

const selected = ref(["pressure", "velocity"]);
const fields = createSelectionListCollection({ items: ["pressure", "velocity", "temperature"] });
</script>

<template>
  <SelectionList.Root v-model="selected" :collection="fields" selection-mode="multiple">
    <SelectionList.Label>Result fields</SelectionList.Label>
    <SelectionList.Content>
      <SelectionList.Item v-for="field in fields.items" :key="field" :item="field">
        <SelectionList.ItemText>{{ field }}</SelectionList.ItemText>
        <SelectionList.ItemIndicator />
      </SelectionList.Item>
    </SelectionList.Content>
  </SelectionList.Root>
</template>`;

export const filterCode = `<script setup>
import { computed, ref } from "vue";
import { SelectionList, createSelectionListCollection } from "@dicehub/kappa";

const query = ref("");
const files = createSelectionListCollection({ items: ["controlDict", "fvSchemes", "fvSolution"] });
const results = computed(() => files.filter((text) => text.toLowerCase().includes(query.value.toLowerCase())));
</script>

<template>
  <SelectionList.Root :collection="results">
    <SelectionList.Label>Case file</SelectionList.Label>
    <SelectionList.Input
      :value="query"
      auto-highlight
      keyboard-priority="navigate"
      placeholder="Filter files…"
      @input="query = $event.target.value"
    />
    <SelectionList.Content>
      <SelectionList.Empty>No matching files</SelectionList.Empty>
      <SelectionList.Item v-for="file in results.items" :key="file" :item="file">
        <SelectionList.ItemText>{{ file }}</SelectionList.ItemText>
        <SelectionList.ItemIndicator />
      </SelectionList.Item>
    </SelectionList.Content>
  </SelectionList.Root>
</template>`;

export const groupsCode = `<SelectionList.Root :collection="targets" :default-value="['local']">
  <SelectionList.Label>Execution target</SelectionList.Label>
  <SelectionList.Content>
    <SelectionList.ItemGroup v-for="([group, items], index) in targets.group()" :id="\`target-group-\${index}\`">
      <SelectionList.ItemGroupLabel>{{ group }}</SelectionList.ItemGroupLabel>
      <SelectionList.Item v-for="item in items" :key="item.value" :item="item">
        <SelectionList.ItemText>{{ item.label }}</SelectionList.ItemText>
        <SelectionList.ItemMeta>{{ item.status }}</SelectionList.ItemMeta>
        <SelectionList.ItemIndicator />
      </SelectionList.Item>
    </SelectionList.ItemGroup>
  </SelectionList.Content>
</SelectionList.Root>`;

export const sizesCode = `<SelectionList.Root :collection="profiles" size="base">…</SelectionList.Root>
<SelectionList.Root :collection="profiles" size="sm">…</SelectionList.Root>`;

export const providerCode = `<script setup>
import {
  SelectionList,
  createSelectionListCollection,
  useSelectionList,
} from "@dicehub/kappa/components/selection-list";

const collection = createSelectionListCollection({ items: ["CPU", "GPU"] });
const list = useSelectionList({ collection, defaultValue: ["CPU"] });
</script>

<template>
  <SelectionList.RootProvider :value="list">
    <SelectionList.Content>…</SelectionList.Content>
  </SelectionList.RootProvider>
</template>`;

export const rootProps = [
  { name: "collection", type: "ListCollection<T>", defaultValue: "required", description: "Items plus value, text, disabled, and optional grouping mappers." },
  { name: "modelValue / v-model", type: "string[]", defaultValue: "—", description: "Controlled selected values." },
  { name: "defaultValue", type: "string[]", defaultValue: "[]", description: "Initial values for uncontrolled use." },
  { name: "selectionMode", type: '"single" | "multiple" | "extended"', defaultValue: '"single"', description: "Selects one item, independent multiple items, or modifier-key ranges." },
  { name: "size", type: '"sm" | "base"', defaultValue: '"base"', description: "Sets the item density." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables selection and navigation." },
  { name: "deselectable", type: "boolean", defaultValue: "false", description: "Allows a single selected item to be cleared." },
  { name: "disallowSelectAll", type: "boolean", defaultValue: "false", description: "Disables the Control or Command+A select-all action." },
  { name: "highlightedValue / v-model:highlightedValue", type: "string | null", defaultValue: "—", description: "Controls the focused item value." },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"vertical"', description: "Sets arrow-key navigation direction." },
  { name: "loopFocus", type: "boolean", defaultValue: "false", description: "Wraps keyboard focus at the first and last items." },
  { name: "selectOnHighlight", type: "boolean", defaultValue: "false", description: "Selects items when keyboard focus moves." },
  { name: "typeahead", type: "boolean", defaultValue: "true", description: "Finds items from typed text while content has focus." },
  { name: "scrollToIndexFn", type: "(details) => void", defaultValue: "—", description: "Connects keyboard navigation to a custom scroller or virtual list." },
] as const;

export const parts = [
  { name: "Root", element: "div", description: "Owns collection, focus, and selected values." },
  { name: "RootProvider", element: "div", description: "Uses an external useSelectionList machine." },
  { name: "Label", element: "label", description: "Provides the accessible list name." },
  { name: "Input", element: "input", description: "Connects filtering input and list keyboard navigation." },
  { name: "Content", element: "div", description: "Scrollable listbox container." },
  { name: "Empty", element: "div", description: "Renders only when the collection is empty." },
  { name: "ItemGroup / ItemGroupLabel", element: "div", description: "Groups related options and names the group." },
  { name: "Item", element: "div", description: "One selectable option from the collection." },
  { name: "ItemMedia / ItemContent", element: "span / div", description: "Optional Kappa layout for media and stacked copy." },
  { name: "ItemText / ItemDescription / ItemMeta", element: "div / span", description: "Primary label, supporting copy, and compact metadata." },
  { name: "ItemIndicator", element: "div", description: "Shows the selected state with a default check." },
  { name: "ValueText", element: "span", description: "Formats selected item text from the collection." },
  { name: "Context / ItemContext", element: "slot", description: "Exposes root actions or current item state." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string[]", description: "Emitted when controlled selection changes." },
  { name: "valueChange", payload: "{ value, items }", description: "Emitted with selected values and resolved items." },
  { name: "select", payload: "{ value, valueAsString }", description: "Emitted for each selection action." },
  { name: "update:highlightedValue", payload: "string | null", description: "Emitted when controlled focus changes." },
  { name: "highlightChange", payload: "{ highlightedValue, highlightedItem }", description: "Emitted with the focused value and item." },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"selection-list" / "selection-list-item" / …', description: "Stable Kappa selectors for each named part." },
  { name: "data-selected", value: '""', description: "Present on selected items and their indicators." },
  { name: "data-focus / data-focus-visible", value: '""', description: "Keyboard focus state owned by Ark UI." },
  { name: "data-disabled", value: '""', description: "Present on disabled roots or items." },
  { name: "data-size", value: '"sm" | "base"', description: "Resolved Kappa density on the root." },
] as const;

export const exportsList = [
  { name: "SelectionList", description: "Compound namespace and root component." },
  { name: "SelectionList.Root / RootProvider", description: "Machine-owned and provider-owned roots." },
  { name: "SelectionList.Label / Input / Content / Empty", description: "List labeling, filtering, and collection parts." },
  { name: "SelectionList.Item* / ItemGroup*", description: "Selectable option behavior and rich Kappa item layout." },
  { name: "createSelectionListCollection", description: "Kappa alias for Ark createListCollection." },
  { name: "useSelectionList / useSelectionListContext / useSelectionListItemContext", description: "Kappa aliases for Ark listbox composables." },
  { name: "SelectionListProps / SelectionListEmits / SelectionListCollection", description: "Root, event, and collection contracts." },
] as const;
