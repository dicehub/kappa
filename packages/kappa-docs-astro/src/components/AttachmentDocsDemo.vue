<script setup lang="ts">
import { defineComponent, h, ref, useAttrs } from "vue";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentRoot,
  AttachmentTitle,
} from "@dicehub/kappa/components/attachment";

type DemoVariant =
  | "preview"
  | "usage"
  | "composition"
  | "media"
  | "states"
  | "sizes"
  | "orientation"
  | "group"
  | "trigger"
  | "rtl";

withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });

const makeIcon = (paths: string[]) =>
  defineComponent({
    inheritAttrs: false,
    setup() {
      const attrs = useAttrs();
      return () =>
        h(
          "svg",
          { ...attrs, "aria-hidden": "true", fill: "none", viewBox: "0 0 16 16" },
          paths.map((d) => h("path", { d })),
        );
    },
  });

const FileIcon = makeIcon([
  "M4 1.75h5L12.5 5v9.25H4V1.75Z",
  "M9 1.75V5h3.5",
  "M6 8h4.5M6 10.5h3.5",
]);
const RemoveIcon = makeIcon(["m4 4 8 8", "m12 4-8 8"]);
const RetryIcon = makeIcon(["M12.5 6A5 5 0 1 0 13 9", "M12.5 2.75V6H9.25"]);

const contourPreview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%230c2134'/%3E%3Cpath d='M-10 132C28 82 56 151 93 98s57-31 77-61' fill='none' stroke='%2367d0cf' stroke-width='34' opacity='.86'/%3E%3Cpath d='M-8 35c43 43 72-2 111 29s50 7 67-2' fill='none' stroke='%23e7a94a' stroke-width='25' opacity='.9'/%3E%3Cpath d='M-5 85c34-30 73 13 104-19s54-24 68-21' fill='none' stroke='%23edf4f7' stroke-width='4' opacity='.68'/%3E%3C/svg%3E";

const imageFiles = [
  { title: "pressure.png", description: "PNG · 1.8 MB", filter: "none", transform: "none" },
  { title: "velocity.png", description: "PNG · 2.1 MB", filter: "hue-rotate(75deg)", transform: "scale(1.15) rotate(8deg)" },
  { title: "vorticity.png", description: "PNG · 940 KB", filter: "hue-rotate(185deg)", transform: "scale(1.2) rotate(-10deg)" },
];

const groupFiles = [
  { title: "rotor-surface.stl", description: "STL · 18.2 MB", image: false },
  { title: "pressure-field.vtk", description: "VTK · 42.7 MB", image: true },
  { title: "solver-log.txt", description: "Text · 184 KB", image: false },
  { title: "residuals.csv", description: "CSV · 96 KB", image: false },
];

const interactionMessage = ref("");
</script>

<template>
  <div class="attachment-demo" :data-attachment-demo="variant">
    <div v-if="variant === 'preview'" class="attachment-demo__hero">
      <Attachment.Group role="group" aria-label="Contour image attachments">
        <Attachment.Root
          v-for="file in imageFiles"
          :key="file.title"
          state="done"
          orientation="vertical"
        >
          <Attachment.Media variant="image">
            <img
              :src="contourPreview"
              :alt="`${file.title} contour preview`"
              :style="{ filter: file.filter, transform: file.transform }"
            />
          </Attachment.Media>
          <Attachment.Content>
            <Attachment.Title>{{ file.title }}</Attachment.Title>
            <Attachment.Description>{{ file.description }}</Attachment.Description>
          </Attachment.Content>
        </Attachment.Root>
      </Attachment.Group>

      <Attachment.Root class="attachment-demo__row" state="uploading">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>volume-mesh.msh</Attachment.Title>
          <Attachment.Description>Uploading · 64%</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>

      <Attachment.Root class="attachment-demo__row" state="done">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>solver-log.txt</Attachment.Title>
          <Attachment.Description>Text · 184 KB</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
          <Attachment.Action aria-label="Remove solver-log.txt"><RemoveIcon /></Attachment.Action>
        </Attachment.Actions>
      </Attachment.Root>
    </div>

    <Attachment.Root v-else-if="variant === 'usage'" state="done">
      <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
      <Attachment.Content>
        <Attachment.Title>rotor-case.cas</Attachment.Title>
        <Attachment.Description>Fluent case · 24.6 MB</Attachment.Description>
      </Attachment.Content>
      <Attachment.Actions>
        <Attachment.Action aria-label="Remove rotor-case.cas"><RemoveIcon /></Attachment.Action>
      </Attachment.Actions>
    </Attachment.Root>

    <AttachmentRoot v-else-if="variant === 'composition'" state="done">
      <AttachmentMedia variant="icon"><FileIcon /></AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>forces.csv</AttachmentTitle>
        <AttachmentDescription>CSV · 86 KB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove forces.csv"><RemoveIcon /></AttachmentAction>
      </AttachmentActions>
    </AttachmentRoot>

    <Attachment.Group
      v-else-if="variant === 'media'"
      class="attachment-demo__image-group"
      role="group"
      aria-label="Contour image attachments"
    >
      <Attachment.Root
        v-for="file in imageFiles"
        :key="file.title"
        state="done"
        orientation="vertical"
      >
        <Attachment.Media variant="image">
          <img
            :src="contourPreview"
            :alt="`${file.title} contour preview`"
            :style="{ filter: file.filter, transform: file.transform }"
          />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>{{ file.title }}</Attachment.Title>
          <Attachment.Description>{{ file.description }}</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>
    </Attachment.Group>

    <div v-else-if="variant === 'states'" class="attachment-demo__stack">
      <Attachment.Root state="idle">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>geometry.step</Attachment.Title>
          <Attachment.Description>Ready to upload</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>
      <Attachment.Root state="uploading">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>volume-mesh.msh</Attachment.Title>
          <Attachment.Description>Uploading · 64%</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>
      <Attachment.Root state="processing">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>run-042.foam</Attachment.Title>
          <Attachment.Description>Indexing result fields</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>
      <Attachment.Root state="error">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>boundary-map.json</Attachment.Title>
          <Attachment.Description id="attachment-error-text">Upload failed. Check the file and try again.</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
          <Attachment.Action aria-label="Retry boundary-map.json"><RetryIcon /></Attachment.Action>
        </Attachment.Actions>
      </Attachment.Root>
      <Attachment.Root state="done">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>solver-log.txt</Attachment.Title>
          <Attachment.Description>Text · 184 KB</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>
    </div>

    <div v-else-if="variant === 'sizes'" class="attachment-demo__stack">
      <Attachment.Root v-for="size in ['default', 'sm', 'xs'] as const" :key="size" :size="size" state="done">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>{{ size }} · residuals.csv</Attachment.Title>
          <Attachment.Description>CSV · 96 KB</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
          <Attachment.Action :aria-label="`Remove ${size} residuals.csv`"><RemoveIcon /></Attachment.Action>
        </Attachment.Actions>
      </Attachment.Root>
    </div>

    <div v-else-if="variant === 'orientation'" class="attachment-demo__orientations">
      <Attachment.Root state="done" orientation="horizontal">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>horizontal.foam</Attachment.Title>
          <Attachment.Description>OpenFOAM case</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>
      <Attachment.Root class="attachment-demo__vertical-card" state="done" orientation="vertical">
        <Attachment.Media variant="image">
          <img :src="contourPreview" alt="Velocity contour preview" />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>velocity.png</Attachment.Title>
          <Attachment.Description>PNG · 2.1 MB</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>
    </div>

    <Attachment.Group
      v-else-if="variant === 'group'"
      class="attachment-demo__group"
      role="group"
      aria-label="Simulation attachments"
      tabindex="0"
    >
      <Attachment.Root
        v-for="file in groupFiles"
        :key="file.title"
        class="attachment-demo__group-row"
        state="done"
      >
        <Attachment.Media :variant="file.image ? 'image' : 'icon'">
          <img v-if="file.image" :src="contourPreview" alt="Pressure field preview" />
          <FileIcon v-else />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>{{ file.title }}</Attachment.Title>
          <Attachment.Description>{{ file.description }}</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>
    </Attachment.Group>

    <div v-else-if="variant === 'trigger'" class="attachment-demo__stack">
      <Attachment.Root state="done">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>rotor-case.cas</Attachment.Title>
          <Attachment.Description>Fluent case · 24.6 MB</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
          <Attachment.Action
            aria-label="Remove rotor-case.cas"
            @click="interactionMessage = 'Removed rotor-case.cas'"
          >
            <RemoveIcon />
          </Attachment.Action>
        </Attachment.Actions>
        <Attachment.Trigger
          as="button"
          aria-label="Open rotor-case.cas"
          @click="interactionMessage = 'Opened rotor-case.cas'"
        />
      </Attachment.Root>

      <Attachment.Root state="done">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title id="attachment-anchor-target">solver-log.txt</Attachment.Title>
          <Attachment.Description>Text · 184 KB</Attachment.Description>
        </Attachment.Content>
        <Attachment.Trigger
          as="a"
          href="#attachment-anchor-target"
          aria-label="View solver-log.txt"
        />
      </Attachment.Root>
    </div>

    <div v-else dir="rtl" class="attachment-demo__rtl">
      <Attachment.Root state="done">
        <Attachment.Media variant="icon"><FileIcon /></Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>نتائج-الضغط.csv</Attachment.Title>
          <Attachment.Description>CSV · ١٢٨ كيلوبايت</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
          <Attachment.Action aria-label="إزالة نتائج الضغط"><RemoveIcon /></Attachment.Action>
        </Attachment.Actions>
      </Attachment.Root>
    </div>

    <p
      v-if="interactionMessage"
      id="attachment-trigger-result"
      class="attachment-demo__result"
      role="status"
    >
      {{ interactionMessage }}
    </p>
  </div>
</template>

<style scoped>
.attachment-demo {
  display: grid;
  width: min(100%, 24rem);
  min-width: 0;
  min-height: 8rem;
  align-content: center;
  gap: 0.75rem;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.attachment-demo__hero {
  display: grid;
  width: min(100%, 24rem);
  justify-self: center;
  gap: 0.75rem;
}

.attachment-demo__row,
.attachment-demo__stack > .kappa-attachment,
.attachment-demo__rtl > .kappa-attachment {
  width: 100%;
}

.attachment-demo__stack,
.attachment-demo__rtl {
  display: grid;
  min-width: 0;
  gap: 0.6rem;
}

.attachment-demo__orientations {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 0.75rem;
}

.attachment-demo__vertical-card {
  width: 7.5rem;
}

.attachment-demo__group {
  width: 100%;
  max-width: 24rem;
}

.attachment-demo__image-group {
  width: min(100%, 24rem);
  justify-self: center;
}

.attachment-demo__group-row {
  width: 16rem;
}

.attachment-demo__result {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.75rem;
  text-align: end;
}

.attachment-demo :deep(svg) {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

@media (max-width: 520px) {
  .attachment-demo__orientations {
    grid-template-columns: minmax(0, 1fr);
  }

  .attachment-demo__vertical-card {
    width: min(100%, 10rem);
  }
}
</style>
