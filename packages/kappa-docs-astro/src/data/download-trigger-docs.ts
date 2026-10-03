export const barrelCode = `import {
  DownloadTrigger,
  useDownload,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  DownloadTrigger,
  useDownload,
} from "@dicehub/kappa/components/download-trigger";`;

export const previewCode = `<script setup>
import { Download } from "@lucide/vue";
import { DownloadTrigger } from "@dicehub/kappa/components/download-trigger";

const configuration = JSON.stringify(
  { theme: "kappa", units: "metric" },
  null,
  2,
);
</script>

<template>
  <DownloadTrigger
    :data="configuration"
    file-name="workspace-config.json"
    mime-type="application/json"
    :icon="Download"
    variant="primary"
  >
    Download configuration
  </DownloadTrigger>
</template>`;

export const usageCode = `<script setup>
import { DownloadTrigger } from "@dicehub/kappa/components/download-trigger";
</script>

<template>
  <DownloadTrigger
    data="Kappa 0.2 release notes"
    file-name="release-notes.txt"
    mime-type="text/plain"
  >
    Download release notes
  </DownloadTrigger>
</template>`;

export const generatedCode = `<script setup>
import { Download } from "@lucide/vue";
import { DownloadTrigger } from "@dicehub/kappa/components/download-trigger";

const configuration = JSON.stringify(
  { theme: "kappa", units: "metric" },
  null,
  2,
);
</script>

<template>
  <DownloadTrigger
    :data="configuration"
    file-name="workspace-config.json"
    mime-type="application/json"
    :icon="Download"
  >
    Export JSON
  </DownloadTrigger>
</template>`;

export const asyncCode = `<script setup>
import { Download } from "@lucide/vue";
import { DownloadTrigger } from "@dicehub/kappa/components/download-trigger";

const createCsv = async () =>
  new Blob(["step,value\\nmesh,complete\\nsolve,queued\\n"], {
    type: "text/csv",
  });
</script>

<template>
  <DownloadTrigger
    :data="createCsv"
    file-name="run-status.csv"
    mime-type="text/csv"
    :icon="Download"
  >
    Build and download CSV
  </DownloadTrigger>
</template>`;

export const statesCode = `<script setup>
import { DownloadTrigger } from "@dicehub/kappa/components/download-trigger";
</script>

<template>
  <div class="download-states">
    <div>
      <code>default</code>
      <DownloadTrigger data="ready" file-name="ready.txt" mime-type="text/plain">
        Download
      </DownloadTrigger>
    </div>
    <div>
      <code>disabled</code>
      <DownloadTrigger disabled data="blocked" file-name="blocked.txt" mime-type="text/plain">
        Download
      </DownloadTrigger>
    </div>
    <div>
      <code>loading</code>
      <DownloadTrigger loading data="pending" file-name="pending.txt" mime-type="text/plain">
        Preparing
      </DownloadTrigger>
    </div>
  </div>
</template>

<style scoped>
.download-states {
  display: grid;
  gap: 0.625rem;
}

.download-states > div {
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr);
  align-items: center;
  gap: 1rem;
}
</style>`;

export const asChildCode = `<script setup>
import { DownloadTrigger } from "@dicehub/kappa/components/download-trigger";
</script>

<template>
  <DownloadTrigger
    as-child
    data="custom"
    file-name="custom.txt"
    mime-type="text/plain"
  >
    <button class="custom-download">Save a local copy</button>
  </DownloadTrigger>
</template>

<style scoped>
.custom-download {
  border-style: dashed;
}
</style>`;

export const triggerProps = [
  {
    name: "data",
    type: "string | Blob | File | (() => value | Promise<value>)",
    defaultValue: "—",
    description: "Required content or producer used to create the downloaded file.",
  },
  {
    name: "fileName",
    type: "string",
    defaultValue: "—",
    description: "Required file name presented to the browser download manager.",
  },
  {
    name: "mimeType",
    type: "FileMimeType",
    defaultValue: "—",
    description: "Required media type for string and Blob data.",
  },
  {
    name: "variant",
    type: "ButtonVariant",
    defaultValue: '"secondary"',
    description: "Uses the same visual variants as Button.",
  },
  {
    name: "size / shape / icon / iconPosition / fullWidth",
    type: "ButtonVisualProps",
    defaultValue: "Button defaults",
    description: "Uses the shared Kappa button visual contract with compact 0.875rem icons at the default base size.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Prevents download activation.",
  },
  {
    name: "loading",
    type: "boolean",
    defaultValue: "false",
    description: "Shows a busy indicator and prevents activation while data is prepared externally.",
  },
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Merges download behavior and Kappa attributes onto one child button.",
  },
] as const;

export const slots = [
  {
    name: "default",
    description: "Button label, or one complete child element when asChild is enabled.",
  },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"download-trigger"', description: "Identifies the button root." },
  { name: "data-variant", value: "ButtonVariant", description: "Resolved Button treatment." },
  { name: "data-size", value: "ButtonSize", description: "Resolved compact control size." },
  { name: "data-shape", value: "ButtonShape", description: "Resolved Button geometry." },
  { name: "data-loading", value: "present", description: "Present during a controlled busy state." },
] as const;

export const exportsList = [
  { name: "DownloadTrigger", description: "Ark-backed Kappa download button." },
  { name: "useDownload", description: "Ark UI composable for programmatic downloads." },
  { name: "DownloadTriggerProps / DownloadTriggerSlots", description: "Public Vue contracts." },
  { name: "DownloadableData / UseDownloadProps / UseDownloadReturn", description: "Ark download data and composable contracts." },
] as const;
