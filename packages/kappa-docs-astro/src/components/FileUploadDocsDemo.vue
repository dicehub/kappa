<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Dialog } from "@dicehub/kappa/components/dialog";
import {
  FileUpload,
  type FileUploadFileRejectDetails,
} from "@dicehub/kappa/components/file-upload";
import FileUploadFileList from "./FileUploadFileList.vue";

type DemoVariant = "preview" | "usage" | "modal" | "validation" | "states";
type UploadState = "ready" | "uploading" | "done";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const previewFiles = ref<File[]>([]);
const modalFiles = ref<File[]>([]);
const modalOpen = ref(false);
const uploadState = ref<UploadState>("ready");
const uploadProgress = ref<Record<string, number>>({});
const validationMessage = ref("STL or STEP files, up to 2 MB each. Maximum two files.");
let uploadTimer: ReturnType<typeof setInterval> | undefined;

const fileKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;
const isUploading = computed(() => uploadState.value === "uploading");
const uploadButtonLabel = computed(() => {
  if (uploadState.value === "done") return "Done";
  const count = modalFiles.value.length;
  return count === 1 ? "Upload file" : `Upload ${count} files`;
});

const makeFile = (name: string, size: number, type: string) =>
  new File([new Uint8Array(size)], name, { type, lastModified: 1_788_777_600_000 });

onMounted(() => {
  previewFiles.value = [
    makeFile("rotor-surface.stl", 486_400, "model/stl"),
    makeFile("run-settings.json", 18_420, "application/json"),
  ];
});

const stopUpload = () => {
  if (uploadTimer !== undefined) clearInterval(uploadTimer);
  uploadTimer = undefined;
};

const startUpload = () => {
  if (uploadState.value === "done") {
    modalOpen.value = false;
    return;
  }
  if (!modalFiles.value.length || isUploading.value) return;

  uploadState.value = "uploading";
  uploadProgress.value = Object.fromEntries(
    modalFiles.value.map((file) => [fileKey(file), 4]),
  );
  stopUpload();
  uploadTimer = setInterval(() => {
    const next = Object.fromEntries(
      modalFiles.value.map((file, index) => {
        const key = fileKey(file);
        return [key, Math.min(100, (uploadProgress.value[key] ?? 0) + 9 + index * 2)];
      }),
    );
    uploadProgress.value = next;
    if (Object.values(next).every((value) => value === 100)) {
      stopUpload();
      uploadState.value = "done";
    }
  }, 140);
};

const resetModal = () => {
  stopUpload();
  modalFiles.value = [];
  uploadProgress.value = {};
  uploadState.value = "ready";
};

const onModalFilesChange = (files: File[]) => {
  modalFiles.value = files;
  if (!isUploading.value) {
    uploadProgress.value = {};
    uploadState.value = "ready";
  }
};

const onFileReject = (details: FileUploadFileRejectDetails) => {
  const count = details.files.length;
  validationMessage.value = `${count} ${count === 1 ? "file was" : "files were"} rejected. Check the type, size, and file limit.`;
};

watch(modalOpen, (open) => {
  if (!open) resetModal();
});
onBeforeUnmount(stopUpload);
</script>

<template>
  <div class="file-upload-demo" :data-file-upload-demo="props.variant">
    <FileUpload.Root
      v-if="props.variant === 'preview'"
      v-model:accepted-files="previewFiles"
      :max-files="4"
      name="project-files"
    >
      <FileUpload.Label>Project files</FileUpload.Label>
      <FileUpload.Dropzone disable-click>
        <span class="file-upload-demo__mark" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none"><path d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M3 13.5v2A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5v-2" /></svg>
        </span>
        <span class="file-upload-demo__copy">
          <strong>Drop project files here</strong>
          <span>Mesh, configuration, or result files · up to 250 MB</span>
        </span>
        <FileUpload.Trigger>Choose files</FileUpload.Trigger>
      </FileUpload.Dropzone>
      <FileUpload.Context v-slot="{ acceptedFiles }">
        <FileUploadFileList :files="acceptedFiles" />
        <FileUpload.ClearTrigger v-if="acceptedFiles.length > 1" />
      </FileUpload.Context>
      <FileUpload.HiddenInput />
    </FileUpload.Root>

    <FileUpload.Root v-else-if="props.variant === 'usage'" :max-files="3" name="geometry">
      <FileUpload.Label>Geometry files</FileUpload.Label>
      <FileUpload.Dropzone disable-click>
        <span class="file-upload-demo__copy">
          <strong>Drag files here</strong>
          <span>or select them from your device</span>
        </span>
        <FileUpload.Trigger>Browse files</FileUpload.Trigger>
      </FileUpload.Dropzone>
      <FileUpload.Context v-slot="{ acceptedFiles }">
        <FileUploadFileList :files="acceptedFiles" />
      </FileUpload.Context>
      <FileUpload.HiddenInput />
    </FileUpload.Root>

    <Dialog.Root
      v-else-if="props.variant === 'modal'"
      v-model:open="modalOpen"
      :close-on-escape="!isUploading"
      :disable-pointer-dismissal="isUploading"
    >
      <Dialog.Trigger as-child><Button variant="primary">Upload files</Button></Dialog.Trigger>
      <Dialog.Content
        class="file-upload-demo__dialog"
        :show-close-button="!isUploading"
        size="lg"
      >
        <Dialog.Header>
          <Dialog.Title>Upload project files</Dialog.Title>
          <Dialog.Description>
            Add geometry, configuration, or result files. Files are checked before transfer starts.
          </Dialog.Description>
        </Dialog.Header>
        <FileUpload.Root
          :accepted-files="modalFiles"
          :disabled="isUploading"
          :max-file-size="250 * 1024 * 1024"
          :max-files="5"
          name="upload-files"
          @update:accepted-files="onModalFilesChange"
        >
          <FileUpload.Dropzone disable-click>
            <span class="file-upload-demo__mark" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none"><path d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M3 13.5v2A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5v-2" /></svg>
            </span>
            <span class="file-upload-demo__copy">
              <strong>Drop files anywhere in this area</strong>
              <span>Maximum five files and 250 MB per file</span>
            </span>
            <FileUpload.Trigger>{{ modalFiles.length ? "Add more" : "Choose files" }}</FileUpload.Trigger>
          </FileUpload.Dropzone>
          <FileUploadFileList
            :busy="isUploading"
            :files="modalFiles"
            :progress="uploadProgress"
          />
          <FileUpload.HiddenInput />
        </FileUpload.Root>
        <output class="file-upload-demo__status" aria-live="polite">
          {{ uploadState === "done" ? "Upload complete. All files are ready." : "Uploads start only after confirmation." }}
        </output>
        <Dialog.Footer>
          <Dialog.Close as-child>
            <Button :disabled="isUploading" variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Button
            :disabled="!modalFiles.length"
            :loading="isUploading"
            variant="primary"
            @click="startUpload"
          >
            {{ uploadButtonLabel }}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>

    <FileUpload.Root
      v-else-if="props.variant === 'validation'"
      accept=".stl,.step"
      :max-file-size="2 * 1024 * 1024"
      :max-files="2"
      @file-reject="onFileReject"
    >
      <FileUpload.Label>Surface geometry</FileUpload.Label>
      <FileUpload.Dropzone disable-click>
        <span class="file-upload-demo__copy"><strong>Drop STL or STEP files</strong><span>Two files maximum</span></span>
        <FileUpload.Trigger>Select geometry</FileUpload.Trigger>
      </FileUpload.Dropzone>
      <FileUpload.Context v-slot="{ acceptedFiles, rejectedFiles }">
        <FileUploadFileList :files="acceptedFiles" />
        <FileUpload.ItemGroup type="rejected">
          <FileUpload.Item v-for="entry in rejectedFiles" :key="fileKey(entry.file)" :file="entry.file">
            <FileUpload.ItemPreview />
            <FileUpload.ItemName />
            <FileUpload.ItemSizeText>Rejected</FileUpload.ItemSizeText>
            <FileUpload.ItemDeleteTrigger :aria-label="`Remove ${entry.file.name}`" />
          </FileUpload.Item>
        </FileUpload.ItemGroup>
      </FileUpload.Context>
      <p class="file-upload-demo__hint" aria-live="polite">{{ validationMessage }}</p>
      <FileUpload.HiddenInput />
    </FileUpload.Root>

    <div v-else class="file-upload-demo__states">
      <FileUpload.Root disabled>
        <FileUpload.Label>Disabled upload</FileUpload.Label>
        <FileUpload.Dropzone><span>Upload unavailable</span></FileUpload.Dropzone>
        <FileUpload.HiddenInput />
      </FileUpload.Root>
      <FileUpload.Root invalid>
        <FileUpload.Label>Invalid upload</FileUpload.Label>
        <FileUpload.Dropzone><span>Select a supported project file</span></FileUpload.Dropzone>
        <FileUpload.HiddenInput />
      </FileUpload.Root>
    </div>
  </div>
</template>

<style scoped>
.file-upload-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.file-upload-demo > :deep(.kappa-file-upload),
.file-upload-demo__states {
  inline-size: min(100%, 34rem);
}

.file-upload-demo__mark {
  display: grid;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  place-items: center;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.625rem;
  background: var(--kappa-control, #ffffff);
  color: var(--kappa-accent, #4356e8);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--kappa-default, #17191f) 7%, transparent);
}

.file-upload-demo__mark svg {
  inline-size: 1.125rem;
  block-size: 1.125rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.file-upload-demo__copy {
  display: grid;
  gap: 0.1875rem;
  justify-items: center;
}

.file-upload-demo__copy strong {
  color: var(--kappa-default, #17191f);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.125rem;
}

.file-upload-demo__copy span,
.file-upload-demo__hint,
.file-upload-demo__status {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1rem;
}

.file-upload-demo__hint,
.file-upload-demo__status {
  margin: 0;
}

.file-upload-demo__dialog {
  max-block-size: min(42rem, calc(100dvb - 2rem));
}

.file-upload-demo__dialog :deep(.kappa-file-upload__dropzone) {
  min-block-size: 10rem;
}

.file-upload-demo__dialog :deep(.kappa-file-upload__item-group) {
  max-block-size: 13.5rem;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.file-upload-demo__states {
  display: grid;
  gap: 1rem;
}

.file-upload-demo__states :deep(.kappa-file-upload__dropzone) {
  min-block-size: 6rem;
}
</style>
