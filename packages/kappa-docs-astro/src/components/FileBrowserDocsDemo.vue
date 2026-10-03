<script setup lang="ts">
import { ref } from "vue";
import { FileBrowser, type FileBrowserFolderId, type FileBrowserItem, type FileBrowserMutationContext, type FileBrowserRequest } from "@dicehub/kappa/blocks/file-browser";
import { Button } from "@dicehub/kappa/components/button";
import { initialFiles, type FileBrowserDemoVariant } from "../data/file-browser-docs";

const props = withDefaults(defineProps<{ variant?: FileBrowserDemoVariant; standalone?: boolean }>(), { variant: "preview", standalone: false });
const files = ref<FileBrowserItem[]>(initialFiles.map(item => ({ ...item })));
const selected = ref<string[]>([]);
const notice = ref("");
const browser = ref<InstanceType<typeof FileBrowser> | null>(null);
const pending = ref<(() => void) | null>(null);
const hasMutations = props.variant !== "preview";
let nextState: "ready" | "loading" | "error" = "ready";
let sequence = 0;
function assertName(name: string) {
  if (name.startsWith(".")) throw new Error("Names that start with a dot are not allowed in this workspace.");
}
async function renameItem(item: FileBrowserItem, name: string) {
  await Promise.resolve();
  assertName(name);
  files.value = files.value.map(value => value.id === item.id ? { ...value, name } : value);
}
async function createFolder(name: string, { folderId }: FileBrowserMutationContext) {
  await Promise.resolve();
  assertName(name);
  files.value.push({ id: `new-folder-${++sequence}`, name, kind: "folder", parentId: folderId, modifiedAt: "2026-09-22T12:00:00Z" });
}
async function loadFolder(folderId: FileBrowserFolderId, { signal }: FileBrowserRequest) {
  const state = nextState;
  nextState = "ready";
  if (state === "error") throw new Error("The folder could not be loaded. Try again.");
  if (state === "loading") await new Promise<void>((resolve, reject) => {
    const abort = () => { pending.value = null; reject(new DOMException("Cancelled", "AbortError")); };
    signal.addEventListener("abort", abort, { once: true });
    pending.value = () => { signal.removeEventListener("abort", abort); pending.value = null; resolve(); };
  });
  return files.value.filter(item => (item.parentId ?? null) === folderId).map(item => ({ ...item }));
}
function showState(value: "loading" | "error") { nextState = value; void browser.value?.refresh(); }
async function runAction(_action: string, item: FileBrowserItem) { notice.value = `${item.name} · ${item.kind === 'folder' ? 'Folder' : 'File'}`; }
</script>
<template>
  <div class="file-browser-demo" :class="{ 'file-browser-demo--standalone': standalone }" :data-file-browser-demo="variant">
    <div v-if="variant === 'async'" class="file-browser-demo__controls">
      <Button size="sm" variant="secondary" @click="showState('loading')">Show loading</Button>
      <Button size="sm" variant="secondary" @click="showState('error')">Show error</Button>
      <Button v-if="pending" size="sm" @click="pending?.()">Complete load</Button>
    </div>
    <FileBrowser ref="browser" v-model="selected" :items="files"
      :load-folder="variant === 'async' ? loadFolder : undefined"
      :rename-item="hasMutations ? renameItem : undefined"
      :create-folder="hasMutations ? createFolder : undefined"
      :actions="hasMutations ? () => [{ id: 'details', label: 'Show details' }] : undefined"
      :run-action="runAction" title="Project files" description="Documents and shared assets for the team." root-label="Project"
      :show-view="variant === 'grid'" :default-view="variant === 'grid' ? 'grid' : 'list'"
      @open="item => notice = `Opened: ${item.name}`" />
    <p v-if="notice" class="file-browser-demo__notice" role="status">{{ notice }}</p>
    <p v-if="variant === 'editing'" class="file-browser-demo__hint">This example rejects names that start with a dot. Use the action menu to rename a file, or create a folder.</p>
    <p v-if="variant === 'grid'" class="file-browser-demo__hint">Switch between grid and list views. Right-click any item for the same actions as its menu button.</p>
  </div>
</template>
<style scoped>
.file-browser-demo { display: grid; inline-size: 100%; min-inline-size: 0; gap: 0.75rem; }
.file-browser-demo__controls { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.file-browser-demo__notice, .file-browser-demo__hint { margin: 0; color: var(--kappa-subtle); font: 0.8125rem/1.5 var(--kappa-font-sans, inherit); }
.file-browser-demo--standalone { min-block-size: 100svh; max-inline-size: 76rem; margin-inline: auto; padding: clamp(1rem, 4vw, 3rem); align-content: start; }
</style>
