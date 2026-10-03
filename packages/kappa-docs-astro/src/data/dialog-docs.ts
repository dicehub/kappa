export const barrelCode = `import {
  Dialog,
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  type DialogProps,
  type DialogSize,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Dialog,
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  type DialogProps,
  type DialogSize,
} from "@dicehub/kappa/components/dialog";`;

export const previewCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Dialog } from "@dicehub/kappa/components/dialog";
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger as-child>
      <Button variant="outline">Edit run details</Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Edit run details</Dialog.Title>
        <Dialog.Description>Change the label used in reports and result archives.</Dialog.Description>
      </Dialog.Header>
      <label>Run label <input value="PIMPLE baseline 07" /></label>
      <Dialog.Footer>
        <Dialog.Close as-child><Button variant="secondary">Cancel</Button></Dialog.Close>
        <Dialog.Close as-child><Button variant="primary">Save changes</Button></Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</template>`;

export const usageCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Dialog } from "@dicehub/kappa/components/dialog";
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger as-child><Button>Open dialog</Button></Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Simulation summary</Dialog.Title>
        <Dialog.Description>Run 4189 completed successfully.</Dialog.Description>
      </Dialog.Header>
      <p>Review the generated fields and reports.</p>
      <Dialog.Footer>
        <Dialog.Close as-child><Button variant="primary">Done</Button></Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@dicehub/kappa/components/dialog";
</script>

<template>
  <DialogRoot>
    <DialogTrigger>Open</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
      </DialogHeader>
      <DialogFooter><DialogClose>Close</DialogClose></DialogFooter>
    </DialogContent>
  </DialogRoot>
</template>`;

export const examples = [
  {
    id: "basic",
    title: "Basic",
    description: "Content supplies the portal, backdrop, centered positioner, surface, and default close control.",
    code: `<Dialog.Root>
  <Dialog.Trigger as-child><Button>Open dialog</Button></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Simulation summary</Dialog.Title>
      <Dialog.Description>Run 4189 completed in 02:14:38.</Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>`,
  },
  {
    id: "alert-dialog",
    title: "Alert Dialog",
    description: "Use alertdialog for a destructive decision. Kappa disables outside dismissal and the example removes the corner close control.",
    code: `<Dialog.Root role="alertdialog">
  <Dialog.Trigger as-child><Button variant="destructive">Delete run</Button></Dialog.Trigger>
  <Dialog.Content :show-close-button="false">
    <Dialog.Header>
      <Dialog.Title>Delete run 4189?</Dialog.Title>
      <Dialog.Description>This action cannot be undone.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Dialog.Close as-child><Button variant="secondary">Keep run</Button></Dialog.Close>
      <Dialog.Close as-child><Button variant="destructive">Delete permanently</Button></Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>`,
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "disablePointerDismissal keeps an ordinary dialog open after backdrop clicks. Escape still works unless closeOnEscape is false.",
    code: `<Dialog.Root disable-pointer-dismissal>
  <Dialog.Trigger as-child><Button variant="warning">Stop solver</Button></Dialog.Trigger>
  <Dialog.Content :show-close-button="false">
    <Dialog.Title>Stop the active solver?</Dialog.Title>
    <Dialog.Footer>
      <Dialog.Close as-child><Button>Continue run</Button></Dialog.Close>
      <Dialog.Close as-child><Button variant="warning">Stop solver</Button></Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>`,
  },
  {
    id: "controlled",
    title: "Controlled",
    description: "Bind v-model:open when application state must own visibility. Do not conditionally remove Dialog.Root.",
    code: `<script setup>
import { ref } from "vue";
import { Dialog } from "@dicehub/kappa/components/dialog";

const open = ref(false);
</script>

<template>
  <Button @click="open = true">Open controlled dialog</Button>
  <Dialog.Root v-model:open="open">
    <Dialog.Content>
      <Dialog.Title>Controlled state</Dialog.Title>
      <Button @click="open = false">Done</Button>
    </Dialog.Content>
  </Dialog.Root>
</template>`,
  },
  {
    id: "sizes",
    title: "Sizes and Custom Width",
    description: "Use sm, base, lg, or xl. Override --kappa-dialog-inline-size for a one-off cap; the viewport limit still applies.",
    code: `<Dialog.Content size="sm">...</Dialog.Content>
<Dialog.Content size="base">...</Dialog.Content>
<Dialog.Content size="lg">...</Dialog.Content>
<Dialog.Content size="xl">...</Dialog.Content>

<Dialog.Content style="--kappa-dialog-inline-size: 40rem">...</Dialog.Content>`,
  },
  {
    id: "custom-close-button",
    title: "Custom Close Button",
    description: "The close slot replaces the built-in icon. Keep Dialog.Close so Ark UI still owns dismissal and focus restoration.",
    code: `<Dialog.Content>
  <template #close>
    <Dialog.Close as-child>
      <Button size="xs" variant="ghost">Dismiss</Button>
    </Dialog.Close>
  </template>
  <Dialog.Title>Custom close control</Dialog.Title>
</Dialog.Content>`,
  },
  {
    id: "no-close-button",
    title: "No Close Button",
    description: "Disable the corner control when a visible action row gives the user a clearer next step.",
    code: `<Dialog.Content :show-close-button="false">
  <Dialog.Title>Review required</Dialog.Title>
  <Dialog.Footer>
    <Dialog.Close as-child><Button>Acknowledge</Button></Dialog.Close>
  </Dialog.Footer>
</Dialog.Content>`,
  },
  {
    id: "native-form-control",
    title: "Native Form Control",
    description: "Native inputs and selects keep their normal keyboard behavior inside the focus trap.",
    code: `<Dialog.Content>
  <Dialog.Header>
    <Dialog.Title>Configure resource</Dialog.Title>
    <Dialog.Description>Choose the target region.</Dialog.Description>
  </Dialog.Header>
  <label>
    Region
    <select v-model="region">
      <option value="eu-central">EU Central · Frankfurt</option>
      <option value="us-east">US East · Virginia</option>
    </select>
  </label>
</Dialog.Content>`,
  },
  {
    id: "combobox",
    title: "With Combobox",
    description: "Lazy mount a teleported Kappa Combobox so its popup stays above the dialog and inside the active modal accessibility tree.",
    code: `<Dialog.Content size="lg">
  <Dialog.Header>
    <Dialog.Title>Move simulation</Dialog.Title>
  </Dialog.Header>
  <Combobox
    v-model="region"
    :items="regions"
    label="Destination region"
    lazy-mount
    placeholder="Search regions"
    unmount-on-exit
  />
</Dialog.Content>`,
  },
  {
    id: "sticky-footer",
    title: "Sticky Footer",
    description: "Give the content a block size and let a min-block-size: 0 body scroll. Header and Footer remain fixed flex children.",
    code: `<Dialog.Content class="report-dialog" size="lg">
  <Dialog.Header><Dialog.Title>Convergence report</Dialog.Title></Dialog.Header>
  <div class="report-dialog__body" tabindex="0">...</div>
  <Dialog.Footer>...</Dialog.Footer>
</Dialog.Content>

<style scoped>
.report-dialog { block-size: min(30rem, calc(100dvb - 2rem)); }
.report-dialog__body { min-block-size: 0; flex: 1; overflow-y: auto; }
</style>`,
  },
  {
    id: "scrollable-content",
    title: "Scrollable Content",
    description: "Keep long copy in a named scroll region. The surface stays inside the dynamic viewport limit.",
    code: `<Dialog.Content>
  <Dialog.Header><Dialog.Title>Solver notes</Dialog.Title></Dialog.Header>
  <div class="scroll-region" tabindex="0">Long content...</div>
</Dialog.Content>

<style scoped>
.scroll-region { max-block-size: 16rem; overflow-y: auto; }
</style>`,
  },
  {
    id: "nested-dialog",
    title: "Nested Dialog",
    description: "Place another Root inside the parent Content. Ark UI coordinates focus, dismissal, aria hiding, and layer order.",
    code: `<Dialog.Root>
  <Dialog.Trigger>Open parent</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Run settings</Dialog.Title>
    <Dialog.Root>
      <Dialog.Trigger>Edit advanced settings</Dialog.Trigger>
      <Dialog.Content size="sm">
        <Dialog.Title>Advanced settings</Dialog.Title>
      </Dialog.Content>
    </Dialog.Root>
  </Dialog.Content>
</Dialog.Root>`,
  },
  {
    id: "right-to-left",
    title: "Right-to-left",
    description: "Logical spacing keeps the close control and action layout correct in RTL content.",
    code: `<Dialog.Content dir="rtl">
  <Dialog.Header>
    <Dialog.Title>نتائج المحاكاة</Dialog.Title>
    <Dialog.Description>النتائج جاهزة للمراجعة.</Dialog.Description>
  </Dialog.Header>
  <Dialog.Footer><Dialog.Close>تم</Dialog.Close></Dialog.Footer>
</Dialog.Content>`,
  },
] as const;

export const rootProps = [
  { name: "open / defaultOpen", type: "boolean", defaultValue: "false", description: "Controlled or initial visibility. Pair open with update:open." },
  { name: "role", type: '"dialog" | "alertdialog"', defaultValue: '"dialog"', description: "Sets the accessible role. Alert dialogs disable outside dismissal by default." },
  { name: "ariaLabel", type: "string", defaultValue: "-", description: "Accessible name when no visible Title is rendered." },
  { name: "closeOnEscape", type: "boolean", defaultValue: "true", description: "Closes the top dialog when Escape is pressed." },
  { name: "closeOnInteractOutside", type: "boolean", defaultValue: "true", description: "Closes after an allowed outside interaction." },
  { name: "disablePointerDismissal", type: "boolean", defaultValue: "false", description: "Forces outside dismissal off without changing the dialog role." },
  { name: "modal", type: "boolean", defaultValue: "true", description: "Blocks pointer and assistive technology access outside the dialog." },
  { name: "trapFocus", type: "boolean", defaultValue: "true", description: "Keeps keyboard focus inside while open." },
  { name: "preventScroll", type: "boolean", defaultValue: "true", description: "Prevents the page behind the modal from scrolling." },
  { name: "restoreFocus", type: "boolean", defaultValue: "true", description: "Returns focus to the opening trigger or finalFocusEl." },
  { name: "initialFocusEl / finalFocusEl", type: "() => HTMLElement | null", defaultValue: "-", description: "Overrides initial and restored focus targets." },
  { name: "lazyMount / unmountOnExit", type: "boolean", defaultValue: "true", description: "Defers dialog DOM and removes it after the exit motion." },
  { name: "triggerValue / defaultTriggerValue", type: "string | null", defaultValue: "null", description: "Tracks which value-bearing Trigger opened the dialog." },
  { name: "persistentElements", type: "(() => Element | null)[]", defaultValue: "-", description: "Outside elements that stay interactive and do not dismiss the layer." },
  { name: "id / ids", type: "string / object", defaultValue: "generated", description: "Overrides machine and individual part identifiers." },
] as const;

export const contentProps = [
  { name: "size", type: '"sm" | "base" | "lg" | "xl"', defaultValue: '"base"', description: "Sets the preferred inline size while keeping the viewport cap." },
  { name: "showCloseButton", type: "boolean", defaultValue: "true", description: "Renders the built-in corner close control." },
  { name: "closeLabel", type: "string", defaultValue: '"Close dialog"', description: "Localizes the built-in close control's accessible name." },
  { name: "showBackdrop", type: "boolean", defaultValue: "true", description: "Renders the dimmed backdrop. Disable it with modal=false for a non-modal surface." },
  { name: "teleport", type: "boolean", defaultValue: "true", description: "Moves the layers out of clipping and stacking contexts." },
  { name: "teleportTo", type: "Teleport target", defaultValue: '"body"', description: "Sets the Vue Teleport destination." },
] as const;

export const parts = [
  { name: "Root", element: "renderless", description: "Owns open state, focus, modality, dismissal, and trigger state." },
  { name: "RootProvider", element: "renderless", description: "Connects parts to an external useDialog machine." },
  { name: "Trigger", element: "button", description: "Opens the dialog; asChild merges behavior onto a Kappa Button." },
  { name: "Content", element: "div", description: "Composes Teleport, Backdrop, Positioner, surface, and optional close control." },
  { name: "Backdrop", element: "div", description: "Public dimmed layer used by the composed Content." },
  { name: "Positioner", element: "div", description: "Public viewport layer used by the composed Content." },
  { name: "Header / Footer", element: "div", description: "Kappa layout parts for stable title and action regions." },
  { name: "Title", element: "h2", description: "Visible accessible name connected to Content." },
  { name: "Description", element: "p", description: "Visible accessible description connected to Content." },
  { name: "Close / CloseTrigger", element: "button", description: "Dismisses the layer; renders a localized icon when no slot is provided." },
  { name: "Context", element: "renderless", description: "Exposes the unwrapped dialog API to its slot." },
] as const;

export const events = [
  { name: "update:open", payload: "boolean", description: "Drives v-model:open." },
  { name: "openChange", payload: "{ open: boolean }", description: "Reports every visibility change." },
  { name: "update:triggerValue", payload: "string | null", description: "Drives v-model:triggerValue." },
  { name: "triggerValueChange", payload: "{ triggerValue: string | null }", description: "Reports the active value-bearing trigger." },
  { name: "escapeKeyDown", payload: "KeyboardEvent", description: "Fires when Escape reaches the layer." },
  { name: "focusOutside / interactOutside / pointerDownOutside", payload: "Ark outside event", description: "Lets consumers inspect or prevent outside behavior." },
  { name: "requestDismiss", payload: "DialogRequestDismissEvent", description: "Fires when a parent layer requests nested dismissal." },
  { name: "exitComplete", payload: "void", description: "Fires after the closed-state motion completes." },
] as const;

export const exportsList = [
  { name: "Dialog", description: "Compound root API exposing every named part." },
  { name: "DialogRoot / DialogContent / DialogClose …", description: "Named unaugmented component exports." },
  { name: "DialogProps / DialogContentProps / DialogSize", description: "Public prop and variant contracts." },
  { name: "DialogOpenChangeDetails and outside-event types", description: "Typed Ark UI event payloads." },
  { name: "DIALOG_SIZES / DIALOG_ROLES", description: "Readonly supported-value lists." },
  { name: "useDialog / useDialogContext", description: "Ark UI hooks for external state and descendant access." },
  { name: "dialogAnatomy", description: "Ark UI part anatomy metadata." },
] as const;
