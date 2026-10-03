export const barrelCode = `import { ToggleGroup } from "@dicehub/kappa";`;

export const granularCode = `import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";

const view = ref(["board"]);
</script>

<template>
  <ToggleGroup.Root
    v-model="view"
    aria-label="View mode"
    variant="outline"
    spacing="none"
  >
    <ToggleGroup.Item value="list">List</ToggleGroup.Item>
    <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
    <ToggleGroup.Item value="timeline">Timeline</ToggleGroup.Item>
  </ToggleGroup.Root>
</template>`;

export const usageCode = `<script setup>
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";
</script>

<template>
  <ToggleGroup.Root :default-value="['board']" aria-label="View mode">
    <ToggleGroup.Item value="list">List</ToggleGroup.Item>
    <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
    <ToggleGroup.Item value="timeline">Timeline</ToggleGroup.Item>
  </ToggleGroup.Root>
</template>`;

export const multipleCode = `<script setup>
import { ref } from "vue";
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";

const columns = ref(["status", "owner"]);
</script>

<template>
  <ToggleGroup.Root v-model="columns" multiple aria-label="Visible columns">
    <ToggleGroup.Item value="status">Status</ToggleGroup.Item>
    <ToggleGroup.Item value="owner">Owner</ToggleGroup.Item>
    <ToggleGroup.Item value="updated">Updated</ToggleGroup.Item>
  </ToggleGroup.Root>
</template>`;

export const verticalCode = `<script setup>
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";
</script>

<template>
  <ToggleGroup.Root
    :default-value="['board']"
    aria-label="View mode"
    orientation="vertical"
    variant="outline"
  >
    <ToggleGroup.Item value="list">List</ToggleGroup.Item>
    <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
    <ToggleGroup.Item value="timeline">Timeline</ToggleGroup.Item>
  </ToggleGroup.Root>
</template>`;

export const sizesCode = `<script setup>
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";
</script>

<template>
  <ToggleGroup.Root :default-value="['base']" aria-label="Density" size="sm">
    <ToggleGroup.Item value="small">Small</ToggleGroup.Item>
    <ToggleGroup.Item value="base">Base</ToggleGroup.Item>
    <ToggleGroup.Item value="large">Large</ToggleGroup.Item>
  </ToggleGroup.Root>
</template>`;

export const statesCode = `<script setup>
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";
</script>

<template>
  <ToggleGroup.Root
    :default-value="['available']"
    aria-label="Unavailable options"
    variant="outline"
  >
    <ToggleGroup.Item value="available">Available</ToggleGroup.Item>
    <ToggleGroup.Item value="pending" disabled>Pending</ToggleGroup.Item>
  </ToggleGroup.Root>

  <ToggleGroup.Root
    :default-value="['locked']"
    aria-label="Locked choice"
    disabled
  >
    <ToggleGroup.Item value="locked">Locked</ToggleGroup.Item>
  </ToggleGroup.Root>
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";

const selected = ref(["board"]);
</script>

<template>
  <ToggleGroup.Root v-model="selected" aria-label="View mode">
    <ToggleGroup.Item value="list">List</ToggleGroup.Item>
    <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
  </ToggleGroup.Root>
  <output aria-live="polite">Selected: {{ selected.join(", ") }}</output>
</template>`;

export const compositionCode = `<ToggleGroup.Root>
  <ToggleGroup.Item value="one">One</ToggleGroup.Item>
  <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
</ToggleGroup.Root>`;

export const rootProps = [
  { name: "defaultValue", type: "string[]", defaultValue: "[]", description: "Initial selected values for an uncontrolled group." },
  { name: "modelValue", type: "string[]", defaultValue: "—", description: "Controlled selected values. Use with v-model." },
  { name: "multiple", type: "boolean", defaultValue: "false", description: "Allows more than one item to be selected." },
  { name: "deselectable", type: "boolean", defaultValue: "true", description: "Allows the selected item to be cleared in single-select mode." },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Sets the layout and arrow-key axis." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables the group and all of its items." },
  { name: "loopFocus / rovingFocus", type: "boolean", defaultValue: "true", description: "Controls arrow-key wrapping and roving tab focus." },
  { name: "variant", type: '"default" | "outline"', defaultValue: '"default"', description: "Selects the quiet or bordered Kappa treatment." },
  { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Selects the item height and text geometry." },
  { name: "spacing", type: '"none" | "sm" | "md"', defaultValue: '"sm"', description: "Sets the gap between items. Use none for a connected group." },
  { name: "id / ids / asChild", type: "string / partial ID map / boolean", defaultValue: "generated / false", description: "Overrides machine IDs or composes the root with a direct child." },
] as const;

export const itemProps = [
  { name: "value", type: "string", defaultValue: "required", description: "Stable item value used in the selected array." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Blocks focus and selection for this item." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Composes item behavior with its direct child." },
] as const;

export const parts = [
  { name: "Root", element: "div", description: "Owns selection state, group semantics, and roving focus." },
  { name: "RootProvider", element: "div", description: "Provides an externally created Ark toggle-group machine." },
  { name: "Item", element: "button", description: "Selectable item with radio or pressed semantics." },
  { name: "Context", element: "renderless", description: "Exposes the current value and Ark group API to a slot." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string[]", description: "Updates v-model after a selection change." },
  { name: "valueChange", payload: "ToggleGroupValueChangeDetails", description: "Reports the next selected value array." },
] as const;

export const slots = [
  { name: "Root.default", description: "ToggleGroup.Item elements or composed children." },
  { name: "Item.default", description: "Visible text, icon, or both inside the item button." },
  { name: "Context.default", description: "Receives the renderless group context." },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"toggle-group" | "toggle-group-item"', description: "Identifies Kappa root and item parts." },
  { name: "data-scope / data-part", value: '"toggle-group" / "root" | "item"', description: "Ark UI anatomy markers." },
  { name: "data-state", value: '"on" | "off"', description: "Exposes each item selection state." },
  { name: "data-disabled", value: "present", description: "Appears on disabled roots or items." },
  { name: "data-orientation", value: '"horizontal" | "vertical"', description: "Exposes the group axis." },
  { name: "data-variant / data-size / data-spacing", value: "resolved option", description: "Exposes Kappa visual options on the root." },
] as const;

export const exportsList = [
  { name: "ToggleGroup", description: "Compound Ark-backed selection group." },
  { name: "ToggleGroupRoot / RootProvider / Item / Context", description: "Named component parts." },
  { name: "ToggleGroupProps / ItemProps / ToggleGroupEmits / Slots", description: "Public Vue props, events, and slot contracts." },
  { name: "ToggleGroupVariant / Size / Spacing", description: "Kappa visual option types." },
  { name: "TOGGLE_GROUP_* / isToggleGroup* / resolveToggleGroup*", description: "Option lists, defaults, guards, and resolvers." },
  { name: "useToggleGroup / useToggleGroupContext / toggleGroupAnatomy", description: "Ark UI composition exports." },
] as const;

export const keyboardRows = [
  { key: "Tab", description: "Moves into or out of the group through the roving tab stop." },
  { key: "Arrow keys", description: "Moves focus along the horizontal or vertical group axis." },
  { key: "Home / End", description: "Moves focus to the first or last enabled item." },
  { key: "Space / Enter", description: "Toggles or selects the focused item." },
] as const;
