export const previewCode = `<script setup lang="ts">
import { ref } from "vue";
import { DragSelection } from "@dicehub/kappa/components/drag-selection";

const selected = ref(["notes"]);
const items = [
  { value: "brand", label: "Brand guidelines.pdf" },
  { value: "landing", label: "Landing page.png" },
  { value: "notes", label: "Project notes.md" },
  { value: "photos", label: "Product photos.zip" },
  { value: "release", label: "Release checklist.md" },
  { value: "tokens", label: "Design tokens.json" },
];
</script>

<template>
  <DragSelection v-model="selected" :items="items" label="Shared files" :columns="3" />
</template>`;

export const examples = [
  { id: "list", title: "List layout", description: "Use one column for long names. The same selection model works for lists and grids.", code: `<DragSelection v-model="selected" :items="items" label="Shared files" :columns="1">
  <template #item="{ item, selected }">
    <span>{{ item.label }}</span>
    <span v-if="selected" aria-hidden="true">✓</span>
  </template>
</DragSelection>` },
  { id: "scrolling", title: "Edge scrolling", description: "Keep the pointer near the top or bottom edge during a drag to select items outside the visible area.", code: `<DragSelection
  v-model="selected"
  :items="assets"
  label="Asset library"
  :columns="3"
  style="--kappa-drag-selection-max-height: 18rem"
/>` },
  { id: "disabled", title: "Disabled items and collection", description: "A disabled item is excluded from pointer and keyboard selection. Disable the entire collection to lock selection.", code: `<script setup lang="ts">
const items = [
  { value: "notes", label: "Project notes.md" },
  { value: "landing", label: "Landing page.png", disabled: true },
];
</script>

<template>
  <DragSelection :items="items" label="Shared files" :disabled="locked" />
</template>` },
  { id: "click-only", title: "Click and keyboard only", description: "Turn off rectangle gestures without removing the accessible selection behavior.", code: `<DragSelection v-model="selected" :items="items" label="Shared files" drag-disabled />` },
] as const;
