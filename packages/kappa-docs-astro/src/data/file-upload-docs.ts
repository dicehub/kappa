export const barrelCode = `import {
  FileUpload,
  type FileUploadProps,
  type FileUploadFileRejectDetails,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  FileUpload,
  type FileUploadProps,
  type FileUploadFileRejectDetails,
} from "@dicehub/kappa/components/file-upload";`;

const fileListCode = `    <FileUpload.Context v-slot="{ acceptedFiles }">
      <FileUpload.ItemGroup>
        <FileUpload.Item v-for="file in acceptedFiles" :key="file.name" :file="file">
          <FileUpload.ItemPreview />
          <FileUpload.ItemName />
          <FileUpload.ItemSizeText />
          <FileUpload.ItemDeleteTrigger :aria-label="\`Remove \${file.name}\`" />
        </FileUpload.Item>
      </FileUpload.ItemGroup>
    </FileUpload.Context>`;

export const previewCode = `<script setup>
import { FileUpload } from "@dicehub/kappa/components/file-upload";
</script>

<template>
  <FileUpload.Root :max-files="4" name="project-files">
    <FileUpload.Label>Project files</FileUpload.Label>
    <FileUpload.Dropzone disable-click>
      <div>
        <strong>Drop project files here</strong>
        <span>Mesh, configuration, or result files · up to 250 MB</span>
      </div>
      <FileUpload.Trigger>Choose files</FileUpload.Trigger>
    </FileUpload.Dropzone>
${fileListCode}
    <FileUpload.HiddenInput />
  </FileUpload.Root>
</template>`;

export const usageCode = `<script setup>
import { FileUpload } from "@dicehub/kappa/components/file-upload";
</script>

<template>
  <FileUpload.Root :max-files="3" name="geometry">
    <FileUpload.Label>Geometry files</FileUpload.Label>
    <FileUpload.Dropzone disable-click>
      <span>Drag files here or select them from your device</span>
      <FileUpload.Trigger>Browse files</FileUpload.Trigger>
    </FileUpload.Dropzone>
${fileListCode}
    <FileUpload.HiddenInput />
  </FileUpload.Root>
</template>`;

export const modalCode = `<script setup lang="ts">
import { ref } from "vue";
import { Button, Dialog, FileUpload, Progress } from "@dicehub/kappa";

const files = ref<File[]>([]);
const uploading = ref(false);
const progress = ref<Record<string, number>>({});

const upload = async () => {
  uploading.value = true;
  // Update progress[file.name] from the application's upload client.
  await Promise.all(files.value.map((file) => uploadFile(file, progress)));
  uploading.value = false;
};
</script>

<template>
  <Dialog.Root :close-on-escape="!uploading" :disable-pointer-dismissal="uploading">
    <Dialog.Trigger as-child><Button>Upload files</Button></Dialog.Trigger>
    <Dialog.Content :show-close-button="!uploading" size="lg">
      <Dialog.Header>
        <Dialog.Title>Upload project files</Dialog.Title>
        <Dialog.Description>Add geometry, configuration, or result files.</Dialog.Description>
      </Dialog.Header>
      <FileUpload.Root v-model:accepted-files="files" :disabled="uploading" :max-files="5">
        <FileUpload.Dropzone disable-click>
          <span>Drop files anywhere in this area</span>
          <FileUpload.Trigger>Choose files</FileUpload.Trigger>
        </FileUpload.Dropzone>
        <FileUpload.Context v-slot="{ acceptedFiles }">
          <FileUpload.ItemGroup>
            <FileUpload.Item v-for="file in acceptedFiles" :key="file.name" :file="file">
              <FileUpload.ItemPreview />
              <FileUpload.ItemName />
              <FileUpload.ItemSizeText />
              <Progress.Root v-if="progress[file.name] != null" :model-value="progress[file.name]">
                <Progress.Track><Progress.Range /></Progress.Track>
              </Progress.Root>
            </FileUpload.Item>
          </FileUpload.ItemGroup>
        </FileUpload.Context>
        <FileUpload.HiddenInput />
      </FileUpload.Root>
      <Dialog.Footer><Button :loading="uploading" @click="upload">Upload</Button></Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</template>`;

export const validationCode = `<FileUpload.Root
  accept=".stl,.step"
  :max-file-size="2 * 1024 * 1024"
  :max-files="2"
  @file-reject="showFileErrors"
>
  <FileUpload.Label>Surface geometry</FileUpload.Label>
  <FileUpload.Dropzone disable-click>
    <span>Drop STL or STEP files</span>
    <FileUpload.Trigger>Select geometry</FileUpload.Trigger>
  </FileUpload.Dropzone>
  <!-- Render acceptedFiles and rejectedFiles from FileUpload.Context. -->
  <FileUpload.HiddenInput />
</FileUpload.Root>`;

export const statesCode = `<FileUpload.Root disabled>
  <FileUpload.Label>Disabled upload</FileUpload.Label>
  <FileUpload.Dropzone>Upload unavailable</FileUpload.Dropzone>
  <FileUpload.HiddenInput />
</FileUpload.Root>

<FileUpload.Root invalid>
  <FileUpload.Label>Invalid upload</FileUpload.Label>
  <FileUpload.Dropzone>Select a supported project file</FileUpload.Dropzone>
  <FileUpload.HiddenInput />
</FileUpload.Root>`;

export const providerCode = `<script setup>
import { FileUpload, useFileUpload } from "@dicehub/kappa/components/file-upload";

const upload = useFileUpload({ maxFiles: 5 });
</script>

<template>
  <FileUpload.RootProvider :value="upload">
    <FileUpload.Dropzone>Drop files here</FileUpload.Dropzone>
    <FileUpload.HiddenInput />
  </FileUpload.RootProvider>
</template>`;

export const rootProps = [
  { name: "acceptedFiles / v-model:acceptedFiles", type: "File[]", defaultValue: "—", description: "Controlled accepted files." },
  { name: "defaultAcceptedFiles", type: "File[]", defaultValue: "[]", description: "Initial files for uncontrolled use." },
  { name: "accept", type: "string | string[] | record", defaultValue: "—", description: "Allowed MIME types or file extensions." },
  { name: "maxFiles", type: "number", defaultValue: "1", description: "Maximum accepted file count." },
  { name: "minFileSize / maxFileSize", type: "number", defaultValue: "0 / Infinity", description: "Accepted byte range for each file." },
  { name: "allowDrop", type: "boolean", defaultValue: "true", description: "Enables drag-and-drop selection." },
  { name: "preventDocumentDrop", type: "boolean", defaultValue: "true", description: "Prevents an outside drop from navigating the document." },
  { name: "directory", type: "boolean", defaultValue: "false", description: "Allows directory selection in supported browsers." },
  { name: "capture", type: '"user" | "environment"', defaultValue: "—", description: "Selects a device camera for media capture." },
  { name: "disabled / readOnly / required / invalid", type: "boolean", defaultValue: "false", description: "Availability, form, and validation states." },
  { name: "name", type: "string", defaultValue: "—", description: "Name for the native hidden file input." },
  { name: "validate", type: "(file, details) => FileError[] | null", defaultValue: "—", description: "Runs custom validation for each file." },
  { name: "transformFiles", type: "(files) => Promise<File[]>", defaultValue: "—", description: "Transforms files before Ark accepts them." },
] as const;

export const parts = [
  { name: "Root", element: "div", description: "Owns file selection, constraints, and accepted or rejected state." },
  { name: "RootProvider", element: "div", description: "Uses an external useFileUpload machine." },
  { name: "Label", element: "label", description: "Names the file input." },
  { name: "Dropzone", element: "div", description: "Accepts pointer clicks and file drops. Use disableClick with a nested Trigger." },
  { name: "Trigger", element: "button", description: "Opens the native file picker." },
  { name: "ItemGroup", element: "ul", description: "Groups accepted or rejected files." },
  { name: "Item", element: "li", description: "Provides one File to its item parts." },
  { name: "ItemPreview / ItemPreviewImage", element: "div / img", description: "Shows generic or image-specific file media." },
  { name: "ItemName / ItemSizeText", element: "div", description: "Shows the file name and localized size." },
  { name: "ItemDeleteTrigger", element: "button", description: "Removes one file. A default close icon is included." },
  { name: "ClearTrigger", element: "button", description: "Removes all accepted files." },
  { name: "HiddenInput", element: "input", description: "Provides native form and file-picker behavior." },
  { name: "Context", element: "slot", description: "Exposes accepted files, rejected files, limits, and machine actions." },
] as const;

export const events = [
  { name: "update:acceptedFiles", payload: "File[]", description: "Emitted when controlled accepted files change." },
  { name: "fileAccept", payload: "{ files: File[] }", description: "Emitted when files pass all constraints." },
  { name: "fileReject", payload: "{ files: FileRejection[] }", description: "Emitted when files fail a constraint or custom validation." },
  { name: "fileChange", payload: "{ acceptedFiles, rejectedFiles }", description: "Emitted after any file selection change." },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"file-upload" / "file-upload-dropzone" / …', description: "Stable Kappa selectors for each named part." },
  { name: "data-dragging", value: '""', description: "Present while files are over the drop zone." },
  { name: "data-invalid / data-disabled / data-readonly", value: '""', description: "Validation and availability state from Ark UI." },
  { name: "data-type", value: '"accepted" | "rejected"', description: "File-list and item category." },
] as const;

export const exportsList = [
  { name: "FileUpload", description: "Compound namespace and root component." },
  { name: "FileUpload.Root / RootProvider", description: "Machine-owned and provider-owned roots." },
  { name: "FileUpload.Label / Dropzone / Trigger / HiddenInput", description: "File-selection parts." },
  { name: "FileUpload.ItemGroup / Item / Item* / ClearTrigger", description: "Accepted and rejected file-list parts." },
  { name: "FileUpload.Context", description: "Scoped access to current machine state and actions." },
  { name: "FileUploadProps / FileUploadEmits", description: "Kappa root props and Vue event contracts." },
  { name: "FileUploadApi / FileUploadContextValue", description: "Provider and context API types." },
  { name: "useFileUpload / useFileUploadContext / fileUploadAnatomy", description: "Ark UI hook and anatomy re-exports." },
] as const;
