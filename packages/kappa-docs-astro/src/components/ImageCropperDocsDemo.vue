<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { Button, LinkButton } from "@dicehub/kappa/components/button";
import { FileUpload } from "@dicehub/kappa/components/file-upload";
import { ImageCropper, type ImageCropperApi, type ImageCropperCrop, type ImageCropperSource, type ImageCropperStatus } from "@dicehub/kappa/components/image-cropper";
import { NativeSelect } from "@dicehub/kappa/components/native-select";

const props = withDefaults(defineProps<{ variant?: "preview" | "wide" | "free" | "states" }>(), { variant: "preview" });
const sample = "/images/demos/cropper-field.svg";
const src = shallowRef<ImageCropperSource>(sample);
const cropper = ref<ImageCropperApi>();
const crop = ref<ImageCropperCrop | null>(null);
const status = ref<ImageCropperStatus>("loading");
const aspectRatio = ref(props.variant === "wide" ? "1.7777777777777777" : props.variant === "free" ? "free" : "1");
const mode = ref("editable");
const resultUrl = ref("");
const resultSize = ref(0);
const message = ref("");
const exporting = ref(false);
let exportRevision = 0;

function clearResult() {
  exportRevision += 1;
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value);
  resultUrl.value = "";
  message.value = "";
}
function changeSource(value: ImageCropperSource) { src.value = value; crop.value = null; clearResult(); }
async function exportImage() {
  if (!cropper.value) return;
  exporting.value = true;
  clearResult();
  const request = exportRevision;
  try {
    const blob = await cropper.value.exportBlob({ type: "image/png", maxSize: { width: 512, height: 512 } });
    if (request !== exportRevision) return;
    resultUrl.value = URL.createObjectURL(blob);
    resultSize.value = blob.size;
    message.value = "Crop ready. The PNG stays in this browser until you download it.";
  } catch (error) {
    if (request === exportRevision) message.value = error instanceof Error ? error.message : "Export failed.";
  } finally { exporting.value = false; }
}
watch(aspectRatio, clearResult);
onBeforeUnmount(clearResult);
</script>

<template>
  <section class="image-cropper-demo" :data-image-cropper-demo="variant">
    <header class="image-cropper-demo__header">
      <div><strong>{{ variant === 'wide' ? 'Cover image' : variant === 'free' ? 'Custom crop' : variant === 'states' ? 'Interaction states' : 'Workspace image' }}</strong><span>Sample illustration · 960 × 640 px</span></div>
      <label v-if="variant !== 'states'" class="image-cropper-demo__ratio">Crop ratio
        <NativeSelect v-model="aspectRatio" size="sm" aria-label="Crop ratio"><option value="free">Custom · Free</option><option value="1">1:1 · Square</option><option value="1.7777777777777777">16:9 · Wide</option><option value="0.75">3:4 · Portrait</option></NativeSelect>
      </label>
      <label v-else class="image-cropper-demo__ratio">State
        <NativeSelect v-model="mode" size="sm" aria-label="Cropper state"><option value="editable">Editable</option><option value="readonly">Read only</option><option value="disabled">Disabled</option></NativeSelect>
      </label>
    </header>
    <ImageCropper ref="cropper" :src="src" :aspect-ratio="aspectRatio === 'free' ? 'free' : Number(aspectRatio)"
      :disabled="mode === 'disabled'" :read-only="mode === 'readonly'"
      @change="crop = $event" @status-change="status = $event"
      @error="message = $event.error.message" />
    <footer class="image-cropper-demo__footer">
      <div class="image-cropper-demo__actions">
        <FileUpload.Root class="image-cropper-demo__upload" accept="image/*" :max-files="1" :max-file-size="10 * 1024 * 1024"
          @file-change="changeSource($event.acceptedFiles[0] ?? null)"
          @file-reject="message = 'Choose an image smaller than 10 MB.'">
          <FileUpload.Trigger size="sm">Choose image</FileUpload.Trigger><FileUpload.HiddenInput aria-label="Choose image file" />
        </FileUpload.Root>
        <Button size="sm" variant="ghost" @click="changeSource(sample)">Use sample</Button>
        <Button size="sm" variant="ghost" @click="changeSource(null)">Clear image</Button>
      </div>
      <Button variant="primary" size="sm" :loading="exporting" :disabled="status !== 'ready' || !crop || mode === 'disabled'" @click="exportImage">Export PNG</Button>
    </footer>
    <p class="image-cropper-demo__note">Local files stay in your browser. PNG export is limited to 512 × 512 px.</p>
    <output v-if="crop" class="image-cropper-demo__geometry" data-crop-geometry :data-x="crop.x" :data-y="crop.y" :data-width="crop.width" :data-height="crop.height" :data-zoom="crop.zoom" :data-natural-width="crop.naturalWidth" :data-natural-height="crop.naturalHeight">
      X {{ Math.round(crop.x) }} · Y {{ Math.round(crop.y) }} · {{ Math.round(crop.width) }} × {{ Math.round(crop.height) }} px
    </output>
    <p v-if="message" role="status" class="image-cropper-demo__note">{{ message }}</p>
    <div v-if="resultUrl" class="image-cropper-demo__result">
      <img :src="resultUrl" alt="Exported crop" /><span>PNG · {{ (resultSize / 1024).toFixed(1) }} kB</span>
      <LinkButton :href="resultUrl" download="image-crop.png" size="sm" variant="link">Download crop</LinkButton>
    </div>
  </section>
</template>

<style scoped>
.image-cropper-demo { inline-size: 100%; min-inline-size: 0; max-inline-size: 44rem; color: var(--kappa-default); }
.image-cropper-demo__header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-block-end: 1rem; }
.image-cropper-demo__header > div { display: grid; gap: 0.125rem; }
.image-cropper-demo__header strong { font-size: 0.875rem; font-weight: 600; }
.image-cropper-demo__header span, .image-cropper-demo__ratio { color: var(--kappa-subtle); font-size: 0.75rem; }
.image-cropper-demo__ratio { display: grid; gap: 0.25rem; }
.image-cropper-demo__footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.75rem; padding-block-start: 1rem; margin-block-start: 1rem; border-block-start: 1px solid var(--kappa-line); }
.image-cropper-demo__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem; }
.image-cropper-demo__upload { inline-size: auto; }
.image-cropper-demo__note, .image-cropper-demo__geometry { margin: 0.75rem 0 0; color: var(--kappa-subtle); font-size: 0.75rem; }
.image-cropper-demo__geometry { display: block; font-family: var(--kappa-font-mono); font-variant-numeric: tabular-nums; }
.image-cropper-demo__result { display: flex; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-block-start: 1rem; font-size: 0.75rem; }
.image-cropper-demo__result img { inline-size: 4rem; max-block-size: 6rem; object-fit: contain; border-radius: 0.25rem; }
</style>
