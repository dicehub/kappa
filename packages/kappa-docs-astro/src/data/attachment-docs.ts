export const barrelCode = `import {
  Attachment,
  AttachmentRoot,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
  AttachmentGroup,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Attachment,
  AttachmentRoot,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
  AttachmentGroup,
} from "@dicehub/kappa/components/attachment";`;

export const previewCode = `<script setup>
import { Attachment } from "@dicehub/kappa/components/attachment";

const images = ["pressure.png", "velocity.png", "vorticity.png"];
</script>

<template>
  <div class="attachments">
    <Attachment.Group class="attachment-images" role="group" aria-label="Contour image attachments">
      <Attachment.Root
        v-for="image in images"
        :key="image"
        state="done"
        orientation="vertical"
      >
        <Attachment.Media variant="image">
          <img :src="\`/\${image}\`" :alt="\`\${image} contour preview\`" />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>{{ image }}</Attachment.Title>
          <Attachment.Description>PNG · 1.8 MB</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>
    </Attachment.Group>

    <Attachment.Root class="attachment-row" state="uploading">
      <Attachment.Media variant="icon" aria-hidden="true">FILE</Attachment.Media>
      <Attachment.Content>
        <Attachment.Title>volume-mesh.msh</Attachment.Title>
        <Attachment.Description>Uploading · 64%</Attachment.Description>
      </Attachment.Content>
    </Attachment.Root>

    <Attachment.Root class="attachment-row" state="done">
      <Attachment.Media variant="icon" aria-hidden="true">FILE</Attachment.Media>
      <Attachment.Content>
        <Attachment.Title>solver-log.txt</Attachment.Title>
        <Attachment.Description>Text · 184 KB</Attachment.Description>
      </Attachment.Content>
    </Attachment.Root>
  </div>
</template>

<style scoped>
.attachments {
  display: grid;
  inline-size: min(100%, 24rem);
  gap: 0.75rem;
}

.attachment-images,
.attachment-row {
  inline-size: 100%;
}
</style>`;

export const usageCode = `<script setup>
import { Attachment } from "@dicehub/kappa/components/attachment";
</script>

<template>
  <Attachment.Root state="done">
    <Attachment.Media variant="icon">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 2h5l3 3v9H4V2Zm5 0v3h3" />
      </svg>
    </Attachment.Media>
    <Attachment.Content>
      <Attachment.Title>rotor-case.cas</Attachment.Title>
      <Attachment.Description>Fluent case · 24.6 MB</Attachment.Description>
    </Attachment.Content>
    <Attachment.Actions>
      <Attachment.Action aria-label="Remove rotor-case.cas">
        <span aria-hidden="true">×</span>
      </Attachment.Action>
    </Attachment.Actions>
  </Attachment.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  AttachmentRoot,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "@dicehub/kappa/components/attachment";
</script>

<template>
  <AttachmentRoot state="done">
    <AttachmentMedia variant="icon" aria-hidden="true">CSV</AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>forces.csv</AttachmentTitle>
      <AttachmentDescription>CSV · 86 KB</AttachmentDescription>
    </AttachmentContent>
    <AttachmentActions>
      <AttachmentAction aria-label="Remove forces.csv">×</AttachmentAction>
    </AttachmentActions>
  </AttachmentRoot>
</template>`;

export const mediaCode = `<script setup>
import { Attachment } from "@dicehub/kappa/components/attachment";

const images = ["pressure.png", "velocity.png", "vorticity.png"];
</script>

<template>
  <Attachment.Group class="attachment-images" role="group" aria-label="Contour image attachments">
    <Attachment.Root
      v-for="image in images"
      :key="image"
      state="done"
      orientation="vertical"
    >
      <Attachment.Media variant="image">
        <img :src="\`/\${image}\`" :alt="\`\${image} contour preview\`" />
      </Attachment.Media>
      <Attachment.Content>
        <Attachment.Title>{{ image }}</Attachment.Title>
        <Attachment.Description>PNG · 1.8 MB</Attachment.Description>
      </Attachment.Content>
    </Attachment.Root>
  </Attachment.Group>
</template>

<style scoped>
.attachment-images {
  inline-size: min(100%, 24rem);
}
</style>`;

export const statesCode = `<script setup>
import { Attachment } from "@dicehub/kappa/components/attachment";

const files = [
  { state: "idle", name: "geometry.step", detail: "Ready to upload" },
  { state: "uploading", name: "volume-mesh.msh", detail: "Uploading · 64%" },
  { state: "processing", name: "run-042.foam", detail: "Indexing result fields" },
  { state: "error", name: "boundary-map.json", detail: "Upload failed. Try again." },
  { state: "done", name: "solver-log.txt", detail: "Text · 184 KB" },
];
</script>

<template>
  <Attachment.Root class="attachment-row" v-for="file in files" :key="file.name" :state="file.state">
    <Attachment.Media variant="icon" aria-hidden="true">FILE</Attachment.Media>
    <Attachment.Content>
      <Attachment.Title>{{ file.name }}</Attachment.Title>
      <Attachment.Description>{{ file.detail }}</Attachment.Description>
    </Attachment.Content>
  </Attachment.Root>
</template>

<style scoped>
.attachment-row {
  inline-size: min(100%, 24rem);
}
</style>`;

export const sizesCode = `<script setup>
import { Attachment } from "@dicehub/kappa/components/attachment";
</script>

<template>
  <Attachment.Root class="attachment-row" v-for="size in ['default', 'sm', 'xs']" :key="size" :size="size" state="done">
    <Attachment.Media variant="icon" aria-hidden="true">CSV</Attachment.Media>
    <Attachment.Content>
      <Attachment.Title>{{ size }} · residuals.csv</Attachment.Title>
      <Attachment.Description>CSV · 96 KB</Attachment.Description>
    </Attachment.Content>
  </Attachment.Root>
</template>

<style scoped>
.attachment-row {
  inline-size: min(100%, 24rem);
}
</style>`;

export const orientationCode = `<script setup>
import { Attachment } from "@dicehub/kappa/components/attachment";
</script>

<template>
  <Attachment.Root state="done" orientation="horizontal">
    <Attachment.Media variant="icon" aria-hidden="true">CASE</Attachment.Media>
    <Attachment.Content>
      <Attachment.Title>horizontal.foam</Attachment.Title>
      <Attachment.Description>OpenFOAM case</Attachment.Description>
    </Attachment.Content>
  </Attachment.Root>

  <Attachment.Root class="attachment-tile" state="done" orientation="vertical">
    <Attachment.Media variant="image">
      <img src="/velocity-contour.png" alt="Velocity contour preview" />
    </Attachment.Media>
    <Attachment.Content>
      <Attachment.Title>velocity.png</Attachment.Title>
      <Attachment.Description>PNG · 2.1 MB</Attachment.Description>
    </Attachment.Content>
  </Attachment.Root>
</template>

<style scoped>
.attachment-tile {
  inline-size: 7.5rem;
}
</style>`;

export const groupCode = `<script setup>
import { Attachment } from "@dicehub/kappa/components/attachment";

const files = ["rotor-surface.stl", "pressure-field.vtk", "solver-log.txt", "residuals.csv"];
</script>

<template>
  <Attachment.Group role="group" aria-label="Simulation attachments" tabindex="0">
    <Attachment.Root class="attachment-row" v-for="file in files" :key="file" state="done">
      <Attachment.Media variant="icon" aria-hidden="true">FILE</Attachment.Media>
      <Attachment.Content>
        <Attachment.Title>{{ file }}</Attachment.Title>
        <Attachment.Description>Simulation file</Attachment.Description>
      </Attachment.Content>
    </Attachment.Root>
  </Attachment.Group>
</template>

<style scoped>
.attachment-row {
  inline-size: 16rem;
}
</style>`;

export const triggerCode = `<script setup>
import { Attachment } from "@dicehub/kappa/components/attachment";

function removeFile() {
  // Remove only this attachment.
}
</script>

<template>
  <Attachment.Root state="done">
    <Attachment.Media variant="icon" aria-hidden="true">CASE</Attachment.Media>
    <Attachment.Content>
      <Attachment.Title>rotor-case.cas</Attachment.Title>
      <Attachment.Description>Fluent case · 24.6 MB</Attachment.Description>
    </Attachment.Content>
    <Attachment.Actions>
      <Attachment.Action aria-label="Remove rotor-case.cas" @click="removeFile">×</Attachment.Action>
    </Attachment.Actions>
    <Attachment.Trigger
      as="a"
      href="/cases/rotor-case"
      aria-label="Open rotor-case.cas"
    />
  </Attachment.Root>
</template>`;

export const rtlCode = `<script setup>
import { Attachment } from "@dicehub/kappa/components/attachment";
</script>

<template>
  <div dir="rtl">
    <Attachment.Root state="done">
      <Attachment.Media variant="icon" aria-hidden="true">CSV</Attachment.Media>
      <Attachment.Content>
        <Attachment.Title>نتائج-الضغط.csv</Attachment.Title>
        <Attachment.Description>CSV · ١٢٨ كيلوبايت</Attachment.Description>
      </Attachment.Content>
      <Attachment.Actions>
        <Attachment.Action aria-label="إزالة نتائج الضغط">×</Attachment.Action>
      </Attachment.Actions>
    </Attachment.Root>
  </div>
</template>`;

export const rootProps = [
  { name: "state", type: '"idle" | "uploading" | "processing" | "error" | "done"', defaultValue: '"done"', description: "Reflects the consumer-managed file lifecycle in styling and data-state." },
  { name: "size", type: '"default" | "sm" | "xs"', defaultValue: '"default"', description: "Sets the attachment density and composed action size." },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Arranges media, content, and actions along the selected axis." },
] as const;

export const mediaProps = [
  { name: "variant", type: '"icon" | "image"', defaultValue: '"icon"', description: "Selects icon framing or edge-to-edge image treatment." },
] as const;

export const actionProps = [
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables the native icon-only action button." },
  { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"', description: "Sets the native button type." },
] as const;

export const triggerProps = [
  { name: "as", type: '"button" | "a"', defaultValue: '"button"', description: "Renders the full-card trigger as a native button or anchor." },
  { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"', description: "Sets the native button type; omitted when the trigger renders as an anchor." },
] as const;

export const parts = [
  { name: "Attachment.Content", element: "div", description: "Flexible wrapper for the title and supporting metadata." },
  { name: "Attachment.Title", element: "span", description: "Single-line file name or primary label." },
  { name: "Attachment.Description", element: "span", description: "Supporting metadata, progress, or error text." },
  { name: "Attachment.Actions", element: "div", description: "Stacking boundary that keeps controls above a full-card trigger." },
  { name: "Attachment.Action", element: "button", description: "Native button with type=button by default." },
  { name: "Attachment.Group", element: "div", description: "Horizontally scrollable, snap-aligned collection." },
] as const;

export const exportsList = [
  { name: "Attachment", description: "Compound API exposing Root, Media, Content, Title, Description, Actions, Action, Trigger, and Group." },
  { name: "AttachmentRoot", description: "Unaugmented attachment root." },
  { name: "AttachmentMedia", description: "Icon or image media frame." },
  { name: "AttachmentContent", description: "File-information wrapper." },
  { name: "AttachmentTitle", description: "Primary file label." },
  { name: "AttachmentDescription", description: "Metadata, progress, or error copy." },
  { name: "AttachmentActions", description: "Container for independent attachment actions." },
  { name: "AttachmentAction", description: "Native button action." },
  { name: "AttachmentTrigger", description: "Full-card button or anchor trigger." },
  { name: "AttachmentGroup", description: "Scrollable attachment collection." },
  { name: "ATTACHMENT_STATES", description: "Readonly list of supported lifecycle states." },
  { name: "ATTACHMENT_SIZES", description: "Readonly list of supported densities." },
  { name: "ATTACHMENT_ORIENTATIONS", description: "Readonly list of supported orientations." },
  { name: "ATTACHMENT_MEDIA_VARIANTS", description: "Readonly list of media treatments." },
  { name: "ATTACHMENT_BUTTON_TYPES", description: "Readonly list of native button types." },
  { name: "ATTACHMENT_TRIGGER_ELEMENTS", description: "Readonly list of supported trigger elements." },
  { name: "ATTACHMENT_DEFAULT_STATE", description: "Default lifecycle state: done." },
  { name: "ATTACHMENT_DEFAULT_SIZE", description: "Default density: default." },
  { name: "ATTACHMENT_DEFAULT_ORIENTATION", description: "Default orientation: horizontal." },
  { name: "ATTACHMENT_MEDIA_DEFAULT_VARIANT", description: "Default media treatment: icon." },
  { name: "ATTACHMENT_ACTION_DEFAULT_TYPE", description: "Default native action type: button." },
  { name: "ATTACHMENT_TRIGGER_DEFAULT_ELEMENT", description: "Default trigger element: button." },
  { name: "ATTACHMENT_TRIGGER_DEFAULT_TYPE", description: "Default native trigger type: button." },
  { name: "isAttachmentState", description: "Runtime state type guard." },
  { name: "isAttachmentSize", description: "Runtime size type guard." },
  { name: "isAttachmentOrientation", description: "Runtime orientation type guard." },
  { name: "isAttachmentMediaVariant", description: "Runtime media-variant type guard." },
  { name: "isAttachmentButtonType", description: "Runtime native-button-type guard." },
  { name: "isAttachmentTriggerElement", description: "Runtime trigger-element guard." },
  { name: "resolveAttachmentState", description: "Resolves unknown input to a supported state." },
  { name: "resolveAttachmentSize", description: "Resolves unknown input to a supported size." },
  { name: "resolveAttachmentOrientation", description: "Resolves unknown input to a supported orientation." },
  { name: "resolveAttachmentMediaVariant", description: "Resolves unknown input to a supported media variant." },
  { name: "resolveAttachmentButtonType", description: "Resolves unknown input to a native button type." },
  { name: "resolveAttachmentTriggerElement", description: "Resolves unknown input to a trigger element." },
  { name: "AttachmentProps", description: "Alias of the public root props." },
  { name: "AttachmentRootProps", description: "Public root props." },
  { name: "AttachmentMediaProps", description: "Public media props." },
  { name: "AttachmentActionProps", description: "Public action props." },
  { name: "AttachmentTriggerProps", description: "Public trigger props." },
  { name: "AttachmentSlots", description: "Alias of the public root slot contract." },
  { name: "AttachmentRootSlots", description: "Root default-slot contract." },
  { name: "AttachmentMediaSlots", description: "Media default-slot contract." },
  { name: "AttachmentContentSlots", description: "Content default-slot contract." },
  { name: "AttachmentTitleSlots", description: "Title default-slot contract." },
  { name: "AttachmentDescriptionSlots", description: "Description default-slot contract." },
  { name: "AttachmentActionsSlots", description: "Actions default-slot contract." },
  { name: "AttachmentActionSlots", description: "Action default-slot contract." },
  { name: "AttachmentTriggerSlots", description: "Trigger default-slot contract." },
  { name: "AttachmentGroupSlots", description: "Group default-slot contract." },
  { name: "AttachmentState", description: "Supported lifecycle-state union." },
  { name: "AttachmentSize", description: "Supported density union." },
  { name: "AttachmentOrientation", description: "Supported orientation union." },
  { name: "AttachmentMediaVariant", description: "Supported media-variant union." },
  { name: "AttachmentButtonType", description: "Supported native-button-type union." },
  { name: "AttachmentTriggerElement", description: "Supported trigger-element union." },
] as const;
