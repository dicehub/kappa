export const barrelCode = `import {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
} from "@dicehub/kappa/components/popover";`;

export const previewCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Popover } from "@dicehub/kappa/components/popover";
</script>

<template>
  <Popover.Root>
    <Popover.Trigger as-child><Button variant="outline">Run filters</Button></Popover.Trigger>
    <Popover.Content>
      <Popover.Title>Run filters</Popover.Title>
      <Popover.Description>Choose which result sets stay in the report.</Popover.Description>
      <Popover.Close as-child label="Apply filters"><Button variant="primary">Apply filters</Button></Popover.Close>
    </Popover.Content>
  </Popover.Root>
</template>`;

export const usageCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Popover } from "@dicehub/kappa/components/popover";
</script>

<template>
  <Popover.Root>
    <Popover.Trigger as-child><Button>Inspect run</Button></Popover.Trigger>
    <Popover.Content>
      <Popover.Title>Run 4189</Popover.Title>
      <Popover.Description>Run completed in 02:14:38.</Popover.Description>
      <p>Pressure residuals stayed below the configured limit.</p>
    </Popover.Content>
  </Popover.Root>
</template>`;

export const compositionCode = `<Popover.Root>
  <Popover.Anchor>Report context</Popover.Anchor>
  <Popover.Trigger as-child><Button>Open</Button></Popover.Trigger>
  <Popover.Content>
    <Popover.Title>Details</Popover.Title>
    <Popover.Description>Content accepts normal interactive markup.</Popover.Description>
    <Popover.Close as-child label="Done"><Button>Done</Button></Popover.Close>
    <template #arrow>
      <Popover.Arrow><Popover.ArrowTip /></Popover.Arrow>
    </template>
  </Popover.Content>
</Popover.Root>`;

const placementCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Popover } from "@dicehub/kappa/components/popover";

const placements = ["top", "bottom", "left", "right"];
</script>

<template>
  <Popover.Root v-for="placement in placements" :key="placement" :positioning="{ placement }">
    <Popover.Trigger as-child><Button size="sm">{{ placement }}</Button></Popover.Trigger>
    <Popover.Content>
      <Popover.Title>{{ placement }} placement</Popover.Title>
      <Popover.Description>Ark UI flips the surface when space is limited.</Popover.Description>
    </Popover.Content>
  </Popover.Root>
</template>`;

const formCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Popover } from "@dicehub/kappa/components/popover";

const runLabel = ref("PIMPLE baseline 07");
</script>

<template>
  <Popover.Root>
    <Popover.Trigger as-child><Button>Edit run details</Button></Popover.Trigger>
    <Popover.Content>
      <Popover.Title>Edit run details</Popover.Title>
      <Popover.Description>Change the label used in reports and archives.</Popover.Description>
      <label>Run label <input v-model="runLabel" /></label>
      <Popover.Close as-child label="Save changes"><Button variant="primary">Save changes</Button></Popover.Close>
    </Popover.Content>
  </Popover.Root>
</template>`;

const controlledCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Popover } from "@dicehub/kappa/components/popover";

const open = ref(false);
</script>

<template>
  <Button @click="open = true">Open controlled popover</Button>
  <Popover.Root v-model:open="open">
    <Popover.Content>
      <Popover.Title>Controlled state</Popover.Title>
      <Popover.Description>The parent owns the open value.</Popover.Description>
      <Popover.Close as-child label="Done"><Button>Done</Button></Popover.Close>
    </Popover.Content>
  </Popover.Root>
</template>`;

const anchorCode = `<Popover.Root>
  <Popover.Anchor as-child>
    <span class="report-context">Report context · Run 4189</span>
  </Popover.Anchor>
  <Popover.Trigger as-child><Button aria-label="Open anchored details">Details</Button></Popover.Trigger>
  <Popover.Content>
    <Popover.Title>Anchored details</Popover.Title>
    <Popover.Description>Positioning uses the custom Anchor.</Popover.Description>
  </Popover.Content>
</Popover.Root>`;

const hoverCode = `<script setup>
import { onBeforeUnmount, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Popover } from "@dicehub/kappa/components/popover";

const open = ref(false);
let timer;

function cancelTimer() {
  window.clearTimeout(timer);
}

function scheduleOpen() {
  cancelTimer();
  timer = window.setTimeout(() => (open.value = true), 200);
}

function scheduleClose() {
  cancelTimer();
  timer = window.setTimeout(() => (open.value = false), 150);
}

function keepOpen() {
  cancelTimer();
  open.value = true;
}

onBeforeUnmount(cancelTimer);
</script>

<template>
  <Popover.Root v-model:open="open" :auto-focus="false">
    <Popover.Trigger as-child>
      <Button @mouseenter="scheduleOpen" @mouseleave="scheduleClose">Hover or focus</Button>
    </Popover.Trigger>
    <Popover.Content
      @mouseenter="keepOpen"
      @mouseleave="scheduleClose"
      @focusin="keepOpen"
      @focusout="scheduleClose"
    >
      <Popover.Title>Hover-triggered content</Popover.Title>
      <Popover.Description>The surface stays open while you interact with it.</Popover.Description>
      <Popover.Close as-child label="Got it"><Button>Got it</Button></Popover.Close>
    </Popover.Content>
  </Popover.Root>
</template>`;

const statesCode = `<Popover.Root>
  <Popover.Trigger as-child><Button disabled>Unavailable action</Button></Popover.Trigger>
  <Popover.Content>
    <Popover.Title>Unavailable action</Popover.Title>
    <Popover.Description>Validation must pass first.</Popover.Description>
  </Popover.Content>
</Popover.Root>

<Popover.Root :modal="true">
  <Popover.Trigger as-child><Button>Modal popover</Button></Popover.Trigger>
  <Popover.Content>
    <Popover.Title>Modal popover</Popover.Title>
    <Popover.Close as-child label="Close"><Button>Close</Button></Popover.Close>
  </Popover.Content>
</Popover.Root>`;

export const examples = [
  {
    id: "basic",
    title: "Basic Content",
    description: "Compose a title, description, metrics, and a close action inside the default surface.",
    variant: "basic",
    code: usageCode,
  },
  {
    id: "placement",
    title: "Placement",
    description: "Pass Ark UI positioning options to choose a side. Collision handling keeps the surface in the viewport.",
    variant: "placement",
    code: placementCode,
  },
  {
    id: "form",
    title: "Interactive Form",
    description: "Popover content can contain inputs and actions. Close through the compound Close part so focus returns correctly.",
    variant: "form",
    code: formCode,
  },
  {
    id: "controlled",
    title: "Controlled State",
    description: "Use v-model:open when application state must own visibility. Keep Root mounted while its value changes.",
    variant: "controlled",
    code: controlledCode,
  },
  {
    id: "custom-anchor",
    title: "Custom Anchor",
    description: "Anchor positions the surface against a separate reference element while Trigger remains the keyboard action.",
    variant: "anchor",
    code: anchorCode,
  },
  {
    id: "open-on-hover",
    title: "Open on Hover",
    description: "Compose controlled state with short pointer delays when rich interactive content must open on hover. Click and keyboard activation remain available; use Tooltip for a short text label.",
    variant: "hover",
    code: hoverCode,
  },
  {
    id: "states",
    title: "States and Modality",
    description: "Disabled triggers stay unavailable, while modal popovers block outside interaction through Ark UI.",
    variant: "states",
    code: statesCode,
  },
  {
    id: "right-to-left",
    title: "Right-to-left",
    description: "Use logical spacing and a dir attribute for Arabic, Hebrew, and other right-to-left content.",
    variant: "right-to-left",
    code: `<Popover.Root dir="rtl">
  <Popover.Trigger as-child><Button>فتح التفاصيل</Button></Popover.Trigger>
  <Popover.Content>
    <Popover.Title>تفاصيل المحاكاة</Popover.Title>
    <Popover.Description>النتائج جاهزة للمراجعة.</Popover.Description>
  </Popover.Content>
</Popover.Root>`,
  },
] as const;

export const rootProps = [
  { name: "open / defaultOpen", type: "boolean", defaultValue: "false", description: "Controlled or initial visibility. Pair open with update:open." },
  { name: "dir", type: '"ltr" | "rtl"', defaultValue: "inherited locale", description: "Overrides the inherited Ark UI locale direction for positioning and directional behavior." },
  { name: "autoFocus", type: "boolean", defaultValue: "true", description: "Moves focus to the first focusable content when opened." },
  { name: "closeOnEscape", type: "boolean", defaultValue: "true", description: "Closes the top popover when Escape is pressed." },
  { name: "closeOnInteractOutside", type: "boolean", defaultValue: "true", description: "Closes after an allowed outside interaction." },
  { name: "modal", type: "boolean", defaultValue: "false", description: "Blocks outside interaction, hides outside content from assistive technology, and traps focus." },
  { name: "portalled", type: "boolean", defaultValue: "true", description: "Preserves correct tab order when content is rendered outside its DOM position." },
  { name: "restoreFocus", type: "boolean", defaultValue: "true", description: "Returns focus to the opening trigger when the popover closes." },
  { name: "initialFocusEl / finalFocusEl", type: "() => HTMLElement | null", defaultValue: "-", description: "Override the elements that receive focus on open and close." },
  { name: "positioning", type: "PopoverPositioningOptions", defaultValue: "bottom, 8 px gutter", description: "Ark UI placement, collision, offset, and strategy options." },
  { name: "lazyMount / unmountOnExit", type: "boolean", defaultValue: "true", description: "Defer the popup DOM until first open and remove it after exit." },
  { name: "triggerValue / defaultTriggerValue", type: "string | null", defaultValue: "null", description: "Tracks which value-bearing Trigger opened the popover." },
  { name: "persistentElements", type: "(() => Element | null)[]", defaultValue: "-", description: "Outside elements that stay interactive and do not dismiss the layer." },
  { name: "translations", type: "PopoverIntlTranslations", defaultValue: "-", description: "Localized accessibility strings consumed by Ark UI." },
  { name: "id / ids", type: "string / object", defaultValue: "generated", description: "Override the machine or individual part identifiers." },
] as const;

export const contentProps = [
  { name: "teleport", type: "boolean", defaultValue: "true", description: "Moves the positioner to teleportTo after mount." },
  { name: "teleportTo", type: "string | Element", defaultValue: '"body"', description: "Vue Teleport target for the popup." },
  { name: "showArrow", type: "boolean", defaultValue: "true", description: "Shows the default Arrow and ArrowTip." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges content attributes into one child element." },
] as const;

export const closeProps = [
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges dismissal behavior onto one child control." },
  { name: "label", type: "string", defaultValue: "Ark translation", description: "Explicit accessible-label override for custom or icon-only close controls; omit it to use translations.closeTriggerLabel." },
] as const;

export const parts = [
  { name: "Popover.Root", element: "renderless", description: "Owns open state, focus, modality, dismissal, and trigger state." },
  { name: "Popover.RootProvider", element: "renderless", description: "Connects parts to an external usePopover machine." },
  { name: "Popover.Trigger", element: "button", description: "Toggles the popover; asChild merges behavior onto a Kappa Button." },
  { name: "Popover.Anchor", element: "div", description: "Optional reference element for custom positioning." },
  { name: "Popover.Content", element: "div", description: "Portalled, positioned surface with a default arrow." },
  { name: "Popover.Positioner", element: "div", description: "Public positioner for advanced manual composition." },
  { name: "Popover.Arrow / ArrowTip", element: "div", description: "Positioned arrow wrapper and visual tip; Content renders both by default." },
  { name: "Popover.Title", element: "div", description: "Visible accessible name connected to Content; use asChild for a heading element." },
  { name: "Popover.Description", element: "div", description: "Visible accessible description connected to Content; use asChild for a paragraph element." },
  { name: "Popover.Indicator", element: "div", description: "Optional state indicator for a trigger or custom control." },
  { name: "Popover.Close / CloseTrigger", element: "button", description: "Dismisses the popover; Ark's translations provide the default accessible name, while label is an explicit override." },
  { name: "Popover.Context", element: "slot", description: "Exposes reactive Ark UI state to a scoped slot." },
] as const;

export const events = [
  { name: "update:open", payload: "boolean", description: "Drives v-model:open." },
  { name: "openChange", payload: "PopoverOpenChangeDetails", description: "Reports every visibility change." },
  { name: "update:triggerValue", payload: "string | null", description: "Drives v-model:triggerValue." },
  { name: "triggerValueChange", payload: "PopoverTriggerValueChangeDetails", description: "Reports the active value-bearing trigger." },
  { name: "escapeKeyDown", payload: "KeyboardEvent", description: "Fires when Escape reaches the layer." },
  { name: "focusOutside / interactOutside / pointerDownOutside", payload: "Ark outside event", description: "Inspect or prevent outside behavior." },
  { name: "requestDismiss", payload: "PopoverRequestDismissEvent", description: "Fires when a parent layer requests nested dismissal." },
  { name: "exitComplete", payload: "void", description: "Fires after the closed-state motion completes." },
] as const;

export const exportsList = [
  { name: "Popover", description: "Compound API exposing every named part." },
  { name: "PopoverRoot / PopoverContent / PopoverClose …", description: "Named unaugmented component exports." },
  { name: "PopoverProps / PopoverDirection / PopoverContentProps", description: "Public prop, direction, and content contracts." },
  { name: "PopoverOpenChangeDetails and outside-event types", description: "Typed Ark UI event payloads." },
  { name: "usePopover / usePopoverContext", description: "Ark UI hooks for external state and descendant access." },
  { name: "popoverAnatomy", description: "Ark UI part anatomy metadata." },
  { name: "POPOVER_DEFAULT_POSITIONING", description: "Kappa's viewport-aware bottom placement." },
] as const;
