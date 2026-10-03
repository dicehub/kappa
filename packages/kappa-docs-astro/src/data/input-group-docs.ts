export const barrelCode = `import { InputGroup } from "@dicehub/kappa";`;

export const granularCode = `import { InputGroup } from "@dicehub/kappa/components/input-group";`;

export const previewCode = `<script setup>
import { Link2, Search } from "@lucide/vue";
import { ref } from "vue";
import { InputGroup } from "@dicehub/kappa/components/input-group";

const endpoint = ref("");
</script>

<template>
  <InputGroup aria-label="Repository endpoint">
    <InputGroup.Input
      v-model="endpoint"
      aria-label="Repository endpoint"
      placeholder="repository.example"
      type="url"
    />
    <InputGroup.Addon align="inline-start">
      <InputGroup.Text><Link2 aria-hidden="true" /> https://</InputGroup.Text>
    </InputGroup.Addon>
    <InputGroup.Addon align="inline-end">
      <InputGroup.Button aria-label="Inspect endpoint" shape="square">
        <Search aria-hidden="true" />
      </InputGroup.Button>
    </InputGroup.Addon>
  </InputGroup>
</template>`;

export const usageCode = `<script setup>
import { Search } from "@lucide/vue";
import { InputGroup } from "@dicehub/kappa/components/input-group";
</script>

<template>
  <InputGroup aria-label="Search runs">
    <InputGroup.Input aria-label="Search runs" placeholder="Search runs..." />
    <InputGroup.Addon align="inline-start">
      <Search aria-hidden="true" />
    </InputGroup.Addon>
  </InputGroup>
</template>`;

export const alignmentCode = `<script setup>
import { FileCode2 } from "@lucide/vue";
import { InputGroup } from "@dicehub/kappa/components/input-group";
</script>

<template>
  <InputGroup aria-label="Request path">
    <InputGroup.Input aria-label="Request path" placeholder="/runs" />
    <InputGroup.Addon align="block-start">
      <FileCode2 aria-hidden="true" /> Request path
    </InputGroup.Addon>
  </InputGroup>
</template>`;

export const textCode = `<script setup>
import { InputGroup } from "@dicehub/kappa/components/input-group";
</script>

<template>
  <InputGroup aria-label="Amount">
    <InputGroup.Input aria-label="Amount" placeholder="0.00" />
    <InputGroup.Addon align="inline-start">
      <InputGroup.Text>$</InputGroup.Text>
    </InputGroup.Addon>
    <InputGroup.Addon align="inline-end">
      <InputGroup.Text>USD</InputGroup.Text>
    </InputGroup.Addon>
  </InputGroup>
</template>`;

export const buttonCode = `<script setup>
import { Copy } from "@lucide/vue";
import { InputGroup } from "@dicehub/kappa/components/input-group";
</script>

<template>
  <InputGroup aria-label="Access token">
    <InputGroup.Input aria-label="Access token" readonly value="••••••••" />
    <InputGroup.Addon align="inline-end">
      <InputGroup.Button aria-label="Copy access token" shape="square">
        <Copy aria-hidden="true" />
      </InputGroup.Button>
    </InputGroup.Addon>
  </InputGroup>
</template>`;

export const textareaCode = `<script setup>
import { SendHorizontal } from "@lucide/vue";
import { InputGroup } from "@dicehub/kappa/components/input-group";
</script>

<template>
  <InputGroup aria-label="Release note">
    <InputGroup.Textarea
      aria-label="Release note"
      placeholder="Describe the solver change..."
      rows="3"
    />
    <InputGroup.Addon align="block-end">
      <InputGroup.Text>0/280</InputGroup.Text>
      <InputGroup.Button aria-label="Post release note" shape="square">
        <SendHorizontal aria-hidden="true" />
      </InputGroup.Button>
    </InputGroup.Addon>
  </InputGroup>
</template>`;

export const statesCode = `<script setup>
import { InputGroup } from "@dicehub/kappa/components/input-group";
</script>

<template>
  <InputGroup invalid aria-label="Invalid run name">
    <InputGroup.Input aria-label="Invalid run name" value="bad/name" />
    <InputGroup.Addon align="inline-end">
      <InputGroup.Text>Required</InputGroup.Text>
    </InputGroup.Addon>
  </InputGroup>

  <InputGroup disabled aria-label="Archived run name">
    <InputGroup.Input aria-label="Archived run name" value="archived-run" />
  </InputGroup>

  <InputGroup aria-label="Loading run search">
    <InputGroup.Input aria-label="Loading run search" placeholder="Searching..." />
    <InputGroup.Addon align="inline-end">
      <InputGroup.Button loading aria-label="Search in progress" shape="square" />
    </InputGroup.Addon>
  </InputGroup>
</template>`;

export const sizesCode = `<script setup>
import { Search } from "@lucide/vue";
import { InputGroup } from "@dicehub/kappa/components/input-group";
</script>

<template>
  <InputGroup size="sm" aria-label="Small search">
    <InputGroup.Input aria-label="Small search" placeholder="Search" />
    <InputGroup.Addon align="inline-start"><Search aria-hidden="true" /></InputGroup.Addon>
  </InputGroup>
</template>`;

export const rtlCode = `<script setup>
import { Search } from "@lucide/vue";
import { InputGroup } from "@dicehub/kappa/components/input-group";
</script>

<template>
  <div dir="rtl" lang="ar">
    <InputGroup aria-label="بحث في التشغيلات">
      <InputGroup.Input aria-label="بحث في التشغيلات" placeholder="ابحث..." />
      <InputGroup.Addon align="inline-start"><Search aria-hidden="true" /></InputGroup.Addon>
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>١٢ نتيجة</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup>
  </div>
</template>`;

export const inputGroupProps = [
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Shared compact control density. A child part can override it.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables controls in the group and exposes aria-disabled on the group.",
  },
  {
    name: "invalid",
    type: "boolean",
    defaultValue: "false",
    description: "Marks the group and its input controls invalid.",
  },
] as const;

export const addonProps = [
  {
    name: "align",
    type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
    defaultValue: '"inline-start"',
    description: "Logical visual placement. Keep the addon after the control in DOM order.",
  },
] as const;

export const controlProps = [
  {
    name: "modelValue",
    type: "string | number",
    defaultValue: "—",
    description: "Controlled value for v-model. Input events emit strings.",
  },
  {
    name: "defaultValue",
    type: "string | number",
    defaultValue: "—",
    description: "Initial value for uncontrolled use.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: "parent size",
    description: "Overrides the shared group density for this control.",
  },
  {
    name: "disabled / invalid",
    type: "boolean",
    defaultValue: "false",
    description: "Adds a local state to the shared group state.",
  },
] as const;

export const buttonProps = [
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: "parent size",
    description: "Uses Kappa Button sizing and can override the group density.",
  },
  {
    name: "shape",
    type: '"base" | "square" | "circle"',
    defaultValue: '"base"',
    description: "Uses the Kappa Button shape. Use square for icon-only actions.",
  },
  {
    name: "variant",
    type: 'ButtonVariant',
    defaultValue: '"ghost"',
    description: "Uses the Kappa Button visual variant; ghost is quiet inside a group.",
  },
] as const;

export const events = [
  {
    name: "update:modelValue",
    payload: "string",
    description: "Emitted by Input and Textarea for v-model.",
  },
  {
    name: "valueChange",
    payload: "string",
    description: "Emitted with the next native value after input.",
  },
  {
    name: "native listeners",
    payload: "Event",
    description: "Input, change, focus, click, and other native listeners pass to their part.",
  },
] as const;

export const slots = [
  { component: "InputGroup", name: "default", description: "Input, textarea, addon, text, and button parts." },
  { component: "InputGroupAddon", name: "default", description: "Icons, text, buttons, or other addon content." },
  { component: "InputGroupButton", name: "default", description: "Button label or icon content." },
  { component: "InputGroupText", name: "default", description: "Compact helper or prefix text." },
] as const;

export const dataAttributes = [
  { name: "input-group", element: "div[role=group]", description: "Root group part." },
  { name: "input-group-addon", element: "div", description: "Addon part; data-align exposes logical placement." },
  { name: "input-group-control", element: "input / textarea", description: "Unified native control selector for focus styling." },
  { name: "input-group-text", element: "span", description: "Text helper part." },
  { name: "input-group-button", element: "button", description: "Marker on a Kappa Button rendered inside an addon." },
] as const;

export const exportsList = [
  { name: "InputGroup", description: "Compound root with Root, Addon, Button, Input, Textarea, and Text parts." },
  { name: "InputGroupRoot / Addon / Button / Input / Textarea / Text", description: "Named component exports for granular composition." },
  { name: "InputGroup*Props / InputGroup*Slots", description: "Public prop and slot contracts for every part." },
  { name: "InputGroupSize / InputGroupAddonAlign", description: "Public size and logical addon placement types." },
  { name: "resolveInputGroupSize / resolveInputGroupAddonAlign", description: "Runtime-safe default resolvers for component values." },
] as const;
