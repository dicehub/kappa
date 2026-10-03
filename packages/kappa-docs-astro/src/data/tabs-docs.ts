import {
  dynamicCountCode,
  manyTabsCode,
  overflowCode,
} from "./tabs-scroll-example-code";

export const barrelCode = `import { Tabs } from "@dicehub/kappa";`;

export const granularCode = `import { Tabs } from "@dicehub/kappa/components/tabs";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Tabs } from "@dicehub/kappa/components/tabs";

const selected = ref("overview");
</script>

<template>
  <Tabs.Root v-model="selected">
    <Tabs.List>
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="runs">Runs</Tabs.Trigger>
      <Tabs.Trigger value="artifacts">Artifacts</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content value="overview">Case overview and current status.</Tabs.Content>
    <Tabs.Content value="runs">Recent solver runs and timings.</Tabs.Content>
    <Tabs.Content value="artifacts">Meshes, logs, and exported fields.</Tabs.Content>
  </Tabs.Root>
</template>`;

export const usageCode = `<script setup>
import { Tabs } from "@dicehub/kappa/components/tabs";
</script>

<template>
  <Tabs.Root default-value="mesh">
    <Tabs.List>
      <Tabs.Trigger value="mesh">Mesh</Tabs.Trigger>
      <Tabs.Trigger value="solver">Solver</Tabs.Trigger>
      <Tabs.Trigger value="results">Results</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content value="mesh">The mesh contains 2.4 million cells.</Tabs.Content>
    <Tabs.Content value="solver">PIMPLE is using six outer correctors.</Tabs.Content>
    <Tabs.Content value="results">Pressure and force histories are ready.</Tabs.Content>
  </Tabs.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
} from "@dicehub/kappa/components/tabs";
</script>

<template>
  <TabsRoot default-value="summary">
    <TabsList>
      <TabsTrigger value="summary">Summary</TabsTrigger>
      <TabsTrigger value="log">Log</TabsTrigger>
      <TabsIndicator />
    </TabsList>
    <TabsContent value="summary">Run summary.</TabsContent>
    <TabsContent value="log">Solver log excerpt.</TabsContent>
  </TabsRoot>
</template>`;

export const basicCode = `<Tabs.Root default-value="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="runs">Runs</Tabs.Trigger>
    <Tabs.Trigger value="artifacts">Artifacts</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="overview">Case overview and current status.</Tabs.Content>
  <Tabs.Content value="runs">Recent solver runs and timings.</Tabs.Content>
  <Tabs.Content value="artifacts">Meshes, logs, and exported fields.</Tabs.Content>
</Tabs.Root>`;

export const variantsCode = `<div class="tabs-stack">
  <Tabs.Root default-value="preview">
    <Tabs.List variant="segmented">
      <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
      <Tabs.Trigger value="code">Code</Tabs.Trigger>
      <Tabs.Trigger value="history">History</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content value="preview">Preview is selected.</Tabs.Content>
    <Tabs.Content value="code">Code is selected.</Tabs.Content>
    <Tabs.Content value="history">History is selected.</Tabs.Content>
  </Tabs.Root>

  <Tabs.Root default-value="preview">
    <Tabs.List variant="line">
      <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
      <Tabs.Trigger value="code">Code</Tabs.Trigger>
      <Tabs.Trigger value="history">History</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content value="preview">Preview is selected.</Tabs.Content>
    <Tabs.Content value="code">Code is selected.</Tabs.Content>
    <Tabs.Content value="history">History is selected.</Tabs.Content>
  </Tabs.Root>
</div>`;

export const sizesCode = `<div class="tabs-stack">
  <Tabs.Root default-value="daily">
    <Tabs.List size="base">
      <Tabs.Trigger value="daily">Daily</Tabs.Trigger>
      <Tabs.Trigger value="weekly">Weekly</Tabs.Trigger>
      <Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content value="daily">Daily data.</Tabs.Content>
    <Tabs.Content value="weekly">Weekly data.</Tabs.Content>
    <Tabs.Content value="monthly">Monthly data.</Tabs.Content>
  </Tabs.Root>

  <Tabs.Root default-value="daily">
    <Tabs.List size="sm">
      <Tabs.Trigger value="daily">Daily</Tabs.Trigger>
      <Tabs.Trigger value="weekly">Weekly</Tabs.Trigger>
      <Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content value="daily">Daily data.</Tabs.Content>
    <Tabs.Content value="weekly">Weekly data.</Tabs.Content>
    <Tabs.Content value="monthly">Monthly data.</Tabs.Content>
  </Tabs.Root>
</div>`;

export const iconsCode = `<script setup>
import { ChartLine, File, Settings } from "@lucide/vue";
import { Tabs } from "@dicehub/kappa/components/tabs";
</script>

<template>
  <Tabs.Root default-value="analytics">
    <Tabs.List variant="line">
      <Tabs.Trigger value="analytics"><ChartLine />Analytics</Tabs.Trigger>
      <Tabs.Trigger value="files"><File />Files</Tabs.Trigger>
      <Tabs.Trigger value="settings"><Settings />Settings</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content value="analytics">Analytics are ready.</Tabs.Content>
    <Tabs.Content value="files">Files are ready.</Tabs.Content>
    <Tabs.Content value="settings">Settings are ready.</Tabs.Content>
  </Tabs.Root>
</template>`;

export const rtlCode = `<Tabs.Root default-value="overview" dir="rtl">
  <Tabs.List variant="line">
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="overview">Direction-aware overview.</Tabs.Content>
  <Tabs.Content value="reports">Direction-aware reports.</Tabs.Content>
  <Tabs.Content value="settings">Direction-aware settings.</Tabs.Content>
</Tabs.Root>`;

export const manualCode = `<Tabs.Root default-value="setup" activation-mode="manual">
  <Tabs.List variant="line">
    <Tabs.Trigger value="setup">Setup</Tabs.Trigger>
    <Tabs.Trigger value="review">Review</Tabs.Trigger>
    <Tabs.Trigger value="submit">Submit</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="setup">Configure the case.</Tabs.Content>
  <Tabs.Content value="review">Review the input values.</Tabs.Content>
  <Tabs.Content value="submit">Submit a validated run.</Tabs.Content>
</Tabs.Root>`;

export const verticalCode = `<Tabs.Root default-value="geometry" orientation="vertical">
  <Tabs.List variant="line">
    <Tabs.Trigger value="geometry">Geometry</Tabs.Trigger>
    <Tabs.Trigger value="mesh">Mesh</Tabs.Trigger>
    <Tabs.Trigger value="boundaries">Boundaries</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="geometry">The geometry is watertight.</Tabs.Content>
  <Tabs.Content value="mesh">All mesh quality checks passed.</Tabs.Content>
  <Tabs.Content value="boundaries">Seven boundary patches are assigned.</Tabs.Content>
</Tabs.Root>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Tabs } from "@dicehub/kappa/components/tabs";

const selected = ref("residuals");
</script>

<template>
  <Tabs.Root v-model="selected">
    <Tabs.List>
      <Tabs.Trigger value="residuals">Residuals</Tabs.Trigger>
      <Tabs.Trigger value="forces">Forces</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content value="residuals">All residuals are below 1e-5.</Tabs.Content>
    <Tabs.Content value="forces">Mean drag coefficient is 0.31.</Tabs.Content>
  </Tabs.Root>
  <output aria-live="polite">Selected: {{ selected }}</output>
</template>`;

export const disabledCode = `<Tabs.Root default-value="available">
  <Tabs.List>
    <Tabs.Trigger value="available">Available</Tabs.Trigger>
    <Tabs.Trigger value="pending" disabled>Pending data</Tabs.Trigger>
    <Tabs.Trigger value="history">History</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="available">Current diagnostics are ready.</Tabs.Content>
  <Tabs.Content value="pending">This panel is not available yet.</Tabs.Content>
  <Tabs.Content value="history">Previous diagnostics are archived.</Tabs.Content>
</Tabs.Root>`;

export const dynamicCode = `<script setup>
import { ref } from "vue";
import { Tabs } from "@dicehub/kappa/components/tabs";

const showInspect = ref(false);
</script>

<template>
  <Tabs.Root lazy-mount unmount-on-exit default-value="overview">
    <Tabs.List>
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
      <Tabs.Trigger v-if="showInspect" value="inspect">Inspect</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content value="overview">Overview is mounted only while selected.</Tabs.Content>
    <Tabs.Content value="logs">Logs mount only when selected.</Tabs.Content>
    <Tabs.Content v-if="showInspect" value="inspect">Inspect is dynamic content.</Tabs.Content>
  </Tabs.Root>
  <button type="button" @click="showInspect = !showInspect">
    {{ showInspect ? "Remove inspect" : "Add inspect" }}
  </button>
</template>`;

export const richCode = `<Tabs.Root default-value="metrics">
  <Tabs.List>
    <Tabs.Trigger value="metrics">Metrics</Tabs.Trigger>
    <Tabs.Trigger value="boundaries">Boundaries</Tabs.Trigger>
    <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="metrics">
    <dl>
      <div><dt>Cells</dt><dd>2.4M</dd></div>
      <div><dt>Residual</dt><dd>8.4e-6</dd></div>
      <div><dt>Courant max</dt><dd>0.82</dd></div>
    </dl>
  </Tabs.Content>
  <Tabs.Content value="boundaries">
    <table><caption>Patch summary</caption>...</table>
  </Tabs.Content>
  <Tabs.Content value="notes">Add review notes alongside any Vue content.</Tabs.Content>
</Tabs.Root>`;

export const examples = [
  {
    id: "basic",
    title: "Basic",
    description: "Use one root with a list, triggers, optional indicator, and matching content panels.",
    variant: "basic",
    code: basicCode,
  },
  {
    id: "variants",
    title: "Variants",
    description: "Use the segmented rail for compact view switches or the line rail for full-width sections.",
    variant: "variants",
    code: variantsCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    description: "Use the small size in dense toolbars and the base size for standard page controls.",
    variant: "sizes",
    code: sizesCode,
  },
  {
    id: "icons",
    title: "Icons",
    description: "Place a decorative icon before a concise label. The text keeps the trigger name clear.",
    variant: "icons",
    code: iconsCode,
  },
  {
    id: "many-tabs",
    title: "Many Tabs",
    description: "Keep a long tab set on one line. A wider constrained rail supports fast scanning and horizontal scrolling.",
    variant: "many",
    code: manyTabsCode,
  },
  {
    id: "horizontal-overflow",
    title: "Horizontal Overflow",
    description: "Constrain the rail when space is tight. Edge controls reveal off-screen tabs without widening the page.",
    variant: "overflow",
    code: overflowCode,
  },
  {
    id: "rtl",
    title: "Right to Left",
    description: "Set dir to rtl when the component must override its inherited document direction.",
    variant: "rtl",
    code: rtlCode,
  },
  {
    id: "manual-activation",
    title: "Manual Activation",
    description: "Set activationMode to manual when arrow-key focus should not change content until Enter or Space.",
    variant: "manual",
    code: manualCode,
  },
  {
    id: "vertical",
    title: "Vertical",
    description: "Use vertical orientation for an inspector or settings rail. Ark UI switches navigation to Up and Down.",
    variant: "vertical",
    code: verticalCode,
  },
  {
    id: "controlled",
    title: "Controlled",
    description: "Bind v-model when route state, a parent workflow, or another control owns the selected value.",
    variant: "controlled",
    code: controlledCode,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "Disable one trigger while preserving the surrounding tab order and accessible state.",
    variant: "disabled",
    code: disabledCode,
  },
  {
    id: "dynamic-tab-count",
    title: "Dynamic Tab Count",
    description: "Change the number of tabs at runtime. Overflow controls disappear when the remaining seven tabs fit.",
    variant: "dynamic-count",
    code: dynamicCountCode,
  },
  {
    id: "dynamic-lazy",
    title: "Dynamic and Lazy",
    description: "Combine v-if with lazyMount and unmountOnExit for panels that appear as data becomes available.",
    variant: "dynamic",
    code: dynamicCode,
  },
  {
    id: "content-rich",
    title: "Content-rich",
    description: "Panels accept normal Vue content, including metrics, tables, forms, and review notes.",
    variant: "rich",
    code: richCode,
  },
] as const;

export const rootProps = [
  { name: "modelValue", type: "string", defaultValue: "-", description: "Controlled selected value; supports v-model." },
  { name: "defaultValue", type: "string", defaultValue: "-", description: "Initial selected value for uncontrolled tabs." },
  { name: "activationMode", type: "automatic | manual", defaultValue: "automatic", description: "Activate on focus, or wait for Enter or Space after focus." },
  { name: "orientation", type: "horizontal | vertical", defaultValue: "horizontal", description: "Changes layout semantics and directional keyboard navigation." },
  { name: "dir", type: "ltr | rtl", defaultValue: "inherited", description: "Overrides the inherited Ark UI locale direction." },
  { name: "loopFocus", type: "boolean", defaultValue: "true", description: "Wraps arrow-key focus from the last enabled trigger to the first." },
  { name: "deselectable", type: "boolean", defaultValue: "false", description: "Allows the active tab to be cleared when clicked again." },
  { name: "composite", type: "boolean", defaultValue: "true", description: "Uses a roving tab stop for the tablist and panel focus behavior." },
  { name: "lazyMount", type: "boolean", defaultValue: "false", description: "Delays each content panel until it is selected for the first time." },
  { name: "unmountOnExit", type: "boolean", defaultValue: "false", description: "Removes deselected content panels from the DOM." },
  { name: "id", type: "string", defaultValue: "generated", description: "Stable identifier for the Ark UI state machine." },
  { name: "ids", type: "TabsRootProps['ids']", defaultValue: "generated", description: "Overrides generated root, list, trigger, content, and indicator IDs." },
  { name: "navigate", type: "(details) => void", defaultValue: "-", description: "Handles navigation when triggers are composed as links." },
  { name: "translations", type: "TabsRootProps['translations']", defaultValue: "-", description: "Localized tablist labels used by Ark UI." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into one custom child element." },
] as const;

export const triggerProps = [
  { name: "value", type: "string", defaultValue: "required", description: "Unique value paired with one content panel." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents activation and removes the trigger from arrow-key navigation." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Composes tab behavior onto one custom button or link." },
] as const;

export const listProps = [
  { name: "variant", type: "segmented | line", defaultValue: "segmented", description: "Uses a compact selected surface or a full-width selection line." },
  { name: "size", type: "sm | base", defaultValue: "base", description: "Controls the list height, trigger spacing, and type scale." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Composes tablist behavior onto one custom element." },
] as const;

export const contentProps = [
  { name: "value", type: "string", defaultValue: "required", description: "Value that selects this content panel." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Composes panel semantics onto one custom element." },
] as const;

export const parts = [
  { name: "Root", element: "div", description: "Owns selected value, activation mode, orientation, locale direction, and render strategy." },
  { name: "RootProvider", element: "div", description: "Root variant driven by an external useTabs machine." },
  { name: "List", element: "div[role=tablist]", description: "Keyboard navigation container with the localized tablist semantics." },
  { name: "Trigger", element: "button[role=tab]", description: "Selects a value and participates in Ark UI roving focus." },
  { name: "Content", element: "div[role=tabpanel]", description: "Associated panel with managed visibility and labelled-by relationship." },
  { name: "Indicator", element: "div", description: "Optional measured surface that follows the selected trigger." },
  { name: "Context", element: "renderless", description: "Exposes the reactive Ark UI tabs API to a scoped slot." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string", description: "Emitted when the selected tab changes; drives v-model." },
  { name: "valueChange", payload: "{ value: string }", description: "Ark UI detail emitted after the selected value changes." },
  { name: "focusChange", payload: "{ focusedValue: string }", description: "Ark UI detail emitted when the focused trigger changes." },
] as const;

export const exportsList = [
  { name: "Tabs", description: "Compound API exposing Root, RootProvider, List, Trigger, Content, Indicator, and Context." },
  { name: "TabsRoot", description: "Unaugmented root with controlled and uncontrolled selected value." },
  { name: "TabsRootProvider", description: "Root backed by an external useTabs state machine." },
  { name: "TabsList", description: "Accessible tablist container." },
  { name: "TabsTrigger", description: "Keyboard-operable tab trigger." },
  { name: "TabsContent", description: "Associated tabpanel with optional lazy rendering." },
  { name: "TabsIndicator", description: "Optional moving selection surface." },
  { name: "TabsContext", description: "Scoped-slot state access." },
  { name: "useTabs", description: "Creates a Tabs state machine for RootProvider." },
  { name: "useTabsContext", description: "Reads Tabs state inside the compound component." },
  { name: "tabsAnatomy", description: "Ark UI part anatomy metadata." },
  { name: "TabsProps", description: "Public root prop contract." },
  { name: "TabsEmits", description: "Root event contract." },
  { name: "TabsVariant", description: "Segmented or line list treatment." },
  { name: "TabsSize", description: "Small or base list geometry." },
  { name: "TABS_VARIANTS", description: "Supported visual variant values." },
  { name: "TABS_SIZES", description: "Supported size values." },
  { name: "TabsValueChangeDetails", description: "Payload for valueChange." },
  { name: "TabsFocusChangeDetails", description: "Payload for focusChange." },
] as const;
