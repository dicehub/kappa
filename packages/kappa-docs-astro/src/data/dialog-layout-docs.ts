const vueTemplate = (source: string) =>
  `<template>\n${source.replace(/^/gm, "  ")}\n</template>`;

export const previewCode = vueTemplate(`<DialogLayout.Root>
  <DialogLayout.Trigger as-child>
    <Button variant="primary">Configure deployment</Button>
  </DialogLayout.Trigger>
  <DialogLayout.Content :show-close-button="false">
    <DialogLayout.Header>
      <DialogLayout.Title>Configure deployment</DialogLayout.Title>
      <DialogLayout.Description>Review the release target.</DialogLayout.Description>
    </DialogLayout.Header>
    <DialogLayout.Body>Deployment settings...</DialogLayout.Body>
    <DialogLayout.Actions dismiss-label="Cancel">
      <DialogLayout.Close as-child>
        <DialogLayout.Actions.Primary>Deploy</DialogLayout.Actions.Primary>
      </DialogLayout.Close>
    </DialogLayout.Actions>
  </DialogLayout.Content>
</DialogLayout.Root>`);

export const barrelCode = `import { DialogLayout } from "@dicehub/kappa";`;

export const granularCode = `import {
  DialogLayout,
  DialogLayoutBody,
  DialogLayoutContent,
} from "@dicehub/kappa/components/dialog-layout";`;

export const usageCode = `<script setup lang="ts">
import { Button } from "@dicehub/kappa/components/button";
import { DialogLayout } from "@dicehub/kappa/components/dialog-layout";
<\/script>

<template>
  <DialogLayout.Root>
    <DialogLayout.Trigger as-child>
      <Button>Open settings</Button>
    </DialogLayout.Trigger>
    <DialogLayout.Content :show-close-button="false">
      <DialogLayout.Header>
        <DialogLayout.Title>Run settings</DialogLayout.Title>
        <DialogLayout.Description>Changes apply to the next run.</DialogLayout.Description>
      </DialogLayout.Header>
      <DialogLayout.Body>Settings form...</DialogLayout.Body>
      <DialogLayout.Actions dismiss-label="Cancel">
        <DialogLayout.Close as-child>
          <DialogLayout.Actions.Primary>Save</DialogLayout.Actions.Primary>
        </DialogLayout.Close>
      </DialogLayout.Actions>
    </DialogLayout.Content>
  </DialogLayout.Root>
</template>`;

export const compositionCode = vueTemplate(`<DialogLayout.Root>
  <DialogLayout.Trigger />
  <DialogLayout.Content>
    <DialogLayout.Header>
      <DialogLayout.Title />
      <DialogLayout.Description />
    </DialogLayout.Header>
    <DialogLayout.Body />
    <DialogLayout.Actions>
      <DialogLayout.Actions.Primary />
    </DialogLayout.Actions>
  </DialogLayout.Content>
</DialogLayout.Root>`);

export const examples = [
  {
    id: "informational",
    title: "Informational",
    description: "Omit the action row when the corner close control is enough.",
    code: vueTemplate(`<DialogLayout.Content size="sm">
  <DialogLayout.Header>
    <DialogLayout.Title>Result archive ready</DialogLayout.Title>
    <DialogLayout.Description>Available for 30 days.</DialogLayout.Description>
  </DialogLayout.Header>
  <DialogLayout.Body>Archive details...</DialogLayout.Body>
</DialogLayout.Content>`),
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "Alert mode requires an explicit decision and blocks outside pointer dismissal.",
    code: vueTemplate(`<DialogLayout.Alert>
  <DialogLayout.Content :show-close-button="false" size="sm">
    <DialogLayout.Header>
      <DialogLayout.Title>Delete result?</DialogLayout.Title>
      <DialogLayout.Description>This action cannot be undone.</DialogLayout.Description>
    </DialogLayout.Header>
    <DialogLayout.Body>Run 4816 will be removed permanently.</DialogLayout.Body>
    <DialogLayout.Actions dismiss-label="Cancel">
      <DialogLayout.Close as-child>
        <DialogLayout.Actions.Primary variant="destructive">
          Delete result
        </DialogLayout.Actions.Primary>
      </DialogLayout.Close>
    </DialogLayout.Actions>
  </DialogLayout.Content>
</DialogLayout.Alert>`),
  },
  {
    id: "long-content",
    title: "Scrollable Body",
    description: "The header and action row stay visible while only the body scrolls.",
    code: vueTemplate(`<DialogLayout.Content :show-close-button="false">
  <DialogLayout.Header>
    <DialogLayout.Title>Run audit log</DialogLayout.Title>
  </DialogLayout.Header>
  <DialogLayout.Body tabindex="0">Long event list...</DialogLayout.Body>
  <DialogLayout.Actions dismiss-label="Done">
    <span>16 events</span>
  </DialogLayout.Actions>
</DialogLayout.Content>`),
  },
  {
    id: "loading",
    title: "Pending Work",
    description: "Keep the primary label visible, show progress, and disable user dismissal while work is pending.",
    code: vueTemplate(`<DialogLayout.Root
  v-model:open="open"
  :close-on-escape="!saving"
  :disable-pointer-dismissal="saving"
>
  <DialogLayout.Content :show-close-button="false">
    <DialogLayout.Header><DialogLayout.Title>Deploy solver image</DialogLayout.Title></DialogLayout.Header>
    <DialogLayout.Body>Deployment details...</DialogLayout.Body>
    <DialogLayout.Actions dismiss-label="Cancel" :dismiss-disabled="saving">
      <DialogLayout.Actions.Primary :loading="saving" @click="deploy">
        {{ saving ? "Deploying" : "Deploy" }}
      </DialogLayout.Actions.Primary>
    </DialogLayout.Actions>
  </DialogLayout.Content>
</DialogLayout.Root>`),
  },
  {
    id: "top-aligned",
    title: "Top Aligned",
    description: "Place a tall technical workflow near the top of a desktop viewport.",
    code: vueTemplate(`<DialogLayout.Content vertical-align="top">
  <DialogLayout.Header><DialogLayout.Title>Validation warnings</DialogLayout.Title></DialogLayout.Header>
  <DialogLayout.Body>Warnings...</DialogLayout.Body>
</DialogLayout.Content>`),
  },
] as const;

export const contentProps = [
  { name: "size", type: '"sm" | "base" | "lg" | "xl"', defaultValue: '"base"', description: "Sets the desktop width." },
  { name: "verticalAlign", type: '"center" | "top"', defaultValue: '"center"', description: "Sets desktop placement. Mobile placement stays at the bottom." },
  { name: "showCloseButton", type: "boolean", defaultValue: "true", description: "Shows the corner close control. Disable it when an action row owns dismissal." },
  { name: "closeLabel", type: "string", defaultValue: '"Close dialog"', description: "Labels the corner close control." },
  { name: "showBackdrop", type: "boolean", defaultValue: "true", description: "Renders the modal backdrop." },
  { name: "teleport / teleportTo", type: "boolean / Teleport target", defaultValue: 'true / "body"', description: "Controls the portal destination." },
] as const;

export const actionsProps = [
  { name: "dismissLabel", type: "string", defaultValue: '"Close"', description: "Labels the automatic dismiss action." },
  { name: "dismissDisabled", type: "boolean", defaultValue: "false", description: "Disables the dismiss action during pending work." },
] as const;

export const primaryActionProps = [
  { name: "variant", type: '"primary" | "destructive"', defaultValue: '"primary"', description: "Sets normal or destructive emphasis." },
  { name: "loading", type: "boolean", defaultValue: "false", description: "Shows progress and disables activation." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables activation." },
  { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"sm"', description: "Sets action height." },
  { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"', description: "Sets native button behavior." },
] as const;

export const parts = [
  { name: "Root", element: "renderless", description: "Reuses Dialog state, focus, modality, and dismissal behavior." },
  { name: "Alert", element: "renderless", description: "Uses the alertdialog role and protected outside dismissal." },
  { name: "Trigger", element: "button", description: "Opens the layout." },
  { name: "Content", element: "div", description: "Owns the constrained surface and responsive placement." },
  { name: "Header", element: "header", description: "Keeps title and description visible above the scroll region." },
  { name: "Title / Description", element: "h2 / p", description: "Provide the accessible name and supporting description." },
  { name: "Body", element: "div", description: "Contains the only scrolling content region." },
  { name: "Actions", element: "footer", description: "Provides a fixed dismiss action and primary slot." },
  { name: "Actions.Primary", element: "button", description: "Renders a loading-aware primary or destructive Button." },
  { name: "Close", element: "button", description: "Closes from a custom control or wraps the primary action after success." },
] as const;

export const exportsList = [
  { name: "DialogLayout", description: "Compound component with all layout parts." },
  { name: "DialogLayoutRoot / DialogLayoutContent / DialogLayoutBody …", description: "Named component exports." },
  { name: "DialogLayoutContentProps / DialogLayoutActionsProps", description: "Public layout contracts." },
  { name: "DIALOG_LAYOUT_VERTICAL_ALIGNS", description: "Readonly supported desktop placements." },
] as const;
