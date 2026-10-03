<script setup lang="ts">
import { Download } from "@lucide/vue";
import { DownloadTrigger } from "@dicehub/kappa/components/download-trigger";

type DemoVariant = "preview" | "usage" | "generated" | "async" | "states" | "as-child";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const configuration = JSON.stringify(
  {
    theme: "kappa",
    units: "metric",
  },
  null,
  2,
);

const createCsv = async () =>
  new Blob(["step,value\nmesh,complete\nsolve,queued\n"], {
    type: "text/csv",
  });
</script>

<template>
  <div class="download-trigger-demo" :data-download-trigger-demo="props.variant">
    <DownloadTrigger
      v-if="props.variant === 'preview'"
      :data="configuration"
      file-name="workspace-config.json"
      mime-type="application/json"
      :icon="Download"
      variant="primary"
    >
      Download configuration
    </DownloadTrigger>

    <DownloadTrigger
      v-else-if="props.variant === 'usage'"
      data="Kappa 0.2 release notes"
      file-name="release-notes.txt"
      mime-type="text/plain"
    >
      Download release notes
    </DownloadTrigger>

    <DownloadTrigger
      v-else-if="props.variant === 'generated'"
      :data="configuration"
      file-name="workspace-config.json"
      mime-type="application/json"
      :icon="Download"
    >
      Export JSON
    </DownloadTrigger>

    <DownloadTrigger
      v-else-if="props.variant === 'async'"
      :data="createCsv"
      file-name="run-status.csv"
      mime-type="text/csv"
      :icon="Download"
    >
      Build and download CSV
    </DownloadTrigger>

    <div v-else-if="props.variant === 'states'" class="download-trigger-demo__states">
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

    <DownloadTrigger
      v-else
      as-child
      data="custom"
      file-name="custom.txt"
      mime-type="text/plain"
    >
      <button class="download-trigger-demo__custom">Save a local copy</button>
    </DownloadTrigger>
  </div>
</template>

<style scoped>
.download-trigger-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 8rem;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.download-trigger-demo__states {
  display: grid;
  inline-size: min(100%, 24rem);
  gap: 0.625rem;
}

.download-trigger-demo__states > div {
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr);
  align-items: center;
  gap: 1rem;
}

.download-trigger-demo__states code {
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.6875rem;
}

.download-trigger-demo__custom {
  border-style: dashed;
}

@media (max-width: 30rem) {
  .download-trigger-demo__states > div {
    grid-template-columns: 4.5rem minmax(0, 1fr);
  }
}
</style>
