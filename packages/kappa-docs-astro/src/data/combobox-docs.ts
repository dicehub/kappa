export const barrelCode = `import {
  Combobox,
  createComboboxCollection,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Combobox,
  createComboboxCollection,
} from "@dicehub/kappa/components/combobox";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Combobox } from "@dicehub/kappa/components/combobox";

const value = ref(["eu-central"]);
const regions = [
  { label: "EU Central · Frankfurt", value: "eu-central" },
  { label: "EU West · Dublin", value: "eu-west" },
  { label: "US East · Virginia", value: "us-east" },
];
</script>

<template>
  <Combobox
    v-model="value"
    :items="regions"
    label="Compute region"
    description="Routes the run to the selected cluster."
    input-behavior="autohighlight"
    placeholder="Select a region"
  />
</template>`;

export const usageCode = `<script setup>
import { ref } from "vue";
import {
  Combobox,
  createComboboxCollection,
} from "@dicehub/kappa/components/combobox";

const value = ref(["openfoam"]);
const collection = createComboboxCollection({
  items: [
    { label: "Binary mesh", value: "binary" },
    { label: "OpenFOAM mesh", value: "openfoam" },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Combobox v-model="value" :collection="collection" label="Mesh format">
    <Combobox.TriggerInput placeholder="Select a format" />
    <Combobox.Content>
      <Combobox.Empty>No matching format.</Combobox.Empty>
      <Combobox.List>
        <template #default="{ item }">
          <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
        </template>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;

export const popupSearchCode = `<Combobox v-model="language" :collection="languages">
  <Combobox.TriggerValue placeholder="Select a language" />
  <Combobox.Content>
    <Combobox.Input aria-label="Search languages" placeholder="Search languages" />
    <Combobox.Empty>No matching language.</Combobox.Empty>
    <Combobox.List>
      <template #default="{ item }">
        <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
      </template>
    </Combobox.List>
  </Combobox.Content>
</Combobox>`;

export const customTriggerCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Combobox } from "@dicehub/kappa/components/combobox";
</script>

<template>
  <Combobox v-model="language" :collection="languages">
    <Combobox.Trigger as-child>
      <Button variant="outline">
        Language: <Combobox.Value />
      </Button>
    </Combobox.Trigger>
    <Combobox.Content :same-width="false">
      <Combobox.List>
        <template #default="{ item }">
          <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
        </template>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;

export const groupedCode = `<script setup>
import { Combobox, createComboboxCollection } from "@dicehub/kappa/components/combobox";

const collection = createComboboxCollection({
  items: solvers,
  groupBy: (item) => item.group,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Combobox v-model="solver" :collection="collection">
    <template #default="{ collection: filteredCollection }">
      <Combobox.TriggerInput placeholder="Select a solver" />
      <Combobox.Content>
        <Combobox.Empty>No matching solver.</Combobox.Empty>
        <Combobox.List :render-items="false">
          <Combobox.Group
            v-for="[group, items] in filteredCollection.group()"
            :key="group"
          >
            <Combobox.GroupLabel>{{ group }}</Combobox.GroupLabel>
            <Combobox.Item v-for="item in items" :key="item.value" :item="item">
              {{ item.label }}
            </Combobox.Item>
          </Combobox.Group>
        </Combobox.List>
      </Combobox.Content>
    </template>
  </Combobox>
</template>`;

export const multipleCode = `<Combobox v-model="tags" :collection="tagCollection" multiple>
  <Combobox.TriggerMultipleWithInput placeholder="Add a tag" />
  <Combobox.Content>
    <Combobox.Empty>No matching tag.</Combobox.Empty>
    <Combobox.List>
      <template #default="{ item }">
        <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
      </template>
    </Combobox.List>
  </Combobox.Content>
</Combobox>`;

export const sizesCode = `<Combobox size="xs" :items="regions" aria-label="Extra small region" />
<Combobox size="sm" :items="regions" aria-label="Small region" />
<Combobox size="base" :items="regions" aria-label="Base region" />
<Combobox size="lg" :items="regions" aria-label="Large region" />`;

export const statesCode = `<Combobox
  :items="formats"
  disabled
  label="Source format"
  placeholder="Unavailable"
/>

<Combobox
  v-model="format"
  :items="formats"
  error="Select one supported output format."
  label="Output format"
  placeholder="Required"
  required
/>`;

export const rootProps = [
  { name: "items", type: "readonly T[]", defaultValue: "[]", description: "Items for the convenience composition." },
  { name: "collection", type: "ComboboxCollection<T>", defaultValue: "generated", description: "Ark list collection for mapped items, groups, and disabled state." },
  { name: "modelValue", type: "string[]", defaultValue: "-", description: "Controlled selection; supports v-model." },
  { name: "defaultValue", type: "string[]", defaultValue: "[]", description: "Initial uncontrolled selection." },
  { name: "inputValue", type: "string", defaultValue: "-", description: "Controlled text; supports v-model:input-value." },
  { name: "open", type: "boolean", defaultValue: "-", description: "Controlled popup state; supports v-model:open." },
  { name: "multiple", type: "boolean", defaultValue: "false", description: "Allows more than one selected value." },
  { name: "allowCustomValue", type: "boolean", defaultValue: "false", description: "Allows text that is not a collection item when true." },
  { name: "filter", type: "false | (item, query) => boolean", defaultValue: "contains label", description: "Local filter. Pass false for external filtering." },
  { name: "itemToString", type: "(item) => string", defaultValue: "item.label", description: "Maps an item to visible and searchable text." },
  { name: "itemToValue", type: "(item) => string", defaultValue: "item.value", description: "Maps an item to its stable value." },
  { name: "isItemDisabled", type: "(item) => boolean", defaultValue: "item.disabled", description: "Marks options unavailable and removes them from keyboard selection." },
  { name: "showOnEmpty", type: "boolean", defaultValue: "true", description: "Shows all items before a query is entered." },
  { name: "closeOnSelect", type: "boolean", defaultValue: "!multiple", description: "Closes after selection for single-value use." },
  { name: "selectionBehavior", type: '"clear" | "replace" | "preserve"', defaultValue: "clear for multiple; replace otherwise", description: "Controls input text after selection." },
  { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"base"', description: "Control height and text density." },
  { name: "disabled / readOnly / invalid / required", type: "boolean", defaultValue: "false", description: "Field interaction and validation states." },
  { name: "label / description / error", type: "string", defaultValue: "-", description: "Connected field copy for the convenience composition." },
  { name: "positioning", type: "ComboboxPositioningOptions", defaultValue: "viewport-safe bottom-start", description: "Ark floating position options." },
  { name: "lazyMount / unmountOnExit", type: "boolean", defaultValue: "false", description: "Popup render strategy." },
] as const;

export const partProps = [
  { name: "Combobox.TriggerInput", element: "input control", description: "Editable trigger with optional clear and toggle buttons." },
  { name: "Combobox.TriggerValue", element: "button", description: "Select-like trigger that displays the current value." },
  { name: "Combobox.TriggerMultipleWithInput", element: "input control", description: "Chip list and filter input for multiple selection." },
  { name: "Combobox.Content", element: "div", description: "Portalled popup. It also accepts every Ark positioning option." },
  { name: "Combobox.Input", element: "input", description: "Ark-connected input for custom controls or popup search." },
  { name: "Combobox.List", element: "div", description: "Scrollable listbox with scoped item rendering." },
  { name: "Combobox.Item", element: "div", description: "Selectable option with text and selected indicator parts." },
  { name: "Combobox.Group / GroupLabel", element: "div", description: "Accessible grouped-option structure." },
  { name: "Combobox.Chip", element: "span", description: "Selected value with an accessible remove button." },
  { name: "Combobox.Trigger / Value", element: "button / span", description: "Low-level parts for a custom select-like trigger." },
  { name: "Combobox.Control / ClearTrigger", element: "div / button", description: "Low-level editable-control composition." },
  { name: "Combobox.Empty / Separator / Context", element: "various", description: "Empty, visual grouping, and reactive state helpers." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string[]", description: "Updates v-model after selection changes." },
  { name: "valueChange", payload: "ComboboxValueChangeDetails<T>", description: "Provides selected values and items." },
  { name: "update:inputValue", payload: "string", description: "Updates v-model:input-value after text changes." },
  { name: "inputValueChange", payload: "ComboboxInputValueChangeDetails", description: "Provides text and the Ark change reason." },
  { name: "update:open", payload: "boolean", description: "Updates v-model:open." },
  { name: "openChange", payload: "ComboboxOpenChangeDetails", description: "Provides the new popup state and reason." },
  { name: "highlightChange / select", payload: "Ark details", description: "Reports active-option and selection interactions." },
] as const;

export const exportsList = [
  { name: "Combobox", description: "Compound component with every Kappa part attached." },
  { name: "ComboboxRoot", description: "Unaugmented root component." },
  { name: "Combobox* parts", description: "Named exports for all controls, triggers, popup, list, item, group, chip, and context parts." },
  { name: "createComboboxCollection", description: "Kappa alias for Ark createListCollection." },
  { name: "useComboboxCollection", description: "Reactive collection helper." },
  { name: "useCombobox / useComboboxContext / useComboboxItemContext", description: "Ark state and context hooks." },
  { name: "comboboxAnatomy", description: "Ark part anatomy metadata." },
  { name: "COMBOBOX_SIZES", description: "Readonly list of supported sizes." },
  { name: "Combobox* types", description: "Root, part, event, collection, filter, item, and positioning contracts." },
] as const;
