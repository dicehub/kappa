<script setup lang="ts">
import { ImageCropper as ArkImageCropper, useImageCropper } from "@ark-ui/vue/image-cropper";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { Button } from "../button";
import { Slider } from "../slider";
import { resolveImageCropperExportOptions, type ImageCropperApi, type ImageCropperCrop,
  type ImageCropperExportOptions, type ImageCropperLabels } from "./image-cropper";
import type { ImageCropperLoadedSource } from "./image-cropper-source";
import { getImageCropperOutputSize, getImageCropperSourceRect } from "./image-cropper-geometry";

const props = defineProps<{
  source: ImageCropperLoadedSource;
  aspectRatio?: number;
  maxZoom: number;
  disabled: boolean;
  readOnly: boolean;
  showPreview: boolean;
  crossOrigin: "anonymous" | "use-credentials";
  labels: ImageCropperLabels;
}>();
const emit = defineEmits<{ change: [crop: ImageCropperCrop] }>();
const host = ref<HTMLDivElement>();
let disposed = false;
const HANDLE_POSITIONS = ["n", "e", "s", "w", "ne", "se", "sw", "nw"] as const;
const locked = computed(() => props.disabled || props.readOnly);
const api = useImageCropper(computed(() => ({
  aspectRatio: props.aspectRatio, fixedCropArea: false,
  minWidth: 1, minHeight: 1, minZoom: 1, maxZoom: props.maxZoom,
  translations: {
    rootLabel: props.labels.region,
    selectionLabel: () => props.labels.selection,
    selectionInstructions: props.labels.instructions,
    selectionValueText: () => {
      const crop = getCrop();
      return crop ? `X ${Math.round(crop.x)}, Y ${Math.round(crop.y)}. ${Math.round(crop.width)} by ${Math.round(crop.height)} pixels.` : "";
    },
  },
})));

function getCrop(): ImageCropperCrop | null {
  return getImageCropperSourceRect(api.value, props.aspectRatio);
}

const crop = computed(() => getCrop());
const imageRatio = computed(() => props.source.width / props.source.height);
const previewRatio = computed(() => crop.value ? crop.value.width / crop.value.height : props.aspectRatio ?? 1);
const previewStyle = computed(() => {
  const area = crop.value;
  if (!area) return {};
  return {
    width: `${area.naturalWidth / area.width * 100}%`, height: `${area.naturalHeight / area.height * 100}%`,
    left: `${-area.x / area.width * 100}%`, top: `${-area.y / area.height * 100}%`,
  };
});

watch(crop, value => { if (value) emit("change", value); }, { flush: "post" });
watch(() => props.aspectRatio, () => api.value.reset(), { flush: "post" });
watch(() => props.maxZoom, value => { if (api.value.zoom > value) api.value.setZoom(value); });

function reset() { if (!locked.value) api.value.reset(); }
function setZoom(value: number) {
  if (!locked.value && Number.isFinite(value)) api.value.setZoom(Math.min(props.maxZoom, Math.max(1, value)));
}
async function exportBlob(options?: ImageCropperExportOptions): Promise<Blob> {
  const area = getCrop();
  const image = host.value?.querySelector<HTMLImageElement>('[data-part="image"]');
  if (props.disabled || !area || !image?.complete) throw new Error("The image cropper is not ready to export.");
  const resolved = resolveImageCropperExportOptions(options);
  const size = getImageCropperOutputSize(area, resolved.maxSize);
  const canvas = image.ownerDocument.createElement("canvas");
  canvas.width = size.width; canvas.height = size.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The browser could not create an image canvas.");
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, size.width, size.height);
  const result = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, resolved.type, resolved.quality));
  if (disposed) throw new DOMException("The image source changed during export.", "AbortError");
  if (!(result instanceof Blob)) throw new Error("The crop could not be exported. Check image access and output size.");
  return result;
}

function blockInteraction(event: Event) {
  // A read-only crop can receive focus. Tab must still leave the control.
  if (event instanceof KeyboardEvent && event.key === "Tab") return;
  if (locked.value) { event.preventDefault(); event.stopImmediatePropagation(); }
}
function handlePointerStart(event: Event) {
  if (locked.value) {
    blockInteraction(event);
    return;
  }
  const target = event.target;
  if (target instanceof Element && target.closest('[data-scope="image-cropper"][data-part="selection"]')) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}
onBeforeUnmount(() => {
  disposed = true;
});
defineExpose<ImageCropperApi>({ reset, setZoom, getCrop, exportBlob });
</script>

<template>
  <div ref="host" class="kappa-image-cropper__editor">
    <ArkImageCropper.RootProvider :value="api" class="kappa-image-cropper__workspace">
      <div class="kappa-image-cropper__stage"
        @pointerdown.capture="handlePointerStart" @keydown.capture="blockInteraction"
        @wheel.capture="blockInteraction" @touchstart.capture="handlePointerStart" @touchmove.capture="blockInteraction">
        <ArkImageCropper.Viewport class="kappa-image-cropper__viewport"
          :style="{ aspectRatio: imageRatio, maxWidth: `${imageRatio * 320}px` }">
          <ArkImageCropper.Image :src="source.url" :crossorigin="crossOrigin" class="kappa-image-cropper__image" />
          <ArkImageCropper.Selection class="kappa-image-cropper__selection"
            :tabindex="disabled ? -1 : 0" :aria-disabled="disabled || undefined" :aria-readonly="readOnly || undefined">
            <ArkImageCropper.Grid axis="horizontal" class="kappa-image-cropper__grid" />
            <ArkImageCropper.Grid axis="vertical" class="kappa-image-cropper__grid" />
            <ArkImageCropper.Handle v-for="position in HANDLE_POSITIONS" :key="position"
              :position="position" class="kappa-image-cropper__handle" />
          </ArkImageCropper.Selection>
        </ArkImageCropper.Viewport>
      </div>
      <div class="kappa-image-cropper__controls">
        <Slider.Root :model-value="[api.zoom]" :min="1" :max="Math.max(1.01, maxZoom)" :step="0.01" :large-step="0.1"
          :aria-label="[labels.zoom]" :disabled="disabled || maxZoom === 1" :read-only="readOnly" size="sm"
          :get-aria-value-text="({ value }) => `${Math.round(value * 100)}%`"
          @update:model-value="setZoom($event[0] ?? 1)">
          <Slider.Label>{{ labels.zoom }}</Slider.Label>
          <span class="kappa-image-cropper__zoom-value" aria-hidden="true">{{ Math.round(api.zoom * 100) }}%</span>
          <Slider.Control><Slider.Track><Slider.Range /></Slider.Track><Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb></Slider.Control>
        </Slider.Root>
        <Button variant="ghost" size="sm" :disabled="locked" @click="reset">{{ labels.reset }}</Button>
      </div>
    </ArkImageCropper.RootProvider>
    <figure v-if="showPreview" class="kappa-image-cropper__preview">
      <div class="kappa-image-cropper__preview-frame" :style="{ aspectRatio: previewRatio }">
        <img v-if="crop" :src="source.url" :alt="labels.preview" :style="previewStyle" draggable="false" />
      </div>
      <figcaption>{{ labels.preview }}<span v-if="crop">{{ Math.round(crop.width) }} × {{ Math.round(crop.height) }} px</span></figcaption>
    </figure>
  </div>
</template>
