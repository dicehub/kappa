<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Archive, Check, File, FileCode2, FileText, Folder, Image } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { DragSelection, type DragSelectionItem } from "@dicehub/kappa/components/drag-selection";

const props = withDefaults(defineProps<{
  variant?: "preview" | "list" | "scrolling" | "disabled" | "click-only";
  standalone?: boolean;
}>(), { variant: "preview", standalone: false });
const names = ["Brand guidelines.pdf", "Landing page.png", "Project notes.md", "Product photos.zip", "Release checklist.md", "Design tokens.json"];
const standaloneNames = [
  "Campaign assets", "Product photography", "Research", "Archive",
  "Brand guidelines.pdf", "Cover image.png", "Design tokens.json", "Release notes.md",
  "Homepage concepts.png", "Logo exports.zip", "Interface audit.pdf", "Motion studies",
  "Navigation icons.zip", "Onboarding copy.md", "Photo references", "Presentation.pdf",
  "Product overview.md", "Prototype notes.md", "Social templates", "Source artwork.zip",
  "Sprint review.pdf", "Style guide.md", "Team portraits", "Typography samples.pdf",
  "Wireframes", "User interviews.pdf", "Color studies.png", "Launch plan.md",
  "Editorial photos", "Font licenses.zip", "Mobile mockups.png", "Print templates",
  "Research summary.pdf", "Video storyboards", "Web exports.zip", "Workshop notes.md",
];
const items: DragSelectionItem[] = props.variant === "scrolling"
  ? Array.from({ length: 72 }, (_, index) => ({ value: `asset-${index + 1}`, label: `Asset ${String(index + 1).padStart(2, "0")}` }))
  : props.standalone
  ? standaloneNames.map((label, index) => ({ value: `asset-${index + 1}`, label, disabled: props.variant === "disabled" && index === 1 }))
  : names.map((label, index) => ({ value: `file-${index}`, label, disabled: props.variant === "disabled" && index === 1 }));
const selected = ref<string[]>(props.standalone ? ["asset-6", "asset-7"] : props.variant === "preview" ? ["file-2"] : []);
const disabled = ref(false);
const isDragging = ref(false);
const container = ref<HTMLElement>();
const columns = ref(3);
let observer: ResizeObserver | undefined;
onMounted(() => {
  observer = new ResizeObserver(entries => {
    const width = entries[0].contentRect.width;
    columns.value = props.standalone ? Math.max(2, Math.min(6, Math.floor(width / 180))) : width < 400 ? 2 : 3;
  });
  if (container.value) observer.observe(container.value);
});
onBeforeUnmount(() => observer?.disconnect());

function itemIcon(item: DragSelectionItem) {
  if (["asset-1", "asset-2", "asset-3", "asset-4", "asset-12", "asset-15", "asset-19", "asset-23", "asset-25", "asset-29", "asset-32", "asset-34"].includes(item.value)) return Folder;
  if (item.label.endsWith(".png")) return Image;
  if (item.label.endsWith(".zip")) return Archive;
  if (item.label.endsWith(".json")) return FileCode2;
  if (item.label.endsWith(".md") || item.label.endsWith(".pdf")) return FileText;
  return File;
}
</script>

<template>
  <section ref="container" :class="['drag-selection-demo', { 'drag-selection-demo--standalone': props.standalone }]"
    :data-drag-selection-demo="props.variant" :data-standalone="props.standalone ? '' : undefined">
    <header class="drag-selection-demo__header">
      <div><h1 v-if="props.standalone">Asset library</h1><strong v-else>{{ props.variant === "scrolling" ? "Asset library" : "Shared files" }}</strong><span v-if="props.standalone">{{ items.length }} items</span><span aria-live="polite" data-selection-count>{{ selected.length }} selected</span></div>
      <Button v-if="props.variant === 'disabled'" size="sm" variant="outline" @click="disabled = !disabled">{{ disabled ? "Enable selection" : "Disable selection" }}</Button>
      <Button v-else size="sm" variant="ghost" :disabled="!selected.length" @click="selected = []">Clear selection</Button>
    </header>
    <DragSelection v-model="selected" :items="items" :label="props.standalone ? 'Asset library' : 'Shared files'" :columns="props.variant === 'list' ? 1 : columns"
      :disabled="disabled" :drag-disabled="props.variant === 'click-only'"
      :style="props.variant === 'scrolling' && !props.standalone ? '--kappa-drag-selection-max-height: 18rem' : undefined"
      @drag-start="isDragging = true" @drag-end="isDragging = false">
      <template #item="{ item, selected: checked }">
        <div :class="['drag-selection-demo__file', { 'drag-selection-demo__file--list': props.variant === 'list' }]">
          <component :is="itemIcon(item)" :size="props.standalone ? 28 : 22" aria-hidden="true" />
          <span :title="item.label">{{ item.label }}</span>
          <span class="drag-selection-demo__check" :data-checked="checked ? '' : undefined" aria-hidden="true"><Check v-if="checked" :size="12" /></span>
        </div>
      </template>
    </DragSelection>
    <p>{{ props.variant === 'click-only' ? "Click a file. Use Ctrl or ⌘ to add more, or Shift to select a range." : "Drag across files to select. Hold Ctrl, ⌘, or Shift to add. Press Escape to cancel a drag." }}</p>
    <output class="drag-selection-demo__status" aria-live="polite">{{ isDragging ? "Selecting…" : props.variant === 'disabled' ? 'Landing page.png is unavailable.' : 'Tab into the list, then use arrow keys and Space.' }}</output>
  </section>
</template>

<style scoped>
.drag-selection-demo { inline-size: min(100%, 38rem); margin-inline: auto; color: var(--kappa-default); font-size: 0.8125rem; line-height: 1.5; font-family: var(--kappa-font-sans, inherit); }
.drag-selection-demo__header { display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-block-end: 0.625rem; }
.drag-selection-demo__header > div { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.75rem; }
.drag-selection-demo__header span { color: var(--kappa-subtle); font-size: 0.75rem; }
.drag-selection-demo__file { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem; inline-size: 100%; min-inline-size: 0; padding-block: 0.375rem; }
.drag-selection-demo__file > svg { color: var(--kappa-subtle); }
.drag-selection-demo__file > span:not(.drag-selection-demo__check) { overflow: hidden; max-inline-size: 100%; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.drag-selection-demo__file--list { flex-direction: row; align-items: center; padding: 0; }
.drag-selection-demo__check { position: absolute; inset-block-start: 0; inset-inline-end: 0; inline-size: 1rem; block-size: 1rem; display: grid; place-items: center; border: 1px solid var(--kappa-line); border-radius: var(--kappa-radius-sm, 0.375rem); }
.drag-selection-demo__check[data-checked] { color: var(--kappa-accent); border-color: var(--kappa-accent); }
.drag-selection-demo p { margin: 0.75rem 0 0.125rem; color: var(--kappa-subtle); font-size: 0.75rem; }
.drag-selection-demo__status { color: var(--kappa-subtle); font-size: 0.75rem; }
.drag-selection-demo--standalone {
  display: grid; grid-template-rows: auto minmax(0, 1fr) auto auto; inline-size: 100%; max-inline-size: none;
  min-block-size: 100svh; padding: clamp(1rem, 3vw, 2rem); background: var(--kappa-tint); gap: 0;
}
.drag-selection-demo--standalone .drag-selection-demo__header {
  margin: 0; padding: 0.75rem 1rem; border: 1px solid var(--kappa-line); border-block-end: 0;
  border-radius: var(--kappa-radius-md) var(--kappa-radius-md) 0 0; background: var(--kappa-base);
}
.drag-selection-demo--standalone .drag-selection-demo__header h1 { margin: 0; font-size: 1rem; font-weight: 600; line-height: 1.5; }
.drag-selection-demo--standalone :deep(.kappa-drag-selection) { min-block-size: 0; }
.drag-selection-demo--standalone :deep(.kappa-drag-selection__viewport) {
  block-size: 100%; min-block-size: 18rem; max-block-size: none; padding: clamp(0.75rem, 2vw, 1.25rem);
  border-radius: 0; background: var(--kappa-canvas);
}
.drag-selection-demo--standalone :deep(.kappa-drag-selection__item) { min-block-size: 5.5rem; }
.drag-selection-demo--standalone .drag-selection-demo__file { gap: 0.875rem; }
.drag-selection-demo--standalone > p { margin: 0; padding: 0.625rem 1rem 0.125rem; border-inline: 1px solid var(--kappa-line); background: var(--kappa-base); }
.drag-selection-demo--standalone > .drag-selection-demo__status {
  padding: 0 1rem 0.625rem; border: 1px solid var(--kappa-line); border-block-start: 0;
  border-radius: 0 0 var(--kappa-radius-md) var(--kappa-radius-md); background: var(--kappa-base);
}
@media (max-width: 36rem) {
  .drag-selection-demo--standalone { padding: 0; }
  .drag-selection-demo--standalone .drag-selection-demo__header,
  .drag-selection-demo--standalone > .drag-selection-demo__status { border-radius: 0; border-inline: 0; }
  .drag-selection-demo--standalone > p { border-inline: 0; }
  .drag-selection-demo--standalone :deep(.kappa-drag-selection__viewport) { border-inline: 0; }
}
</style>
