export const barrelCode = `import {
  Autocomplete,
  createAutocompleteCollection,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Autocomplete,
  createAutocompleteCollection,
} from "@dicehub/kappa/components/autocomplete";`;

export const previewCode = `<script setup>
import { Autocomplete } from "@dicehub/kappa/components/autocomplete";

const commands = [
  { label: "Run simulation", value: "run" },
  { label: "Review mesh", value: "mesh" },
  { label: "Restart worker", value: "restart", disabled: true },
  { label: "Open results", value: "results" },
];

const isItemDisabled = (item) => item.disabled === true;
</script>

<template>
  <Autocomplete
    :items="commands"
    :input-attrs="{ 'aria-label': 'Find a command' }"
    :is-item-disabled="isItemDisabled"
    clearable
    empty-text="No matching command."
    input-behavior="autohighlight"
    placeholder="Find a command..."
  />
</template>`;

export const usageCode = `<script setup>
import { Autocomplete } from "@dicehub/kappa/components/autocomplete";

const commands = [
  { label: "Run simulation", value: "run" },
  { label: "Review mesh", value: "mesh" },
  { label: "Open results", value: "results" },
];
</script>

<template>
  <Autocomplete :items="commands">
    <Autocomplete.InputGroup
      aria-label="Find a command"
      placeholder="Find a command..."
    />
    <Autocomplete.Content teleport-to="body">
      <Autocomplete.Empty>No matching command.</Autocomplete.Empty>
      <Autocomplete.List>
        <template #default="{ item }">
          <Autocomplete.Item :item="item">
            {{ item.label }}
          </Autocomplete.Item>
        </template>
      </Autocomplete.List>
    </Autocomplete.Content>
  </Autocomplete>
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Autocomplete } from "@dicehub/kappa/components/autocomplete";

const inputValue = ref("");
const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Pear", value: "pear" },
];
</script>

<template>
  <Autocomplete
    v-model:input-value="inputValue"
    :items="fruits"
    :input-attrs="{ 'aria-label': 'Type a fruit' }"
    clearable
    placeholder="Type a fruit..."
  />
  <p>Input: {{ inputValue || "empty" }}</p>
</template>`;

export const fieldCode = `<script setup>
import { Autocomplete } from "@dicehub/kappa/components/autocomplete";

const countries = [
  { label: "Germany", value: "de" },
  { label: "Japan", value: "jp" },
  { label: "United States", value: "us" },
];
</script>

<template>
  <Autocomplete
    :items="countries"
    :input-attrs="{ 'aria-describedby': 'country-help' }"
    label="Country"
    placeholder="Search countries..."
  />
  <p id="country-help">Start typing to filter countries.</p>
</template>`;

export const invalidCode = `<script setup>
import { Autocomplete } from "@dicehub/kappa/components/autocomplete";

const countries = [
  { label: "Germany", value: "de" },
  { label: "Japan", value: "jp" },
  { label: "United States", value: "us" },
];
</script>

<template>
  <Autocomplete
    :items="countries"
    :input-attrs="{ 'aria-describedby': 'country-error' }"
    invalid
    label="Country"
    placeholder="Search countries..."
  />
  <p id="country-error">Please enter a supported country.</p>
</template>`;

export const groupedCode = `<script setup>
import { computed, ref } from "vue";
import {
  Autocomplete,
  createAutocompleteCollection,
} from "@dicehub/kappa/components/autocomplete";

const query = ref("");
const regions = [
  { label: "US East", value: "us-east", group: "North America" },
  { label: "EU Central", value: "eu-central", group: "Europe" },
  { label: "AP Northeast", value: "ap-northeast", group: "Asia Pacific" },
];

const collection = computed(() =>
  createAutocompleteCollection({
    items: query.value.trim()
      ? regions.filter((item) =>
          item.label.toLowerCase().includes(query.value.trim().toLowerCase()),
        )
      : [],
    groupBy: (item) => item.group,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  }),
);
</script>

<template>
  <Autocomplete v-model:input-value="query" :collection="collection">
    <Autocomplete.InputGroup
      aria-label="Find a region"
      placeholder="Find a region..."
    />
    <Autocomplete.Content>
      <Autocomplete.Empty>No matching region.</Autocomplete.Empty>
      <Autocomplete.List :render-items="false">
        <Autocomplete.Group
          v-for="[group, items] in collection.group()"
          :key="group"
        >
          <Autocomplete.GroupLabel>{{ group }}</Autocomplete.GroupLabel>
          <Autocomplete.Item v-for="item in items" :key="item.value" :item="item">
            {{ item.label }}
          </Autocomplete.Item>
        </Autocomplete.Group>
      </Autocomplete.List>
    </Autocomplete.Content>
  </Autocomplete>
</template>`;

export const sizesCode = `<script setup>
import { Autocomplete } from "@dicehub/kappa/components/autocomplete";

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Blueberry", value: "blueberry" },
];
</script>

<template>
  <Autocomplete size="xs" :items="fruits" :input-attrs="{ 'aria-label': 'Extra small' }" />
  <Autocomplete size="sm" :items="fruits" :input-attrs="{ 'aria-label': 'Small' }" />
  <Autocomplete size="base" :items="fruits" :input-attrs="{ 'aria-label': 'Base' }" />
  <Autocomplete size="lg" :items="fruits" :input-attrs="{ 'aria-label': 'Large' }" />
</template>`;

export const filteringCode = `<script setup>
import { Autocomplete } from "@dicehub/kappa/components/autocomplete";

const projects = [
  { label: "Aerofoil study", value: "aerofoil" },
  { label: "Cavity benchmark", value: "cavity" },
  { label: "Cylinder wake", value: "cylinder" },
];

const startsWith = (item, query) =>
  item.label.toLowerCase().startsWith(query.trim().toLowerCase());
</script>

<template>
  <Autocomplete
    :items="projects"
    :filter="startsWith"
    :input-attrs="{ 'aria-label': 'Filter projects' }"
    empty-text="No project starts with that text."
    placeholder="Filter projects..."
    show-on-empty
    show-trigger
  />
</template>`;

export const statesCode = `<script setup>
import { Autocomplete } from "@dicehub/kappa/components/autocomplete";

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Blueberry", value: "blueberry" },
];
</script>

<template>
  <Autocomplete
    :items="fruits"
    disabled
    label="Disabled"
    placeholder="Unavailable"
  />
  <Autocomplete
    :items="fruits"
    :default-value="['apple']"
    label="Read only"
    read-only
  />
</template>`;

export const rootProps = [
  { name: "items", type: "readonly T[]", defaultValue: "[]", description: "Items used by the convenience autocomplete UI." },
  { name: "collection", type: "AutocompleteCollection<T>", defaultValue: "-", description: "Ark list collection used for advanced composition and grouping." },
  { name: "itemToString", type: "(item: T) => string", defaultValue: "item.label ?? String(item)", description: "Maps an item to visible and searchable text." },
  { name: "itemToValue", type: "(item: T) => string", defaultValue: "item.value ?? itemToString(item)", description: "Maps an item to its stable option value." },
  { name: "isItemDisabled", type: "(item: T) => boolean", defaultValue: "false", description: "Marks matching items unavailable; keyboard navigation skips them." },
  { name: "filter", type: "AutocompleteFilter<T>", defaultValue: "contains label", description: "Local filtering rule. Pass false when filtering externally." },
  { name: "showOnEmpty", type: "boolean", defaultValue: "false", description: "Shows suggestions before the user enters a query." },
  { name: "emptyText", type: "string", defaultValue: '"No suggestions."', description: "Empty-state text for the convenience UI." },
  { name: "placeholder", type: "string", defaultValue: "-", description: "Placeholder for the convenience input." },
  { name: "label", type: "string", defaultValue: "-", description: "Visible accessible label rendered above the convenience input." },
  { name: "lazyMount", type: "boolean", defaultValue: "false", description: "Defers suggestion content mounting until the popup first opens." },
  { name: "unmountOnExit", type: "boolean", defaultValue: "false", description: "Unmounts suggestion content after its exit transition." },
  { name: "inputAttrs", type: "AutocompleteInputAttributes", defaultValue: "{}", description: "Attributes forwarded to the internal input, including aria-describedby." },
  { name: "ariaLabel", type: "string", defaultValue: "-", description: "Convenience accessible name for the internal input." },
  { name: "ariaDescribedby", type: "string", defaultValue: "-", description: "Convenience relationship to supporting or error text." },
  { name: "clearable", type: "boolean", defaultValue: "false", description: "Shows the clear trigger only while the input has a value." },
  { name: "showTrigger", type: "boolean", defaultValue: "false", description: "Shows the optional suggestion trigger." },
  { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"base"', description: "Control height and text density." },
  { name: "allowCustomValue", type: "boolean", defaultValue: "true", description: "Keeps free-form text valid when it is not a suggestion." },
  { name: "closeOnSelect", type: "boolean", defaultValue: "true", description: "Closes the suggestions after selection." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables input and interaction." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Makes the input non-editable while preserving its value." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks the control invalid for Ark state and styling." },
  { name: "inputBehavior", type: '"autohighlight" | "autocomplete" | "none"', defaultValue: '"none"', description: "Controls automatic highlighting and inline completion behavior." },
  { name: "inputValue", type: "string", defaultValue: "-", description: "Controlled input text." },
  { name: "defaultInputValue", type: "string", defaultValue: '""', description: "Initial input text for uncontrolled usage." },
  { name: "modelValue", type: "string[]", defaultValue: "-", description: "Controlled selected option values inherited from Ark UI." },
  { name: "defaultValue", type: "string[]", defaultValue: "[]", description: "Initial selected option values for uncontrolled usage." },
  { name: "positioning", type: "AutocompletePositioningOptions", defaultValue: "same-width, viewport-safe bottom-start", description: "Ark floating-position options with a 4px gutter and 8px overflow padding." },
] as const;

export const contentProps = [
  { name: "teleport", type: "boolean", defaultValue: "true", description: "Keeps the surface in the local DOM tree when false." },
  { name: "teleportTo", type: "string | HTMLElement", defaultValue: '"body"', description: "Portal target for the positioned suggestion surface." },
] as const;

export const events = [
  { name: "@update:input-value", type: "string", description: "Updates v-model:input-value with the current text." },
  { name: "@input-value-change", type: "AutocompleteInputValueChangeDetails", description: "Provides Ark input-change details." },
  { name: "@update:model-value", type: "string[]", description: "Updates v-model with the selected option values." },
  { name: "@value-change", type: "AutocompleteValueChangeDetails", description: "Provides details when selected option values change." },
  { name: "@update:open", type: "boolean", description: "Updates v-model:open with the suggestion-surface state." },
  { name: "@open-change", type: "AutocompleteOpenChangeDetails", description: "Provides details when the suggestion surface opens or closes." },
] as const;

export const exportsList = [
  { name: "Autocomplete", description: "Items-driven autocomplete with the compound parts attached as properties." },
  { name: "AutocompleteRoot", description: "Named root export for the same component." },
  { name: "AutocompleteInputGroup", description: "Input control with optional clear and suggestion triggers." },
  { name: "AutocompleteContent", description: "Portalled, positioned suggestion surface." },
  { name: "AutocompleteList", description: "Scrollable list with scoped item rendering." },
  { name: "AutocompleteItem / AutocompleteItemText / AutocompleteItemIndicator", description: "Selectable suggestion and its text and selected-state parts." },
  { name: "AutocompleteEmpty", description: "Empty state announced when no suggestion matches." },
  { name: "AutocompleteGroup / AutocompleteGroupLabel / AutocompleteSeparator", description: "Parts for grouped suggestion lists." },
  { name: "AutocompleteLabel", description: "Ark-connected accessible field label." },
  { name: "createAutocompleteCollection", description: "Kappa alias for Ark createListCollection." },
  { name: "useAutocompleteCollection", description: "Kappa alias for Ark useListCollection." },
  { name: "AUTOCOMPLETE_SIZES", description: "Readonly list of supported size names." },
  { name: "Autocomplete* types", description: "Public props, slots, event details, collection, filter, item, and positioning types." },
] as const;
