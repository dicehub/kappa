export const barrelCode = `import {
  Drawer,
  DrawerRoot,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  type DrawerProps,
  type DrawerSnapPoint,
  type DrawerSwipeDirection,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Drawer,
  DrawerRoot,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  type DrawerProps,
  type DrawerSnapPoint,
  type DrawerSwipeDirection,
} from "@dicehub/kappa/components/drawer";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Drawer } from "@dicehub/kappa/components/drawer";

const goal = ref(350);
const adjustGoal = (amount) => {
  goal.value = Math.min(600, Math.max(200, goal.value + amount));
};
</script>

<template>
  <Drawer.Root swipe-direction="end">
    <Drawer.Trigger as-child><Button variant="outline">Open Drawer</Button></Drawer.Trigger>
    <Drawer.Content show-close-button>
      <Drawer.Header>
        <Drawer.Title>Move Goal</Drawer.Title>
        <Drawer.Description>Set your daily activity goal.</Drawer.Description>
      </Drawer.Header>
      <div class="goal" data-no-drag>
        <Button aria-label="Decrease goal" @click="adjustGoal(-10)">−</Button>
        <output>{{ goal }} Calories/day</output>
        <Button aria-label="Increase goal" @click="adjustGoal(10)">+</Button>
      </div>
      <Drawer.Footer>
        <Drawer.Close as-child><Button variant="primary">Submit</Button></Drawer.Close>
        <Drawer.Close as-child><Button variant="secondary">Cancel</Button></Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
</template>`;

export const usageCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Drawer } from "@dicehub/kappa/components/drawer";
</script>

<template>
  <Drawer.Root>
    <Drawer.Trigger as-child><Button>Open drawer</Button></Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Are you absolutely sure?</Drawer.Title>
        <Drawer.Description>This action cannot be undone.</Drawer.Description>
      </Drawer.Header>
      <Drawer.Footer>
        <Button variant="primary">Submit</Button>
        <Drawer.Close as-child><Button variant="secondary">Cancel</Button></Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@dicehub/kappa/components/drawer";
</script>

<template>
  <DrawerRoot>
    <DrawerTrigger>Open</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Title</DrawerTitle>
        <DrawerDescription>Description</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter><DrawerClose>Close</DrawerClose></DrawerFooter>
    </DrawerContent>
  </DrawerRoot>
</template>`;

export const examples = [
  {
    id: "basic",
    title: "Basic",
    description: "A complete drawer has a clear title, concise supporting text, focused content, and explicit actions. Content supplies the portal, backdrop, positioner, surface, and grabber.",
    code: `<Drawer.Root>
  <Drawer.Trigger as-child><Button>Open drawer</Button></Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Edit profile</Drawer.Title>
      <Drawer.Description>Make changes to your profile here. Save when you are done.</Drawer.Description>
    </Drawer.Header>
    <form data-no-drag><!-- Profile fields --></form>
    <Drawer.Footer>
      <Drawer.Close as-child><Button>Save changes</Button></Drawer.Close>
      <Drawer.Close as-child><Button variant="secondary">Cancel</Button></Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>`,
  },
  {
    id: "positions",
    title: "Positions",
    description: "Render the same content from each supported edge. The LTR controls use physical labels; the API uses logical start and end values so side drawers adapt to text direction.",
    code: `<Drawer.Root swipe-direction="up"><!-- Move Goal --></Drawer.Root>
<Drawer.Root swipe-direction="end"><!-- Move Goal --></Drawer.Root>
<Drawer.Root swipe-direction="down"><!-- Move Goal --></Drawer.Root>
<Drawer.Root swipe-direction="start"><!-- Move Goal --></Drawer.Root>`,
  },
  {
    id: "custom-size",
    title: "Custom Sizes",
    description: "Set block size on vertical content or --kappa-drawer-inline-size on side content. The built-in viewport caps remain active.",
    code: `<Drawer.Content style="block-size: 50dvb">...</Drawer.Content>

<Drawer.Root swipe-direction="end">
  <Drawer.Content style="--kappa-drawer-inline-size: 30rem">...</Drawer.Content>
</Drawer.Root>`,
  },
  {
    id: "swipe-handle",
    title: "Swipe Handle",
    description: "The grabber follows the active edge. The same header and content hierarchy works in all four directions.",
    code: `<Drawer.Root swipe-direction="up"><Drawer.Content show-grabber>...</Drawer.Content></Drawer.Root>
<Drawer.Root swipe-direction="end"><Drawer.Content show-grabber>...</Drawer.Content></Drawer.Root>
<Drawer.Root swipe-direction="down"><Drawer.Content show-grabber>...</Drawer.Content></Drawer.Root>
<Drawer.Root swipe-direction="start"><Drawer.Content show-grabber>...</Drawer.Content></Drawer.Root>`,
  },
  {
    id: "snap-points",
    title: "Snap Points",
    description: "Vertical drawers can stop at fractional, pixel, or CSS-length positions. Bind snapPoint when the application needs the active value.",
    code: `<script setup>
import { ref } from "vue";
const snapPoint = ref(0.35);
</script>

<Drawer.Root
  v-model:snap-point="snapPoint"
  :snap-points="[0.35, 0.65, 1]"
  snap-to-sequential-points
>
  <Drawer.Content style="block-size: min(42rem, calc(100dvb - 3rem))">...</Drawer.Content>
</Drawer.Root>`,
  },
  {
    id: "scrollable",
    title: "Scrollable Content",
    description: "Keep Header and Footer fixed. Make the middle flex child scrollable and add data-no-drag so scrolling does not start a drawer gesture.",
    code: `<Drawer.Content class="policy-drawer">
  <Drawer.Header>...</Drawer.Header>
  <div class="policy-drawer__body" data-no-drag tabindex="0">...</div>
  <Drawer.Footer>...</Drawer.Footer>
</Drawer.Content>

<style scoped>
.policy-drawer { block-size: min(34rem, calc(100dvb - 3rem)); }
.policy-drawer__body { min-block-size: 0; flex: 1; overflow-y: auto; }
</style>`,
  },
  {
    id: "non-draggable",
    title: "Handle-only Drag",
    description: "Set draggable to false when users must select or manipulate content. The Grabber remains draggable.",
    code: `<Drawer.Content :draggable="false">
  <Drawer.Header>
    <Drawer.Title>Copy confirmation code</Drawer.Title>
  </Drawer.Header>
  <p>Select the code without moving the panel.</p>
</Drawer.Content>`,
  },
  {
    id: "non-modal",
    title: "Non-modal",
    description: "Disable modal focus and scroll restrictions when the panel supplements an active page. Remove the backdrop and choose outside-dismissal behavior explicitly.",
    code: `<Drawer.Root
  :close-on-interact-outside="false"
  :modal="false"
  :prevent-scroll="false"
  :trap-focus="false"
  swipe-direction="end"
>
  <Drawer.Content :show-backdrop="false">...</Drawer.Content>
</Drawer.Root>`,
  },
  {
    id: "controlled",
    title: "Controlled",
    description: "Bind v-model:open when application state owns visibility. Keep Root mounted so exit motion and focus restoration can finish.",
    code: `<script setup>
import { ref } from "vue";
const open = ref(false);
</script>

<Button @click="open = true">Open controlled drawer</Button>
<Drawer.Root v-model:open="open">
  <Drawer.Content>
    <Drawer.Title>Export account data</Drawer.Title>
    <Drawer.Footer><Button @click="open = false">Export</Button></Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>`,
  },
  {
    id: "multiple-triggers",
    title: "Multiple Triggers",
    description: "Give each Trigger a value and bind triggerValue when one Drawer surface presents context for several source controls.",
    code: `<Drawer.Root v-model:trigger-value="activeSetting">
  <Drawer.Trigger as-child value="profile"><Button>Profile</Button></Drawer.Trigger>
  <Drawer.Trigger as-child value="security"><Button>Security</Button></Drawer.Trigger>
  <Drawer.Content>...</Drawer.Content>
</Drawer.Root>`,
  },
  {
    id: "nested",
    title: "Nested Drawers",
    description: "Wrap related roots in Drawer.Stack. A child drawer opens above its parent while Ark UI coordinates layer state and Kappa scales the parent surface.",
    code: `<Drawer.Stack>
  <Drawer.Root>
    <Drawer.Trigger>Open settings</Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Root>
        <Drawer.Trigger>Advanced settings</Drawer.Trigger>
        <Drawer.Content>...</Drawer.Content>
      </Drawer.Root>
    </Drawer.Content>
  </Drawer.Root>
</Drawer.Stack>`,
  },
  {
    id: "responsive",
    title: "Responsive Dialog",
    description: "Use Dialog for wide screens and Drawer for compact screens. Preserve the same title, fields, actions, and controlled state across both branches.",
    code: `<Dialog.Root v-if="!isCompact">...</Dialog.Root>
<Drawer.Root v-else>...</Drawer.Root>`,
  },
  {
    id: "right-to-left",
    title: "Right-to-left",
    description: "The logical start and end directions follow the inherited locale. In RTL, start resolves to the right edge.",
    code: `<Drawer.Root locale="ar" swipe-direction="start">
  <Drawer.Content dir="rtl">
    <Drawer.Title>ملخص الحساب</Drawer.Title>
    <Drawer.Description>تفتح اللوحة من البداية المنطقية.</Drawer.Description>
  </Drawer.Content>
</Drawer.Root>`,
  },
] as const;

export const rootProps = [
  { name: "open / defaultOpen", type: "boolean", defaultValue: "false", description: "Controls or initializes visibility." },
  { name: "swipeDirection", type: '"up" | "down" | "start" | "end"', defaultValue: '"down"', description: "Sets the edge and dismiss gesture. Start and end are logical directions." },
  { name: "snapPoints", type: "(number | string)[]", defaultValue: "[1]", description: "Defines available vertical resting positions." },
  { name: "snapPoint / defaultSnapPoint", type: "number | string | null", defaultValue: "1", description: "Controls or initializes the active snap point." },
  { name: "snapToSequentialPoints", type: "boolean", defaultValue: "false", description: "Moves through adjacent snap points instead of selecting by release position." },
  { name: "closeThreshold", type: "number", defaultValue: "0.25", description: "Sets the fractional drag distance that dismisses the drawer." },
  { name: "swipeVelocityThreshold", type: "number", defaultValue: "700", description: "Sets the velocity in pixels per second that dismisses the drawer." },
  { name: "preventDragOnScroll", type: "boolean", defaultValue: "true", description: "Prevents a gesture from starting on a scrollable element." },
  { name: "closeOnEscape / closeOnInteractOutside", type: "boolean", defaultValue: "true", description: "Controls keyboard and outside-interaction dismissal." },
  { name: "modal", type: "boolean", defaultValue: "true", description: "Blocks pointer and assistive technology access outside the drawer." },
  { name: "trapFocus", type: "boolean", defaultValue: "true", description: "Keeps keyboard focus inside while open." },
  { name: "preventScroll", type: "boolean", defaultValue: "true", description: "Prevents page scrolling behind a modal drawer." },
  { name: "restoreFocus", type: "boolean", defaultValue: "true", description: "Returns focus to the opening trigger or finalFocusEl." },
  { name: "initialFocusEl / finalFocusEl", type: "() => HTMLElement | null", defaultValue: "-", description: "Overrides initial and restored focus targets." },
  { name: "role", type: '"dialog" | "alertdialog"', defaultValue: '"dialog"', description: "Sets the accessible layer role." },
  { name: "locale", type: "string", defaultValue: '"en-US"', description: "Sets the Ark UI locale used to resolve logical start and end directions." },
  { name: "lazyMount / unmountOnExit", type: "boolean", defaultValue: "true", description: "Defers DOM creation and removes the surface after exit motion." },
  { name: "triggerValue / defaultTriggerValue", type: "string | null", defaultValue: "null", description: "Tracks which value-bearing Trigger opened the drawer." },
  { name: "id / ids", type: "string / object", defaultValue: "generated", description: "Overrides machine and part identifiers." },
] as const;

export const contentProps = [
  { name: "draggable", type: "boolean", defaultValue: "true", description: "Allows dragging from the complete surface. The Grabber still works when false." },
  { name: "showGrabber", type: "boolean", defaultValue: "true", description: "Renders the directional grabber and indicator." },
  { name: "showBackdrop", type: "boolean", defaultValue: "true", description: "Renders the dimmed modal backdrop." },
  { name: "showCloseButton", type: "boolean", defaultValue: "false", description: "Renders a built-in corner close control." },
  { name: "closeLabel", type: "string", defaultValue: '"Close drawer"', description: "Localizes the built-in close control's accessible name." },
  { name: "teleport", type: "boolean", defaultValue: "true", description: "Moves layers out of clipping and stacking contexts." },
  { name: "teleportTo", type: "Teleport target", defaultValue: '"body"', description: "Sets the Vue Teleport destination." },
] as const;

export const parts = [
  { name: "Root", element: "renderless", description: "Owns open state, gestures, snap points, focus, modality, and dismissal." },
  { name: "RootProvider", element: "renderless", description: "Connects parts to an external useDrawer machine." },
  { name: "Stack", element: "renderless", description: "Coordinates visual state for nested drawer roots." },
  { name: "Trigger", element: "button", description: "Opens the drawer and can identify itself with a value." },
  { name: "SwipeArea", element: "div", description: "Optional viewport-edge gesture area that can open a closed drawer." },
  { name: "Content", element: "div", description: "Composes Teleport, Backdrop, Positioner, surface, Grabber, and optional close control." },
  { name: "Backdrop / Positioner", element: "div", description: "Public viewport layers used by composed Content." },
  { name: "Grabber / GrabberIndicator", element: "div", description: "Directional drag target and its visible indicator." },
  { name: "Header / Footer", element: "div", description: "Kappa layout parts for stable copy and action regions." },
  { name: "Title", element: "h2", description: "Visible accessible name connected to Content." },
  { name: "Description", element: "p", description: "Visible accessible description connected to Content." },
  { name: "Close / CloseTrigger", element: "button", description: "Dismisses the drawer and restores focus." },
  { name: "Context", element: "renderless", description: "Exposes the unwrapped drawer API to its slot." },
  { name: "Indent / IndentBackground", element: "div", description: "Optional page layers driven by Drawer.Stack state." },
] as const;

export const events = [
  { name: "update:open", payload: "boolean", description: "Drives v-model:open." },
  { name: "openChange", payload: "{ open: boolean }", description: "Reports every visibility change." },
  { name: "update:snapPoint", payload: "number | string | null", description: "Drives v-model:snapPoint." },
  { name: "snapPointChange", payload: "{ snapPoint: number | string | null }", description: "Reports the active resting position." },
  { name: "update:triggerValue", payload: "string | null", description: "Drives v-model:triggerValue." },
  { name: "triggerValueChange", payload: "{ value: string | null; triggerElement: HTMLElement | null }", description: "Reports the active value-bearing trigger." },
  { name: "exitComplete", payload: "void", description: "Fires after the closed-state motion completes." },
] as const;

export const exportsList = [
  { name: "Drawer", description: "Compound root API exposing every named part." },
  { name: "DrawerRoot / DrawerContent / DrawerClose …", description: "Named unaugmented component exports." },
  { name: "DrawerProps / DrawerContentProps", description: "Public root and composed-content prop contracts." },
  { name: "DrawerSwipeDirection / DrawerSnapPoint / DrawerRole", description: "Supported behavior value types." },
  { name: "DrawerOpenChangeDetails and change-detail types", description: "Typed Ark UI event payloads." },
  { name: "DRAWER_SWIPE_DIRECTIONS / DRAWER_ROLES", description: "Readonly supported-value lists." },
  { name: "useDrawer / useDrawerContext / useDrawerStackContext", description: "Ark UI hooks for external and descendant access." },
  { name: "drawerAnatomy", description: "Ark UI part anatomy metadata." },
] as const;
