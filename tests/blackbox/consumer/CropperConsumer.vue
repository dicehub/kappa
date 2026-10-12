<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { ImageCropper, type ImageCropperApi } from "@dicehub/kappa/components/image-cropper";
const mounted = ref(true), src = shallowRef<Blob | string | null>(null);
const callerUrl = ref(""), result = ref(""), errors = ref<string[]>([]);
const remoteSource = ref(""), events = ref<string[]>([]);
const exportError = ref("");
const options = ref('{"maxSize":{"width":20,"height":20}}');
const cropper = ref<ImageCropperApi>();
const invalidImage = () => { src.value = new Blob(["invalid image"], { type: "image/png" }); };
const zeroWidthImage = () => { src.value = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="0" height="40"/>'], { type: "image/svg+xml" }); };
async function image(callerOwned = false) {
  const canvas = document.createElement("canvas");
  canvas.width = 80; canvas.height = 40;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#f00"; context.fillRect(0, 0, 80, 40);
  const blob = await new Promise<Blob>(resolve => canvas.toBlob(blob => resolve(blob!)));
  if (callerOwned) { callerUrl.value = URL.createObjectURL(blob); src.value = callerUrl.value; }
  else src.value = blob;
}
async function exportImage() {
  try {
    result.value = "";
    exportError.value = "";
    const parsed = JSON.parse(options.value, (_key, value) => value && typeof value === "object" && "$number" in value ? Number(value.$number) : value);
    const blob = await cropper.value!.exportBlob(parsed);
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width; canvas.height = bitmap.height;
    const context = canvas.getContext("2d")!;
    context.drawImage(bitmap, 0, 0);
    result.value = JSON.stringify({ width: bitmap.width, height: bitmap.height, pixel: [...context.getImageData(0, 0, 1, 1).data], type: blob.type });
    bitmap.close();
  } catch (error) { exportError.value = String(error); errors.value.push(String(error)); }
}
</script>

<template>
  <main>
    <h1>Cropper consumer</h1>
    <button @click="image()">Set owned image</button>
    <button @click="image(true)">Set caller image</button>
    <button @click="invalidImage">Set invalid image</button>
    <button @click="zeroWidthImage">Set zero-width image</button>
    <label>Remote source<input v-model="remoteSource" /></label>
    <button @click="src = remoteSource">Set remote image</button>
    <label>Export options<textarea v-model="options" /></label>
    <button @click="src = null">Clear image</button>
    <button @click="mounted = false">Unmount cropper</button>
    <button @click="exportImage">Export image</button>
    <ImageCropper v-if="mounted" ref="cropper" :src="src" @error="errors.push($event.phase)"
      @load="events.push('load:' + JSON.stringify($event))" @status-change="events.push('status:' + $event)" />
    <output aria-label="Caller URL">{{ callerUrl }}</output>
    <output aria-label="Export result">{{ result }}</output>
    <output aria-label="Public errors">{{ errors.join('\n') }}</output>
    <output aria-label="Export error">{{ exportError }}</output>
    <output aria-label="Public events">{{ events.join('\n') }}</output>
  </main>
</template>
