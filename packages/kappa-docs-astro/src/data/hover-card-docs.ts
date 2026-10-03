export const barrelCode = `import {
  HoverCard,
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardPositioner,
  HoverCardArrow,
  HoverCardArrowTip,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  HoverCard,
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardPositioner,
  HoverCardArrow,
  HoverCardArrowTip,
} from "@dicehub/kappa/components/hover-card";`;

export const previewCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { HoverCard } from "@dicehub/kappa/components/hover-card";
</script>

<template>
  <HoverCard.Root :open-delay="0">
    <HoverCard.Trigger as-child><Button variant="outline">Inspect run</Button></HoverCard.Trigger>
    <HoverCard.Content>
      <h3>Run 4189</h3>
      <p>Completed in 02:14:38. Residuals are within the acceptance limit.</p>
      <a href="/runs/4189">Open run report</a>
    </HoverCard.Content>
  </HoverCard.Root>
</template>`;

export const usageCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { HoverCard } from "@dicehub/kappa/components/hover-card";
</script>

<template>
  <HoverCard.Root>
    <HoverCard.Trigger as-child><Button>View solver profile</Button></HoverCard.Trigger>
    <HoverCard.Content>
      <h3>PIMPLE baseline</h3>
      <p>Pressure-velocity coupling · 1,240 iterations · 8.4e-6 residual.</p>
      <a href="/runs/pimple-baseline">Review the full run</a>
    </HoverCard.Content>
  </HoverCard.Root>
</template>`;

const placementCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { HoverCard } from "@dicehub/kappa/components/hover-card";

const placements = ["top", "bottom", "left", "right"] as const;
</script>

<template>
  <div class="placements">
    <HoverCard.Root v-for="placement in placements" :key="placement" :open-delay="0" :positioning="{ placement }">
      <HoverCard.Trigger as-child>
        <Button :data-placement-control="placement" size="sm" variant="outline">{{ placement }}</Button>
      </HoverCard.Trigger>
      <HoverCard.Content><h3>{{ placement }} placement</h3><p>Ark UI flips the surface when the viewport is tight.</p></HoverCard.Content>
    </HoverCard.Root>
  </div>
</template>

<style scoped>
.placements {
  display: grid;
  grid-template-areas: ". top ." "left . right" ". bottom .";
  grid-template-columns: repeat(3, minmax(0, 1fr));
  place-items: center;
  gap: 0.75rem 1rem;
}

[data-placement-control="top"] { grid-area: top; }
[data-placement-control="bottom"] { grid-area: bottom; }
[data-placement-control="left"] { grid-area: left; justify-self: start; }
[data-placement-control="right"] { grid-area: right; justify-self: end; }
</style>`;

const delayCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { HoverCard } from "@dicehub/kappa/components/hover-card";
</script>

<template>
  <HoverCard.Root :open-delay="0" :close-delay="300">
    <HoverCard.Trigger as-child><Button variant="outline">Immediate preview</Button></HoverCard.Trigger>
    <HoverCard.Content><h3>Fast preview</h3><p>Use a short open delay for a dense comparison table.</p></HoverCard.Content>
  </HoverCard.Root>
</template>`;

const controlledCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { HoverCard } from "@dicehub/kappa/components/hover-card";

const open = ref(false);
</script>

<template>
  <Button variant="outline" @click="open = !open">Toggle preview</Button>
  <HoverCard.Root v-model:open="open" :open-delay="0">
    <HoverCard.Trigger as-child><Button>Hover or focus</Button></HoverCard.Trigger>
    <HoverCard.Content><h3>Controlled state</h3><p>The parent owns the open value.</p></HoverCard.Content>
  </HoverCard.Root>
</template>`;

const arrowCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { HoverCard } from "@dicehub/kappa/components/hover-card";
</script>

<template>
<HoverCard.Root>
  <HoverCard.Trigger as-child><Button>Custom arrow</Button></HoverCard.Trigger>
  <HoverCard.Content>
    <template #arrow>
      <HoverCard.Arrow><HoverCard.ArrowTip /></HoverCard.Arrow>
    </template>
    <h3>Custom arrow slot</h3>
    <p>Replace the default arrow when the surface needs a different visual.</p>
  </HoverCard.Content>
</HoverCard.Root>
</template>`;

const overflowCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { HoverCard } from "@dicehub/kappa/components/hover-card";
</script>

<template>
<HoverCard.Root :open-delay="0">
  <HoverCard.Trigger as-child><Button>Long preview</Button></HoverCard.Trigger>
  <HoverCard.Content>
    <h3>Convergence notes</h3>
    <p>Long preview text wraps and scrolls inside the available viewport area. Keep the preview useful, but link to the full report for complete logs, tables, and actions.</p>
  </HoverCard.Content>
</HoverCard.Root>
</template>`;

const disabledCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { HoverCard } from "@dicehub/kappa/components/hover-card";
</script>

<template>
<HoverCard.Root disabled>
  <HoverCard.Trigger as-child><Button disabled>Unavailable run</Button></HoverCard.Trigger>
  <HoverCard.Content><h3>Unavailable run</h3><p>Validation must pass before this preview is available.</p></HoverCard.Content>
</HoverCard.Root>
</template>`;

export const examples = [
  {
    id: "interactive-preview",
    title: "Interactive Preview",
    description: "Use Hover Card for a compact preview that may contain a link. Its content stays interactive while the pointer moves from Trigger to Content.",
    variant: "interactive-preview",
    code: usageCode,
  },
  {
    id: "placement",
    title: "Placement and Collision",
    description: "Pass Ark UI positioning options to select a side. Collision handling keeps the surface inside the viewport.",
    variant: "placement",
    code: placementCode,
  },
  {
    id: "delay-control",
    title: "Delay Control",
    description: "Tune openDelay and closeDelay for the density of the surrounding workflow. The installed Ark UI default is 600 ms open and 300 ms close.",
    variant: "delay-control",
    code: delayCode,
  },
  {
    id: "controlled",
    title: "Controlled State",
    description: "Use v-model:open when application state must own visibility. Pointer and focus events still come from Ark UI.",
    variant: "controlled",
    code: controlledCode,
  },
  {
    id: "custom-arrow",
    title: "Custom Arrow",
    description: "Content renders an Arrow and ArrowTip by default. Replace them through the arrow slot when the surface needs a custom treatment.",
    variant: "custom-arrow",
    code: arrowCode,
  },
  {
    id: "long-preview",
    title: "Long Preview",
    description: "Long copy wraps and scrolls within the viewport-aware surface. Keep required workflow actions in a Popover or full page instead.",
    variant: "long-preview",
    code: overflowCode,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "A disabled root prevents opening. Do not make essential information available only through a disabled trigger.",
    variant: "disabled",
    code: disabledCode,
  },
] as const;

export const rootProps = [
  { name: "open / defaultOpen", type: "boolean", defaultValue: "false", description: "Controlled or initial visibility. Pair open with update:open or v-model:open." },
  { name: "openDelay", type: "number", defaultValue: "600", description: "Milliseconds from pointer enter or focus until the card opens. This follows the installed Ark UI machine." },
  { name: "closeDelay", type: "number", defaultValue: "300", description: "Milliseconds from pointer leave until the card closes. Pointer movement into Content cancels the close." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents pointer and focus events from opening the card." },
  { name: "positioning", type: "HoverCardPositioningOptions", defaultValue: "bottom, 8 px gutter", description: "Ark UI placement, collision, offset, and strategy options." },
  { name: "lazyMount / unmountOnExit", type: "boolean", defaultValue: "Ark UI", description: "Control whether Content mounts on first open and unmounts after exit." },
  { name: "triggerValue / defaultTriggerValue", type: "string | null", defaultValue: "null", description: "Track the active value-bearing Trigger when one root owns multiple previews." },
  { name: "id / ids", type: "string / object", defaultValue: "generated", description: "Override the machine or individual part identifiers." },
] as const;

export const contentProps = [
  { name: "teleport", type: "boolean", defaultValue: "true", description: "Moves the positioner to teleportTo after mount without changing Ark UI state or relationships." },
  { name: "teleportTo", type: "string | Element", defaultValue: '"body"', description: "Vue Teleport target for the positioner." },
  { name: "showArrow", type: "boolean", defaultValue: "true", description: "Shows the Kappa Arrow and ArrowTip convenience parts." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges content attributes into one child element through Ark UI." },
] as const;

export const parts = [
  { name: "HoverCard.Root", element: "renderless", description: "Owns open state, pointer/focus delays, active trigger value, outside interaction, and positioning." },
  { name: "HoverCard.RootProvider", element: "renderless", description: "Connects parts to an external useHoverCard machine." },
  { name: "HoverCard.Trigger", element: "button", description: "Pointer and keyboard focus target; asChild merges behavior onto a Kappa Button or link." },
  { name: "HoverCard.Content", element: "div", description: "Interactive, portalled preview surface with a default positioner and arrow." },
  { name: "HoverCard.Positioner", element: "div", description: "Public positioner for advanced manual composition; Content includes it by default." },
  { name: "HoverCard.Arrow / ArrowTip", element: "div", description: "Positioned arrow wrapper and visual tip; Content renders both by default." },
  { name: "HoverCard.Context", element: "slot", description: "Exposes reactive Ark UI state to a scoped slot." },
] as const;

export const events = [
  { name: "update:open", payload: "boolean", description: "Drives v-model:open." },
  { name: "openChange", payload: "HoverCardOpenChangeDetails", description: "Reports every visibility change." },
  { name: "update:triggerValue", payload: "string | null", description: "Drives v-model:triggerValue." },
  { name: "triggerValueChange", payload: "HoverCardTriggerValueChangeDetails", description: "Reports the active value-bearing trigger." },
  { name: "focusOutside / interactOutside / pointerDownOutside", payload: "Ark outside event", description: "Inspect or prevent outside interaction behavior." },
  { name: "exitComplete", payload: "void", description: "Fires after the closed-state motion completes." },
] as const;

export const exportsList = [
  { name: "HoverCard", description: "Compound API exposing Root, RootProvider, Trigger, Positioner, Content, Arrow, ArrowTip, and Context." },
  { name: "HoverCardRoot / HoverCardContent …", description: "Named unaugmented component exports." },
  { name: "HoverCardProps / HoverCardContentProps", description: "Public root, content, positioning, and part contracts." },
  { name: "HoverCardOpenChangeDetails and outside-event types", description: "Typed Ark UI event payloads." },
  { name: "useHoverCard / useHoverCardContext", description: "Ark UI hooks for external state and descendant access." },
  { name: "hoverCardAnatomy", description: "Ark UI part anatomy metadata." },
  { name: "HOVER_CARD_DEFAULT_POSITIONING", description: "Kappa's viewport-aware bottom placement." },
] as const;
