<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import ImageCropperEditor from "./ImageCropperEditor.vue";
import { createImageCropperSourceLoader, type ImageCropperLoadedSource } from "./image-cropper-source";
import { IMAGE_CROPPER_LABELS, resolveImageCropperAspectRatio, resolveImageCropperMaxZoom,
  type ImageCropperProps, type ImageCropperEmits, type ImageCropperApi, type ImageCropperStatus,
  type ImageCropperExportOptions } from "./image-cropper";

const props = withDefaults(defineProps<ImageCropperProps>(), {
  src: null, aspectRatio: 1, maxZoom: 5, disabled: false, readOnly: false,
  showPreview: true, crossOrigin: "anonymous",
});
const emit = defineEmits<ImageCropperEmits>();
const status = ref<ImageCropperStatus>(props.src ? "loading" : "empty");
const source = shallowRef<ImageCropperLoadedSource>();
const editor = ref<ImageCropperApi>();
const labels = computed(() => ({ ...IMAGE_CROPPER_LABELS, ...props.labels }));
let loader: ReturnType<typeof createImageCropperSourceLoader> | undefined;
let disposed = false;

onMounted(() => {
  loader = createImageCropperSourceLoader({
    status(value) {
      status.value = value;
      if (value !== "ready") source.value = undefined;
      emit("statusChange", value);
    },
    load(value) { source.value = value; emit("load", { width: value.width, height: value.height }); },
    error(error) { emit("error", { phase: "load", error }); },
  });
  loader.load(props.src, props.crossOrigin);
});
watch(() => [props.src, props.crossOrigin] as const, () => loader?.load(props.src, props.crossOrigin), { flush: "sync" });
onBeforeUnmount(() => { disposed = true; loader?.dispose(); });

async function exportBlob(options?: ImageCropperExportOptions): Promise<Blob> {
  const revision = source.value?.revision;
  const current = editor.value;
  try {
    if (status.value !== "ready" || !current) throw new Error("The image cropper is not ready to export.");
    const blob = await current.exportBlob(options);
    if (disposed || revision !== source.value?.revision) throw new DOMException("The image source changed during export.", "AbortError");
    return blob;
  } catch (error) {
    if (!disposed && !(error instanceof DOMException && error.name === "AbortError")) {
      emit("error", { phase: "export", error: error instanceof Error ? error : new Error(String(error)) });
    }
    throw error;
  }
}
defineExpose<ImageCropperApi>({
  reset: () => editor.value?.reset(), setZoom: value => editor.value?.setZoom(value),
  getCrop: () => status.value === "ready" ? editor.value?.getCrop() ?? null : null,
  exportBlob,
});
</script>

<template>
  <div class="kappa-image-cropper" data-slot="image-cropper" :data-state="status"
    :data-disabled="disabled ? '' : undefined" :data-readonly="readOnly ? '' : undefined"
    :aria-busy="status === 'loading' || undefined">
    <ImageCropperEditor v-if="source" :key="source.revision" ref="editor" :source="source"
      :aspect-ratio="resolveImageCropperAspectRatio(aspectRatio)" :max-zoom="resolveImageCropperMaxZoom(maxZoom)"
      :disabled="disabled" :read-only="readOnly" :show-preview="showPreview" :cross-origin="crossOrigin" :labels="labels"
      @change="emit('change', $event)" />
    <div v-else class="kappa-image-cropper__placeholder" :role="status === 'error' ? 'alert' : 'status'">
      <span>{{ status === 'loading' ? labels.loading : status === 'error' ? labels.error : labels.empty }}</span>
    </div>
    <p v-if="source && !disabled && !readOnly" class="kappa-image-cropper__instructions">{{ labels.instructions }}</p>
  </div>
</template>

<style src="./image-cropper.css"></style>
