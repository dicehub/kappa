export const barrelCode = `import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "@dicehub/kappa/components/tooltip";`;

export const previewCode = `<script setup>
import { Plus } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Trigger as-child>
      <Button :icon="Plus" shape="square" variant="outline" aria-label="Add item" />
    </Tooltip.Trigger>
    <Tooltip.Content>Add item</Tooltip.Content>
  </Tooltip.Root>
</template>`;

export const usageCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Trigger as-child>
      <Button variant="outline">Hover or focus</Button>
    </Tooltip.Trigger>
    <Tooltip.Content>Review component details</Tooltip.Content>
  </Tooltip.Root>
</template>`;

export const compositionCode = `<Tooltip.Root>
  <Tooltip.Trigger as-child>
    <Button>Trigger</Button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    Tooltip text
    <template #arrow>
      <Tooltip.Arrow><Tooltip.ArrowTip /></Tooltip.Arrow>
    </template>
  </Tooltip.Content>
</Tooltip.Root>`;

const sidesCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Tooltip } from "@dicehub/kappa/components/tooltip";

const sides = ["left", "top", "bottom", "right"];
</script>

<template>
  <Tooltip.Root
    v-for="side in sides"
    :key="side"
    :positioning="{ placement: side }"
  >
    <Tooltip.Trigger as-child>
      <Button size="sm" variant="outline">{{ side }}</Button>
    </Tooltip.Trigger>
    <Tooltip.Content>{{ side }} tooltip</Tooltip.Content>
  </Tooltip.Root>
</template>`;

const shortcutCode = `<script setup>
import { Save } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Trigger as-child>
      <Button :icon="Save" variant="outline">Save changes</Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <span>Save changes</span>
      <kbd>Ctrl S</kbd>
    </Tooltip.Content>
  </Tooltip.Root>
</template>`;

const disabledCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Trigger as-child>
      <span class="disabled-trigger" tabindex="0">
        <Button disabled>Deploy update</Button>
      </span>
    </Tooltip.Trigger>
    <Tooltip.Content>Available after validation passes</Tooltip.Content>
  </Tooltip.Root>
</template>

<style scoped>
.disabled-trigger { display: inline-flex; }
.disabled-trigger .kappa-button { pointer-events: none; }
</style>`;

const delayCode = `<Tooltip.Root :open-delay="0">
  <Tooltip.Trigger as-child><Button>Instant</Button></Tooltip.Trigger>
  <Tooltip.Content>Opens without delay</Tooltip.Content>
</Tooltip.Root>

<Tooltip.Root>
  <Tooltip.Trigger as-child><Button>Default</Button></Tooltip.Trigger>
  <Tooltip.Content>Opens after 400 ms</Tooltip.Content>
</Tooltip.Root>

<Tooltip.Root :open-delay="900" :close-delay="300">
  <Tooltip.Trigger as-child><Button>Custom delay</Button></Tooltip.Trigger>
  <Tooltip.Content>Custom open and close timing</Tooltip.Content>
</Tooltip.Root>`;

const overflowCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Tooltip } from "@dicehub/kappa/components/tooltip";

const content =
  "This explanation stays inside the viewport and wraps when space becomes narrow.";
</script>

<template>
  <div class="edge-row">
    <Tooltip.Root
      v-for="label in ['Near left edge', 'Centered', 'Near right edge']"
      :key="label"
      :positioning="{ placement: 'bottom' }"
    >
      <Tooltip.Trigger as-child><Button>{{ label }}</Button></Tooltip.Trigger>
      <Tooltip.Content>{{ content }}</Tooltip.Content>
    </Tooltip.Root>
  </div>
</template>`;

const controlledCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Tooltip } from "@dicehub/kappa/components/tooltip";

const open = ref(false);
</script>

<template>
  <Tooltip.Root v-model:open="open" :open-delay="0">
    <Tooltip.Trigger as-child><Button>Focus state</Button></Tooltip.Trigger>
    <Tooltip.Content>The open state is synchronized with Vue.</Tooltip.Content>
  </Tooltip.Root>
  <output>Tooltip: {{ open ? "open" : "closed" }}</output>
</template>`;

export const examples = [
  {
    id: "sides",
    title: "Sides",
    description: "Set positioning.placement to place the tooltip on any side of its trigger.",
    variant: "sides",
    code: sidesCode,
  },
  {
    id: "keyboard-shortcut",
    title: "With Keyboard Shortcut",
    description: "Pair a short label with a compact shortcut hint.",
    variant: "shortcut",
    code: shortcutCode,
  },
  {
    id: "disabled-button",
    title: "Disabled Button",
    description: "Wrap a disabled control in a focusable trigger because disabled elements do not receive focus or pointer events reliably.",
    variant: "disabled",
    code: disabledCode,
  },
  {
    id: "delay-control",
    title: "Delay Control",
    description: "Tune open and close timing for immediate guidance or dense groups of controls.",
    variant: "delay",
    code: delayCode,
  },
  {
    id: "long-content-overflow",
    title: "Long Content and Overflow",
    description: "Content wraps against the available viewport width instead of crossing the page edge.",
    variant: "overflow",
    code: overflowCode,
  },
  {
    id: "controlled",
    title: "Controlled",
    description: "Use v-model:open when application state must observe or control the tooltip.",
    variant: "controlled",
    code: controlledCode,
  },
] as const;

export const rootProps = [
  { name: "open", type: "boolean", defaultValue: "-", description: "Controlled open state; supports v-model:open." },
  { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial open state for uncontrolled use." },
  { name: "openDelay", type: "number", defaultValue: "400", description: "Delay before pointer hover opens the tooltip, in milliseconds. Keyboard focus opens without delay." },
  { name: "closeDelay", type: "number", defaultValue: "150", description: "Delay before the tooltip closes, in milliseconds." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables tooltip opening." },
  { name: "interactive", type: "boolean", defaultValue: "false", description: "Keeps the tooltip open while the pointer is over its content. Prefer Popover for controls." },
  { name: "positioning", type: "TooltipPositioningOptions", defaultValue: "top, 8 px gutter", description: "Ark UI placement, collision, offset, and strategy options." },
  { name: "lazyMount", type: "boolean", defaultValue: "false", description: "Defers content mounting until the first open state." },
  { name: "unmountOnExit", type: "boolean", defaultValue: "false", description: "Removes content after the close transition." },
  { name: "triggerValue", type: "string | null", defaultValue: "null", description: "Controlled active value for a root with multiple triggers." },
  { name: "id", type: "string", defaultValue: "generated", description: "Stable identifier for the Ark UI machine." },
] as const;

export const parts = [
  { name: "Tooltip.Trigger", element: "button", description: "Hover and focus target. Use asChild to merge behavior into one control." },
  { name: "Tooltip.Content", element: "div", description: "Portalled tooltip surface with a default positioner and arrow." },
  { name: "Tooltip.Arrow", element: "div", description: "Positioned arrow wrapper. Content renders it by default." },
  { name: "Tooltip.ArrowTip", element: "div", description: "Visual arrow tip rendered by Arrow by default." },
  { name: "Tooltip.Context", element: "slot", description: "Exposes reactive Ark UI state to a scoped slot." },
  { name: "Tooltip.RootProvider", element: "slot", description: "Accepts a state machine created by useTooltip." },
] as const;

export const contentProps = [
  { name: "teleport", type: "boolean", defaultValue: "true", description: "Moves the positioner to teleportTo after mount." },
  { name: "teleportTo", type: "string | Element", defaultValue: '"body"', description: "Vue Teleport target for the popup." },
  { name: "showArrow", type: "boolean", defaultValue: "true", description: "Shows the default Arrow and ArrowTip." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges content attributes into one child element." },
] as const;

export const events = [
  { name: "update:open", payload: "boolean", description: "Emitted when the controlled open state changes." },
  { name: "openChange", payload: "TooltipOpenChangeDetails", description: "Ark UI detail emitted after an open-state change." },
  { name: "update:triggerValue", payload: "string | null", description: "Emitted when the active trigger changes." },
  { name: "triggerValueChange", payload: "TooltipTriggerValueChangeDetails", description: "Details for an active-trigger change." },
  { name: "exitComplete", payload: "void", description: "Emitted after the close transition completes." },
] as const;

export const exportsList = [
  { name: "Tooltip", description: "Compound API exposing Root, RootProvider, Trigger, Content, Arrow, ArrowTip, and Context." },
  { name: "TooltipRoot", description: "Unaugmented Ark UI state root." },
  { name: "TooltipRootProvider", description: "Root backed by an external useTooltip state machine." },
  { name: "TooltipTrigger", description: "Hover and focus target." },
  { name: "TooltipContent", description: "Portalled, positioned tooltip surface." },
  { name: "TooltipArrow", description: "Arrow wrapper with a default ArrowTip." },
  { name: "TooltipArrowTip", description: "Arrow tip primitive." },
  { name: "TooltipContext", description: "Scoped-slot state access." },
  { name: "useTooltip", description: "Creates a Tooltip state machine for RootProvider." },
  { name: "useTooltipContext", description: "Reads Tooltip state inside the compound component." },
  { name: "tooltipAnatomy", description: "Ark UI part anatomy metadata." },
  { name: "TOOLTIP_DEFAULT_POSITIONING", description: "Kappa's viewport-aware top placement." },
] as const;
