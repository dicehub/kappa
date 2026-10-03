export const barrelCode = `import { Select, createSelectCollection } from "@dicehub/kappa";`;

export const granularCode = `import {
  Select,
  createSelectCollection,
} from "@dicehub/kappa/components/select";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/kappa/components/select";

const region = ref(["eu-central"]);
const regions = [
  { label: "EU Central · Frankfurt", value: "eu-central" },
  { label: "EU West · Dublin", value: "eu-west" },
  { label: "US East · Virginia", value: "us-east" },
];
</script>

<template>
  <Select
    v-model="region"
    :items="regions"
    label="Compute region"
    description="Routes the run to the selected cluster."
    name="compute-region"
    placeholder="Select a region"
  />
</template>`;

export const usageCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/kappa/components/select";

const value = ref(["openfoam"]);
const formats = [
  { label: "OpenFOAM mesh", value: "openfoam" },
  { label: "Binary mesh", value: "binary" },
  { label: "Fluent mesh", value: "fluent" },
  { label: "STAR-CCM+ mesh", value: "star", disabled: true },
];
</script>

<template>
  <Select
    v-model="value"
    :items="formats"
    label="Mesh format"
    name="mesh-format"
    placeholder="Select a format"
  />
</template>`;

export const groupedCode = `<script setup>
import { ref } from "vue";
import {
  Select,
  createSelectCollection,
} from "@dicehub/kappa/components/select";

const solver = ref(["gamg"]);
const solvers = [
  { label: "GAMG", value: "gamg", group: "Pressure" },
  { label: "PCG", value: "pcg", group: "Pressure" },
  { label: "PBiCGStab", value: "pbicgstab", group: "Momentum" },
  { label: "smoothSolver", value: "smooth", group: "Momentum" },
  { label: "diagonal", value: "diagonal", group: "Direct" },
];
const collection = createSelectCollection({
  items: solvers,
  groupBy: (item) => item.group,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Select v-model="solver" :collection="collection">
    <template #default="{ collection: visibleCollection }">
      <Select.Label>Linear solver</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select a solver" />
          <Select.Indicator />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.List :render-items="false">
            <Select.Group v-for="[group, items] in visibleCollection.group()" :key="group">
              <Select.GroupLabel>{{ group }}</Select.GroupLabel>
              <Select.Option v-for="item in items" :key="item.value" :item="item">
                {{ item.label }}
              </Select.Option>
            </Select.Group>
          </Select.List>
        </Select.Content>
      </Select.Positioner>
    </template>
  </Select>
</template>`;

export const multipleCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/kappa/components/select";

const selectedColumns = ref(["name", "location", "size"]);
const columns = [
  { label: "Name", value: "name" },
  { label: "Location", value: "location" },
  { label: "Size", value: "size" },
  { label: "Read", value: "read" },
  { label: "Write", value: "write" },
  { label: "Created at", value: "created-at" },
];
</script>

<template>
  <Select
    v-model="selectedColumns"
    :items="columns"
    label="Visible columns"
    multiple
    name="visible-columns"
    placeholder="Select columns"
  />
</template>`;

export const placementCode = `<script setup>
import { Select } from "@dicehub/kappa/components/select";

const planets = [
  { label: "Mercury", value: "mercury" },
  { label: "Venus", value: "venus" },
  { label: "Earth", value: "earth" },
  { label: "Mars", value: "mars" },
];
</script>

<template>
  <Select
    :default-value="['earth']"
    :items="planets"
    :positioning="{ flip: false, placement: 'bottom-start' }"
    label="bottom-start (default)"
  />
  <Select
    :default-value="['earth']"
    :items="planets"
    :positioning="{ flip: false, placement: 'top-start' }"
    label="top-start"
  />
  <Select
    :default-value="['earth']"
    :items="planets"
    :positioning="{ flip: false, placement: 'bottom-end' }"
    label="bottom-end"
  />
  <Select
    :default-value="['earth']"
    :items="planets"
    :positioning="{ flip: false, gutter: 12, placement: 'bottom-start' }"
    label="gutter: 12"
  />
</template>`;

export const alignmentCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/kappa/components/select";

const anchoredPlanet = ref(["mars"]);
const alignedPlanet = ref(["mars"]);
const planets = [
  { label: "Mercury", value: "mercury" },
  { label: "Venus", value: "venus" },
  { label: "Earth", value: "earth" },
  { label: "Mars", value: "mars" },
  { label: "Jupiter", value: "jupiter" },
  { label: "Saturn", value: "saturn" },
  { label: "Uranus", value: "uranus" },
  { label: "Neptune", value: "neptune" },
];
</script>

<template>
  <Select
    v-model="anchoredPlanet"
    :items="planets"
    aria-label="Anchored planet"
  />
  <Select
    v-model="alignedPlanet"
    :items="planets"
    align-item-with-trigger
    aria-label="Aligned planet"
  />
</template>`;

export const sizesCode = `<script setup>
import { Select } from "@dicehub/kappa/components/select";

const options = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
];
</script>

<template>
  <div v-for="size in ['xs', 'sm', 'base', 'lg']" :key="size">
    <span>{{ size }}</span>
    <Select
      :size="size"
      :items="options"
      :aria-label="\`Select size \${size}\`"
      placeholder="Choose..."
    />
  </div>
</template>`;

export const longListCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/kappa/components/select";

const value = ref([]);
const options = Array.from({ length: 50 }, (_, index) => ({
  label: \`Option \${String(index + 1).padStart(2, "0")}\`,
  value: \`option-\${index + 1}\`,
}));
</script>

<template>
  <Select
    v-model="value"
    :items="options"
    label="Long list select"
    description="Tests scrolling behavior with many options."
    placeholder="Choose an option"
  />
</template>`;

export const statesCode = `<script setup>
import { Select } from "@dicehub/kappa/components/select";

const formats = [
  { label: "OpenFOAM mesh", value: "openfoam" },
  { label: "Binary mesh", value: "binary" },
  { label: "Fluent mesh", value: "fluent" },
];
</script>

<template>
  <Select :items="formats" disabled label="Source format" placeholder="Unavailable" />
  <Select :items="formats" :default-value="['openfoam']" read-only label="Pinned format" />
  <Select :items="formats" error="Select one supported output format." label="Output format" required />
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/kappa/components/select";

const region = ref(["eu-west"]);
const regions = [
  { label: "EU Central · Frankfurt", value: "eu-central" },
  { label: "EU West · Dublin", value: "eu-west" },
  { label: "US East · Virginia", value: "us-east" },
];
</script>

<template>
  <Select v-model="region" :items="regions" label="Failover region" />
  <output aria-live="polite">Controlled value: {{ region[0] }}</output>
</template>`;

export const rtlCode = `<script setup>
import { Select } from "@dicehub/kappa/components/select";

const regions = [
  { label: "فرانكفورت · أوروبا الوسطى", value: "eu-central" },
  { label: "دبلن · أوروبا الغربية", value: "eu-west" },
  { label: "فرجينيا · شرق الولايات المتحدة", value: "us-east" },
];
</script>

<template>
  <Select dir="rtl" :items="regions" label="منطقة الحساب" placeholder="اختر منطقة" />
</template>`;

export const examples = [
  {
    id: "grouped",
    title: "Grouped options",
    variant: "grouped",
    description: "Render filtered collection groups while keeping Ark's active option and keyboard state.",
    code: groupedCode,
  },
  {
    id: "multiple",
    title: "Multiple values",
    variant: "multiple",
    description: "Keep selected rows identifiable with check marks while only the active row receives a highlight.",
    code: multipleCode,
  },
  {
    id: "placement",
    title: "Placement",
    variant: "placement",
    description: "Set Ark's placement and gutter through the positioning prop. These examples disable collision flipping so each position stays visible.",
    code: placementCode,
  },
  {
    id: "aligned-to-the-selected-option",
    title: "Aligned to the selected option",
    variant: "alignment",
    description: "Overlay the selected option on the trigger when space permits. Kappa falls back to anchored placement near a viewport edge.",
    code: alignmentCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    variant: "sizes",
    description: "Use the compact sizes for dense toolbars and the base size for form fields.",
    code: sizesCode,
  },
  {
    id: "states",
    title: "Disabled, read-only, and invalid",
    variant: "states",
    description: "Keep unavailable controls explicit and connect errors to the trigger.",
    code: statesCode,
  },
  {
    id: "controlled",
    title: "Controlled value",
    variant: "controlled",
    description: "Drive the selected value from Vue state and expose it to a live output.",
    code: controlledCode,
  },
  {
    id: "long-list-scrolling-test",
    title: "Long list (scrolling test)",
    variant: "long-list",
    description: "Use the bounded popup for long collections. Scrolling stays inside the list without page bounce.",
    code: longListCode,
  },
  {
    id: "rtl",
    title: "Right to left",
    variant: "rtl",
    description: "Ark locale direction and Kappa logical geometry support right-to-left interfaces.",
    code: rtlCode,
  },
] as const;

export const rootProps = [
  { name: "alignItemWithTrigger", type: "boolean", defaultValue: "false", description: "Center the selected option over the trigger when viewport space permits." },
  { name: "items", type: "readonly T[]", defaultValue: "[]", description: "Convenience collection. Objects may expose label, value, and disabled." },
  { name: "collection", type: "ListCollection<T>", defaultValue: "generated", description: "Ark collection for custom item mapping, grouping, and advanced rendering." },
  { name: "modelValue", type: "string[]", defaultValue: "undefined", description: "Controlled selected values. A single-select value uses a one-item array internally." },
  { name: "defaultValue", type: "string[]", defaultValue: "[]", description: "Initial selected values for uncontrolled usage." },
  { name: "multiple", type: "boolean", defaultValue: "false", description: "Allow more than one option and keep the popup open after selection by default." },
  { name: "open / defaultOpen", type: "boolean", defaultValue: "false", description: "Control or initialize popup visibility." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevent focus, opening, and selection." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Keep the value visible while preventing changes." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Mark the control invalid. error also enables this state." },
  { name: "required", type: "boolean", defaultValue: "false", description: "Apply required form semantics to the hidden native select." },
  { name: "label / description / error", type: "string", defaultValue: "undefined", description: "Convenience field content with label and description/error relationships." },
  { name: "itemToString / itemToValue / isItemDisabled", type: "function", defaultValue: "object defaults", description: "Map custom collection records to accessible text, values, and disabled state." },
  { name: "size", type: "'xs' | 'sm' | 'base' | 'lg'", defaultValue: "'base'", description: "Kappa control geometry." },
  { name: "positioning", type: "Ark PositioningOptions", defaultValue: "same width, bottom-start", description: "Forwarded Ark floating-position options." },
  { name: "dir", type: "'ltr' | 'rtl'", defaultValue: "inherited", description: "Locale direction used by Ark keyboard and placement behavior." },
] as const;

export const itemProps = [
  { name: "item", type: "T", defaultValue: "undefined", description: "Collection item. Preferred for object collections." },
  { name: "value", type: "T", defaultValue: "undefined", description: "Resolve an item by value from the nearest collection." },
  { name: "persistFocus", type: "boolean", defaultValue: "false", description: "Keep focus on the option after selection." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merge Ark item behavior into a custom element." },
] as const;

export const parts = [
  { name: "Root / RootProvider", element: "div", description: "Own Ark state, collection, controlled values, and compound context." },
  { name: "Label", element: "label", description: "Names the trigger and links it to the field." },
  { name: "Control / Trigger", element: "div / button", description: "The focusable combobox trigger and its visual control." },
  { name: "ValueText / Indicator", element: "span / div", description: "Selected label, placeholder, and disclosure indicator." },
  { name: "Positioner / Content", element: "div", description: "Teleported floating surface with Ark positioning." },
  { name: "List / Option", element: "div", description: "Collection list and selectable options." },
  { name: "ItemText / ItemIndicator", element: "span", description: "Accessible option text and selected mark." },
  { name: "Group / GroupLabel", element: "div", description: "Optional semantic grouping for related options." },
  { name: "Separator", element: "div", description: "Optional semantic divider between option groups." },
  { name: "ClearTrigger", element: "button", description: "Clears selected values when the composition includes it." },
  { name: "HiddenSelect", element: "select", description: "Native form bridge. The convenience root adds it automatically." },
  { name: "Context / ItemContext", element: "slot", description: "Expose Ark state for advanced render logic." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string[]", description: "Controlled selected values changed." },
  { name: "valueChange", payload: "SelectValueChangeDetails", description: "Ark selection details." },
  { name: "update:open / openChange", payload: "boolean / SelectOpenChangeDetails", description: "Popup visibility changed." },
  { name: "update:highlightedValue / highlightChange", payload: "string / SelectHighlightChangeDetails", description: "Active option changed." },
  { name: "select", payload: "SelectSelectionDetails", description: "An option was selected." },
  { name: "focusOutside / interactOutside / pointerDownOutside", payload: "Ark outside event", description: "The popup interacted with or lost focus outside." },
] as const;

export const exportsList = [
  { name: "Select", description: "Namespace and convenience root with all compound parts." },
  { name: "SelectRoot / SelectOption", description: "Named root and option aliases." },
  { name: "createSelectCollection", description: "Ark ListCollection factory for custom records and groups." },
  { name: "SelectProps / SelectEmits / SelectSlots", description: "Kappa root contracts." },
  { name: "SelectSelectionDetails", description: "Typed payload for the select event, derived from Ark RootEmits." },
  { name: "SelectRootProvider / SelectApi", description: "Advanced shared Ark machine composition." },
  { name: "SELECT_SIZES / SELECT_DEFAULT_SIZE", description: "Supported Kappa size values." },
  { name: "selectAnatomy / useSelect / useSelectContext", description: "Ark UI behavior and anatomy exports." },
] as const;
