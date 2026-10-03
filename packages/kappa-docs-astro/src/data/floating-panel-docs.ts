export const barrelCode = `import { FloatingPanel } from "@dicehub/kappa";`;

export const granularCode = `import {
  FloatingPanel,
  FloatingPanelBody,
  FloatingPanelClose,
  FloatingPanelContent,
  FloatingPanelControl,
  FloatingPanelDragTrigger,
  FloatingPanelHeader,
  FloatingPanelPositioner,
  FloatingPanelResizeTrigger,
  FloatingPanelStageTrigger,
  FloatingPanelTitle,
  FloatingPanelTrigger,
} from "@dicehub/kappa/components/floating-panel";`;

export const previewCode = `<script setup lang="ts">
import { FloatingPanel } from "@dicehub/kappa/components/floating-panel";
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <FloatingPanel.Root :default-size="{ width: 340, height: 250 }">
    <FloatingPanel.Trigger as-child>
      <Button variant="outline">Open run monitor</Button>
    </FloatingPanel.Trigger>
    <FloatingPanel.Positioner>
      <FloatingPanel.Content>
        <FloatingPanel.DragTrigger>
          <FloatingPanel.Header>
            <FloatingPanel.Title>Run monitor</FloatingPanel.Title>
            <FloatingPanel.Control>
              <FloatingPanel.StageTrigger stage="minimized" />
              <FloatingPanel.StageTrigger stage="maximized" />
              <FloatingPanel.StageTrigger stage="default" />
              <FloatingPanel.Close />
            </FloatingPanel.Control>
          </FloatingPanel.Header>
        </FloatingPanel.DragTrigger>
        <FloatingPanel.Body>Run details</FloatingPanel.Body>
        <FloatingPanel.ResizeTrigger axis="se" />
      </FloatingPanel.Content>
    </FloatingPanel.Positioner>
  </FloatingPanel.Root>
</template>`;

export const transformCode = `<script setup lang="ts">
import { ref } from "vue";
import { FloatingPanel } from "@dicehub/kappa/components/floating-panel";
import { Button, Input, Label } from "@dicehub/kappa";

const offsetX = ref("0");
</script>

<template>
  <FloatingPanel.Root persist-rect>
    <FloatingPanel.Trigger>Open transform tool</FloatingPanel.Trigger>
    <FloatingPanel.Positioner>
      <FloatingPanel.Content>
        <FloatingPanel.DragTrigger>
          <FloatingPanel.Header>
            <FloatingPanel.Title>Transform geometry</FloatingPanel.Title>
            <FloatingPanel.Control>
              <FloatingPanel.StageTrigger stage="minimized" />
              <FloatingPanel.StageTrigger stage="maximized" />
              <FloatingPanel.StageTrigger stage="default" />
              <FloatingPanel.Close />
            </FloatingPanel.Control>
          </FloatingPanel.Header>
        </FloatingPanel.DragTrigger>
        <FloatingPanel.Body>
          <Label for="offset-x">Offset X</Label>
          <Input id="offset-x" v-model="offsetX" />
          <footer data-no-drag>
            <Button variant="primary">Apply transform</Button>
          </footer>
        </FloatingPanel.Body>
        <FloatingPanel.ResizeTrigger axis="e" />
        <FloatingPanel.ResizeTrigger axis="s" />
        <FloatingPanel.ResizeTrigger axis="se" />
      </FloatingPanel.Content>
    </FloatingPanel.Positioner>
  </FloatingPanel.Root>
</template>`;

export const controlledCode = `<script setup lang="ts">
import { ref } from "vue";
import { FloatingPanel } from "@dicehub/kappa/components/floating-panel";

const position = ref({ x: 56, y: 42 });
const size = ref({ width: 328, height: 244 });
</script>

<template>
  <FloatingPanel.Root v-model:position="position" v-model:size="size">
    <!-- Positioner, Content, header, body, and resize triggers -->
  </FloatingPanel.Root>
</template>`;

export const stagesCode = `<FloatingPanel.Control>
  <FloatingPanel.StageTrigger stage="minimized" />
  <FloatingPanel.StageTrigger stage="maximized" />
  <FloatingPanel.StageTrigger stage="default" />
  <FloatingPanel.Close />
</FloatingPanel.Control>`;

export const multipleCode = `<template>
  <FloatingPanel.Root default-open>
    <!-- Variables window -->
  </FloatingPanel.Root>
  <FloatingPanel.Root default-open>
    <!-- Probe chart window; interaction raises it above the first -->
  </FloatingPanel.Root>
</template>`;

export const boundedCode = `<script setup lang="ts">
import { ref } from "vue";
import { FloatingPanel } from "@dicehub/kappa/components/floating-panel";

const workArea = ref<HTMLElement>();
const getBoundaryEl = () => workArea.value ?? null;
</script>

<template>
  <main ref="workArea" class="work-area">
    <FloatingPanel.Root
      default-open
      :allow-overflow="false"
      :get-boundary-el="getBoundaryEl"
    >
      <FloatingPanel.Positioner>
        <!-- Content -->
      </FloatingPanel.Positioner>
    </FloatingPanel.Root>
  </main>
</template>`;

export const fixedCode = `<FloatingPanel.Root :draggable="false" :resizable="false">
  <FloatingPanel.Trigger>Open summary</FloatingPanel.Trigger>
  <FloatingPanel.Positioner>
    <FloatingPanel.Content>
      <FloatingPanel.Header>
        <FloatingPanel.Title>Read-only summary</FloatingPanel.Title>
        <FloatingPanel.Control><FloatingPanel.Close /></FloatingPanel.Control>
      </FloatingPanel.Header>
      <FloatingPanel.Body>Summary content</FloatingPanel.Body>
    </FloatingPanel.Content>
  </FloatingPanel.Positioner>
</FloatingPanel.Root>`;

export const rootProviderCode = `<script setup lang="ts">
import { FloatingPanel, useFloatingPanel } from "@dicehub/kappa/components/floating-panel";

const panel = useFloatingPanel({
  id: "metrics-panel",
  allowOverflow: false,
  closeOnEscape: true,
  defaultSize: { width: 360, height: 240 },
  minSize: { width: 240, height: 160 },
});
</script>

<template>
  <FloatingPanel.RootProvider :value="panel">
    <!-- Compound parts -->
  </FloatingPanel.RootProvider>
</template>`;

export const rootProps = [
  { name: "open / defaultOpen", type: "boolean", defaultValue: "false", description: "Controlled or initial open state." },
  { name: "position / defaultPosition", type: "FloatingPanelPoint", defaultValue: "—", description: "Controlled or initial x/y position in pixels." },
  { name: "size / defaultSize", type: "FloatingPanelSize", defaultValue: "320 × 240", description: "Controlled or initial width and height in pixels." },
  { name: "minSize", type: "FloatingPanelSize", defaultValue: "240 × 160", description: "Smallest permitted panel geometry." },
  { name: "maxSize", type: "FloatingPanelSize", defaultValue: "—", description: "Largest permitted panel geometry." },
  { name: "draggable", type: "boolean", defaultValue: "true", description: "Enables pointer dragging and content arrow-key movement." },
  { name: "resizable", type: "boolean", defaultValue: "true", description: "Enables pointer resize triggers and stage changes." },
  { name: "allowOverflow", type: "boolean", defaultValue: "false", description: "Allows dragging beyond the boundary when true." },
  { name: "getBoundaryEl", type: "() => HTMLElement | null", defaultValue: "viewport", description: "Returns the element that constrains geometry." },
  { name: "gridSize", type: "number", defaultValue: "1", description: "Movement and resize snap interval in pixels." },
  { name: "persistRect", type: "boolean", defaultValue: "false", description: "Retains geometry after close and reopen." },
  { name: "closeOnEscape", type: "boolean", defaultValue: "true", description: "Closes the panel when Escape reaches it." },
  { name: "strategy", type: '"fixed" | "absolute"', defaultValue: '"fixed"', description: "Uses viewport-fixed or containing-block absolute positioning." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables window interaction." },
] as const;

export const parts = [
  { name: "Trigger", element: "button", description: "Opens the panel." },
  { name: "Positioner", element: "div", description: "Owns geometry, stack order, and optional Teleport." },
  { name: "Content", element: "div", description: "Non-modal window surface and focus target." },
  { name: "DragTrigger", element: "div", description: "Pointer drag area, normally wrapped around Header." },
  { name: "Header", element: "div", description: "Compact window title bar." },
  { name: "Title", element: "div", description: "Accessible panel name." },
  { name: "Control", element: "div", description: "Header actions protected from drag gestures." },
  { name: "StageTrigger", element: "button", description: "Minimizes, maximizes, or restores the panel." },
  { name: "Close", element: "button", description: "Closes the panel; alias of CloseTrigger." },
  { name: "Body", element: "div", description: "Scrollable panel content, hidden while minimized." },
  { name: "ResizeTrigger", element: "div", description: "Pointer resize edge or corner." },
  { name: "Context", element: "—", description: "Exposes the current Ark panel API to a slot." },
] as const;

export const events = [
  { name: "update:open", payload: "boolean", description: "Updates controlled open state." },
  { name: "update:position", payload: "FloatingPanelPoint", description: "Updates controlled position during drag or movement." },
  { name: "update:size", payload: "FloatingPanelSize", description: "Updates controlled size during resize." },
  { name: "openChange", payload: "FloatingPanelOpenChangeDetails", description: "Reports open-state details." },
  { name: "positionChange / positionChangeEnd", payload: "FloatingPanelPositionChangeDetails", description: "Reports live and committed position changes." },
  { name: "sizeChange / sizeChangeEnd", payload: "FloatingPanelSizeChangeDetails", description: "Reports live and committed size changes." },
  { name: "stageChange", payload: "FloatingPanelStageChangeDetails", description: "Reports minimize, maximize, or restore." },
] as const;

export const keyboardRows = [
  { key: "Arrow keys", description: "Moves the panel when Content has focus." },
  { key: "Escape", description: "Closes the active panel when closeOnEscape is enabled." },
  { key: "Tab", description: "Moves through controls without trapping focus in the non-modal panel." },
] as const;

export const exportsList = [
  { name: "FloatingPanel", description: "Compound component with all public parts." },
  { name: "FloatingPanelRoot", description: "Named root export." },
  { name: "useFloatingPanel", description: "Creates an Ark-owned panel machine for RootProvider." },
  { name: "useFloatingPanelContext", description: "Reads panel state and imperative methods." },
  { name: "FloatingPanelPoint / FloatingPanelSize", description: "Controlled geometry types." },
  { name: "FloatingPanelStage", description: "The default, minimized, or maximized stage union." },
] as const;
