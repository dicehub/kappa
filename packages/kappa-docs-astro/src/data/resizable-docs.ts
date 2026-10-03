export const barrelCode = `import { Resizable } from "@dicehub/kappa";`;

export const granularCode = `import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
  ResizableResizeTrigger,
  ResizableResizeTriggerIndicator,
} from "@dicehub/kappa/components/resizable";`;

export const previewCode = `<script setup>
import { Resizable } from "@dicehub/kappa/components/resizable";
</script>

<template>
  <Resizable.Root
    class="layout"
    :panels="[
      { id: 'navigation', minSize: 22 },
      { id: 'inspector', minSize: 32 },
    ]"
    :default-size="[36, 64]"
    aria-label="Workspace layout"
  >
    <Resizable.Panel id="navigation">Navigation</Resizable.Panel>
    <Resizable.Handle id="navigation:inspector" aria-label="Resize navigation and inspector" />
    <Resizable.Panel id="inspector">Inspector</Resizable.Panel>
  </Resizable.Root>
</template>

<style>
.layout { inline-size: 100%; block-size: 16rem; }
.layout [data-slot="resizable-panel"] { display: grid; place-items: center; padding: 1rem; font-weight: 650; }
</style>`;

export const usageCode = `<script setup>
import { Resizable } from "@dicehub/kappa/components/resizable";
</script>

<template>
  <Resizable.Root
    class="workspace"
    :panels="[
      { id: 'files', minSize: 25 },
      { id: 'preview', minSize: 30 },
    ]"
    :default-size="[32, 68]"
    aria-label="File preview layout"
  >
    <Resizable.Panel id="files">Files</Resizable.Panel>
    <Resizable.Handle id="files:preview" aria-label="Resize files and preview" />
    <Resizable.Panel id="preview">Preview</Resizable.Panel>
  </Resizable.Root>
</template>

<style>
.workspace { inline-size: 100%; block-size: 16rem; }
.workspace [data-slot="resizable-panel"] { display: grid; place-items: center; padding: 1rem; font-weight: 650; }
</style>`;

export const verticalCode = `<script setup>
import { Resizable } from "@dicehub/kappa/components/resizable";
</script>

<template>
  <Resizable.Root
    class="layout"
    orientation="vertical"
    :panels="[
      { id: 'chart', minSize: 30 },
      { id: 'events', minSize: 22 },
    ]"
    :default-size="[62, 38]"
    aria-label="Chart and events layout"
  >
    <Resizable.Panel id="chart">Chart</Resizable.Panel>
    <Resizable.Handle id="chart:events" aria-label="Resize chart and events" />
    <Resizable.Panel id="events">Events</Resizable.Panel>
  </Resizable.Root>
</template>

<style>
.layout { inline-size: 100%; block-size: 16rem; }
.layout [data-slot="resizable-panel"] { display: grid; place-items: center; padding: 1rem; font-weight: 650; }
</style>`;

export const handleCode = `<script setup>
import { Resizable } from "@dicehub/kappa/components/resizable";
</script>

<template>
  <Resizable.Root
    class="layout"
    :panels="[
      { id: 'editor', minSize: 28 },
      { id: 'output', minSize: 28 },
    ]"
    :default-size="[58, 42]"
    aria-label="Editor and output layout"
  >
    <Resizable.Panel id="editor">Editor</Resizable.Panel>
    <Resizable.ResizeTrigger id="editor:output" aria-label="Resize editor and output">
      <Resizable.ResizeTriggerIndicator />
    </Resizable.ResizeTrigger>
    <Resizable.Panel id="output">Output</Resizable.Panel>
  </Resizable.Root>
</template>

<style>
.layout { inline-size: 100%; block-size: 16rem; }
.layout [data-slot="resizable-panel"] { display: grid; place-items: center; padding: 1rem; font-weight: 650; }
</style>`;

export const collapsibleCode = `<script setup>
import { Resizable } from "@dicehub/kappa/components/resizable";
</script>

<template>
  <Resizable.Root
    class="layout"
    :panels="[
      { id: 'details', minSize: 20, collapsible: true, collapsedSize: 8 },
      { id: 'summary', minSize: 28 },
    ]"
    :default-size="[34, 66]"
    aria-label="Summary and details layout"
  >
    <Resizable.Panel id="details">Details</Resizable.Panel>
    <Resizable.Handle id="details:summary" aria-label="Resize details and summary" />
    <Resizable.Panel id="summary">
      <Resizable.Context v-slot="api">
        <div class="summary">
          <span>Summary</span>
          <div class="actions">
            <button type="button" @click="api.expandPanel('details')">Expand details</button>
            <button type="button" @click="api.collapsePanel('details')">Collapse details</button>
          </div>
        </div>
      </Resizable.Context>
    </Resizable.Panel>
  </Resizable.Root>
</template>

<style>
.layout { inline-size: 100%; block-size: 16rem; }
.layout [data-slot="resizable-panel"] { display: grid; place-items: center; padding: 1rem; font-weight: 650; }
.summary { display: grid; justify-items: center; gap: 0.75rem; }
.actions { display: flex; gap: 0.5rem; }
</style>`;

export const nestedCode = `<script setup>
import { Resizable } from "@dicehub/kappa/components/resizable";
</script>

<template>
  <Resizable.Root
    class="layout"
    :panels="[
      { id: 'outline', minSize: 22 },
      { id: 'workbench', minSize: 38 },
    ]"
    :default-size="[28, 72]"
    aria-label="Project outline and workbench"
  >
    <Resizable.Panel id="outline">Outline</Resizable.Panel>
    <Resizable.Handle id="outline:workbench" aria-label="Resize outline and workbench" />
    <Resizable.Panel id="workbench" class="nested-host">
      <Resizable.Root
        class="nested-layout"
        orientation="vertical"
        :panels="[
          { id: 'code', minSize: 30 },
          { id: 'terminal', minSize: 24 },
        ]"
        :default-size="[64, 36]"
        aria-label="Code and terminal layout"
      >
        <Resizable.Panel id="code">Code</Resizable.Panel>
        <Resizable.Handle id="code:terminal" aria-label="Resize code and terminal" />
        <Resizable.Panel id="terminal">Terminal</Resizable.Panel>
      </Resizable.Root>
    </Resizable.Panel>
  </Resizable.Root>
</template>

<style>
.layout { inline-size: 100%; block-size: 18rem; }
.layout [data-slot="resizable-panel"] { display: grid; place-items: center; padding: 1rem; font-weight: 650; }
.nested-host { place-items: stretch; }
.nested-layout { inline-size: 100%; block-size: auto; align-self: stretch; }
</style>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Resizable } from "@dicehub/kappa/components/resizable";

const size = ref([42, 58]);
</script>

<template>
  <Resizable.Root
    v-model:size="size"
    class="layout"
    :panels="[
      { id: 'canvas', minSize: 25 },
      { id: 'metrics', minSize: 25 },
    ]"
    aria-label="Controlled canvas and metrics layout"
  >
    <Resizable.Panel id="canvas">Canvas · {{ size[0] }}%</Resizable.Panel>
    <Resizable.Handle id="canvas:metrics" aria-label="Resize canvas and metrics" />
    <Resizable.Panel id="metrics">Metrics · {{ size[1] }}%</Resizable.Panel>
  </Resizable.Root>
  <div class="actions">
    <button type="button" @click="size = [28, 72]">28 / 72</button>
    <button type="button" @click="size = [60, 40]">60 / 40</button>
  </div>
</template>

<style>
.layout { inline-size: 100%; block-size: 16rem; }
.layout [data-slot="resizable-panel"] { display: grid; place-items: center; padding: 1rem; font-weight: 650; }
.actions { display: flex; justify-content: end; gap: 0.5rem; margin-block-start: 0.75rem; }
</style>`;

export const rootProviderCode = `<script setup>
import { useSplitter } from "@dicehub/kappa/components/resizable";
import { Resizable } from "@dicehub/kappa/components/resizable";

const api = useSplitter({
  panels: [
    { id: "left", minSize: 25 },
    { id: "right", minSize: 25 },
  ],
  defaultSize: [40, 60],
});
</script>

<template>
  <Resizable.RootProvider :value="api">
    <!-- Compose Panel, Handle, and ResizeTriggerIndicator parts. -->
  </Resizable.RootProvider>
</template>`;

export const rootProps = [
  { name: "panels", type: "ResizablePanelData[]", defaultValue: "required", description: "Panel ids and optional order, minimum/maximum, and collapse constraints." },
  { name: "defaultSize / size", type: "number[]", defaultValue: "equal / —", description: "Initial or controlled panel percentages." },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Sets the divider axis and keyboard direction." },
  { name: "keyboardResizeBy", type: "number", defaultValue: "1 px", description: "Pixels moved by an arrow key. Shift + Arrow uses 10 px." },
  { name: "id / ids", type: "string / Partial<ElementIds>", defaultValue: "generated", description: "Stable machine and part identifiers for composition." },
  { name: "registry", type: "SplitterRegistry", defaultValue: "—", description: "Enables coordinated multi-drag interactions between splitters." },
  { name: "nonce", type: "string", defaultValue: "—", description: "Nonce for the global cursor style injected during pointer resize." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into its direct child." },
] as const;

export const parts = [
  { name: "Root", element: "div", description: "Owns panel sizes, constraints, orientation, and resize state." },
  { name: "RootProvider", element: "div", description: "Provides an externally created useSplitter machine." },
  { name: "Panel", element: "div", description: "Measured, constrained, and scrollable panel. Its id must exist in Root panels." },
  { name: "Handle", element: "button", description: "Kappa alias for ResizeTrigger with a visible grip indicator by default." },
  { name: "ResizeTrigger", element: "button", description: "Ark-aligned keyboard and pointer divider control. Use id='before:after'." },
  { name: "ResizeTriggerIndicator", element: "div", description: "Optional Ark indicator for a custom ResizeTrigger grip." },
  { name: "Context", element: "renderless", description: "Exposes the splitter API for collapse, expand, and programmatic resizing." },
] as const;

export const events = [
  { name: "update:size", payload: "number[]", description: "Updates v-model after a size change." },
  { name: "resize", payload: "ResizableResizeDetails", description: "Ark invokes this callback for controlled size changes; use update:size for the current model and resizeEnd for interaction completion." },
  { name: "resizeEnd", payload: "ResizableResizeEndDetails", description: "Reports the final sizes after a resize interaction." },
  { name: "resizeStart", payload: "void", description: "Reports the start of a pointer or keyboard resize." },
  { name: "collapse / expand", payload: "ResizableExpandCollapseDetails", description: "Reports a collapsible panel changing state." },
] as const;

export const slots = [
  { name: "Root.default / RootProvider.default", description: "Panel and divider parts in their layout order." },
  { name: "Panel.default", description: "Panel content. Give the panel an id present in Root panels." },
  { name: "Handle.default", description: "Replaces the default grip indicator when custom handle content is needed." },
  { name: "ResizeTrigger.default", description: "Custom content for an Ark-aligned divider control." },
  { name: "ResizeTriggerIndicator.default", description: "Custom indicator content inside a ResizeTrigger." },
  { name: "Context.default", description: "Receives the renderless ResizableApi value." },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"resizable" and part names', description: "Identifies Kappa roots and parts." },
  { name: "data-orientation", value: '"horizontal" | "vertical"', description: "Exposes the active axis on roots, panels, handles, and indicators." },
  { name: "data-id / data-index", value: "panel or trigger identity", description: "Exposes Ark panel and divider identity for styling and testing." },
  { name: "data-dragging", value: "present while active", description: "Exposes active pointer or keyboard resize state." },
  { name: "data-focus / data-disabled", value: "present when applicable", description: "Exposes divider focus and disabled states." },
  { name: "role / aria-valuenow / aria-controls", value: "on ResizeTrigger", description: "Ark UI separator semantics and current layout values." },
] as const;

export const exportsList = [
  { name: "Resizable", description: "Compound Ark-backed splitter component." },
  { name: "ResizableRoot / ResizableRootProvider / ResizablePanel", description: "Named root, provider, and panel components." },
  { name: "ResizableHandle", description: "Friendly divider alias with a default grip indicator." },
  { name: "ResizableResizeTrigger / ResizableResizeTriggerIndicator", description: "Ark-aligned divider and optional indicator components." },
  { name: "ResizableContext", description: "Renderless access to the active splitter API." },
  { name: "ResizableProps / Resizable*Props / Resizable*Slots / ResizableEmits", description: "Public root, part, slot, and event contracts." },
  { name: "ResizablePanelData / ResizableApi / ResizableOrientation", description: "Panel constraints, machine API, and orientation types." },
  { name: "useSplitter / useSplitterContext / splitterAnatomy", description: "Ark UI composition functions and anatomy." },
] as const;

export const keyboardRows = [
  { key: "ArrowLeft / ArrowRight", description: "Resize a horizontal divider by one step." },
  { key: "ArrowUp / ArrowDown", description: "Resize a vertical divider by one step." },
  { key: "Shift + Arrow", description: "Resize by 10 px for faster keyboard adjustments." },
  { key: "Home / End", description: "Move the adjacent panel to its minimum or maximum boundary." },
  { key: "Enter", description: "Collapse or expand the adjacent panel when it is collapsible." },
  { key: "F6 / Shift + F6", description: "Move focus to the next or previous divider." },
] as const;
