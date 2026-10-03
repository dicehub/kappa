export const previewCode = `<script setup lang="ts">
import { ref } from "vue";
import { ImageCropper, type ImageCropperApi } from "@dicehub/kappa/components/image-cropper";
import { Button } from "@dicehub/kappa/components/button";

const cropper = ref<ImageCropperApi>();
const source = ref<string | File>("/images/demos/cropper-field.svg");
const ready = ref(false);
const error = ref("");

async function saveCrop() {
  try {
    const blob = await cropper.value!.exportBlob({
      type: "image/png", maxSize: { width: 512, height: 512 },
    });
    // Send this Blob to your application's storage service.
    console.log(blob.type, blob.size);
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : "Export failed.";
  }
}
</script>

<template>
  <ImageCropper ref="cropper" :src="source" :aspect-ratio="1"
    @status-change="ready = $event === 'ready'"
    @error="error = $event.error.message" />
  <Button :disabled="!ready" @click="saveCrop">Save crop</Button>
  <p v-if="error" role="alert">{{ error }}</p>
</template>`;

export const examples = [
  { id: "wide", title: "Cover images and aspect ratios", description: "Use a fixed ratio for each destination. A ratio change resets the crop and zoom. The source stays fixed inside the viewport.",
    code: `<ImageCropper :src="imageFile" :aspect-ratio="16 / 9" :max-zoom="3" />` },
  { id: "free", title: "Custom crop", description: "Use free mode when the output has no fixed ratio. Drag the crop area to move it. Drag any edge or corner to resize width and height independently.",
    code: `<ImageCropper :src="imageFile" aspect-ratio="free" />` },
  { id: "states", title: "Read only, disabled, and empty", description: "Read-only content remains focusable and can be exported. Disabled content blocks editing and export. Clear the source to show the empty state.",
    code: `<ImageCropper :src="imageFile" read-only />\n<ImageCropper :src="imageFile" disabled />\n<ImageCropper :src="null" />` },
] as const;
